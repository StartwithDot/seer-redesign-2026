import nu7 from './archive/zcash-nu7.json';
import grants from './archive/zcash.json';
import octant from './archive/octant.json';
import l2 from './archive/round2-l2.json';
import l1 from './archive/round2-l1.json';
import round2 from './archive/round2.json';
import type { ArchivedMarketRow, PricePoint } from './types';

type Market = { id: string; marketName?: string; outcomes?: string[]; prices?: (number | null)[]; upPrice?: number; downPrice?: number; yesPrice?: number; noPrice?: number; price?: number };
type Series = { outcomeName: string; points: [number, number][] };
type Fixture = { markets: { marketsData?: Record<string, Market>; markets?: Market[] }; charts: Record<string, { series: Series[] }> };
const fixtures = { 'zcash-nu7': nu7, 'zcash-grants': grants, octant, 'round-2-l2': l2, 'round-2-l1': l1, 'round-2-originality': round2 } as unknown as Record<string, Fixture>;
const points = (series?: Series): PricePoint[] => (series?.points ?? []).map(([timestamp, price]) => ({ timestamp, price })).sort((a, b) => a.timestamp - b.timestamp);

export function archivedRows(id: string): ArchivedMarketRow[] {
  const fixture = fixtures[id];
  if (!fixture) return [];
  const rows: ArchivedMarketRow[] = [];
  const add = (market: Market, name: string, group: string, index?: number) => {
    const series = fixture.charts[market.id.toLowerCase()]?.series ?? [];
    const primary = index === undefined ? series.find(s => /^(UP|YES)$/i.test(s.outcomeName)) ?? series[0] : series.find(s => s.outcomeName === name) ?? series[index];
    const upHistory = points(primary);
    const downHistory = index === undefined ? points(series.find(s => /^(DOWN|NO)$/i.test(s.outcomeName))) : [];
    rows.push({ id: `${market.id.toLowerCase()}${index === undefined ? '' : `:${index}`}`, name, group,
      primaryPrice: index === undefined ? market.upPrice ?? market.yesPrice ?? market.price ?? null : market.prices?.[index] ?? null,
      pairedPrice: index === undefined ? market.downPrice ?? market.noPrice ?? null : null,
      balance: null, predicted: null, difference: null, upHistory, downHistory,
      historyState: upHistory.length || downHistory.length ? 'available' : 'not included in the saved contest response' });
  };
  if (fixture.markets.marketsData) for (const [name, market] of Object.entries(fixture.markets.marketsData)) {
    if (market.prices) market.prices.forEach((_, index) => add(market, fixture.markets.markets?.find(item => item.id.toLowerCase() === market.id.toLowerCase())?.outcomes?.[index] ?? fixture.charts[market.id.toLowerCase()]?.series[index]?.outcomeName ?? `Outcome ${index + 1}`, name, index));
    else add(market, name, '');
  } else for (const market of fixture.markets.markets ?? []) market.outcomes?.forEach((name, index) => add(market, name, market.marketName ?? '', index));
  return rows;
}
export function archivedMarketCount(id: string): number | null {
  const data = fixtures[id]?.markets;
  return data ? data.marketsData ? Object.keys(data.marketsData).length : data.markets?.length ?? null : null;
}
