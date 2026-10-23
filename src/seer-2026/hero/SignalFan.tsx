import { useId, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './SignalFan.css';

const star = new URL('../../../assets/brand/star.svg', import.meta.url).href;
const OUTCOMES = [
  { name: 'Ethereum', price: 38 }, { name: 'Solana', price: 21 },
  { name: 'Base', price: 13 }, { name: 'Arbitrum', price: 9 },
  { name: 'BNB Chain', price: 7 }, { name: 'Tron', price: 5 },
  { name: 'Sui', price: 4 }, { name: 'Other', price: 3 },
] as const;
const DESKTOP_ROWS = [0, 1, 2, 3, 4, 5, 6, 7] as const;
const COMPACT_ROWS = [0, 1, 2, 3, 7] as const;
const SAMPLES = 64;
const ENTRANCE = 1.6;

type Price = { value: number; nudge: number };
type Curve = {
  x0: number; y0: number; x1: number; y1: number;
  x2: number; y2: number; x3: number; y3: number;
  baseX1: number; baseX2: number; length: number; reveal: number;
  points: Float32Array; distances: Float32Array;
  packet: number; wait: number; speed: number; stroke: CanvasGradient | null;
};
type Diagnostics = {
  running: boolean; reduced: boolean; frames: number; steps: number;
  rows: number; dpr: number; packets: number; prices: Uint8Array;
};
type FanCanvas = HTMLCanvasElement & { __labels?: never[]; __signalFan?: Diagnostics };

/** Mulberry32 keeps the illustrative walk repeatable without a looping sequence. */
function randomWalk(seed: number) {
  return () => {
    let n = seed += 0x6d2b79f5;
    n = Math.imul(n ^ n >>> 15, n | 1);
    n ^= n + Math.imul(n ^ n >>> 7, n | 61);
    return ((n ^ n >>> 14) >>> 0) / 4294967296;
  };
}

/** Largest remainders preserve an exact 100c total, including during interpolation. */
function roundCents(values: Float64Array, rounded: Uint8Array, fractions: Float64Array) {
  let remainder = 100;
  for (let i = 0; i < values.length; i++) {
    rounded[i] = Math.floor(values[i]);
    fractions[i] = values[i] - rounded[i];
    remainder -= rounded[i];
  }
  while (remainder-- > 0) {
    let largest = 0;
    for (let i = 1; i < fractions.length; i++) if (fractions[i] > fractions[largest]) largest = i;
    rounded[largest]++;
    fractions[largest] = -1;
  }
}

function makeCurve(): Curve {
  return {
    x0: 0, y0: 0, x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0,
    baseX1: 0, baseX2: 0, length: 0, reveal: 0,
    points: new Float32Array((SAMPLES + 1) * 2), distances: new Float32Array(SAMPLES + 1),
    packet: 0, wait: 0, speed: 0, stroke: null,
  };
}

/** Sample cubic arc length once per geometry change for constant-speed packets. */
function sampleCurve(curve: Curve) {
  curve.length = 0;
  for (let i = 0; i <= SAMPLES; i++) {
    const t = i / SAMPLES, u = 1 - t;
    const x = u ** 3 * curve.x0 + 3 * u * u * t * curve.x1 + 3 * u * t * t * curve.x2 + t ** 3 * curve.x3;
    const y = u ** 3 * curve.y0 + 3 * u * u * t * curve.y1 + 3 * u * t * t * curve.y2 + t ** 3 * curve.y3;
    if (i) curve.length += Math.hypot(x - curve.points[(i - 1) * 2], y - curve.points[(i - 1) * 2 + 1]);
    curve.points[i * 2] = x;
    curve.points[i * 2 + 1] = y;
    curve.distances[i] = curve.length;
  }
}

function pointAt(curve: Curve, distance: number, point: Float32Array) {
  let low = 0, high = SAMPLES;
  while (low + 1 < high) {
    const middle = (low + high) >>> 1;
    if (curve.distances[middle] < distance) low = middle;
    else high = middle;
  }
  const t = Math.max(0, Math.min(1, (distance - curve.distances[low]) / (curve.distances[high] - curve.distances[low] || 1)));
  point[0] = curve.points[low * 2] + (curve.points[high * 2] - curve.points[low * 2]) * t;
  point[1] = curve.points[low * 2 + 1] + (curve.points[high * 2 + 1] - curve.points[low * 2 + 1]) * t;
  return high;
}

// This scoped ramp uses hex tokens. Always resolve alpha to rgba, never append it to a CSS variable.
function withAlpha(hex: string, alpha: number) {
  const value = Number.parseInt(hex.replace('#', ''), 16);
  return `rgba(${value >>> 16 & 255}, ${value >>> 8 & 255}, ${value & 255}, ${alpha})`;
}

function mountSignalFan(stage: HTMLElement) {
  const canvas = stage.querySelector<FanCanvas>('canvas')!;
  const context = canvas.getContext('2d');
  const node = stage.querySelector<HTMLElement>('.sf-node')!;
  const glass = stage.querySelector<HTMLElement>('.sf-node__glass')!;
  const breath = stage.querySelector<HTMLElement>('.sf-node__breath')!;
  const market = stage.querySelector<HTMLElement>('.sf-market')!;
  const heading = stage.querySelector<HTMLElement>('.sf-market__heading')!;
  const rows = Array.from(stage.querySelectorAll<HTMLElement>('.sf-row'));
  const digits = rows.map(row => row.querySelector<HTMLElement>('.sf-price__value')!);
  const prices = rows.map(row => row.querySelector<HTMLElement>('.sf-price')!);
  const bars = rows.map(row => row.querySelector<HTMLElement>('.sf-bar__fill')!);
  const hero = stage.closest<HTMLElement>('.s26-hero')!;
  const copy = hero.querySelector<HTMLElement>('.s26-hero-copy')!;
  const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compactQuery = window.matchMedia('(max-width: 1000px)');
  const finePointer = window.matchMedia('(pointer: fine)');
  const random = randomWalk(20261023);
  const models: Price[] = OUTCOMES.map(outcome => ({ value: outcome.price, nudge: 0 }));
  const anchors: number[] = OUTCOMES.map(outcome => outcome.price);
  const curves = OUTCOMES.map(makeCurve);
  const input = makeCurve();
  const values = new Float64Array(8), cents = new Uint8Array(8), fractions = new Float64Array(8);
  const lastCents = new Int16Array(8).fill(-1);
  const lastValues = new Float64Array(8).fill(-1), lastNudges = new Float64Array(8).fill(-1);
  const start = new Float32Array(2), end = new Float32Array(2);
  const nudges: (gsap.core.Timeline | undefined)[] = new Array(8);
  const nudgeStarts = new Float64Array(8);
  const inputState = { reveal: reducedQuery.matches ? 1 : 0 };
  const colors = getComputedStyle(stage);
  const core = colors.getPropertyValue('--sf-line-core').trim() || '#6c47ff';
  const terminal = colors.getPropertyValue('--sf-line-end').trim() || '#a992ff';
  const diagnostics: Diagnostics | undefined = import.meta.env.DEV
    ? { running: false, reduced: reducedQuery.matches, frames: 0, steps: 0, rows: 8, dpr: 1, packets: 0, prices: cents }
    : undefined;
  if (diagnostics) { canvas.__labels = []; canvas.__signalFan = diagnostics; }

  let activeRows: readonly number[] = compactQuery.matches ? COMPACT_ROWS : DESKTOP_ROWS;
  let width = 0, height = 0, inputY = 0, inputLength = 0;
  let reduced = reducedQuery.matches, visible = false, disposed = false, frame = 0, previous = 0;
  let clock = 0, nextPrice = ENTRANCE + 2 + random() * 2, nextLeader = 48 + random() * 36;
  let bendX = 0, bendY = 0, targetX = 0, targetY = 0;
  let stageLeft = 0, stageTop = 0;
  let priceTween: gsap.core.Tween | undefined, priceStart = 0;
  let entrance: gsap.core.Timeline | undefined;
  let lastLeader = -1;

  for (const curve of curves) { curve.wait = 0.5 + random() * 3; curve.speed = 65 + random() * 38; }

  function writePrices() {
    for (let i = 0; i < models.length; i++) values[i] = models[i].value;
    roundCents(values, cents, fractions);
    let otherValue = 0, otherCents = 0, leader = activeRows[0], leadingValue = -1;
    for (let i = 4; i < models.length; i++) { otherValue += values[i]; otherCents += cents[i]; }
    for (const i of activeRows) {
      const value = compactQuery.matches && i === 7 ? otherValue : values[i];
      const rounded = compactQuery.matches && i === 7 ? otherCents : cents[i];
      if (value > leadingValue) { leadingValue = value; leader = i; }
      if (lastCents[i] !== rounded) {
        digits[i].textContent = String(rounded);
        prices[i].setAttribute('aria-valuenow', String(rounded));
        prices[i].setAttribute('aria-valuetext', `${rounded} cents, ${rounded}% implied probability`);
        rows[i].dataset.price = String(rounded);
        lastCents[i] = rounded;
      }
      if (lastValues[i] !== value || lastNudges[i] !== models[i].nudge) {
        bars[i].style.transform = `translateX(${models[i].nudge * 1.25}px) scaleX(${value / 100}) scaleY(${1 + models[i].nudge * 0.25})`;
        lastValues[i] = value; lastNudges[i] = models[i].nudge;
      }
    }
    if (lastLeader !== leader) {
      for (const i of activeRows) rows[i].dataset.leading = String(i === leader);
      lastLeader = leader;
    }
  }

  function drawCurve(curve: Curve, reveal: number) {
    if (!context || reveal <= 0) return;
    context.beginPath();
    context.moveTo(curve.x0, curve.y0);
    context.bezierCurveTo(curve.x1, curve.y1, curve.x2, curve.y2, curve.x3, curve.y3);
    context.strokeStyle = curve.stroke || core;
    context.setLineDash(reveal < 1 ? [curve.length * reveal, curve.length + 2] : []);
    context.stroke();
    context.setLineDash([]);
  }

  function packetSegment(curve: Curve, from: number, to: number) {
    if (!context || to <= from) return;
    const first = pointAt(curve, from, start);
    pointAt(curve, to, end);
    context.beginPath();
    context.moveTo(start[0], start[1]);
    for (let i = first; i <= SAMPLES && curve.distances[i] < to; i++) context.lineTo(curve.points[i * 2], curve.points[i * 2 + 1]);
    context.lineTo(end[0], end[1]);
    context.stroke();
  }

  function draw() {
    if (!context || !width || !height) return;
    context.clearRect(0, 0, width, height);
    context.lineWidth = 1.5;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    if (inputState.reveal > 0) {
      context.beginPath();
      context.moveTo(0, inputY);
      context.lineTo(input.x0, inputY);
      context.bezierCurveTo(input.x1, input.y1, input.x2, input.y2, input.x3, input.y3);
      context.strokeStyle = input.stroke || core;
      context.setLineDash(inputState.reveal < 1 ? [inputLength * inputState.reveal, inputLength + 2] : []);
      context.stroke();
      context.setLineDash([]);
    }
    for (const i of activeRows) drawCurve(curves[i], curves[i].reveal);
    if (reduced || clock < ENTRANCE) return;
    context.strokeStyle = core;
    for (const i of activeRows) {
      const curve = curves[i];
      if (curve.wait > 0 || curve.packet <= 0) continue;
      // Six finite segments make a soft tail. There is no particle or blur pass.
      for (let tail = 5; tail >= 0; tail--) {
        context.globalAlpha = (1 - tail / 6) * 0.8;
        context.lineWidth = tail === 0 ? 2 : 1.5;
        packetSegment(curve, Math.max(0, curve.packet - (tail + 1) * 4), Math.max(0, curve.packet - tail * 4));
      }
    }
    context.globalAlpha = 1;
  }

  function measure() {
    if (disposed) return;
    const rect = stage.getBoundingClientRect();
    stageLeft = rect.left; stageTop = rect.top;
    width = rect.width; height = rect.height;
    if (!width || !height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context?.setTransform(dpr, 0, 0, dpr, 0, 0);
    activeRows = compactQuery.matches ? COMPACT_ROWS : DESKTOP_ROWS;
    const nodeX = Number.parseFloat(getComputedStyle(node).left), radius = node.offsetWidth / 2;
    const first = rows[activeRows[0]].getBoundingClientRect();
    const last = rows[activeRows[activeRows.length - 1]].getBoundingClientRect();
    const nodeY = (first.top + first.height / 2 + last.top + last.height / 2) / 2 - rect.top;
    node.style.top = `${nodeY}px`;
    for (const i of activeRows) {
      const row = rows[i].getBoundingClientRect(), curve = curves[i];
      const previousLength = curve.length;
      curve.x0 = nodeX + radius; curve.y0 = nodeY;
      // Exclude the GSAP entrance translation: connections end at the final row position.
      curve.x3 = row.left - rect.left - Number(gsap.getProperty(rows[i], 'x')) - 10;
      curve.y3 = row.top - rect.top + row.height / 2;
      const span = Math.max(12, curve.x3 - curve.x0);
      curve.baseX1 = curve.x0 + span * 0.36; curve.baseX2 = curve.x3 - span * 0.36;
      curve.x1 = curve.baseX1 + bendX * 0.5; curve.y1 = nodeY + bendY * 0.7;
      curve.x2 = curve.baseX2 + bendX; curve.y2 = curve.y3 + bendY;
      sampleCurve(curve);
      if (previousLength) curve.packet = curve.packet / previousLength * curve.length;
      if (context) {
        curve.stroke = context.createLinearGradient(curve.x0, nodeY, curve.x3, curve.y3);
        curve.stroke.addColorStop(0, withAlpha(core, 0.8));
        curve.stroke.addColorStop(1, terminal);
      }
    }
    // The input belongs to the diagram, independent of animated copy bounds.
    inputY = nodeY;
    input.x3 = nodeX - radius; input.y3 = nodeY;
    input.x0 = Math.max(0, input.x3 - 128);
    input.y0 = inputY;
    input.x1 = input.x0 + (input.x3 - input.x0) * 0.36;
    input.y1 = inputY;
    input.x2 = input.x3 - (input.x3 - input.x0) * 0.36; input.y2 = nodeY;
    sampleCurve(input);
    inputLength = input.x0 + input.length;
    if (context) {
      input.stroke = context.createLinearGradient(0, inputY, input.x3, nodeY);
      input.stroke.addColorStop(0, withAlpha(core, 0));
      input.stroke.addColorStop(0.25, withAlpha(core, 0.18));
      input.stroke.addColorStop(0.7, withAlpha(core, 0.6));
      input.stroke.addColorStop(1, core);
    }
    lastCents.fill(-1);
    lastLeader = -1;
    writePrices();
    if (diagnostics) { diagnostics.dpr = dpr; diagnostics.rows = activeRows.length; }
    if (visible && !document.hidden) draw();
  }

  function reprice() {
    if (clock >= nextLeader) {
      let leader = 0;
      for (let i = 1; i < 3; i++) if (models[i].value > models[leader].value) leader = i;
      const challenger = (leader + 1 + Math.floor(random() * 2)) % 3;
      [anchors[leader], anchors[challenger]] = [anchors[challenger], anchors[leader]];
      nextLeader = clock + 60 + random() * 36;
    }
    // Positive bounded walk with a gentle pull toward a slowly changing market regime.
    const next = models.map((model, i) => Math.max(1.25, model.value + (random() - 0.5) * 2.4 + (anchors[i] - model.value) * 0.08));
    const total = next.reduce((sum, value) => sum + value, 0);
    priceTween?.kill();
    priceStart = clock;
    priceTween = gsap.to(models, { value: (i: number) => next[i] / total * 100, duration: 0.95, ease: 'power2.inOut', paused: true });
    nextPrice = clock + 2 + random() * 2;
    if (diagnostics) diagnostics.steps++;
  }

  function tick(now: number) {
    frame = 0;
    if (disposed || reduced || !visible || document.hidden) return;
    const dt = previous ? Math.min((now - previous) / 1000, 0.05) : 0;
    previous = now; clock += dt;
    entrance?.time(Math.min(clock, ENTRANCE));
    if (clock >= nextPrice) reprice();
    if (priceTween) {
      priceTween.time(clock - priceStart);
      if (clock - priceStart >= priceTween.duration()) { priceTween.kill(); priceTween = undefined; }
    }
    const damping = 1 - Math.exp(-dt * 7);
    const dx = (targetX - bendX) * damping, dy = (targetY - bendY) * damping;
    bendX += dx; bendY += dy;
    let packetCount = 0;
    for (const i of activeRows) {
      const curve = curves[i];
      if (Math.abs(dx) + Math.abs(dy) > 0.001) {
        curve.x1 = curve.baseX1 + bendX * 0.5; curve.y1 = curve.y0 + bendY * 0.7;
        curve.x2 = curve.baseX2 + bendX; curve.y2 = curve.y3 + bendY;
        sampleCurve(curve);
      }
      if (clock >= ENTRANCE && curve.length) {
        if (curve.wait > 0) curve.wait -= dt;
        else {
          curve.packet += curve.speed * dt;
          packetCount++;
          if (curve.packet >= curve.length) {
            curve.packet = 0; curve.wait = 0.8 + random() * 2;
            nudges[i]?.kill();
            nudgeStarts[i] = clock;
            nudges[i] = gsap.timeline({ paused: true })
              .to(models[i], { nudge: 1, duration: 0.12, ease: 'power2.out' })
              .to(models[i], { nudge: 0, duration: 0.42, ease: 'power2.out' });
          }
        }
      }
      const nudge = nudges[i];
      if (nudge) {
        nudge.time(clock - nudgeStarts[i]);
        if (clock - nudgeStarts[i] >= nudge.duration()) { nudge.kill(); nudges[i] = undefined; }
      }
    }
    breath.style.transform = `scale(${1 + Math.sin(clock * Math.PI / 2.8) * 0.009})`;
    writePrices();
    draw();
    if (diagnostics) { diagnostics.frames++; diagnostics.packets = packetCount; }
    frame = requestAnimationFrame(tick);
  }

  function syncPlayback() {
    cancelAnimationFrame(frame); frame = 0; previous = 0;
    const running = visible && !document.hidden && !reduced;
    if (diagnostics) diagnostics.running = running;
    if (running) frame = requestAnimationFrame(tick);
    else if (visible && !document.hidden) draw();
  }

  function motionChanged() {
    reduced = reducedQuery.matches;
    if (diagnostics) { diagnostics.reduced = reduced; diagnostics.packets = 0; }
    if (reduced) {
      entrance?.progress(1).kill(); entrance = undefined;
      priceTween?.progress(1).kill(); priceTween = undefined;
      inputState.reveal = 1;
      for (let i = 0; i < curves.length; i++) {
        curves[i].reveal = 1; curves[i].packet = 0;
        nudges[i]?.kill(); nudges[i] = undefined; models[i].nudge = 0;
      }
      targetX = 0; targetY = 0; bendX = 0; bendY = 0;
      breath.style.removeProperty('transform');
      writePrices();
      measure();
    }
    syncPlayback();
  }

  function pointerMoved(event: PointerEvent) {
    if (reduced || !finePointer.matches || event.pointerType === 'touch') return;
    targetX = gsap.utils.clamp(-4, 4, (event.clientX - stageLeft - width * 0.65) / width * 10);
    targetY = gsap.utils.clamp(-7, 7, (event.clientY - stageTop - height / 2) / height * 16);
  }
  function pointerLeft() { targetX = 0; targetY = 0; }
  function resized() { measure(); syncPlayback(); }

  measure();
  if (reduced) for (const curve of curves) curve.reveal = 1;
  else {
    // Paused GSAP timelines are advanced by this canvas's one visibility-gated RAF.
    entrance = gsap.timeline({ paused: true })
      .to(inputState, { reveal: 1, duration: 0.6, ease: 'power2.inOut' }, 0)
      .fromTo(glass, { scale: 0.65, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'power3.out' }, 0.25)
      .to(curves, { reveal: 1, duration: 0.7, stagger: 0.035, ease: 'power2.inOut' }, 0.45)
      .fromTo(heading, { x: 10, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }, 0.65)
      .fromTo(rows, { x: 12, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, stagger: 0.05, ease: 'power3.out' }, 0.8);
  }
  const resize = new ResizeObserver(resized);
  resize.observe(stage); resize.observe(market); resize.observe(copy);
  const intersection = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    syncPlayback();
  }, { threshold: 0 });
  intersection.observe(stage);
  reducedQuery.addEventListener('change', motionChanged);
  compactQuery.addEventListener('change', resized);
  window.addEventListener('resize', resized, { passive: true });
  document.addEventListener('visibilitychange', syncPlayback);
  hero.addEventListener('pointermove', pointerMoved, { passive: true });
  hero.addEventListener('pointerleave', pointerLeft);
  void document.fonts.ready.then(() => { if (!disposed) resized(); });

  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    resize.disconnect(); intersection.disconnect();
    reducedQuery.removeEventListener('change', motionChanged);
    compactQuery.removeEventListener('change', resized);
    window.removeEventListener('resize', resized);
    document.removeEventListener('visibilitychange', syncPlayback);
    hero.removeEventListener('pointermove', pointerMoved);
    hero.removeEventListener('pointerleave', pointerLeft);
    entrance?.kill(); priceTween?.kill();
    for (const nudge of nudges) nudge?.kill();
    gsap.set([glass, heading, ...rows], { clearProps: 'transform,opacity' });
    breath.style.removeProperty('transform');
    delete canvas.__labels; delete canvas.__signalFan;
  };
}

