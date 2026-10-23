import { useEffect, useRef, type CSSProperties } from 'react';

export type VisualProps = { active: boolean };
export const STAGE = { width: 480, height: 420 } as const;
// The overnight brief's light palette is a deliberate extension of the EF neutrals.
export const COLORS = { ink: '#101014', violet: '#6C47FF', grey: '#E6E6EC', muted: '#5C5C66', white: '#FFFFFF' } as const;
export const canvasStyle: CSSProperties = {
  display: 'block', width: '100%', height: '100%', minWidth: 0, maxWidth: '100%',
  aspectRatio: '8 / 7', objectFit: 'contain', pointerEvents: 'none', fontVariantNumeric: 'tabular-nums',
};
export type VisualFrame = { time: number; delta: number; reducedMotion: boolean };
export type VisualDraw = (context: CanvasRenderingContext2D, frame: VisualFrame) => void;
type LabelBox = { text: string; x: number; y: number; width: number; height: number };
type VisualCanvas = HTMLCanvasElement & {
  __labels: LabelBox[];
  __pulse: { mode: 'running' | 'inactive' | 'offscreen' | 'hidden' | 'reduced'; particles: number };
  __visual: { frames: number; time: number; scale: number; x: number; y: number };
};
type LabelState = { pool: LabelBox[]; boxes: LabelBox[]; count: number };
const labelStates = new WeakMap<CanvasRenderingContext2D, LabelState>();
type TextLayout = { width: number; glyphs?: string[]; offsets?: number[] };
const textLayouts = new Map<string, TextLayout>();
const edgeMasks = new WeakMap<CanvasRenderingContext2D, CanvasGradient>();

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;
export const mod = (value: number, divisor: number) => ((value % divisor) + divisor) % divisor;
export const smooth = (from: number, to: number, value: number) => {
  const u = clamp((value - from) / (to - from));
  return u * u * (3 - 2 * u);
};
export function withAlpha(hex: string, alpha: number) {
  const value = Number.parseInt(hex.slice(1), 16);
  return `rgba(${value >> 16}, ${(value >> 8) & 255}, ${value & 255}, ${clamp(alpha)})`;
}
export function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => { value = (Math.imul(1664525, value) + 1013904223) >>> 0; return value / 4294967296; };
}
export function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius = 8) {
  ctx.beginPath(); ctx.roundRect(x, y, width, height, radius);
}
export function line(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, width = 1) {
  ctx.save(); ctx.setLineDash([]); ctx.lineCap = 'round'; ctx.lineWidth = width; ctx.strokeStyle = color;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore();
}
export type Curve = readonly [number, number, number, number, number, number, number, number];
export function curvePoint(curve: Curve, u: number, point: { x: number; y: number }) {
  const v = 1 - u;
  point.x = v ** 3 * curve[0] + 3 * v * v * u * curve[2] + 3 * v * u * u * curve[4] + u ** 3 * curve[6];
  point.y = v ** 3 * curve[1] + 3 * v * v * u * curve[3] + 3 * v * u * u * curve[5] + u ** 3 * curve[7];
}
// De Casteljau subdivision draws a real partial cubic without a sampled path.
export function strokeCurve(ctx: CanvasRenderingContext2D, curve: Curve, color: string, width = 1.5, u = 1) {
  if (u <= 0) return;
  const ax = lerp(curve[0], curve[2], u), ay = lerp(curve[1], curve[3], u);
  const bx = lerp(curve[2], curve[4], u), by = lerp(curve[3], curve[5], u);
  const cx = lerp(curve[4], curve[6], u), cy = lerp(curve[5], curve[7], u);
  const dx = lerp(ax, bx, u), dy = lerp(ay, by, u), ex = lerp(bx, cx, u), ey = lerp(by, cy, u);
  ctx.save(); ctx.setLineDash([]); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(curve[0], curve[1]); ctx.bezierCurveTo(ax, ay, dx, dy, lerp(dx, ex, u), lerp(dy, ey, u));
  ctx.stroke(); ctx.restore();
}
type LabelOptions = { size?: number; weight?: number; color?: string; align?: CanvasTextAlign; alpha?: number; halo?: string; tabular?: boolean };
export function label(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, options: LabelOptions = {}) {
  const { size = 16, weight = 500, color = COLORS.muted, align = 'left', alpha = 1, halo = COLORS.white, tabular = false } = options;
  if (alpha <= 0.01) return;
  ctx.save(); ctx.setLineDash([]); ctx.globalAlpha *= alpha;
  ctx.font = `${weight} ${size}px "Inter Tight Variable", "Inter Tight", sans-serif`;
  ctx.textBaseline = 'middle'; ctx.textAlign = align;
  const key = `${ctx.font}:${tabular}:${text}`;
  let layout = textLayouts.get(key);
  if (!layout) {
    layout = { width: 0 };
    if (tabular) {
      const digit = Math.max(...Array.from('0123456789', glyph => ctx.measureText(glyph).width));
      layout.glyphs = Array.from(text); layout.offsets = [];
      for (const glyph of layout.glyphs) {
        const advance = /\d/.test(glyph) ? digit : ctx.measureText(glyph).width;
        layout.offsets.push(layout.width + advance / 2); layout.width += advance;
      }
    } else layout.width = ctx.measureText(text).width;
    textLayouts.set(key, layout);
  }
  const width = layout.width;
  const left = x - (align === 'center' ? width / 2 : align === 'right' ? width : 0);
  const state = labelStates.get(ctx);
  // Partially clipped marquee labels are intentional; expose only complete labels.
  if (state && ctx.globalAlpha >= 0.5 && left >= 12 && left + width <= STAGE.width - 12 && y - size / 2 >= 12 && y + size / 2 <= STAGE.height - 12) {
    const box = state.pool[state.count] ?? (state.pool[state.count] = { text: '', x: 0, y: 0, width: 0, height: 0 });
    box.text = text; box.x = left; box.y = y - size / 2; box.width = width; box.height = size;
    state.boxes[state.count++] = box;
  }
  ctx.lineJoin = 'round'; ctx.lineWidth = 4; ctx.strokeStyle = withAlpha(halo, 0.85);
  if (layout.glyphs && layout.offsets) {
    ctx.textAlign = 'center';
    for (let i = 0; i < layout.glyphs.length; i++) ctx.strokeText(layout.glyphs[i], left + layout.offsets[i], y);
    ctx.fillStyle = color;
    for (let i = 0; i < layout.glyphs.length; i++) ctx.fillText(layout.glyphs[i], left + layout.offsets[i], y);
  } else { ctx.strokeText(text, x, y); ctx.fillStyle = color; ctx.fillText(text, x, y); }
  ctx.restore();
}
export function fadeEdges(ctx: CanvasRenderingContext2D) {
  let mask = edgeMasks.get(ctx);
  if (!mask) {
    mask = ctx.createLinearGradient(0, 0, STAGE.width, 0);
    mask.addColorStop(0, 'rgba(0,0,0,0)'); mask.addColorStop(0.065, '#000');
    mask.addColorStop(0.935, '#000'); mask.addColorStop(1, 'rgba(0,0,0,0)'); edgeMasks.set(ctx, mask);
  }
  ctx.save(); ctx.globalCompositeOperation = 'destination-in'; ctx.fillStyle = mask;
  ctx.fillRect(0, 0, STAGE.width, STAGE.height); ctx.restore();
}

