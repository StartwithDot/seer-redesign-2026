import { useMemo } from 'react';
import { canvasStyle, COLORS, curvePoint, label, line, mod, roundedRect, smooth, STAGE, strokeCurve, useVisualCanvas, withAlpha, type Curve, type VisualDraw, type VisualProps } from './shared';

const branches: readonly Curve[] = [
  [94, 210, 128, 210, 126, 138, 162, 138],
  [94, 210, 128, 210, 126, 282, 162, 282],
];
function priceTile(ctx: CanvasRenderingContext2D, y: number, pass: boolean, cents: number) {
  roundedRect(ctx, 162, y - 42, 120, 84, 8);
  ctx.fillStyle = pass ? withAlpha(COLORS.violet, 0.055) : COLORS.white; ctx.fill();
  ctx.lineWidth = 1; ctx.strokeStyle = pass ? withAlpha(COLORS.violet, 0.24) : COLORS.grey; ctx.stroke();
  const halo = pass ? '#F7F5FF' : COLORS.white;
  label(ctx, pass ? 'IF PASS' : 'IF FAIL', 178, y - 22, { color: pass ? COLORS.violet : COLORS.muted, halo });
  label(ctx, `$${(cents / 100).toFixed(2)}`, 178, y + 4, { size: 28, weight: 600, color: COLORS.ink, halo, tabular: true });
  label(ctx, 'token price', 178, y + 30, { halo });
}
function createDraw(): VisualDraw {
  const point = { x: 0, y: 0 }, tail = { x: 0, y: 0 };
  return (ctx, frame) => {
    const time = frame.reducedMotion ? 0 : frame.time;
    // Derive the displayed spread from the displayed cents, so the arithmetic stays exact.
    const pass = 53 + Math.round(Math.sin(time * 0.65) * 0.8);
    const fail = 46 + Math.round(Math.sin(time * 0.48) * 0.6);
    const gap = pass - fail;
    const entry = frame.reducedMotion ? 1 : smooth(0, 1, time);
    const split = frame.reducedMotion ? 1 : smooth(0.65, 1.9, time);
    line(ctx, 18, 210, 94, 210, COLORS.grey, 1.5);
    if (entry > 0) line(ctx, 18, 210, 18 + 76 * entry, 210, COLORS.ink, 1.5);
    for (let branch = 0; branch < 2; branch++) {
      const color = branch === 0 ? COLORS.violet : withAlpha(COLORS.ink, 0.6);
      strokeCurve(ctx, branches[branch], COLORS.grey);
      strokeCurve(ctx, branches[branch], color, 1.75, split);
      if (frame.reducedMotion || split < 1) continue;
      for (let packet = 0; packet < 2; packet++) {
        const u = mod(time * 0.26 + packet * 0.5, 1);
        curvePoint(branches[branch], u, point); curvePoint(branches[branch], Math.max(0, u - 0.07), tail);
        line(ctx, tail.x, tail.y, point.x, point.y, color, 2.5);
        ctx.beginPath(); ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.white; ctx.fill(); ctx.strokeStyle = color; ctx.lineWidth = 1.3; ctx.stroke();
      }
    }
    if (!frame.reducedMotion && split === 1) {
      const u = mod(time * 0.26, 1);
      line(ctx, 18 + u * 76, 210, 18 + u * 76 + 5, 210, COLORS.violet, 2.5);
      (ctx.canvas as HTMLCanvasElement & { __pulse: { particles: number } }).__pulse.particles = 5;
    }
    priceTile(ctx, 138, true, pass); priceTile(ctx, 282, false, fail);
    ctx.save(); ctx.strokeStyle = withAlpha(COLORS.ink, 0.45); ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(290, 138); ctx.lineTo(304, 138); ctx.lineTo(304, 282); ctx.lineTo(290, 282); ctx.stroke(); ctx.restore();
    label(ctx, 'Market signal', 316, 164);
    label(ctx, `${gap >= 0 ? '+' : '−'}${(Math.abs(gap) / 100).toFixed(2)}`, 316, 190, { size: 24, weight: 600, color: COLORS.violet, tabular: true });
    line(ctx, 304, 210, 372, 210, COLORS.grey, 1.2);
    const signal = frame.reducedMotion ? 1 : smooth(1.9, 2.8, time);
    if (signal > 0) line(ctx, 304, 210, 304 + 68 * signal, 210, withAlpha(COLORS.violet, 0.65), 1.2);
    line(ctx, 366, 205, 372, 210, COLORS.violet, 1.2); line(ctx, 366, 215, 372, 210, COLORS.violet, 1.2);
    const phase = mod(time, 12);
    const votes = frame.reducedMotion ? 1 : smooth(2.8, 7.6, phase) * (1 - smooth(10.4, 12, phase));
    ctx.save(); ctx.beginPath(); ctx.arc(414, 210, 34, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = COLORS.white; ctx.fillRect(380, 176, 68, 68);
    ctx.fillStyle = withAlpha(COLORS.violet, 0.12); ctx.fillRect(380, 244 - votes * 68, 68, votes * 68); ctx.restore();
    ctx.beginPath(); ctx.arc(414, 210, 34, 0, Math.PI * 2); ctx.lineWidth = 1.5; ctx.strokeStyle = COLORS.grey; ctx.stroke();
    if (votes > 0) {
      ctx.beginPath(); ctx.arc(414, 210, 34, -Math.PI / 2, -Math.PI / 2 + votes * Math.PI * 2);
      ctx.strokeStyle = COLORS.violet; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.stroke();
    }
    label(ctx, 'DAO', 414, 210, { size: 15, weight: 600, align: 'center', color: COLORS.ink });
    label(ctx, 'DAO decides', 414, 142, { align: 'center', color: COLORS.ink });
    label(ctx, 'informed,', 414, 270, { align: 'center' });
    label(ctx, 'never overruled', 414, 290, { align: 'center' });
  };
}

export function FutarchyVisual({ active }: VisualProps) {
  const draw = useMemo(createDraw, []);
  const canvas = useVisualCanvas(active, draw);
  return <canvas ref={canvas} width={STAGE.width} height={STAGE.height} style={canvasStyle} role="img"
    aria-label="Futarchy compares token prices if a proposal passes or fails. Their price difference informs the DAO. DAO members vote and decide, informed and never overruled.">
    Conditional market prices inform the DAO. DAO members keep the final decision.
  </canvas>;
}
export default FutarchyVisual;