export function SignalFan() {
  const root = useRef<HTMLElement>(null);
  const questionId = useId();
  useLayoutEffect(() => root.current ? mountSignalFan(root.current) : undefined, []);
  return <figure ref={root} className="sf-stage" aria-labelledby={questionId}>
    <canvas className="sf-canvas" aria-hidden="true" />
    <div className="sf-node" aria-hidden="true">
      <div className="sf-node__glass"><div className="sf-node__breath"><img src={star} alt="" width="32" height="29" /></div></div>
    </div>
    <div className="sf-market">
      <header className="sf-market__heading">
        <span className="sf-market__tag">Illustrative market</span>
        <h2 id={questionId} className="sf-market__question">Which chain leads TVL on Dec 31?</h2>
      </header>
      <ul className="sf-rows" aria-label="Outcome prices in cents" aria-live="off">
        {OUTCOMES.map((outcome, i) => <li className="sf-row" key={outcome.name} data-leading={i === 0}>
          <span className="sf-row__label">{outcome.name}</span>
          <span className="sf-bar" aria-hidden="true"><span className="sf-bar__fill" style={{ transform: `scaleX(${outcome.price / 100})` }} /></span>
          <span className="sf-price" role="meter" aria-label={`${outcome.name} implied probability`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={outcome.price} aria-valuetext={`${outcome.price} cents, ${outcome.price}% implied probability`}>
            <span className="sf-price__value" aria-hidden="true">{outcome.price}</span><span className="sf-price__unit" aria-hidden="true">c</span>
          </span>
        </li>)}
      </ul>
    </div>
  </figure>;
}
