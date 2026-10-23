import type { Market, MarketOutcome } from '../types';
import { capturedHistory } from './capturedHistory';
import { hasNumericSettlement, isScalarMarket } from '../lib/marketKind';

export type HistoryRangeId = '1d' | '1w' | '1m' | 'all' | 'custom';

export interface HistoryRange {
  id: HistoryRangeId;
  label: string;
  start: string;
  end: string;
}

export interface HistoryPoint {
  timestamp: string;
  values: Record<string, number>;
}

export interface MarketHistory {
  captured?: boolean;
  points: HistoryPoint[];
  series: MarketOutcome[];
  unit: string | undefined;
  bounds: [number, number] | undefined;
}

export { sampleClock as historySampleClock } from './clock';
import { sampleClock as historySampleClock } from './clock';

const DAY = 24 * 60 * 60 * 1000;

function historyOutcomes(market: Market) {
  return isScalarMarket(market) ? market.outcomes.filter((outcome) => outcome.id === 'estimate') : market.outcomes;
}

function atOffset(days: number) {
  return new Date(Date.parse(historySampleClock) - days * DAY).toISOString();
}

export function getBuiltinRanges(): HistoryRange[] {
  return [
    { id: '1d', label: '1D', start: atOffset(1), end: historySampleClock },
    { id: '1w', label: '1W', start: atOffset(7), end: historySampleClock },
    { id: '1m', label: '1M', start: atOffset(30), end: historySampleClock },
    { id: 'all', label: 'All', start: atOffset(210), end: historySampleClock },
  ];
}

function seededNoise(seed: number, index: number, seriesIndex: number) {
  const value = Math.sin(seed * 0.017 + index * 1.731 + seriesIndex * 2.117) * 43758.5453;
  return ((value - Math.floor(value)) * 2 - 1) * 100;
}

function normalizeProbability(values: number[]) {
  const positive = values.map((value) => Math.max(0.01, value));
  const total = positive.reduce((sum, value) => sum + value, 0);
  return positive.map((value) => (value / total) * 100);
}

function createPoint(
  market: Market,
  timestamp: string,
  progress: number,
  sampleIndex: number,
): HistoryPoint {
  const seed = [...market.id].reduce((sum, character) => sum + character.charCodeAt(0), 0);
  const scalarMarket = hasNumericSettlement(market);

  if (scalarMarket) {
    const [min, max] = market.bounds ?? [0, 100];
    const values = Object.fromEntries(
      historyOutcomes(market).map((outcome, index) => {
        const opening = min + ((seed + index * 37) % 100) / 100 * (max - min);
        const noise = seededNoise(seed, sampleIndex, index) * (max - min) * 0.0025;
        const value = opening + (outcome.chance - opening) * progress + noise * (1 - progress * 0.35);
        return [outcome.id, Math.max(min, Math.min(max, value))];
      }),
    );
    return { timestamp, values };
  }

  const raw = market.outcomes.map((outcome, index) => {
    const openingShift = ((seed + index * 29) % 15) - 7;
    const noise = seededNoise(seed, sampleIndex, index) * 1.4;
    return Math.max(1, outcome.chance + openingShift * (1 - progress) + noise * (1 - progress * 0.35));
  });
  const normalized = normalizeProbability(raw);
  return {
    timestamp,
    values: Object.fromEntries(market.outcomes.map((outcome, index) => [outcome.id, normalized[index]])),
  };
}

export function getMarketHistory(market: Market, range: HistoryRange): MarketHistory {
  if (market.provenance.origin === 'captured-api') return capturedHistory(market, range);
  if (market.hasPriceHistory === false) {
    return {
      points: [],
      series: historyOutcomes(market).map((outcome) => ({ ...outcome })),
      unit: market.unit,
      bounds: market.bounds ? [...market.bounds] : undefined,
    };
  }

  // All ranges are slices of one deterministic history, never regenerated
  // around the viewport. Switching ranges must preserve overlapping prices.
  const created = Date.parse(market.createdAt);
  const clock = Date.parse(historySampleClock);
  const start = Math.max(created, Date.parse(range.start));
  const end = Math.min(clock, Date.parse(range.end));
  if (!Number.isFinite(start) || !Number.isFinite(end) || start > end || created > clock) {
    return { points: [], series: historyOutcomes(market).map((outcome) => ({ ...outcome })), unit: market.unit, bounds: market.bounds ? [...market.bounds] : undefined };
  }
  const interval = 30 * 60 * 1000;
  const valueAt = (time: number) => {
    const sample = Math.floor((time - created) / interval);
    const progress = clock === created ? 1 : (time - created) / (clock - created);
    const point = createPoint(market, new Date(time).toISOString(), progress, sample);
    if (time === clock) {
      const scalar = market.type === 'scalar' || market.type === 'multi-scalar';
      const series = historyOutcomes(market);
      const values = scalar ? series.map((outcome) => Math.max(market.bounds?.[0] ?? 0, Math.min(market.bounds?.[1] ?? 100, outcome.chance))) : normalizeProbability(series.map((outcome) => outcome.chance));
      point.values = Object.fromEntries(series.map((outcome, index) => [outcome.id, values[index]]));
    }
    return point;
  };
  const points = [valueAt(start)];
  for (let time = Math.ceil((start + 1) / interval) * interval; time < end; time += interval) points.push(valueAt(time));
  if (end > start) points.push(valueAt(end));

  return {
    points,
    series: historyOutcomes(market).map((outcome) => ({ ...outcome })),
    unit: market.unit,
    bounds: market.bounds ? [...market.bounds] : undefined,
  };
}
