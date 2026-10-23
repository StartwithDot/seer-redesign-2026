import { leaderboardRows, traderDisplayName, type LeaderboardRow } from './leaderboard';

export type Period = '1D' | '1W' | '1M' | 'ALL';
export type AppFilter = 'All' | 'Foresight' | 'Opportunity Markets' | 'Deepfunding';
export type LeaderSort = 'score' | 'profit' | 'volume' | 'roi' | 'markets';
export interface LeaderQuery { period: Period; app: AppFilter; chain: number; search: string; sort: LeaderSort; ascending: boolean; page: number }
export const sampleClock = '2026-10-23T12:00:00Z';

// Explicit synthetic settlement ledger for exploring controls. Not live performance.
const settlementsFor = (traders: LeaderboardRow[]) => traders.flatMap((trader, index) => [
  { address: trader.address, date: '2026-10-23T08:00:00Z', app: 'Foresight', chain: 100, profit: trader.profit * 0.01, volume: trader.volume * 0.02, cost: index === 5 ? 0 : 4200 + index * 300, wins: 2, losses: 1, markets: 3 },
  { address: trader.address, date: '2026-10-20T08:00:00Z', app: 'Opportunity Markets', chain: index % 2 ? 10 : 100, profit: trader.profit * (index % 2 ? -0.02 : 0.04), volume: trader.volume * 0.08, cost: 18000 + index * 900, wins: 3, losses: 2, markets: 5 },
  { address: trader.address, date: '2026-10-04T08:00:00Z', app: 'Deepfunding', chain: index % 2 ? 8453 : 1, profit: trader.profit * 0.15, volume: trader.volume * 0.2, cost: 40000 + index * 1100, wins: 6, losses: 4, markets: 10 },
  { address: trader.address, date: '2026-08-18T08:00:00Z', app: 'Foresight', chain: 100, profit: trader.profit * 0.8, volume: trader.volume * 0.7, cost: 90000 + index * 2200, wins: 20, losses: 12, markets: 32 },
]);

export function queryLeaderboard(query: LeaderQuery, traders: LeaderboardRow[] = leaderboardRows) {
  const settlements = settlementsFor(traders);
  const days = query.period === '1D' ? 1 : query.period === '1W' ? 7 : query.period === '1M' ? 30 : Infinity;
  const cutoff = Date.parse(sampleClock) - days * 86400000;
  const ranked = traders.flatMap((trader) => {
    const ledger = settlements.filter((item) => item.address === trader.address && Date.parse(item.date) >= cutoff && (query.app === 'All' || item.app === query.app) && (!query.chain || item.chain === query.chain));
    if (!ledger.length) return [];
    const profit = ledger.reduce((sum, item) => sum + item.profit, 0);
    const volume = ledger.reduce((sum, item) => sum + item.volume, 0);
    const cost = ledger.reduce((sum, item) => sum + item.cost, 0);
    const markets = ledger.reduce((sum, item) => sum + item.markets, 0);
    const wins = ledger.reduce((sum, item) => sum + item.wins, 0);
    const losses = ledger.reduce((sum, item) => sum + item.losses, 0);
    const gains = ledger.reduce((sum, item) => sum + Math.max(0, item.profit), 0);
    const burn = ledger.reduce((sum, item) => sum + Math.max(0, -item.profit), 0);
    const roi = cost ? profit / cost * 100 : null;
    const hitRate = wins / (wins + losses) * 100;
    const factor = burn ? gains / burn : null;
    const shrink = Math.min(1, markets / 30);
    const score = markets < 5 ? null : Math.min(100, Math.max(0, (50 + (roi ?? 0) * 0.2 + (hitRate - 50) * 0.5) * shrink));
    return [{ ...trader, label: traderDisplayName(trader.address, trader.label), profit, volume, markets, roi, score, hitRate, factor, burn, shrink, rank: 0 }];
  }).sort((a, b) => (b.profit - a.profit));
  ranked.forEach((row, index) => { row.rank = index + 1; });
  const rows = ranked.filter((row) => `${row.label} ${row.address}`.toLowerCase().includes(query.search.toLowerCase().trim()));
  rows.sort((a, b) => {
    const av = a[query.sort]; const bv = b[query.sort];
    if (av === null) return bv === null ? 0 : 1;
    if (bv === null) return -1;
    return (av - bv) * (query.ascending ? 1 : -1);
  });
  const pages = Math.max(1, Math.ceil(rows.length / 5));
  return { rows: rows.slice((Math.min(query.page, pages) - 1) * 5, Math.min(query.page, pages) * 5), all: ranked, total: rows.length, pages, offset: (Math.min(query.page, pages) - 1) * 5, updatedAt: sampleClock };
}
export type TraderResult = ReturnType<typeof queryLeaderboard>['rows'][number];
