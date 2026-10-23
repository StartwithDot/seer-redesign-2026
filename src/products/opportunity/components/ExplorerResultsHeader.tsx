import type {
  ActiveFilterChip,
  ExplorerDensity,
  ExplorerFilters,
  ExplorerSort,
} from '../data/explorer';

interface ExplorerResultsHeaderProps {
  count: number;
  total: number;
  chips: ActiveFilterChip[];
  sort: ExplorerSort;
  density: ExplorerDensity;
  onRemoveFilter: (key: ActiveFilterChip['key']) => void;
  onSortChange: (sort: ExplorerSort) => void;
  onDensityChange: (density: ExplorerDensity) => void;
}

const sortLabels: Record<ExplorerSort, string> = {
  relevance: 'Relevance',
  featured: 'Featured (source markets first)',
  outcomes: 'Outcome count',
  newest: 'Newest',
  volume: 'Volume',
  liquidity: 'Liquidity',
  coverage: 'Coverage',
  concentration: 'Odds concentration',
  readiness: 'Decision readiness',
};

const densityLabels: Record<ExplorerDensity, string> = {
  table: 'Table',
  compact: 'Compact',
  field: 'Field',
};

export function ExplorerResultsHeader({
  count,
  total,
  chips,
  sort,
  density,
  onRemoveFilter,
  onSortChange,
  onDensityChange,
}: ExplorerResultsHeaderProps) {
  return (
    <section className="explorer-results-header" aria-label="Explorer result controls">
      <div className="results-count" aria-live="polite">
        <strong>{count}</strong>
        <span>of {total} market records</span>
      </div>
      <div className="active-filter-list" aria-label="Active filters">
        {chips.map((chip) => (
          <button key={`${chip.key}-${chip.label}`} type="button" onClick={() => onRemoveFilter(chip.key)}>
            <span>{chip.label}</span>
            <span aria-hidden="true">×</span>
            <span className="sr-only">Remove this filter</span>
          </button>
        ))}
      </div>
      <label className="sort-control">
        <span>Sort</span>
        <select value={sort} onChange={(event) => onSortChange(event.target.value as ExplorerSort)}>
          {Object.entries(sortLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>
      <div className="density-control" aria-label="Result density">
        {(Object.keys(densityLabels) as ExplorerDensity[]).map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={density === value}
            onClick={() => onDensityChange(value)}
          >
            {densityLabels[value]}
          </button>
        ))}
      </div>
    </section>
  );
}
