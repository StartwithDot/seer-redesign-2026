import type { DiscoveryFilters, Market, MarketStatus, Organization } from '../data/types';
import { statusLabel } from '../data/discovery';
import { MarketAvatar } from './MarketAvatar';
import { DataList } from './DataList';

interface DiscoveryFiltersProps {
  filters: DiscoveryFilters;
  markets: Market[];
  organizations: Organization[];
  activeCount: number;
  closedCount: number;
  onChange: (filters: DiscoveryFilters, replace?: boolean) => void;
}

type FilterKey = 'organizationIds' | 'tokens';

export function DiscoveryFilterBar({
  filters,
  markets,
  organizations,
  activeCount,
  closedCount,
  onChange,
}: DiscoveryFiltersProps) {
  const update = (patch: Partial<DiscoveryFilters>, replace = false) => onChange({ ...filters, ...patch }, replace);
  const toggleArray = (key: FilterKey, value: string) => {
    const current = filters[key] as string[];
    update({ [key]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value] } as Partial<DiscoveryFilters>);
  };

  const chips = [
    ...(filters.query.trim() ? [{ id: 'query', label: `Search: ${filters.query.trim()}`, clear: () => update({ query: '' }) }] : []),
    ...filters.organizationIds.map((id) => ({
      id: `org-${id}`,
      label: organizations.find((organization) => organization.id === id)?.shortName ?? id,
      clear: () => update({ organizationIds: filters.organizationIds.filter((item) => item !== id) }),
    })),
    ...filters.tokens.map((token) => ({
      id: `token-${token}`,
      label: token,
      clear: () => update({ tokens: filters.tokens.filter((item) => item !== token) }),
    })),
    ...(filters.status !== 'all' ? [{
      id: 'status',
      label: statusLabel[filters.status],
      clear: () => update({ status: 'all' as MarketStatus | 'all' }),
    }] : []),
  ];

  return (
    <section className="discovery-filters" aria-labelledby="discovery-title">
      <header className="filter-heading">
        <div><span className="eyebrow">DISCOVER MILESTONES</span><h2 id="discovery-title">Find the decision to inspect.</h2></div>
        <p><strong>{activeCount}</strong> active <span aria-hidden="true">·</span> <strong>{closedCount}</strong> closed</p>
      </header>
      <div className="filter-controls">
        <label className="filter-search">
          <span className="sr-only">Search milestones</span>
          <input
            type="search"
            value={filters.query}
            placeholder="Search proposal, question, token or organization"
            onChange={(event) => update({ query: event.target.value }, true)}
          />
        </label>
        <details className="filter-menu">
          <summary>Organizations <span>{filters.organizationIds.length || ''}</span></summary>
          <fieldset>
            <legend>Filter by organization</legend>
            <DataList label="Organization filter options" count={organizations.length} emptyTitle="No organizations to filter.">{organizations.map((organization) => {
              const count = markets.filter((market) => market.organizationId === organization.id).length;
              return (
                <label key={organization.id}>
                  <input
                    type="checkbox"
                    checked={filters.organizationIds.includes(organization.id)}
                    onChange={() => toggleArray('organizationIds', organization.id)}
                  />
                  <span className="filter-avatar">{organization.shortName.slice(0, 2)}</span>
                  <span>{organization.shortName}</span>
                  <small>{count}</small>
                </label>
              );
            })}</DataList>
          </fieldset>
        </details>
        <details className="filter-menu">
          <summary>Tokens <span>{filters.tokens.length || ''}</span></summary>
          <fieldset>
            <legend>Filter by token</legend>
            {(['ETH', 'GNO', 'PNK', 'AAVE'] as const).map((token) => {
              const sample = markets.find((market) => market.token === token);
              const count = markets.filter((market) => market.token === token).length;
              return (
                <label key={token}>
                  <input
                    type="checkbox"
                    checked={filters.tokens.includes(token)}
                    onChange={() => toggleArray('tokens', token)}
                  />
                  {sample ? <MarketAvatar market={sample} /> : <span className="filter-avatar">{token.slice(0, 2)}</span>}
                  <span>{token}</span>
                  <small>{count}</small>
                </label>
              );
            })}
          </fieldset>
        </details>
        <div className="status-segments" role="group" aria-label="Filter by market status">
          {(['all', 'active', 'awaiting', 'resolved'] as const).map((status) => (
            <button
              key={status}
              type="button"
              aria-pressed={filters.status === status}
              onClick={() => update({ status })}
            >
              {statusLabel[status]}
            </button>
          ))}
        </div>
        <label className="sort-select">
          <span>Sort</span>
          <select value={filters.sort} onChange={(event) => update({ sort: event.target.value as DiscoveryFilters['sort'] })}>
            <option value="closing">Closing soon</option>
            <option value="volume">Volume</option>
            <option value="impact">Impact</option>
          </select>
        </label>
      </div>
      <div className="filter-summary">
        <div className="filter-chips" aria-label="Selected filters">
          {chips.slice(0, 3).map((chip) => (
            <button key={chip.id} type="button" onClick={chip.clear}>
              {chip.label} <span aria-hidden="true">×</span><span className="sr-only">Remove filter</span>
            </button>
          ))}
          {chips.length > 3 && <span>+{chips.length - 3} more</span>}
        </div>
        {chips.length > 0 && <button className="text-link" type="button" onClick={() => onChange({
          query: '',
          organizationIds: [],
          tokens: [],
          status: 'all',
          sort: filters.sort,
        })}>Clear filters</button>}
      </div>
    </section>
  );
}
