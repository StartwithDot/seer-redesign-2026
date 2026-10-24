import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './MarketStage.css';

type Scene = { tab: string; who: string; q: string; read: string; outcomes: [string, number][] };

const SCENES: Scene[] = [
  {
    tab: 'DAO', who: 'A DAO asks',
    q: 'Should the treasury fund the Q4 grants round?',
    read: '62% means traders expect the proposal to pass. The DAO still votes.',
    outcomes: [['Yes, fund it', 62], ['No, hold', 38]],
  },
  {
    tab: 'Treasury', who: 'A treasury asks',
    q: 'Which stablecoin is least likely to lose its peg this year?',
    read: 'Compare the risk side by side before moving collateral. No trade needed.',
    outcomes: [['USDS', 34], ['USDC', 29], ['DAI', 17], ['USDe', 12], ['Other', 8]],
  },
  {
    tab: 'AI agent', who: 'An AI agent asks',
    q: 'Which repositories will reviewers rank most original?',
    read: 'People and agents read the same prices, then send reviewers to the top few.',
    outcomes: [['ethereum/consensus', 24], ['sigp/lighthouse', 19], ['foundry-rs/foundry', 16], ['status-im/nimbus', 14], ['paradigmxyz/reth', 12], ['ethers-io/ethers.js', 9], ['Other', 6]],
  },
];

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));
const drift = (vals: number[]) => {
  const next = vals.map((v) => Math.max(2, v + (Math.random() - 0.5) * Math.max(5, v * 0.34)));
  const sum = next.reduce((a, b) => a + b, 0);
  return next.map((v) => (v / sum) * 100);
};

type Live = {
  draw: number; vals: number[]; hover: number; visible: boolean;
  tl: gsap.core.Timeline | null; scene: Scene;
};

