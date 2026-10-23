import type { SubmissionDossier } from './types';

export type ReviewCutStrategy = 'rank' | 'odds' | 'tier' | 'sponsor';

export interface ShortlistEntry {
  submissionId: string;
  pinned: boolean;
  order: number;
}

export type SponsorDecisionAction = 'select' | 'reject' | 'defer' | 'withdraw';
export type SponsorDecisionStatus = 'optimistic' | 'pending' | 'confirmed' | 'failed' | 'already-decided';

export interface SponsorDecisionRecord {
  id: string;
  submissionId: string;
  action: SponsorDecisionAction;
  status: SponsorDecisionStatus;
  rationale: string;
  signature: string | null;
  createdAt: string;
  signedAt: string | null;
  error: string | null;
}

export interface ReviewWorkspaceState {
  cutSize: number;
  cutStrategy: ReviewCutStrategy;
  shortlist: ShortlistEntry[];
  rationale: string;
  decisions: Record<string, SponsorDecisionRecord>;
  listPage: number;
  listPageSize: 25 | 50 | 100;
}

export const defaultReviewWorkspace: ReviewWorkspaceState = {
  cutSize: 27,
  cutStrategy: 'rank',
  shortlist: [],
  rationale: '',
  decisions: {},
  listPage: 1,
  listPageSize: 25,
};

function stableNumber(value: string, maximum: number) {
  let hash = 0;
  for (const character of value) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return hash % maximum;
}

function strategyValue(dossier: SubmissionDossier, strategy: ReviewCutStrategy, shortlist: ShortlistEntry[]) {
  const { submission } = dossier;
  if (strategy === 'odds') return submission.oddsPercent ?? -1;
  if (strategy === 'tier') {
    return submission.tier === 'above-floor' ? 3 : submission.tier === 'tied-floor' ? 2 : 1;
  }
  if (strategy === 'sponsor') {
    const entry = shortlist.find((item) => item.submissionId === submission.id);
    return entry ? (entry.pinned ? 100000 : 50000) - entry.order : -submission.rank;
  }
  return -submission.rank;
}

export function rankForCut(
  dossiers: SubmissionDossier[],
  strategy: ReviewCutStrategy,
  shortlist: ShortlistEntry[],
) {
  return [...dossiers].sort((left, right) => {
    const delta = strategyValue(right, strategy, shortlist) - strategyValue(left, strategy, shortlist);
    return delta || left.submission.rank - right.submission.rank;
  });
}

export function includedForCut(
  dossiers: SubmissionDossier[],
  cutSize: number,
  strategy: ReviewCutStrategy,
  shortlist: ShortlistEntry[],
) {
  return rankForCut(dossiers, strategy, shortlist).slice(0, Math.max(0, cutSize));
}

export function oddsTotal(dossiers: SubmissionDossier[]) {
  return dossiers.reduce((total, dossier) => total + (dossier.submission.oddsPercent ?? 0), 0);
}

export function oddsFor(dossiers: SubmissionDossier[]) {
  return dossiers.reduce((total, dossier) => total + (dossier.submission.oddsPercent ?? 0), 0);
}

export function coverageAtRank(dossiers: SubmissionDossier[], count: number) {
  const ranked = [...dossiers].sort((left, right) => left.submission.rank - right.submission.rank);
  return oddsFor(ranked.slice(0, count));
}

export function buildCutSummary(
  dossiers: SubmissionDossier[],
  included: SubmissionDossier[],
  strategy: ReviewCutStrategy,
) {
  const includedOdds = oddsFor(included);
  const totalOdds = oddsTotal(dossiers);
  const coverage = includedOdds;
  const top3Coverage = coverageAtRank(dossiers, 3);
  return {
    includedCount: included.length,
    excludedCount: Math.max(0, dossiers.length - included.length),
    includedOdds,
    totalOdds,
    coveragePercent: coverage,
    coverageGainVsTop3Percent: coverage - top3Coverage,
    strategy,
  };
}

export function buildCoverageCheckpoints(dossiers: SubmissionDossier[]) {
  return [3, 8, 27].map((count) => ({
    count,
    oddsPercent: coverageAtRank(dossiers, count),
  }));
}

export function upsertShortlist(
  shortlist: ShortlistEntry[],
  submissionId: string,
  pinned = false,
): ShortlistEntry[] {
  const existing = shortlist.find((entry) => entry.submissionId === submissionId);
  if (existing) {
    return shortlist.map((entry) =>
      entry.submissionId === submissionId ? { ...entry, pinned: pinned || entry.pinned } : entry,
    );
  }
  return [...shortlist, { submissionId, pinned, order: shortlist.length }];
}

export function removeShortlist(shortlist: ShortlistEntry[], submissionId: string) {
  return shortlist
    .filter((entry) => entry.submissionId !== submissionId)
    .map((entry, index) => ({ ...entry, order: index }));
}

export function moveShortlist(shortlist: ShortlistEntry[], submissionId: string, direction: -1 | 1) {
  const ordered = orderedShortlist(shortlist);
  const index = ordered.findIndex((entry) => entry.submissionId === submissionId);
  const nextIndex = index + direction;
  if (index < 0 || nextIndex < 0 || nextIndex >= ordered.length) return shortlist;
  if (ordered[index].pinned !== ordered[nextIndex].pinned) return shortlist;
  [ordered[index], ordered[nextIndex]] = [ordered[nextIndex], ordered[index]];
  return ordered.map((entry, order) => ({ ...entry, order }));
}

export function orderedShortlist(shortlist: ShortlistEntry[]) {
  return [...shortlist].sort((left, right) => Number(right.pinned) - Number(left.pinned) || left.order - right.order);
}

export function togglePinned(shortlist: ShortlistEntry[], submissionId: string) {
  return shortlist.map((entry) =>
    entry.submissionId === submissionId ? { ...entry, pinned: !entry.pinned } : entry,
  );
}

export function makeDecisionId(submissionId: string) {
  return `decision-${submissionId}-${stableNumber(`${submissionId}-${Date.now()}`, 1_000_000)}`;
}
