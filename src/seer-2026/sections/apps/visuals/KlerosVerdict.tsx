import { canvasStyle, clamp, colors, dot, label, lerp, line, smooth, useCanvasScene, type VisualProps } from './shared2';

const jury = Array.from({ length: 9 }, (_, i) => {
  const angle = (200 + i * 17.5) * Math.PI / 180;
  return { x: 240 + Math.cos(angle) * 148, y: 232 + Math.sin(angle) * 148, endX: 156 + i * 21, offset: ((i * 5) % 7 - 3) * 7 };
});
const monochrome = { faint: '#323238', grey: '#A8A8B3', white: '#FFFFFF' } as const;

function drawVerdict(ctx: CanvasRenderingContext2D, time: number, reduced: boolean) {
  const t = time % 18;
  const release = reduced ? 1 : 1 - smooth(15.5, 18, t);
  const lock = reduced ? 1 : smooth(9, 10.3, t);
  ctx.fillStyle = colors.charcoal; ctx.fillRect(0, 0, 480, 420);
  label(ctx, '9 jurors', 240, 44, 16, monochrome.grey, 'center', 500, colors.charcoal);

  ctx.strokeStyle = monochrome.faint; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(240, 232, 148, 200 * Math.PI / 180, 340 * Math.PI / 180); ctx.stroke();
  line(ctx, 136, 244.5, 344, 244.5, monochrome.faint);

  jury.forEach((juror, i) => {
    const cast = reduced ? 1 : smooth(i * 0.42 + 0.5, i * 0.42 + 1.5, t);
    const align = reduced ? 1 : smooth(4.7 + i * 0.38, 5.75 + i * 0.38, t);
    const endY = lerp(244 + juror.offset, 244, align);
    const endX = lerp(juror.endX + juror.offset * 0.3, juror.endX, align);
    ctx.save(); ctx.globalAlpha = (1 - lock) * release * 0.72;
    line(ctx, juror.x, juror.y, lerp(juror.x, endX, cast), lerp(juror.y, endY, cast), align > 0.5 ? monochrome.white : monochrome.grey);
    if (cast > 0.99) dot(ctx, endX, endY, 1.8, monochrome.grey);
    ctx.restore();
    dot(ctx, juror.x, juror.y, 3, monochrome.grey);
    ctx.save(); ctx.globalAlpha = cast * release;
    dot(ctx, juror.x, juror.y, 3, monochrome.white); ctx.restore();
  });

  // Once the nine inputs align, they resolve into one precise, stationary line.
  ctx.save(); ctx.globalAlpha = lock * release;
  line(ctx, 120, 244.5, 120 + 240 * lock, 244.5, monochrome.white, 2);
  line(ctx, 120, 239, 120, 250, monochrome.white);
  line(ctx, 360, 239, 360, 250, monochrome.white);
  const tick = reduced ? 1 : smooth(10, 10.9, t);
  const first = clamp(tick * 2), second = clamp(tick * 2 - 1);
  ctx.beginPath(); ctx.strokeStyle = monochrome.white; ctx.lineWidth = 1.5;
  ctx.moveTo(307, 286); ctx.lineTo(lerp(307, 311, first), lerp(286, 290, first));
  if (second > 0) ctx.lineTo(lerp(311, 319, second), lerp(290, 282, second));
  ctx.stroke();
  label(ctx, 'Final', 328, 286, 16, monochrome.white, 'left', 500, colors.charcoal); ctx.restore();
  label(ctx, 'Ruling', 136, 286, 16, monochrome.grey, 'left', 500, colors.charcoal);
}

export function KlerosVerdict({ active }: VisualProps) {
  const ref = useCanvasScene(active, drawVerdict, 11);
  return <canvas ref={ref} width={480} height={420} style={{ ...canvasStyle, background: colors.charcoal }} role="img" aria-label="Nine jurors cast their decisions toward a ruling bar. Their lines align one by one, then a single verdict locks with a Final check." />;
}
export default KlerosVerdict;
