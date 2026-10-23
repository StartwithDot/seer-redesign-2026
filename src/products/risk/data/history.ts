import { quarterlyToAnnualPd } from './math';
import { POOL_HISTORY, decodePdToken, type RawPoolHistoryPoint } from './pool-history';
import type { AssetRecord } from './types';

export interface HistoryPoint {
  timestamp: number;
  iso: string;
  label: string;
  marketPd: number;
  poolPrice: number;
  source: RawPoolHistoryPoint;
}

const decodeTicker = (point: RawPoolHistoryPoint): string => {
  return decodePdToken(point.token0Name) || decodePdToken(point.token1Name) || '';
};

const timestampLabel = (timestamp: number): string =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(timestamp * 1000));

const toAnnualPd = (poolPrice: number): number =>
  quarterlyToAnnualPd(Math.min(1, Math.max(0, poolPrice)) * 100);

export const decodePoolHistory = (ticker: string, targetMarketPd: number): HistoryPoint[] => {
  const matchingSeries = POOL_HISTORY[ticker] || Object.entries(POOL_HISTORY).find(([key]) => key.toLowerCase() === ticker.toLowerCase())?.[1] || [];
  const raw = matchingSeries.filter((point) => decodeTicker(point).toLowerCase() === ticker.toLowerCase() &&
    Number.isFinite(point.periodStartUnix) && Number.isFinite(Number(point.token0Price)) &&
    Number.isFinite(Number(point.token1Price)) && Number(point.token0Price) >= 0 && Number(point.token1Price) >= 0);
  const sorted = [...raw].sort((a, b) => a.periodStartUnix - b.periodStartUnix);
  const unscaled = sorted.map((point) => Math.min(Number(point.token0Price), Number(point.token1Price)));
  const lastAnnual = unscaled.length ? toAnnualPd(unscaled[unscaled.length - 1]) : 0;
  const scale = lastAnnual > 0 ? targetMarketPd / lastAnnual : 1;
  return sorted.map((point, index) => {
    const poolPrice = unscaled[index];
    return {
      timestamp: point.periodStartUnix,
      iso: new Date(point.periodStartUnix * 1000).toISOString(),
      label: timestampLabel(point.periodStartUnix),
      marketPd: Math.min(100, Math.max(0, toAnnualPd(poolPrice) * scale)),
      poolPrice,
      source: point,
    };
  });
};

export const buildHistory = (asset: AssetRecord): HistoryPoint[] =>
  decodePoolHistory(asset.ticker, asset.marketPd);

export const historyChange = (asset: AssetRecord, hours = 24): number => {
  const history = buildHistory(asset);
  if (history.length < 2) return 0;
  const end = history[history.length - 1];
  const target = end.timestamp - hours * 3_600;
  const start = history.reduce((closest, point) =>
    Math.abs(point.timestamp - target) < Math.abs(closest.timestamp - target) ? point : closest,
  history[0]);
  return end.marketPd - start.marketPd;
};

export const historyRange = (history: HistoryPoint[], range: 'all' | '30d' | '7d' | '24h'): HistoryPoint[] => {
  if (range === 'all' || !history.length) return history;
  const hours = range === '30d' ? 720 : range === '7d' ? 168 : 24;
  const cutoff = history[history.length - 1].timestamp - hours * 3_600;
  return history.filter((point) => point.timestamp >= cutoff);
};
