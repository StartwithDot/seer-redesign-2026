import type { DecisionState, MarketKind, MarketRecord, MarketStatus, SearchRecord } from './types';

export interface NumericRange {
  min: number | null;
  max: number | null;
}

export interface ExplorerFilters {
  query: string;
  kind: 'all' | MarketKind;
  status: 'all' | MarketStatus;
  decision: 'all' | DecisionState;
  outcomes: 'all' | 'zero' | 'one' | 'many';
  outcomeRange?: NumericRange;
  winnerCount?: 'all' | 'one' | 'five';
  createdAtFrom: string;
  createdAtTo: string;
  volume: NumericRange;
  liquidity: NumericRange;
  odds: NumericRange;
  submissions: NumericRange;
}

export type ExplorerSort =
  | 'relevance'
  | 'featured'
  | 'outcomes'
  | 'newest'
  | 'volume'
  | 'liquidity'
  | 'coverage'
  | 'concentration'
  | 'readiness';

export type ExplorerDensity = 'table' | 'compact' | 'field';

export interface ExplorerPreset {
  id: string;
  name: string;
  filters: ExplorerFilters;
  sort: ExplorerSort;
  density: ExplorerDensity;
}

export const emptyRange: NumericRange = { min: null, max: null };

export const emptyFilters: ExplorerFilters = {
  query: '',
  kind: 'all',
  status: 'all',
  decision: 'all',
  outcomes: 'all',
  outcomeRange: { ...emptyRange },
  createdAtFrom: '',
  createdAtTo: '',
  volume: { ...emptyRange },
  liquidity: { ...emptyRange },
  odds: { ...emptyRange },
  submissions: { ...emptyRange },
};

export function cloneFilters(filters: ExplorerFilters): ExplorerFilters {
  return {
    ...filters,
    outcomeRange: { ...(filters.outcomeRange ?? emptyRange) },
    volume: { ...filters.volume },
    liquidity: { ...filters.liquidity },
    odds: { ...filters.odds },
    submissions: { ...filters.submissions },
  };
}

function rangeMatches(value: number, range: NumericRange) {
  return (range.min === null || value >= range.min) && (range.max === null || value <= range.max);
}

export function filterMarkets(markets: MarketRecord[], filters: ExplorerFilters) {
  const query = filters.query.trim().toLowerCase();
  return markets.filter((market) => {
    const searchValue = [
      market.id,
      market.title,
      market.description,
      market.sponsor,
      market.creator,
      market.contract ?? '',
      market.network,
    ]
      .join(' ')
      .toLowerCase();
    const outcomeMatch =
      filters.outcomes === 'all' ||
      (filters.outcomes === 'zero' && market.submissionCount === 0) ||
      (filters.outcomes === 'one' && market.submissionCount === 1) ||
      (filters.outcomes === 'many' && market.submissionCount > 1);
    const date = market.createdAt ? new Date(market.createdAt).getTime() : null;
    const dateMatch =
      (!filters.createdAtFrom || (date !== null && date >= new Date(filters.createdAtFrom).getTime())) &&
      (!filters.createdAtTo || (date !== null && date <= new Date(`${filters.createdAtTo}T23:59:59.999Z`).getTime()));
    return (
      (!query || searchValue.includes(query)) &&
      (filters.kind === 'all' || market.kind === filters.kind) &&
      (filters.status === 'all' || market.status === filters.status) &&
      (filters.decision === 'all' || market.decisions[filters.decision] > 0) &&
      outcomeMatch &&
      (!filters.winnerCount || filters.winnerCount === 'all' || (filters.winnerCount === 'five' ? market.id === 'seer-merch-devcon-mumbai' || market.decisions.selected === 5 : market.id !== 'seer-merch-devcon-mumbai' && market.decisions.selected <= 1)) &&
      rangeMatches(market.submissionCount, filters.outcomeRange ?? emptyRange) &&
      dateMatch &&
      rangeMatches(market.volumeUsd, filters.volume) &&
      rangeMatches(market.liquidityUsd, filters.liquidity) &&
      ((filters.odds.min === null && filters.odds.max === null) || (market.signal !== null && rangeMatches(market.signal.totalOddsPercent, filters.odds))) &&
      rangeMatches(market.submissionCount, filters.submissions)
    );
  });
}

