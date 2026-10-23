import manifest from './captures/leaderboard-index.json';
import type { LeaderQuery } from './leaderboardQuery';
import type { TraderResult } from './leaderboardService';
import { traderDisplayName } from './leaderboard';

export interface ScoreBreakdown {
  components: { returns: number; profitFactor: number; hitRate: number; lossBurn: number; breadth: number };
  sampleShrink: { scoredMarketCount: number; factor: number; rawScore: number };
  inputs: { roi: number | null; profitFactor: number | null; hitRate: number; lossBurn: number; breadth: number };
}
interface RawRow {
  rank: number; address: string; username?: string; pnl: number; volume: number; roi: number | null;
  marketCount: number; score: number | null; tier: string | null; scoreBreakdown?: ScoreBreakdown;
}
interface RawResponse { rows: RawRow[]; total: number; updatedAt: string; limit: number; offset: number }
const apps = { All: 'all', Foresight: 'foresight', 'Opportunity Markets': 'opportunity', Deepfunding: 'deepfunding' };
const sorts = { profit: 'pnl', score: 'score', volume: 'volume', roi: 'roi', markets: 'marketCount' };

export function leaderboardCapture(query: LeaderQuery) {
  return manifest.find((item) => item.period === query.period.toLowerCase() && item.app === apps[query.app]
    && item.chain === (query.chain ? String(query.chain) : 'all') && item.sort === sorts[query.sort]
    && item.direction === (query.ascending ? 'asc' : 'desc') && item.offset === (query.page - 1) * 25);
}
export function capturedQueryOptions() { return manifest; }

export async function loadCapturedLeaderboard(query: LeaderQuery, signal: AbortSignal) {
  const capture = leaderboardCapture(query);
  if (!capture) throw new Error('This exact filter, order and page has no saved API response. Choose Sample ledger or open live rankings.');
  const response = await fetch(new URL(`./captures/leaderboard/${capture.file}`, import.meta.url), { signal, cache: 'no-store' });
  if (!response.ok) throw new Error(`Captured rankings could not load (${response.status}).`);
  const raw = await response.json() as RawResponse;
  signal.throwIfAborted();
  if (!Array.isArray(raw.rows) || !Number.isFinite(raw.total) || raw.rows.some((row) => !/^0x[\da-f]{40}$/i.test(row.address) || !Number.isFinite(row.pnl) || !Number.isFinite(row.volume))) throw new Error('Captured rankings contain an invalid response.');
  const all: TraderResult[] = raw.rows.map((row) => ({
    rank: row.rank, address: row.address, label: traderDisplayName(row.address, row.username), profit: row.pnl, volume: row.volume,
    roi: row.roi === null ? null : row.roi * 100, markets: row.marketCount, score: row.score,
    tier: row.tier?.toUpperCase() ?? 'N/A', breakdown: row.scoreBreakdown,
    hitRate: (row.scoreBreakdown?.inputs.hitRate ?? 0) * 100, factor: row.scoreBreakdown?.inputs.profitFactor ?? null,
    burn: row.scoreBreakdown?.inputs.lossBurn ?? 0, shrink: row.scoreBreakdown?.sampleShrink.factor ?? 0, accuracy: 0,
  }));
  return { rows: all.filter((row) => `${row.label} ${row.address}`.toLowerCase().includes(query.search.trim().toLowerCase())), all, total: raw.total, pages: Math.max(1, Math.ceil(raw.total / raw.limit)), offset: raw.offset, updatedAt: raw.updatedAt, source: 'captured' as const };
}
