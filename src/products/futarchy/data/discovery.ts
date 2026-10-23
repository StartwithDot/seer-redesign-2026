import type { DiscoveryFilters, Market, MarketStatus, Organization } from './types';

export const defaultDiscoveryFilters: DiscoveryFilters = {
  query: '',
  organizationIds: [],
  tokens: [],
  status: 'all',
  sort: 'closing',
};

export const parseDiscoveryFilters = (hash: string): DiscoveryFilters => {
  const params = new URLSearchParams(hash.split('?')[1] ?? '');
  const tokens = (params.get('tokens') ?? '')
    .split(',')
    .filter((token): token is Market['token'] => ['ETH', 'GNO', 'PNK', 'AAVE'].includes(token));
  const status = params.get('status');
  const sort = params.get('sort');

  return {
    query: params.get('q') ?? '',
    organizationIds: (params.get('orgs') ?? '').split(',').filter(Boolean),
    tokens: [...new Set(tokens)],
    status: status === 'active' || status === 'awaiting' || status === 'resolved' ? status : 'all',
    sort: sort === 'volume' || sort === 'impact' ? sort : 'closing',
  };
};

export const serializeDiscoveryFilters = (filters: DiscoveryFilters) => {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set('q', filters.query.trim());
  if (filters.organizationIds.length) params.set('orgs', filters.organizationIds.join(','));
  if (filters.tokens.length) params.set('tokens', filters.tokens.join(','));
  if (filters.status !== 'all') params.set('status', filters.status);
  if (filters.sort !== 'closing') params.set('sort', filters.sort);
  return params.toString();
};

export const filterMarkets = (
  marketList: Market[],
  organizationList: Organization[],
  filters: DiscoveryFilters,
) => {
  const organizationById = new Map(organizationList.map((organization) => [organization.id, organization]));
  const query = filters.query.trim().toLocaleLowerCase();
  const filtered = marketList.filter((market) => {
    const organization = organizationById.get(market.organizationId);
    const searchable = [
      market.id,
      market.proposal,
      market.question,
      market.condition,
      market.token,
      organization?.name ?? '',
      organization?.shortName ?? '',
    ].join(' ').toLocaleLowerCase();

    return (
      (!query || searchable.includes(query)) &&
      (!filters.organizationIds.length || filters.organizationIds.includes(market.organizationId)) &&
      (!filters.tokens.length || filters.tokens.includes(market.token)) &&
      (filters.status === 'all' || market.status === filters.status)
    );
  });

  return [...filtered].sort((left, right) => {
    if (filters.sort === 'volume') return right.volume - left.volume;
    if (filters.sort === 'impact') return Math.abs(right.impact) - Math.abs(left.impact);
    return new Date(left.closesAt).getTime() - new Date(right.closesAt).getTime();
  });
};

export const discoveryCounts = (markets: Market[], filters: DiscoveryFilters) => ({
  active: markets.filter((market) => market.status !== 'resolved').length,
  closed: markets.filter((market) => market.status === 'resolved').length,
  include: markets.filter((market) => market.verdict === 'include').length,
  exclude: markets.filter((market) => market.verdict === 'exclude').length,
  total: markets.length,
  filtered: filterMarkets(markets, [], filters).length,
});

export const groupCount = <T extends { id: string }>(
  items: T[],
  markets: Market[],
  key: 'organizationId' | 'token',
) => {
  const counts = new Map<string, number>();
  items.forEach((item) => {
    const value = key === 'organizationId' ? item.id : item.id;
    counts.set(value, markets.filter((market) => market[key] === value).length);
  });
  return counts;
};

export const statusLabel: Record<MarketStatus | 'all', string> = {
  all: 'All',
  active: 'Active',
  awaiting: 'Awaiting',
  resolved: 'Resolved',
};
