import captures from './captures/chart-series.capture.json';
import type { Market } from '../types';
import type { MarketHistory, HistoryRange } from './chartHistory';
import { hasNumericSettlement, isMultiScalarMarket, isScalarMarket } from '../lib/marketKind';

const series = captures as unknown as Record<string, [number, Record<string, number>][] >;

export function capturedHistory(market: Market, range: HistoryRange): MarketHistory {
  const numeric = hasNumericSettlement(market);
  const scalar = isScalarMarket(market);
  const lower = market.bounds?.[0] ?? 0;
  const upper = market.bounds?.[1] ?? 100;
  const outcomes = scalar ? market.outcomes.filter((outcome) => outcome.id === 'estimate') : market.outcomes;
  const points = (series[market.id] ?? []).filter(([time]) => time * 1000 >= Date.parse(range.start) && time * 1000 <= Date.parse(range.end)).map(([time, prices]) => {
    let values: Record<string, number>;
    if (scalar) {
      const up = market.outcomes.find((outcome) => outcome.name.toUpperCase() === 'UP')?.index;
      const down = market.outcomes.find((outcome) => outcome.name.toUpperCase() === 'DOWN')?.index;
      const u = up === undefined ? undefined : prices[up];
      const d = down === undefined ? undefined : prices[down];
      values = { estimate: u === undefined || d === undefined || u + d === 0 ? Number.NaN : lower + (upper - lower) * u / (u + d) };
    } else {
      values = Object.fromEntries(market.outcomes.map((outcome) => {
        const price = outcome.index === undefined ? undefined : prices[outcome.index];
        return [outcome.id, price === undefined ? Number.NaN : isMultiScalarMarket(market) ? price * upper : price * 100];
      }));
    }
    return { timestamp: new Date(time * 1000).toISOString(), values };
  }).filter((point) => Object.values(point.values).some(Number.isFinite));
  return { points, series: outcomes, unit: market.unit, bounds: numeric ? market.bounds : undefined, captured: true };
}

export const hasCapturedHistory = (marketId: string) => Boolean(series[marketId]?.length);