export function filterObjectRecords(records: SearchRecord[], markets: MarketRecord[], filters: ExplorerFilters) {
  const eligible = new Set(filterMarkets(markets, { ...filters, query: '' }).map(market => market.id));
  return records.filter(record => (record.marketIds ?? []).some(id => eligible.has(id)) &&
    (filters.decision === 'all' || record.decision === undefined || record.decision === filters.decision));
}

function readinessScore(market: MarketRecord) {
  const openWeight = market.status === 'active' ? 35 : market.status === 'pending' ? 24 : 8;
  const signalWeight = market.signal?.totalOddsPercent ?? 0;
  const decisionPenalty = market.submissionCount ? (market.decidedCount / market.submissionCount) * 18 : 0;
  return openWeight + signalWeight * 0.45 + market.coverage.top8Percent * 0.2 - decisionPenalty;
}

export function sortMarkets(markets: MarketRecord[], sort: ExplorerSort, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  return [...markets].sort((left, right) => {
    if (sort === 'featured') return Number(left.source === 'sample') - Number(right.source === 'sample');
    if (sort === 'newest') return (right.createdAt ?? '').localeCompare(left.createdAt ?? '');
    if (sort === 'outcomes') return right.submissionCount - left.submissionCount;
    if (sort === 'volume') return right.volumeUsd - left.volumeUsd;
    if (sort === 'liquidity') return right.liquidityUsd - left.liquidityUsd;
    if (sort === 'coverage') return right.coverage.top27Percent - left.coverage.top27Percent;
    if (sort === 'concentration') return right.coverage.top3Percent - left.coverage.top3Percent;
    if (sort === 'readiness') return readinessScore(right) - readinessScore(left);
    const leftMatch = normalizedQuery && `${left.id} ${left.title}`.toLowerCase().includes(normalizedQuery) ? 1 : 0;
    const rightMatch = normalizedQuery && `${right.id} ${right.title}`.toLowerCase().includes(normalizedQuery) ? 1 : 0;
    return rightMatch - leftMatch || readinessScore(right) - readinessScore(left);
  });
}

