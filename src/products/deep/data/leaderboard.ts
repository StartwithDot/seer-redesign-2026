import type { LeaderboardMetadata, LeaderboardWallet } from './types';

import reference from './leaderboard-reference.json';
import metadata from './leaderboard-metadata-all.json';

export const leaderboardWallets: LeaderboardWallet[] = reference;

export const leaderboardSummary = {
  walletCount: leaderboardWallets.length,
  totalVolume: leaderboardWallets.reduce((total, wallet) => total + wallet.volume, 0),
  winners: leaderboardWallets.filter(wallet => wallet.profitLoss > 0).length,
  losers: leaderboardWallets.filter(wallet => wallet.profitLoss < 0).length,
  scope: 'All Deep markets',
};

export const leaderboardMetadata: LeaderboardMetadata = {
  scope: 'All Deep markets',
  period: 'all',
  sortBy: 'profitLoss',
  sortDir: 'desc',
  unit: 'USD',
  updatedAt: metadata.updatedAt,
  total: leaderboardSummary.walletCount,
  limit: metadata.limit,
  offset: 0,
};