export function MarketStage() {
  const [idx, setIdx] = useState(0);
  const scene = SCENES[idx];
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const qText = useRef<HTMLSpanElement>(null);
  const readEl = useRef<HTMLParagraphElement>(null);
  const live = useRef<Live>({ draw: 0, vals: [], hover: -1, visible: true, tl: null, scene: SCENES[0] });

  const rows = () => Array.from(root.current?.querySelectorAll<HTMLElement>('.ms-row') ?? []);

  const paint = useCallback(() => {
    const s = live.current;
    const els = rows();
    const lead = s.vals.indexOf(Math.max(...s.vals));
    const cap = Math.max(1, Math.max(...s.vals) * 1.12);
    els.forEach((el, k) => {
      const v = s.vals[k] ?? 0;
      const pct = el.querySelector('.ms-pct');
      const fill = el.querySelector<HTMLElement>('.ms-fill');
      if (pct) pct.textContent = `${Math.round(v)}%`;
      if (fill) fill.style.transform = `scaleX(${clamp(v / cap, 0, 1)})`;
      el.classList.toggle('is-lead', k === lead && s.draw > 0.6);
    });
  }, []);

  const setRead = useCallback((k: number) => {
    const s = live.current;
    if (!readEl.current) return;
    readEl.current.textContent = k >= 0
      ? `Traders give "${s.scene.outcomes[k][0]}" a ${Math.round(s.vals[k])}% chance.`
      : s.scene.read;
  }, []);

  // Scene timeline: type the question, draw the fan, price the outcomes, let the prices move, hand over to the next asker.
  useEffect(() => {
    const s = live.current;
    s.scene = scene; s.hover = -1;
    const targets = scene.outcomes.map((o) => o[1]);
    s.vals = targets.map(() => 0); s.draw = 0;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const els = rows();
    if (qText.current) qText.current.textContent = '';
    if (readEl.current) readEl.current.textContent = scene.read;
    paint();
    if (reduce) {
      s.vals = targets.slice(); s.draw = 1;
      if (qText.current) qText.current.textContent = scene.q;
      gsap.set(els, { opacity: 1, x: 0 });
      paint();
      return;
    }
    gsap.set(els, { opacity: 0, x: 22 });
    const typer = { n: 0 };
    const price = { t: 0 };
    const tl = gsap.timeline({ delay: idx === 0 ? 0.5 : 0.1 });
    s.tl = tl;
    tl.to(typer, {
      n: scene.q.length, duration: scene.q.length * 0.024, ease: 'none',
      onUpdate() { if (qText.current) qText.current.textContent = scene.q.slice(0, Math.round(typer.n)); },
    })
      .to(s, { draw: 1, duration: 1.3, ease: 'power3.inOut' }, '+=0.12')
      .to(els, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', stagger: 0.07 }, '<0.3')
      .to(price, { t: 1, duration: 1.4, ease: 'power3.out', onUpdate() { s.vals = targets.map((v) => v * price.t); paint(); } }, '<0.2');
    for (let j = 0; j < 3; j++) {
      const mv = { t: 0 };
      let from: number[] = []; let to: number[] = [];
      tl.to(mv, {
        t: 1, duration: 1.6, ease: 'power2.inOut',
        onStart() { from = s.vals.slice(); to = drift(s.vals); },
        onUpdate() { s.vals = from.map((v, k) => v + (to[k] - v) * mv.t); paint(); if (s.hover >= 0) setRead(s.hover); },
      }, '+=1.1');
    }
    tl.to(els, { opacity: 0, x: -14, duration: 0.45, ease: 'power2.in', stagger: 0.03 }, '+=1.2')
      .to(s, { draw: 0, duration: 0.5, ease: 'power2.in' }, '<')
      .call(() => setIdx((idx + 1) % SCENES.length));
    return () => { tl.kill(); s.tl = null; };
  }, [idx, scene, paint, setRead]);

  // Pause when off screen.
  useEffect(() => {
    const el = root.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { live.current.visible = e.isIntersecting; live.current.tl?.paused(!e.isIntersecting); }, { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Canvas: one line in, a fan out. Line weight is the price.
  useEffect(() => {
    const cv = canvas.current, host = root.current; if (!cv || !host) return;
    const ctx = cv.getContext('2d'); if (!ctx) return;
    let raf = 0, w = 0, h = 0, dpr = 1;
    const resize = () => {
      const r = host.getBoundingClientRect(); dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height; cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      cv.style.width = `${w}px`; cv.style.height = `${h}px`;
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(host);
    const bez = (p0: number[], c1: number[], c2: number[], p3: number[], u: number) => {
      const v = 1 - u;
      return [
        v * v * v * p0[0] + 3 * v * v * u * c1[0] + 3 * v * u * u * c2[0] + u * u * u * p3[0],
        v * v * v * p0[1] + 3 * v * v * u * c1[1] + 3 * v * u * u * c2[1] + u * u * u * p3[1],
      ];
    };
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const s = live.current; if (!s.visible) return;
      const hr = host.getBoundingClientRect();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
      const cap = host.querySelector<HTMLElement>('.ms-capsule'); if (!cap) return;
      const cr = cap.getBoundingClientRect();
      const dots = Array.from(host.querySelectorAll<HTMLElement>('.ms-dot'));
      if (!dots.length || s.draw <= 0.001) return;
      const stack = w < 700;
      const src = stack ? [cr.left - hr.left + 28, cr.bottom - hr.top] : [cr.right - hr.left, cr.top - hr.top + cr.height / 2];
      const total = s.vals.reduce((a, b) => a + b, 0) || 1;
      const lead = s.vals.indexOf(Math.max(...s.vals));
      const now = performance.now() / 1000;
      // entry stub: the single question line arriving from the left
      if (!stack) {
        const e = clamp(s.draw * 3, 0, 1);
        ctx.lineCap = 'round'; ctx.strokeStyle = '#6c47ff'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(cr.left - hr.left - 56 * e, src[1]); ctx.lineTo(cr.left - hr.left, src[1]); ctx.stroke();
      }
      dots.forEach((d, k) => {
        const dr = d.getBoundingClientRect();
        const dst = [dr.left - hr.left + dr.width / 2, dr.top - hr.top + dr.height / 2];
        const p = clamp((s.draw - k * 0.035) / (1 - dots.length * 0.035), 0, 1);
        if (p <= 0) return;
        const share = (s.vals[k] ?? 0) / total;
        const dim = s.hover >= 0 && s.hover !== k;
        const dx = dst[0] - src[0], dy = dst[1] - src[1];
        const c1 = stack ? [src[0], src[1] + dy * 0.7] : [src[0] + dx * 0.55, src[1]];
        const c2 = stack ? [dst[0] - dx * 0.6, dst[1]] : [dst[0] - dx * 0.45, dst[1]];
        const lw = 2 + share * 17;
        const alpha = dim ? 0.12 : k === lead || k === s.hover ? 1 : 0.34 + share * 0.9;
        const N = 56, end = Math.max(2, Math.round(N * p));
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        if (k === lead && !dim) {
          ctx.strokeStyle = 'rgba(108,71,255,.14)'; ctx.lineWidth = lw + 10; ctx.beginPath();
          for (let i = 0; i <= end; i++) { const q = bez(src, c1, c2, dst, i / N); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); } ctx.stroke();
        }
        ctx.strokeStyle = `rgba(108,71,255,${clamp(alpha, 0, 1)})`; ctx.lineWidth = lw; ctx.beginPath();
        for (let i = 0; i <= end; i++) { const q = bez(src, c1, c2, dst, i / N); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); } ctx.stroke();
        // light packets: brighter segments travelling toward the price
        if (p > 0.98 && !dim) {
          for (let m = 0; m < 2; m++) {
            const u0 = ((now * (0.16 + share * 0.5) + k * 0.31 + m * 0.5) % 1);
            const u1 = Math.min(1, u0 + 0.1);
            ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = Math.max(1.6, lw * 0.5); ctx.beginPath();
            for (let i = 0; i <= 10; i++) { const q = bez(src, c1, c2, dst, u0 + (u1 - u0) * (i / 10)); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }
            ctx.stroke();
          }
        }
      });
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  const hover = (k: number) => { live.current.hover = k; setRead(k); };

  return (
    <div className="ms" ref={root}>
      <canvas ref={canvas} className="ms-canvas" aria-hidden="true" />
      <div className="ms-grid">
        <div className="ms-capsule" aria-live="polite">
          <span className="ms-who">{scene.who}</span>
          <p className="ms-q"><span ref={qText} /><i className="ms-caret" aria-hidden="true" /></p>
          <span className="ms-note">Traders price every outcome. Anyone can read it.</span>
        </div>
        <div className="ms-rows" key={idx} role="list" aria-label={`Priced outcomes: ${scene.q}`}>
          {scene.outcomes.map(([label], k) => (
            <div className="ms-row" role="listitem" tabIndex={0} key={label}
              onMouseEnter={() => hover(k)} onMouseLeave={() => hover(-1)} onFocus={() => hover(k)} onBlur={() => hover(-1)}>
              <i className="ms-dot" aria-hidden="true" />
              <span className="ms-label">{label}</span>
              <span className="ms-track" aria-hidden="true"><span className="ms-fill" /></span>
              <output className="ms-pct">0%</output>
            </div>
          ))}
        </div>
      </div>
      <p className="ms-read" ref={readEl}>{scene.read}</p>
      <div className="ms-tabs" role="tablist" aria-label="Who is asking">
        {SCENES.map((sc, k) => (
          <button key={sc.tab} role="tab" aria-selected={k === idx} className={k === idx ? 'is-on' : ''} onClick={() => k !== idx && setIdx(k)}>{sc.tab}</button>
        ))}
      </div>
    </div>
  );
}
