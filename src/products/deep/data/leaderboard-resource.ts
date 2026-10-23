import type { LeaderboardPeriod, LeaderboardWallet } from './types';

export function validateLeaderboardRows(value: unknown): LeaderboardWallet[] {
  if (!Array.isArray(value)) throw new Error('The wallet snapshot is not a list.');
  const addresses = new Set<string>();
  for (const row of value) {
    if (!row || typeof row.address !== 'string' || !/^0x[0-9a-f]{40}$/i.test(row.address)
      || ![row.rank, row.profitLoss, row.volume, row.markets, row.mergedWallets].every(Number.isFinite)
      || (row.roi !== null && !Number.isFinite(row.roi))
      || row.rank < 1 || row.volume < 0 || row.markets < 0 || row.mergedWallets < 1
      || (row.mergedWalletAddresses !== undefined && (!Array.isArray(row.mergedWalletAddresses)
        || row.mergedWalletAddresses.some((address: unknown) => typeof address !== 'string' || !/^0x[0-9a-f]{40}$/i.test(address))))
      || addresses.has(row.address.toLowerCase())) {
      throw new Error('The wallet snapshot contains an invalid or duplicate row.');
    }
    addresses.add(row.address.toLowerCase());
  }
  return value as LeaderboardWallet[];
}

// A separate module request can fail offline or after a deployment. Retry reloads
// that request; there is no invented remote endpoint or artificial loading delay.
export async function loadLeaderboard(period: LeaderboardPeriod): Promise<LeaderboardWallet[]> {
  const urls = { all: new URL('./leaderboard-reference.json?no-inline', import.meta.url), '1d': new URL('./leaderboard-1d.json?no-inline', import.meta.url), '1w': new URL('./leaderboard-1w.json?no-inline', import.meta.url), '1m': new URL('./leaderboard-1m.json?no-inline', import.meta.url) };
  const response = await fetch(urls[period], { cache: 'no-cache' });
  if (!response.ok) throw new Error(`Wallet snapshot request failed (${response.status}).`);
  return validateLeaderboardRows(await response.json());
}
