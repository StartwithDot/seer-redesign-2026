import type { PricePoint } from './types';

export function toHorizontalStepPoints(points: PricePoint[]): PricePoint[] {
  const latestByTime = new Map<number, number>();
  [...points].sort((a, b) => a.timestamp - b.timestamp).forEach(point => latestByTime.set(point.timestamp, point.price));
  const steps: PricePoint[] = [];
  for (const [timestamp, price] of latestByTime) {
    const previous = steps.at(-1);
    if (!previous) { steps.push({ timestamp, price }); continue; }
    if (previous.price === price) {
      if (steps.length > 1 && steps[steps.length - 2].price === price) previous.timestamp = timestamp;
      else steps.push({ timestamp, price });
    } else steps.push({ timestamp, price: previous.price }, { timestamp, price });
  }
  return steps;
}
