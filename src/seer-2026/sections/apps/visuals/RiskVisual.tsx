import { canvasStyle, colors, dot, label, lerp, line, smooth, useCanvasScene, type VisualProps } from './shared2';

const plot = { left: 68, right: 278, top: 98, bottom: 298 } as const;
const protocols = [
  { name: 'Protocol A', yearlyRisk: 0.021, color: colors.violet, dash: [] as number[] },
  { name: 'Protocol B', yearlyRisk: 0.067, color: colors.ink, dash: [] as number[] },
  { name: 'Protocol C', yearlyRisk: 0.124, color: colors.muted, dash: [4, 4] },
].map(protocol => {
  // Annual PD -> constant hazard lambda=-ln(1-PD); survival S(t)=exp(-lambda*t).
  const hazard = -Math.log1p(-protocol.yearlyRisk);
  return { ...protocol, hazard, path: null as Path2D | null };
});
function survivalY(survival: number) { return plot.top + (1 - survival) / 0.3 * (plot.bottom - plot.top); }

function drawRisk(ctx: CanvasRenderingContext2D, time: number, reduced: boolean) {
  const sweep = reduced ? 0.5 : 0.5 - 0.5 * Math.cos(time * Math.PI / 7);
  const cursorX = lerp(plot.left, plot.right, sweep);
  const reveal = reduced ? 1 : smooth(0, 1.8, time);
  label(ctx, 'Survival chance', 20, 38, 20);
  label(ctx, '2-year horizon', 460, 38, 16, colors.muted, 'right');
  label(ctx, `${Math.round(sweep * 24)} months`, Math.max(111, Math.min(235, cursorX)), 74, 16, colors.ink, 'center');

  [1, 0.9, 0.8, 0.7].forEach(survival => {
    const y = Math.round(survivalY(survival)) + 0.5;
    line(ctx, plot.left, y, plot.right, y, colors.grey);
    label(ctx, `${Math.round(survival * 100)}%`, 57, y, 16, colors.muted, 'right');
  });
  label(ctx, 'Now', plot.left, 326, 16, colors.muted, 'center');
  label(ctx, '1 year', (plot.left + plot.right) / 2, 326, 16, colors.muted, 'center');
  label(ctx, '2 years', plot.right, 326, 16, colors.muted, 'center');

  ctx.save(); ctx.beginPath(); ctx.rect(plot.left - 3, plot.top - 4, (plot.right - plot.left) * reveal + 6, plot.bottom - plot.top + 8); ctx.clip();
  protocols.forEach(protocol => {
    // Build once in the canvas lifecycle, so importing the component is SSR-safe.
    if (!protocol.path) {
      const path = new Path2D();
      for (let i = 0; i <= 120; i++) {
        const u = i / 120, x = lerp(plot.left, plot.right, u), y = survivalY(Math.exp(-protocol.hazard * u * 2));
        if (i === 0) path.moveTo(x, y); else path.lineTo(x, y);
      }
      protocol.path = path;
    }
    ctx.strokeStyle = protocol.color; ctx.lineWidth = 2; ctx.setLineDash(protocol.dash); ctx.stroke(protocol.path);
  });
  ctx.restore();

  // A single vertical crosshair reads all protocols at exactly the same horizon.
  ctx.save(); ctx.setLineDash([2, 5]);
  line(ctx, cursorX, plot.top, cursorX, plot.bottom, colors.muted); ctx.restore();
  protocols.forEach((protocol, i) => {
    const endY = survivalY(Math.exp(-protocol.hazard * 2));
    const survival = Math.exp(-protocol.hazard * sweep * 2);
    const y = survivalY(survival);
    if (sweep <= reveal) {
      dot(ctx, cursorX, y, 4, colors.white);
      dot(ctx, cursorX, y, 2.5, protocol.color);
      line(ctx, cursorX - 5, y, cursorX + 5, y, protocol.color);
    }
    dot(ctx, plot.right, endY, 2.5, protocol.color);
    line(ctx, plot.right + 6, endY, 291, endY, colors.grey);
    label(ctx, protocol.name, 300, endY - 8, 16, protocol.color);
    label(ctx, `${(protocol.yearlyRisk * 100).toFixed(1)}% yearly risk`, 300, endY + 16, 16, colors.ink);
    const columnX = 80 + i * 160;
    label(ctx, protocol.name, columnX, 365, 16, protocol.color, 'center');
    label(ctx, `${(survival * 100).toFixed(1)}%`, columnX, 394, 24, colors.ink, 'center');
  });
  line(ctx, 20, 348.5, 460, 348.5, colors.grey);
  line(ctx, 160.5, 362, 160.5, 404, colors.grey);
  line(ctx, 320.5, 362, 320.5, 404, colors.grey);
}

export function RiskVisual({ active }: VisualProps) {
  const ref = useCanvasScene(active, drawRisk, 3.5);
  return <canvas ref={ref} width={480} height={420} style={canvasStyle} role="img" aria-label="Compare survival curves for Protocols A, B and C over two years. Yearly default risks are 2.1%, 6.7% and 12.4%; a shared crosshair compares survival at the same time." />;
}
export default RiskVisual;