/** One clock per mounted scene. Resuming never includes time spent outside the viewport. */
export function useVisualCanvas(active: boolean, draw: VisualDraw) {
  const ref = useRef<HTMLCanvasElement>(null);
  const elapsed = useRef(0);
  useEffect(() => {
    const canvas = ref.current as VisualCanvas | null;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !parent || !ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const frame: VisualFrame = { time: elapsed.current, delta: 0, reducedMotion: reduced.matches };
    const labels: LabelState = { pool: [], boxes: [], count: 0 };
    labelStates.set(ctx, labels); canvas.__labels = labels.boxes;
    canvas.__pulse ??= { mode: 'offscreen', particles: 0 };
    canvas.__visual ??= { frames: 0, time: 0, scale: 1, x: 0, y: 0 };
    let visible = false, disposed = false, request = 0, previous = 0, sized = false;
    let scale = 1, originX = 0, originY = 0;
    const render = () => {
      if (!sized || disposed) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(scale, 0, 0, scale, originX, originY);
      ctx.save(); ctx.beginPath(); ctx.rect(0, 6, STAGE.width, STAGE.height - 12); ctx.clip();
      labels.count = 0; canvas.__pulse.particles = 0; draw(ctx, frame);
      labels.boxes.length = labels.count; ctx.restore();
      canvas.__visual.frames++; canvas.__visual.time = frame.time;
    };
    const running = () => active && visible && sized && !document.hidden && !reduced.matches;
    const tick = (timestamp: number) => {
      request = 0;
      if (!running() || disposed) return;
      frame.delta = previous ? Math.min((timestamp - previous) / 1000, 0.05) : 0;
      previous = timestamp; elapsed.current += frame.delta; frame.time = elapsed.current;
      render(); request = window.requestAnimationFrame(tick);
    };
    const sync = () => {
      frame.reducedMotion = reduced.matches; frame.delta = 0;
      canvas.__pulse.mode = !active ? 'inactive' : document.hidden ? 'hidden' : !visible ? 'offscreen' : reduced.matches ? 'reduced' : 'running';
      if (running()) { if (!request) { previous = 0; request = window.requestAnimationFrame(tick); } }
      else { window.cancelAnimationFrame(request); request = 0; previous = 0; canvas.__pulse.particles = 0; }
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      sized = rect.width > 0 && rect.height > 0;
      if (sized) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const width = Math.max(1, Math.round(rect.width * dpr)), height = Math.max(1, Math.round(rect.height * dpr));
        if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
        scale = Math.min(width / STAGE.width, height / STAGE.height);
        originX = (width - STAGE.width * scale) / 2; originY = (height - STAGE.height * scale) / 2;
        Object.assign(canvas.__visual, { scale, x: originX, y: originY }); render();
      }
      sync();
    };
    const intersection = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting && entries[0].intersectionRatio > 0;
      sync(); if (visible) render();
    }, { threshold: [0, 0.01] });
    const sizeObserver = new ResizeObserver(resize); sizeObserver.observe(parent); intersection.observe(canvas);
    const motionChanged = () => { sync(); if (visible && !document.hidden) render(); };
    const visibilityChanged = () => { sync(); if (visible && !document.hidden) render(); };
    reduced.addEventListener('change', motionChanged); document.addEventListener('visibilitychange', visibilityChanged);
    window.addEventListener('resize', resize); resize();
    void document.fonts?.ready.then(() => {
      if (!disposed) { textLayouts.clear(); if (visible) render(); }
    });
    return () => {
      disposed = true; window.cancelAnimationFrame(request); intersection.disconnect(); sizeObserver.disconnect();
      reduced.removeEventListener('change', motionChanged); document.removeEventListener('visibilitychange', visibilityChanged);
      window.removeEventListener('resize', resize); labelStates.delete(ctx);
      canvas.__pulse.mode = 'inactive'; canvas.__pulse.particles = 0;
    };
  }, [active, draw]);
  return ref;
}
