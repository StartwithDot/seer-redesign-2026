import type { queryLeaderboard } from './leaderboardQuery';
import type { ScoreBreakdown } from './capturedLeaderboard';
import { loadCapturedLeaderboard } from './capturedLeaderboard';
export type { Period, AppFilter, LeaderSort, LeaderQuery } from './leaderboardQuery';
import type { LeaderQuery } from './leaderboardQuery';
export type TraderResult = ReturnType<typeof queryLeaderboard>['rows'][number] & { tier?: string; breakdown?: ScoreBreakdown };
export type LeaderResponse = Omit<ReturnType<typeof queryLeaderboard>, 'rows' | 'all'> & { rows: TraderResult[]; all: TraderResult[]; source?: 'captured' | 'sample' };
export function scoreTier(score: number | null) { return score === null ? 'N/A' : score >= 80 ? 'ELITE' : score >= 60 ? 'GREAT' : 'GOOD'; }

// Load the declared local sample over HTTP. Network and parse failures are
// recoverable by refetching; no invented success or artificial delay is used.
export async function loadLeaderboard(query: LeaderQuery, signal: AbortSignal, source: 'sample' | 'captured' = 'sample'): Promise<LeaderResponse> {
  if (source === 'captured') return loadCapturedLeaderboard(query, signal);
  signal.throwIfAborted();
  const response = await fetch(new URL('./leaderboard.fixture.json', import.meta.url), { signal, cache: 'no-store' });
  if (!response.ok) throw new Error(`Sample ledger request failed (${response.status}). Retry to load it again.`);
  const payload: unknown = await response.json();
  if (!payload || typeof payload !== 'object' || !('rows' in payload) || !Array.isArray(payload.rows)) throw new Error('The sample ledger has an unsupported format.');
  const rows = payload.rows;
  if (!rows.length || rows.some((row) => !row || typeof row.label !== 'string' || !/^0x[\da-f]{40}$/i.test(row.address) || !Number.isFinite(row.profit) || !Number.isFinite(row.volume) || row.volume < 0)) throw new Error('The sample ledger contains invalid account data.');
  const module = await import('./leaderboardQuery');
  signal.throwIfAborted();
  const result = module.queryLeaderboard(query, rows);
  if (result.rows.some((row) => !/^0x[\da-f]{40}$/i.test(row.address) || !Number.isFinite(row.profit))) {
    throw new Error('The sample settlement ledger could not be read. Retry to load it again.');
  }
  return result;
}
