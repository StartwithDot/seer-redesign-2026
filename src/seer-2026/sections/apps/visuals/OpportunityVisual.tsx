import { canvasStyle, clamp, colors, dot, label, lerp, line, smooth, useCanvasScene, type VisualProps } from './shared2';

const rows = [144, 232, 320] as const;
const names = ['Submission A', 'Submission B', 'Submission C'] as const;
const baseOdds = [41, 27, 18] as const;
// A fixed pool replaces the source scene's numbered chips with small submissions.
const submissions = Array.from({ length: 40 }, (_, i) => ({
  x: 24 + (i % 8) * 16, y: 126 + Math.floor(i / 8) * 42,
  delay: (i % 8) * 0.105 + Math.floor(i / 8) * 0.14,
  row: i === 5 ? 0 : i === 18 ? 1 : i === 31 ? 2 : -1,
  phase: i * 2.399963,
}));

function drawOpportunity(ctx: CanvasRenderingContext2D, time: number, reduced: boolean) {
  const t = time % 13;
  const fieldAlpha = reduced ? 1 : 1 - smooth(11.5, 13, t);
  label(ctx, '40 submissions', 20, 64);
  label(ctx, 'Shortlist', 244, 96);
  label(ctx, 'Traders forecast selection', 20, 397, 16, colors.muted);

  // The channel narrows before three distinct shortlist paths fan out again.
  ctx.strokeStyle = colors.grey; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(16, 105); ctx.bezierCurveTo(116, 105, 157, 190, 210, 205); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(16, 337); ctx.bezierCurveTo(116, 337, 157, 242, 210, 229); ctx.stroke();
  rows.forEach(y => {
    ctx.beginPath(); ctx.moveTo(210, 217); ctx.bezierCurveTo(229, 217, 225, y, 244, y);
    ctx.strokeStyle = colors.grey; ctx.lineWidth = 1; ctx.stroke();
  });

  rows.forEach((y, i) => {
    const repricing = reduced ? 0 : Math.sin(time * 0.85 + i * 1.8) * 1.6 + Math.sin(time * 1.65 + i) * 0.4;
    const odds = baseOdds[i] + repricing;
    line(ctx, 244, y + 52.5, 456, y + 52.5, colors.grey);
    dot(ctx, 246, y, 3.5, colors.violet);
    label(ctx, names[i], 262, y, 16);
    label(ctx, `${Math.round(odds)}c`, 456, y, 28, colors.violet, 'right', 500);
    line(ctx, 264, y + 23, 454, y + 23, colors.grey, 3);
    line(ctx, 264, y + 23, 264 + 190 * (odds / 60), y + 23, colors.violet, 3);
    if (i === 0) {
      // The reviewer check is ink, distinct from the violet market price.
      const pulse = reduced ? 1 : 0.72 + 0.28 * (0.5 + 0.5 * Math.sin(time * 1.9));
      ctx.save(); ctx.globalAlpha = pulse; ctx.strokeStyle = colors.ink; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(244, y + 36); ctx.lineTo(248, y + 40); ctx.lineTo(255, y + 32); ctx.stroke(); ctx.restore();
      label(ctx, 'Reviewers decide', 264, y + 38, 16, colors.ink);
    }
  });

  ctx.save();
  submissions.forEach(submission => {
    const progress = reduced ? 0 : clamp((t - submission.delay) / 6.2);
    const funnel = smooth(0, 0.73, progress);
    const settle = smooth(0.73, 1, progress);
    const entry = reduced ? 1 : smooth(0, 0.8, t - submission.delay + 0.3);
    const drift = reduced ? 0 : Math.sin(time * 1.1 + submission.phase) * 2 * (1 - funnel);
    let x = lerp(submission.x - (1 - entry) * 80, 210, funnel);
    let y = lerp(submission.y + drift, 217 + Math.sin(submission.phase) * 8, funnel);
    let alpha = entry * fieldAlpha;
    if (submission.row >= 0) {
      x = lerp(x, 246, settle); y = lerp(y, rows[submission.row], settle);
    } else alpha *= 1 - smooth(0.58, 0.9, progress);
    if (alpha < 0.01) return;
    ctx.globalAlpha = alpha;
    dot(ctx, x, y, submission.row >= 0 ? 3.2 : 2.4, submission.row >= 0 ? colors.violet : colors.muted);
  });
  ctx.restore();
}

export function OpportunityVisual({ active }: VisualProps) {
  const ref = useCanvasScene(active, drawOpportunity, 3.6);
  return <canvas ref={ref} width={480} height={420} style={canvasStyle} role="img" aria-label="Forty submissions narrow into three market-ranked candidates. Traders forecast selection; reviewers keep the final decision." />;
}
export default OpportunityVisual;
