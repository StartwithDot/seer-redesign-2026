import type { PricePoint } from '../data/types';

export function timeLinePath(points: PricePoint[], start: number, end: number, min: number, max: number): string {
  return points.map((point, index) => {
    const x = 56 + ((point.timestamp - start) / Math.max(1, end - start)) * 862;
    const y = 268 - ((point.price - min) / Math.max(0.001, max - min)) * 230;
    return `${index ? 'L' : 'M'}${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');
}
