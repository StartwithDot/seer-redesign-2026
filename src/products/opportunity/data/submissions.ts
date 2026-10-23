import type { DecisionState, MarketRecord, SubmissionRecord } from './types';
import { allMarkets, marketById } from './markets';
import liveOutcomes from './live_outcomes.json';
import rebrandOutcomes from './finalized_outcomes.json';
import merchOutcomes from './devcon_outcomes.json';
import { archiveEvidenceFor } from './archive';
import { galleryFor } from './gallery';

const rankedSampleNames = [
  'Wageware',
  'Workmesh',
  'CW',
  'Foreguild',
  'Synergent',
  'AuspeX',
  'WorkX',
  'Agentarchy',
  'AgenticGigs',
  'Vantage',
  'Seek',
  'Agora',
];

const namePrefixes = [
  'Agent',
  'Brief',
  'Craft',
  'Delegate',
  'Future',
  'Hire',
  'Human',
  'Open',
  'Role',
  'Signal',
  'Talent',
  'Work',
];

const nameSuffixes = [
  'Atlas',
  'Board',
  'Bench',
  'Circle',
  'Commons',
  'Crew',
  'Flow',
  'Foundry',
  'Grid',
  'Guild',
  'Layer',
  'Loop',
  'Mesh',
  'Signal',
  'Works',
];

function stableOffset(value: string, maximum: number) {
  let hash = 0;
  for (const character of value) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return hash % maximum;
}

function sampleName(rank: number) {
  const named = rankedSampleNames[rank - 4];
  if (named) return named;
  const prefix = namePrefixes[(rank * 5) % namePrefixes.length];
  const suffix = nameSuffixes[(rank * 7) % nameSuffixes.length];
  return `${prefix}${suffix} ${rank}`;
}

export const pilotSubmissions: SubmissionRecord[] = liveOutcomes.map(row => ({
  id: row.name === 'SAI' ? 'sai' : row.name === 'delegateyourjob.ai' ? 'delegateyourjob-ai' : row.name === 'Zetsu.AI' ? 'zetsu-ai' : `pilot-${row.rank}`,
  marketId: 'seer-ai-job-board-name', rank: row.rank, name: row.name,
  creator: 'Creator not recorded', createdAt: null,
  oddsPercent: row.odds, priceUsd: row.odds === null ? null : row.odds / 100,
  delta24h: null, rankMovement: null,
  tier: row.odds === null ? 'unpriced' : row.odds === 0.4 ? 'tied-floor' : 'above-floor',
  decision: 'undecided', source: 'verified',
}));

export const sampleSubmissions = pilotSubmissions.filter((submission) => submission.source === 'sample').slice(0, 12);

export const visibleSubmissions = allMarkets.flatMap(market => submissionsForMarket(market.id));

function decisionFor(market: MarketRecord, index: number, count: number): DecisionState {
  if (market.decidedCount === 0) return index === 0 ? 'shortlisted' : 'undecided';
  if (market.decidedCount < market.submissionCount) {
    if (index === 0) return 'selected';
    if (index < 3) return 'shortlisted';
    if (index === count - 1) return 'withdrawn';
    return index % 4 === 0 ? 'rejected' : 'undecided';
  }
  if (index === 0) return 'selected';
  return index === count - 1 ? 'withdrawn' : 'rejected';
}

function buildGeneratedSubmission(market: MarketRecord, rank: number, count: number): SubmissionRecord {
  const pricedCount = Math.max(1, Math.floor(count * 0.42));
  const tiedCount = Math.max(1, Math.floor(count * 0.2));
  const oddsPercent =
    rank <= pricedCount
      ? Number(Math.max(0.5, 6.2 - ((rank - 1) * 5.4) / Math.max(1, pricedCount - 1)).toFixed(1))
      : rank <= pricedCount + tiedCount
        ? 0.4
        : null;
  return {
    id: `${market.id}-submission-${rank}`,
    marketId: market.id,
    rank,
    name: sampleName(rank),
    creator: `Deterministic sample creator ${String.fromCharCode(65 + (rank % 12))}`,
    createdAt: market.createdAt
      ? new Date(new Date(market.createdAt).getTime() + rank * 3_600_000).toISOString()
      : `2026-09-${String(1 + (rank % 28)).padStart(2, '0')}T09:00:00Z`,
    oddsPercent,
    priceUsd: oddsPercent === null ? null : oddsPercent / 100,
    delta24h: Number((((rank % 9) - 4) * 0.1).toFixed(1)),
    tier: rank <= pricedCount ? 'above-floor' : rank <= pricedCount + tiedCount ? 'tied-floor' : 'unpriced',
    decision: decisionFor(market, rank - 1, count),
    source: 'sample',
    rankMovement: stableOffset(`${market.id}-${rank}`, 5) - 2,
  };
}

export function submissionsForMarket(marketId: string): SubmissionRecord[] {
  const market = marketById.get(marketId);
  if (!market) return [];
  if (market.id === 'seer-ai-job-board-name') return pilotSubmissions;
  if (market.source === 'verified') {
    const rows = market.id === 'seer-rebrand-contest' ? rebrandOutcomes : merchOutcomes;
    const evidence = archiveEvidenceFor(market.id);
    const gallery = galleryFor(market.id);
    return rows.map((row, index) => ({
      id: `${market.id}-outcome-${index}`, marketId, rank: row.rank,
      name: row.name, creator: gallery.find(item => item.title.trim() === row.name.trim())?.creator ?? 'Creator not recorded',
      createdAt: null, oddsPercent: row.odds, priceUsd: row.odds / 100,
      delta24h: null, rankMovement: null, tier: 'above-floor',
      decision: row.name === 'Invalid' ? 'withdrawn' : BigInt(evidence?.payoutNumerators[index] ?? '0') > 0n ? 'selected' : 'rejected',
      source: 'verified',
    }));
  }
  return Array.from({ length: market.submissionCount }, (_, index) =>
    buildGeneratedSubmission(market, index + 1, market.submissionCount),
  );
}
