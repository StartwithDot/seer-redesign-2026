import { marketCollections } from '../data/markets';
import { chains } from '../data/chains';
import { topicKey } from './marketKind';
import type {
  Market,
  MarketState,
  MarketType,
  VerificationStatus,
} from '../types';

export type MarketSort =
  | 'default'
  | 'liquidity'
  | 'volume'
  | 'open-interest'
  | 'opening-date'
  | 'creation-date'
  | 'closing-date'
  | 'status';

export interface MarketFilterState {
  types: MarketType[];
  states: MarketState[];
  verification: VerificationStatus[];
  chains: number[];
  sort: MarketSort;
  direction: 'asc' | 'desc';
  conditionalOnly: boolean;
  rewardsOnly: boolean;
  futarchyOnly: boolean;
  minLiquidity: number;
}

export interface MarketUrlState {
  search: string;
  view: string;
  layout: string;
  page: number;
  topic: string;
  filters: MarketFilterState;
}

export const defaultMarketFilters: MarketFilterState = {
  types: [],
  states: [],
  verification: [],
  chains: [],
  sort: 'default',
  direction: 'desc',
  conditionalOnly: false,
  rewardsOnly: false,
  futarchyOnly: false,
  minLiquidity: 0,
};

import { marketTypeLabels, marketStateLabels, verificationLabels } from '../data/semantics';
export { marketTypeLabels, marketStateLabels, verificationLabels } from '../data/semantics';

export const marketSortLabels: Record<MarketSort, string> = {
  default: 'Default',
  liquidity: 'Liquidity',
  volume: 'Volume',
  'open-interest': 'Open Interest',
  'opening-date': 'Opening Date',
  'creation-date': 'Creation Date',
  'closing-date': 'Closing Date',
  status: 'Status',
};

const marketTypes = Object.keys(marketTypeLabels) as MarketType[];
const marketStates = Object.keys(marketStateLabels) as MarketState[];
const verificationStatuses = Object.keys(verificationLabels) as VerificationStatus[];
const marketSorts = Object.keys(marketSortLabels) as MarketSort[];

function readList<T extends string>(value: string | null, allowed: T[]): T[] {
  if (!value) return [];
  return [...new Set(value.split(','))].filter((item): item is T => allowed.includes(item as T));
}

function readNumber(value: string | null) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export function parseMarketFilters(query: URLSearchParams): MarketFilterState {
  const sortValue = query.get('sort');
  const direction = query.get('direction');
  return {
    types: readList(query.get('types'), marketTypes),
    states: readList(query.get('states'), marketStates),
    verification: readList(query.get('verification'), verificationStatuses),
    chains: (query.get('chains') ?? '')
      .split(',')
      .map(Number)
      .filter((id) => chains.some((chain) => chain.id === id)),
    sort: marketSorts.includes(sortValue as MarketSort) ? (sortValue as MarketSort) : 'default',
    direction: direction === 'asc' ? 'asc' : 'desc',
    conditionalOnly: query.get('conditional') === '1',
    rewardsOnly: query.get('rewards') === '1',
    futarchyOnly: query.get('futarchy') === '1',
    minLiquidity: readNumber(query.get('minLiquidity')),
  };
}

export function serializeMarketQuery(state: MarketUrlState) {
  const query = new URLSearchParams();
  const search = state.search.trim();
  if (search) query.set('marketName', search);
  if (state.view !== 'all') query.set('view', state.view);
  if (state.layout !== 'cards') query.set('layout', state.layout);
  if (state.page > 1) query.set('page', String(state.page));
  if (state.topic) query.set('topic', state.topic);
  if (state.filters.types.length) query.set('types', state.filters.types.join(','));
  if (state.filters.states.length) query.set('states', state.filters.states.join(','));
  if (state.filters.verification.length) query.set('verification', state.filters.verification.join(','));
  if (state.filters.chains.length) query.set('chains', state.filters.chains.join(','));
  if (state.filters.sort !== 'default') query.set('sort', state.filters.sort);
  if (state.filters.direction !== 'desc') query.set('direction', state.filters.direction);
  if (state.filters.conditionalOnly) query.set('conditional', '1');
  if (state.filters.rewardsOnly) query.set('rewards', '1');
  if (state.filters.futarchyOnly) query.set('futarchy', '1');
  if (state.filters.minLiquidity > 0) query.set('minLiquidity', String(state.filters.minLiquidity));
  return query.toString();
}

