import type { SubmissionDossier } from './types';

export type ReviewSortKey =
  | 'rank'
  | 'name'
  | 'creator'
  | 'odds'
  | 'price'
  | 'delta'
  | 'tier'
  | 'position'
  | 'decision'
  | 'winner';

export interface ReviewSortState {
  key: ReviewSortKey;
  direction: 'asc' | 'desc';
}

export interface ReviewListFilters {
  query: string;
  tier: 'all' | 'above-floor' | 'tied-floor' | 'unpriced';
  decision: 'all' | 'undecided' | 'shortlisted' | 'selected' | 'rejected' | 'withdrawn';
  outcome: 'all' | 'priced' | 'unpriced' | 'no-pool';
  price: 'all' | 'under-1' | '1-3' | 'over-3';
  winner: 'all' | 'winner' | 'not-winner';
  groupByTier: boolean;
}

export const defaultReviewListFilters: ReviewListFilters = {
  query: '',
  tier: 'all',
  decision: 'all',
  outcome: 'all',
  price: 'all',
  winner: 'all',
  groupByTier: false,
};

function matchesPrice(dossier: SubmissionDossier, band: ReviewListFilters['price']) {
  const price = dossier.submission.priceUsd;
  if (band === 'all') return true;
  if (price === null) return false;
  if (band === 'under-1') return price < 1;
  if (band === '1-3') return price >= 1 && price <= 3;
  return price > 3;
}

export function filterDossiers(dossiers: SubmissionDossier[], filters: ReviewListFilters) {
  const query = filters.query.trim().toLowerCase();
  return dossiers.filter((dossier) => {
    const { submission } = dossier;
    const text = `${submission.name} ${submission.creator} ${submission.id}`.toLowerCase();
    const outcome =
      submission.oddsPercent === null
        ? submission.priceUsd === null ? 'no-pool' : 'unpriced'
        : 'priced';
    return (
      (!query || text.includes(query)) &&
      (filters.tier === 'all' || submission.tier === filters.tier) &&
      (filters.decision === 'all' || submission.decision === filters.decision) &&
      (filters.outcome === 'all' || filters.outcome === outcome) &&
      matchesPrice(dossier, filters.price) &&
      (filters.winner === 'all' || (filters.winner === 'winner' ? dossier.winner : !dossier.winner))
    );
  });
}

function sortableValue(dossier: SubmissionDossier, key: ReviewSortKey) {
  const { submission, position } = dossier;
  switch (key) {
    case 'rank': return submission.rank;
    case 'name': return submission.name.toLowerCase();
    case 'creator': return submission.creator.toLowerCase();
    case 'odds': return submission.oddsPercent;
    case 'price': return submission.priceUsd;
    case 'delta': return submission.delta24h;
    case 'tier': return submission.tier;
    case 'position': return position?.outcomeCount ?? null;
    case 'decision': return submission.decision;
    case 'winner': return dossier.winner ? 1 : 0;
  }
}

export function sortDossiers(dossiers: SubmissionDossier[], sort: ReviewSortState) {
  return [...dossiers].sort((left, right) => {
    const leftValue = sortableValue(left, sort.key);
    const rightValue = sortableValue(right, sort.key);
    if (leftValue === null && rightValue === null) return left.submission.rank - right.submission.rank;
    if (leftValue === null) return 1;
    if (rightValue === null) return -1;
    const comparison =
      typeof leftValue === 'string' && typeof rightValue === 'string'
        ? leftValue.localeCompare(rightValue)
        : Number(leftValue) - Number(rightValue);
    return sort.direction === 'asc' ? comparison : -comparison;
  });
}

export function tierLabel(tier: SubmissionDossier['submission']['tier']) {
  return tier === 'above-floor' ? 'Above floor' : tier === 'tied-floor' ? 'Tied at 0.4%' : 'Unpriced / no pool';
}

export function groupDossiersByTier(dossiers: SubmissionDossier[]) {
  const order = { 'above-floor': 0, 'tied-floor': 1, unpriced: 2 } as const;
  return [...dossiers].sort((left, right) => order[left.submission.tier] - order[right.submission.tier]);
}
