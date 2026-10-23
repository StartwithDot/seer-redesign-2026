import { useMemo } from 'react';
import { canvasStyle, clamp, COLORS, label, lerp, line, mod, seededRandom, smooth, STAGE, useVisualCanvas, withAlpha, type VisualDraw, type VisualProps } from './shared';

const targets = [19, 37, 12, 52, 30, 45, 22, 57] as const;
const cellX = (index: number) => 84 + (index % 8) * 44;
const cellY = (index: number) => 108 + Math.floor(index / 8) * 32;
const barHeight = (probability: number) => clamp(probability / 0.07, 0, 1) * 28;

function createDraw(): VisualDraw {
  const random = seededRandom(5);
  const base = new Float64Array(64), phases = new Float64Array(64), weights = new Float64Array(64);
  for (let index = 0; index < 64; index++) { base[index] = 0.3 + random() ** 2.3 * 4.8; phases[index] = random() * Math.PI * 2; }
  const neutral = withAlpha(COLORS.ink, 0.43), cap = withAlpha(COLORS.ink, 0.65);
  return (ctx, frame) => {
    const time = frame.reducedMotion ? 2.4 : frame.time;
    let total = 0;
    for (let index = 0; index < 64; index++) {
      // Positive repricing weights, normalized to a single many-outcome probability distribution.
      weights[index] = base[index] * (1 + 0.18 * Math.sin(time * 0.7 + phases[index]) + 0.08 * Math.sin(time * 0.29 + phases[index] * 2));
      total += weights[index];
    }
    for (let index = 0; index < 64; index++) weights[index] /= total;
    const step = Math.floor(time / 3.8), phase = mod(time, 3.8);
    const current = targets[step % targets.length], previous = step === 0 ? current : targets[(step - 1) % targets.length];
    const hop = frame.reducedMotion ? 1 : smooth(0, 0.9, phase);
    const arrival = previous === current ? 1 : smooth(0.85, 1.25, phase);
    for (let index = 0; index < 64; index++) {
      const x = cellX(index), y = cellY(index), height = barHeight(weights[index]);
      line(ctx, x, y + 1.5, x + 14, y + 1.5, COLORS.grey);
      ctx.fillStyle = index === current ? COLORS.violet : neutral;
      ctx.fillRect(x, y - height, 14, height);
      if (index !== current) line(ctx, x + 0.5, y - height, x + 13.5, y - height, cap);
    }
    const targetX = cellX(current) + 7, targetY = cellY(current) - barHeight(weights[current]);
    const fromX = cellX(previous) + 7, fromY = cellY(previous) - barHeight(weights[previous]);
    const bob = frame.reducedMotion ? 0 : Math.sin(time * 2.4) * 1.5;
    const x = lerp(fromX, targetX, hop);
    const y = lerp(fromY, targetY, hop) - 20 + bob - (previous === current ? 0 : Math.sin(hop * Math.PI) * 24);
    if (arrival > 0) line(ctx, x, y + 8, targetX, lerp(y + 8, targetY - 2, arrival), COLORS.violet, 1.2);
    // The diamond is an agent; the separate bar is the market's probability, not a verdict.
    ctx.save(); ctx.beginPath(); ctx.moveTo(x, y - 6); ctx.lineTo(x + 6, y); ctx.lineTo(x, y + 6); ctx.lineTo(x - 6, y); ctx.closePath();
    ctx.fillStyle = COLORS.white; ctx.fill(); ctx.strokeStyle = COLORS.violet; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = COLORS.ink; ctx.fillRect(x - 1.25, y - 1.25, 2.5, 2.5); ctx.restore();
    label(ctx, '64 outcomes', 84, 32, { size: 17, color: COLORS.ink });
    label(ctx, 'Selected outcome', 84, 58, { size: 16 });
    label(ctx, `${(weights[current] * 100).toFixed(1)}%`, 406, 58, { size: 18, align: 'right', color: COLORS.violet, weight: 600, tabular: true });
    label(ctx, 'agents forecast how reviewers will judge', STAGE.width / 2, 386, { size: 17, align: 'center', color: COLORS.ink });
  };
}

export function DeepVisual({ active }: VisualProps) {
  const draw = useMemo(createDraw, []);
  const canvas = useVisualCanvas(active, draw);
  return <canvas ref={canvas} width={STAGE.width} height={STAGE.height} style={canvasStyle} role="img"
    aria-label="Deep prices 64 outcomes as a field of changing probability bars. An AI agent moves between outcomes and forecasts how reviewers will judge. Reviewers retain the final judgment.">
    Agents forecast how reviewers will judge many outcomes.
  </canvas>;
}
export default DeepVisual;