export function countActiveMarketFilters(filters: MarketFilterState) {
  return (
    filters.types.length +
    filters.states.length +
    filters.verification.length +
    filters.chains.length +
    Number(filters.sort !== 'default') +
    Number(filters.direction !== 'desc') +
    Number(filters.conditionalOnly) +
    Number(filters.rewardsOnly) +
    Number(filters.futarchyOnly) +
    Number(filters.minLiquidity > 0)
  );
}

export function filterMarketRecords(
  markets: Market[],
  search: string,
  topic: string,
  filters: MarketFilterState,
) {
  const query = search.trim().toLowerCase();
  return markets.filter((market) => {
    const searchText = [
      market.question,
      market.summary,
      market.creator ?? market.creatorAddress,
      market.subject,
      ...market.outcomes.map((outcome) => outcome.name),
      ...marketCollections.filter((collection) => collection.marketIds.includes(market.id)).map((collection) => collection.name),
    ].join(' ').toLowerCase();
    return (
      (!query || searchText.includes(query)) &&
      (!topic || topicKey(market.subject) === topicKey(topic)) &&
      (!filters.types.length || filters.types.includes(market.type) || Boolean(market.settlementKind && filters.types.includes(market.settlementKind))) &&
      (!filters.states.length || filters.states.includes(market.marketState)) &&
      (!filters.verification.length || filters.verification.includes(market.verification)) &&
      (!filters.chains.length || filters.chains.includes(market.chainId)) &&
      (!filters.conditionalOnly || market.type === 'conditional' || Boolean(market.parent)) &&
      (!filters.rewardsOnly || market.hasRewards) &&
      (!filters.futarchyOnly || market.type === 'futarchy') &&
      (filters.minLiquidity === 0 || market.liquidity >= filters.minLiquidity)
    );
  });
}

export function sortMarketRecords(markets: Market[], filters: MarketFilterState) {
  if (filters.sort === 'default') {
    return filters.direction === 'asc' ? [...markets].reverse() : markets;
  }
  const direction = filters.direction === 'asc' ? 1 : -1;
  return [...markets].sort((a, b) => {
    const numericKey = ({ liquidity: 'liquidity', volume: 'volume', 'open-interest': 'openInterest' } as const)[filters.sort as 'liquidity' | 'volume' | 'open-interest'];
    if (numericKey) {
      if (!Number.isFinite(a[numericKey])) return Number.isFinite(b[numericKey]) ? 1 : 0;
      if (!Number.isFinite(b[numericKey])) return -1;
    }
    const values: Record<Exclude<MarketSort, 'default'>, number> = {
      liquidity: a.liquidity - b.liquidity,
      volume: a.volume - b.volume,
      'open-interest': a.openInterest - b.openInterest,
      'opening-date': a.openingDate.localeCompare(b.openingDate),
      'creation-date': a.createdAt.localeCompare(b.createdAt),
      'closing-date': a.endDate.localeCompare(b.endDate),
      status: a.status.localeCompare(b.status),
    };
    return values[filters.sort as Exclude<MarketSort, 'default'>] * direction;
  });
}

export function getMarketFilterCounts(markets: Market[]) {
  return {
    types: Object.fromEntries(marketTypes.map((type) => [
      type,
      markets.filter((market) => market.type === type || market.settlementKind === type).length,
    ])) as Record<MarketType, number>,
    states: Object.fromEntries(marketStates.map((state) => [
      state,
      markets.filter((market) => market.marketState === state).length,
    ])) as Record<MarketState, number>,
    verification: Object.fromEntries(verificationStatuses.map((status) => [
      status,
      markets.filter((market) => market.verification === status).length,
    ])) as Record<VerificationStatus, number>,
    chains: Object.fromEntries(chains.map((chain) => [
      chain.id,
      markets.filter((market) => market.chainId === chain.id).length,
    ])) as Record<number, number>,
  };
}
