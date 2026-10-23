import type { ChartMarketTotals } from './types';

export async function loadMarketVolumes(): Promise<Record<string, ChartMarketTotals>> {
  const response = await fetch(new URL('./refresh-market-volume.json?no-inline', import.meta.url), { cache: 'no-cache' });
  if (!response.ok) throw new Error(`Market-volume snapshot request failed (${response.status}).`);
  const value: unknown = await response.json();
  const payload = value && typeof value === 'object' ? (value as { data?: { volumes?: unknown } }).data?.volumes : null;
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error('Invalid market-volume response.');
  const volumes = payload as Record<string, Record<string, unknown>>;
  if (!Object.keys(volumes).length || !Object.values(volumes).every(record => record
    && ['totalVolumeMarket', 'totalVolumeTokens', 'totalLiquidityMarket', 'totalLiquidityTokens'].every(key => typeof record[key] === 'string')))
    throw new Error('Missing market-volume totals.');
  return Object.fromEntries(Object.entries(volumes).map(([id, record]) => [id, {
    volumeMarket: record.totalVolumeMarket as string, volumeTokens: record.totalVolumeTokens as string,
    liquidityMarket: record.totalLiquidityMarket as string, liquidityTokens: record.totalLiquidityTokens as string,
  }]));
}
