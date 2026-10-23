import { buildPriceHistory, type PriceHistoryRange } from './priceHistory';
import { submissionsForMarket } from './submissions';
import type { MarketRecord } from './types';

export type AnalysisMode = 'odds' | 'coverage' | 'ranks' | 'distribution';
export interface AnalysisLine { id: string; label: string; values: Array<number | null> }
export interface AnalysisData { lines: AnalysisLine[]; labels: string[]; note: string; unit: string }

export function marketAnalysis(market: MarketRecord, mode: AnalysisMode, range: PriceHistoryRange): AnalysisData {
  const submissions = submissionsForMarket(market.id);
  const priced = submissions.filter(s => s.oddsPercent !== null);
  const provenance = submissions.some(s => s.source === 'sample') ? 'Includes explicitly labeled deterministic sample submissions. ' : '';
  if (!submissions.length) return { lines: [], labels: [], unit: '', note: 'Submission-level evidence is unavailable for this archived market.' };
  if (mode === 'distribution') {
    const groups = [submissions.filter(s => s.tier === 'above-floor').length, submissions.filter(s => s.tier === 'tied-floor').length, submissions.filter(s => s.tier === 'unpriced').length];
    return { lines: [{ id: 'population', label: 'Submissions', values: groups }], labels: ['Above floor', 'Tied at floor', 'Unpriced'], unit: 'submissions', note: provenance + 'Population by recorded price tier, not a probability estimate.' };
  }
  if (mode === 'coverage') {
    let total = 0;
    return { lines: [{ id: 'coverage', label: 'Cumulative odds', values: priced.map(s => { total += s.oddsPercent ?? 0; return Number(total.toFixed(2)); }) }], labels: priced.map((_, i) => `Top ${i + 1}`), unit: '%', note: provenance + 'Raw cumulative odds, without normalization. Checkpoints at top 3, 8 and 27.' };
  }
  if (mode === 'ranks') {
    return { lines: priced.slice(0, 8).map(s => ({ id: s.id, label: `${s.name}${s.source === 'sample' ? ' · sample' : ''}`, values: [s.rankMovement === null || s.rankMovement === undefined ? null : Math.max(1, s.rank + s.rankMovement), s.rank] })), labels: ['Previous rank', 'Current rank'], unit: 'rank', note: provenance + 'Current rank is recorded. Missing previous ranks remain unavailable.' };
  }
  const histories = priced.map(s => ({ submission: s, history: buildPriceHistory(s, range) })).filter(s => s.history.points.length);
  // Sample histories have a different cadence: keep separate provenance rather than interpolate verified records.
  const source = market.source === 'verified' ? histories.filter(s => s.submission.source === 'verified') : histories;
  const timestamps = [...new Set(source.flatMap(({ history }) => history.points.map(point => point.timestamp)))].sort();
  return { lines: source.map(({ submission, history }) => {
    const points = new Map(history.points.map(point => [point.timestamp, point.priceUsd * 100]));
    return { id: submission.id, label: submission.name, values: timestamps.map(timestamp => points.get(timestamp) ?? null) };
  }), labels: timestamps.map(timestamp => new Date(timestamp).toLocaleString('en', { month: 'short', day: 'numeric', hour: 'numeric' })), unit: '%', note: market.source === 'verified' ? 'Partial history: only verified priced submissions with source evidence are shown. Longer ranges do not invent missing history.' : 'Deterministic sample probability history. Not live market data.' };
}