function readNumber(value: string | null) {
  if (value === null || value.trim() === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function readRange(params: URLSearchParams, key: string): NumericRange {
  return { min: readNumber(params.get(`${key}Min`)), max: readNumber(params.get(`${key}Max`)) };
}

export function filtersFromSearch(params: URLSearchParams): ExplorerFilters {
  const valid = <T extends string>(value: string | null, values: readonly T[], fallback: T) =>
    values.includes(value as T) ? (value as T) : fallback;
  return {
    query: params.get('q') ?? '',
    kind: valid(params.get('kind'), ['all', 'hiring', 'prediction', 'futarchy', 'funding', 'contest', 'proposal'] as const, 'all'),
    status: valid(params.get('status'), ['all', 'active', 'pending', 'paused', 'resolved', 'finalized', 'redeemed'] as const, 'all'),
    decision: valid(params.get('decision'), ['all', 'undecided', 'shortlisted', 'selected', 'rejected', 'withdrawn'] as const, 'all'),
    outcomes: valid(params.get('outcomes'), ['all', 'zero', 'one', 'many'] as const, 'all'),
    outcomeRange: readRange(params, 'outcomeCount'),
    winnerCount: valid(params.get('winners'), ['all', 'one', 'five'] as const, 'all'),
    createdAtFrom: params.get('from') ?? '',
    createdAtTo: params.get('to') ?? '',
    volume: readRange(params, 'volume'),
    liquidity: readRange(params, 'liquidity'),
    odds: readRange(params, 'odds'),
    submissions: readRange(params, 'submissions'),
  };
}

function writeRange(params: URLSearchParams, key: string, range: NumericRange) {
  if (range.min !== null) params.set(`${key}Min`, String(range.min));
  if (range.max !== null) params.set(`${key}Max`, String(range.max));
}

export function applyExplorerStateToSearch(
  params: URLSearchParams,
  filters: ExplorerFilters,
  sort: ExplorerSort,
  density: ExplorerDensity,
  page: number,
) {
  if (filters.query) params.set('q', filters.query);
  if (filters.kind !== 'all') params.set('kind', filters.kind);
  if (filters.status !== 'all') params.set('status', filters.status);
  if (filters.decision !== 'all') params.set('decision', filters.decision);
  if (filters.outcomes !== 'all') params.set('outcomes', filters.outcomes);
  writeRange(params, 'outcomeCount', filters.outcomeRange ?? emptyRange);
  if (filters.winnerCount && filters.winnerCount !== 'all') params.set('winners', filters.winnerCount);
  if (filters.createdAtFrom) params.set('from', filters.createdAtFrom);
  if (filters.createdAtTo) params.set('to', filters.createdAtTo);
  writeRange(params, 'volume', filters.volume);
  writeRange(params, 'liquidity', filters.liquidity);
  writeRange(params, 'odds', filters.odds);
  writeRange(params, 'submissions', filters.submissions);
  if (sort !== 'relevance') params.set('sort', sort);
  if (density !== 'table') params.set('view', density);
  if (page > 1) params.set('page', String(page));
}

export interface ActiveFilterChip {
  key: keyof ExplorerFilters;
  label: string;
}

export function activeFilterChips(filters: ExplorerFilters): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];
  if (filters.query) chips.push({ key: 'query', label: `Search: ${filters.query}` });
  if (filters.kind !== 'all') chips.push({ key: 'kind', label: `Type: ${filters.kind}` });
  if (filters.status !== 'all') chips.push({ key: 'status', label: `Status: ${filters.status}` });
  if (filters.decision !== 'all') chips.push({ key: 'decision', label: `Decision: ${filters.decision}` });
  if (filters.outcomes !== 'all') chips.push({ key: 'outcomes', label: `Outcomes: ${filters.outcomes}` });
  if (filters.winnerCount && filters.winnerCount !== 'all') chips.push({ key: 'winnerCount', label: filters.winnerCount === 'five' ? 'Top 5 winners' : '1 winner' });
  if (filters.outcomeRange && (filters.outcomeRange.min !== null || filters.outcomeRange.max !== null)) chips.push({ key: 'outcomeRange', label: 'Outcome count range' });
  if (filters.createdAtFrom || filters.createdAtTo) chips.push({ key: 'createdAtFrom', label: 'Date range' });
  for (const key of ['volume', 'liquidity', 'odds', 'submissions'] as const) {
    if (filters[key].min !== null || filters[key].max !== null) chips.push({ key, label: `${key} range` });
  }
  return chips;
}

const presetStorageKey = 'opportunity-explorer-presets';

export function loadExplorerPresets(): ExplorerPreset[] {
  try {
    return JSON.parse(localStorage.getItem(presetStorageKey) ?? '[]') as ExplorerPreset[];
  } catch {
    return [];
  }
}

export function saveExplorerPreset(preset: ExplorerPreset) {
  const presets = loadExplorerPresets().filter((item) => item.id !== preset.id);
  localStorage.setItem(presetStorageKey, JSON.stringify([...presets, preset].slice(-8)));
}

export function deleteExplorerPreset(id: string) {
  localStorage.setItem(
    presetStorageKey,
    JSON.stringify(loadExplorerPresets().filter((preset) => preset.id !== id)),
  );
}
