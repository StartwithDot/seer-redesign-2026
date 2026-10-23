import { useMemo, useState } from 'react';
import { valueAtOrBefore } from '../data/field-analysis';
import type { PricePoint, Repository } from '../data/types';

export type TimeFigureSeriesItem = {
  repository: Repository;
  points: PricePoint[];
};

export function directLabels(items: TimeFigureSeriesItem[], selected: Repository, cursor: number) {
  const candidates = [items[0], items.at(-1), items.find((item) => item.repository.marketId === selected.marketId)]
    .filter((item): item is TimeFigureSeriesItem => Boolean(item));
  const unique = [...new Map(candidates.map((item) => [item.repository.marketId, item])).values()];
  return unique
    .map((item) => ({ item, value: valueAtOrBefore(item.points, cursor) ?? item.points.at(-1)?.price ?? 0 }))
    .sort((left, right) => right.value - left.value)
    .map((label, index) => ({ ...label, y: 52 + index * 28 }));
}

export function TimeFigureSeriesList({
  items,
  hidden,
  visibleIds,
  selected,
  isolated,
  expanded = false,
  onSelect,
  onIsolate,
  onToggle,
}: {
  items: TimeFigureSeriesItem[];
  hidden: Set<string>;
  visibleIds?: Set<string>;
  selected: Repository;
  isolated: Repository;
  expanded?: boolean;
  onSelect: (repository: Repository) => void;
  onIsolate: (repository: Repository) => void;
  onToggle: (marketId: string, checked: boolean) => void;
}) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return items.filter(({ repository }) => `${repository.owner}/${repository.name}`.toLowerCase().includes(normalized));
  }, [items, query]);

  return (
    <div className={`deep-time-series-list ${expanded ? 'is-expanded' : ''}`}>
      {expanded && (
        <div className="deep-time-series-list__filter">
          <label>
            <span>Filter repositories</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Owner or repository" />
          </label>
          <button type="button" onClick={() => setQuery('')} disabled={!query} title={query ? 'Clear repository filter' : 'Repository filter is empty'}>Clear</button>
        </div>
      )}
      <ol aria-label="Ranked repository values">
        {filtered.map(({ repository, points }, index) => {
          const value = points.at(-1)?.price ?? 0;
          const visible = visibleIds ? visibleIds.has(repository.marketId) : !hidden.has(repository.marketId);
          const isSelected = selected.marketId === repository.marketId;
          return (
            <li key={repository.marketId} className={isSelected ? 'is-selected' : ''}>
              <input
                type="checkbox"
                checked={visible}
                onChange={event => onToggle(repository.marketId, event.target.checked)}
                aria-label={`${visible ? 'Hide' : 'Show'} ${repository.owner}/${repository.name}`}
              />
              <button
                type="button"
                title={`${repository.owner}/${repository.name}`}
                aria-current={isSelected ? 'true' : undefined}
                onPointerEnter={() => onIsolate(repository)}
                onPointerLeave={() => onIsolate(selected)}
                onBlur={() => onIsolate(selected)}
                onFocus={() => onIsolate(repository)}
                onClick={() => onSelect(repository)}
              >
                <span>{index + 1}</span>
                <strong>{repository.owner}/{repository.name}</strong>
                <b>{value.toFixed(4)}</b>
              </button>
            </li>
          );
        })}
      </ol>
      {!filtered.length && <p className="deep-empty">No repositories match “{query}”.</p>}
      <span className="deep-visually-hidden" aria-live="polite">
        {isolated.owner}/{isolated.name} isolated
      </span>
    </div>
  );
}
