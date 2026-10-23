import { toHorizontalStepPoints } from './price-series';
import type { PricePoint, Repository } from './types';

export type FieldLeg = 'up' | 'down';
export type SwarmLayer = 'price' | 'gap' | 'drift' | 'volume' | 'predictions';
export type DistributionPoint = {
  timestamp: number;
  p10: number;
  median: number;
  p90: number;
};

export function legPoints(repository: Repository, leg: FieldLeg): PricePoint[] {
  return leg === 'up' ? repository.upHistory : repository.downHistory;
}

export function latestPrice(points: PricePoint[]): number {
  return points.at(-1)?.price ?? 0;
}

export function stepPoints(points: PricePoint[]): PricePoint[] {
  return toHorizontalStepPoints(points);
}

export function valueAtOrBefore(points: PricePoint[], timestamp: number): number | null {
  if (!points.length || timestamp < points[0].timestamp) return null;
  let low = 0;
  let high = points.length - 1;
  let result = 0;
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    if (points[middle].timestamp <= timestamp) {
      result = middle;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }
  return points[result].price;
}

export function pointsThrough(points: PricePoint[], start: number, end: number): PricePoint[] {
  const before = [...points].reverse().find((point) => point.timestamp < start);
  const inside = points.filter((point) => point.timestamp >= start && point.timestamp <= end);
  const output = before ? [{ timestamp: start, price: before.price }, ...inside] : [...inside];
  const endPrice = valueAtOrBefore(points, end);
  if (endPrice !== null && output.at(-1)?.timestamp !== end) output.push({ timestamp: end, price: endPrice });
  return output;
}

export function quantile(values: number[], percentile: number): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((left, right) => left - right);
  const position = (sorted.length - 1) * percentile;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower);
}

export function distributionAt(series: PricePoint[][], timestamp: number): DistributionPoint {
  const values = series
    .map((points) => valueAtOrBefore(points, timestamp))
    .filter((value): value is number => value !== null);
  return {
    timestamp,
    p10: quantile(values, 0.1),
    median: quantile(values, 0.5),
    p90: quantile(values, 0.9),
  };
}

export function distributionEnvelope(series: PricePoint[][], start: number, end: number): DistributionPoint[] {
  const timestamps = new Set<number>([start, end]);
  series.forEach((points) => points.forEach((point) => {
    if (point.timestamp >= start && point.timestamp <= end) timestamps.add(point.timestamp);
  }));
  return [...timestamps]
    .sort((left, right) => left - right)
    .map((timestamp) => distributionAt(series, timestamp));
}

export function uniqueTradeTimes(points: PricePoint[], start: number, end: number): number[] {
  return [...new Set(points
    .filter((point) => point.timestamp >= start && point.timestamp <= end)
    .map((point) => point.timestamp))]
    .sort((left, right) => left - right);
}

export function formatUtc(timestamp: number, includeTime = true): string {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {}),
    timeZone: 'UTC',
    timeZoneName: includeTime ? 'short' : undefined,
  }).format(new Date(timestamp * 1000));
}

export function utcDayTicks(start: number, end: number): number[] {
  const ticks: number[] = [];
  const firstDay = Math.ceil(start / 86_400) * 86_400;
  for (let timestamp = firstDay; timestamp < end; timestamp += 86_400) ticks.push(timestamp);
  return ticks;
}

export function collisionDodgedRows(items: Array<{ id: string; x: number }>, rowCount = 18): Map<string, number> {
  const laneLastX = Array<number>(rowCount).fill(Number.NEGATIVE_INFINITY);
  const rows = new Map<string, number>();
  [...items].sort((left, right) => left.x - right.x || left.id.localeCompare(right.id)).forEach((item) => {
    let lane = laneLastX.findIndex((lastX) => item.x - lastX > 13);
    if (lane === -1) lane = laneLastX.indexOf(Math.min(...laneLastX));
    laneLastX[lane] = item.x;
    rows.set(item.id, lane);
  });
  return rows;
}

export function concentrationCount(repositories: Repository[], low = 0.65, high = 0.85): number {
  return repositories.filter((repository) => repository.upPrice >= low && repository.upPrice <= high).length;
}

// Two thirds of the full-price axis cover a fifth of the price range: 3.33x.
export function swarmPriceX(price: number): number {
  if (price < 0.65) return 32 + price / 0.65 * 156;
  if (price > 0.85) return 812 + (price - 0.85) / 0.15 * 156;
  return 188 + (price - 0.65) / 0.2 * 624;
}

// Fix x to the exact price; solve circle separation only along y.
export function dodgeSwarmMarks(items: Array<{ id: string; x: number; radius: number }>) {
  const placed: Array<{ id: string; x: number; radius: number; y: number }> = [];
  for (const item of [...items].sort((a, b) => a.x - b.x || a.id.localeCompare(b.id))) {
    let y = 80;
    for (const other of placed) {
      const distance = item.radius + other.radius + 4;
      const dx = Math.abs(item.x - other.x);
      if (dx >= distance) continue;
      const dy = Math.sqrt(distance ** 2 - dx ** 2);
      if (Math.abs(y - other.y) < dy) y = other.y + dy;
    }
    // Moving past one circle may collide with an earlier circle.
    while (placed.some(other => Math.hypot(item.x - other.x, y - other.y) < item.radius + other.radius + 3.99)) {
      y += 4;
    }
    placed.push({ ...item, y });
  }
  return new Map(placed.map(item => [item.id, item.y]));
}
