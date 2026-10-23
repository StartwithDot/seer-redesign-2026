import { useEffect, useRef, type CSSProperties } from 'react';
import { canvasStyle as baseCanvasStyle, COLORS } from './shared';
export { clamp, lerp, smooth, type VisualProps } from './shared';

// Task palette: a white stage and quieter violet than the original neon scenes.
export const colors = { ...COLORS, muted: '#686870', charcoal: '#0E0E12' } as const;
export const canvasStyle: CSSProperties = { ...baseCanvasStyle, height: '100%', fontVariantNumeric: 'tabular-nums' };
interface LabelBox { text: string; x: number; y: number; width: number; height: number }
type SceneCanvas = HTMLCanvasElement & { __labels: LabelBox[]; __labelCount: number };
type Scene = (context: CanvasRenderingContext2D, time: number, reduced: boolean) => void;

export function line(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, width = 1) {
  ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
}
export function dot(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) {
  ctx.beginPath(); ctx.fillStyle = color; ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
}

// All labels share halo, dash reset, typography and reusable logical-size bounds.
export function label(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size = 16, color: string = colors.ink, align: CanvasTextAlign = 'left', weight = 500, background: string = colors.white) {
  ctx.save(); ctx.setLineDash([]); ctx.textAlign = align; ctx.textBaseline = 'middle';
  ctx.font = `${weight} ${size}px "Inter Tight Variable", "Inter Tight", "Inter", sans-serif`;
  const width = ctx.measureText(text).width;
  ctx.lineJoin = 'round'; ctx.lineWidth = 4; ctx.strokeStyle = background; ctx.strokeText(text, x, y);
  ctx.fillStyle = color; ctx.fillText(text, x, y); ctx.restore();
  const canvas = ctx.canvas as SceneCanvas;
  const index = canvas.__labelCount++;
  const bounds = canvas.__labels[index] ?? (canvas.__labels[index] = { text: '', x: 0, y: 0, width: 0, height: 0 });
  bounds.text = text; bounds.x = x - (align === 'center' ? width / 2 : align === 'right' ? width : 0);
  bounds.y = y - size / 2; bounds.width = width; bounds.height = size;
}

export function useCanvasScene(active: boolean, draw: Scene, stillTime: number) {
  const ref = useRef<HTMLCanvasElement>(null);
  const elapsed = useRef(0);
  useEffect(() => {
    const canvas = ref.current as SceneCanvas | null;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !parent || !ctx) return;
    canvas.__labels = []; canvas.__labelCount = 0;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false, disposed = false, frame = 0, previous = 0;
    let cssWidth = 480, cssHeight = 420, dpr = 1;
    let lastPaint = elapsed.current > 0 ? elapsed.current : stillTime;
    const paint = (time: number) => {
      lastPaint = time;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height);
      const scale = Math.min(cssWidth / 480, cssHeight / 420);
      ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * (cssWidth - 480 * scale) / 2, dpr * (cssHeight - 420 * scale) / 2);
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 480, 420); ctx.clip();
      ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.setLineDash([]); canvas.__labelCount = 0;
      draw(ctx, time, media.matches); ctx.restore(); canvas.__labels.length = canvas.__labelCount;
    };
    const stop = () => { cancelAnimationFrame(frame); frame = 0; previous = 0; };
    const running = () => active && visible && !document.hidden && !media.matches;
    const tick = (now: number) => {
      frame = 0;
      if (!running()) { previous = 0; return; }
      if (previous) elapsed.current += Math.min((now - previous) / 1000, 0.064);
      previous = now; paint(elapsed.current); frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      stop();
      if (media.matches) paint(stillTime);
      else if (running()) frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      cssWidth = rect.width || 480; cssHeight = rect.height || 420;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cssWidth * dpr); canvas.height = Math.round(cssHeight * dpr);
      paint(media.matches ? stillTime : lastPaint);
    };
    const intersection = new IntersectionObserver(entries => { visible = entries[0].isIntersecting && entries[0].intersectionRatio > 0; sync(); }, { threshold: [0, 0.01] });
    const observer = new ResizeObserver(resize);
    intersection.observe(canvas); observer.observe(parent); resize();
    media.addEventListener('change', sync); document.addEventListener('visibilitychange', sync); window.addEventListener('resize', resize);
    void document.fonts?.ready.then(() => { if (!disposed) paint(lastPaint); });
    return () => {
      disposed = true; stop(); intersection.disconnect(); observer.disconnect();
      media.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync); window.removeEventListener('resize', resize);
    };
  }, [active, draw, stillTime]);
  return ref;
}
