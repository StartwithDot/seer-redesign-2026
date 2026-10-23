import dayMeta from './leaderboard-metadata-1d.json';
import weekMeta from './leaderboard-metadata-1w.json';
import monthMeta from './leaderboard-metadata-1m.json';
import allMeta from './leaderboard-metadata-all.json';
import day from './leaderboard-1d.json';
import week from './leaderboard-1w.json';
import month from './leaderboard-1m.json';
import { leaderboardMetadata, leaderboardWallets } from './leaderboard';
import type { LeaderboardMetadata, LeaderboardPeriod, LeaderboardWallet } from './types';

const labels: Record<LeaderboardPeriod, string> = { '1d': '1D', '1w': '1W', '1m': '1M', all: 'All' };
export function isLeaderboardPeriod(value: string): value is LeaderboardPeriod {
  return value === '1d' || value === '1w' || value === '1m' || value === 'all';
}
export function leaderboardPeriodLabel(period: LeaderboardPeriod): string { return labels[period]; }
export function walletsForPeriod(period: LeaderboardPeriod): LeaderboardWallet[] {
  // Each period uses its own recorded API response.
  return { all: leaderboardWallets, '1d': day, '1w': week, '1m': month }[period];
}
export function metadataForPeriod(period: LeaderboardPeriod): LeaderboardMetadata {
  const meta = { all: allMeta, '1d': dayMeta, '1w': weekMeta, '1m': monthMeta }[period];
  return { ...leaderboardMetadata, period, updatedAt: meta.updatedAt, total: meta.total, limit: meta.limit, offset: meta.offset };
}
export function summaryForPeriod(period: LeaderboardPeriod) {
  const wallets = walletsForPeriod(period);
  return {
    walletCount: wallets.length,
    totalVolume: wallets.reduce((total, item) => total + item.volume, 0),
    winners: wallets.filter((item) => item.profitLoss > 0).length,
    losers: wallets.filter((item) => item.profitLoss < 0).length,
    flat: wallets.filter((item) => item.profitLoss === 0).length,
  };
}
