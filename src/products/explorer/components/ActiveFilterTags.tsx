import { chains } from '../data/chains';
import { useState } from 'react';
import {
  marketSortLabels,
  marketStateLabels,
  marketTypeLabels,
  verificationLabels,
  type MarketFilterState,
} from '../lib/marketFilters';

interface ActiveFilterTagsProps {
  search: string;
  topic: string;
  filters: MarketFilterState;
  onSearchClear: () => void;
  onTopicClear: () => void;
  onFiltersChange: (filters: MarketFilterState) => void;
  onClear: () => void;
}

interface FilterTag {
  id: string;
  label: string;
  onRemove: () => void;
}

export function ActiveFilterTags({
  search,
  topic,
  filters,
  onSearchClear,
  onTopicClear,
  onFiltersChange,
  onClear,
}: ActiveFilterTagsProps) {
  const [expanded, setExpanded] = useState(false);
  const tags: FilterTag[] = [];
  if (search) tags.push({ id: 'search', label: `Search: ${search}`, onRemove: onSearchClear });
  if (topic) tags.push({ id: 'topic', label: `Topic: ${topic.replaceAll('-', ' ')}`, onRemove: onTopicClear });
  filters.types.forEach((type) => tags.push({
    id: `type-${type}`,
    label: marketTypeLabels[type],
    onRemove: () => onFiltersChange({ ...filters, types: filters.types.filter((item) => item !== type) }),
  }));
  filters.states.forEach((state) => tags.push({
    id: `state-${state}`,
    label: marketStateLabels[state],
    onRemove: () => onFiltersChange({ ...filters, states: filters.states.filter((item) => item !== state) }),
  }));
  filters.verification.forEach((status) => tags.push({
    id: `verification-${status}`,
    label: verificationLabels[status],
    onRemove: () => onFiltersChange({
      ...filters,
      verification: filters.verification.filter((item) => item !== status),
    }),
  }));
  filters.chains.forEach((chainId) => tags.push({
    id: `chain-${chainId}`,
    label: chains.find((chain) => chain.id === chainId)?.name ?? String(chainId),
    onRemove: () => onFiltersChange({ ...filters, chains: filters.chains.filter((item) => item !== chainId) }),
  }));
  if (filters.sort !== 'default') tags.push({
    id: 'sort',
    label: `Sort: ${marketSortLabels[filters.sort]}`,
    onRemove: () => onFiltersChange({ ...filters, sort: 'default' }),
  });
  if (filters.direction !== 'desc') tags.push({
    id: 'direction',
    label: 'Ascending',
    onRemove: () => onFiltersChange({ ...filters, direction: 'desc' }),
  });
  if (filters.conditionalOnly) tags.push({
    id: 'conditional',
    label: 'Conditional markets',
    onRemove: () => onFiltersChange({ ...filters, conditionalOnly: false }),
  });
  if (filters.rewardsOnly) tags.push({
    id: 'rewards',
    label: 'Rewards',
    onRemove: () => onFiltersChange({ ...filters, rewardsOnly: false }),
  });
  if (filters.futarchyOnly) tags.push({
    id: 'futarchy',
    label: 'Futarchy only',
    onRemove: () => onFiltersChange({ ...filters, futarchyOnly: false }),
  });
  if (filters.minLiquidity > 0) tags.push({
    id: 'liquidity',
    label: `Liquidity ≥ $${filters.minLiquidity.toLocaleString()}`,
    onRemove: () => onFiltersChange({ ...filters, minLiquidity: 0 }),
  });

  if (!tags.length) return null;
  const visibleTags = expanded ? tags : tags.slice(0, 3);
  const overflow = tags.length - visibleTags.length;

  return (
    <div className="active-filter-row" aria-label="Active market filters">
      <div className="active-filter-tags">
        {visibleTags.map((tag) => (
          <button key={tag.id} type="button" onClick={tag.onRemove}>
            <span>{tag.label}</span>
            <span aria-hidden="true">×</span>
            <span className="sr-only">Remove filter</span>
          </button>
        ))}
        {overflow > 0 && <button type="button" className="filter-overflow" aria-expanded={expanded} onClick={() => setExpanded(true)}>+{overflow} more</button>}
        {expanded && tags.length > 3 && <button type="button" className="filter-overflow" aria-expanded="true" onClick={() => setExpanded(false)}>Show fewer filters</button>}
      </div>
      <button className="clear-filters" type="button" onClick={onClear}>Clear filters</button>
    </div>
  );
}
