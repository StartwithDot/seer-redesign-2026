import type { ReviewListFilters } from '../data/reviewList';

interface ReviewListControlsProps {
  filters: ReviewListFilters;
  resultCount: number;
  selectedCount: number;
  density: 'table' | 'compact';
  onFiltersChange: (filters: ReviewListFilters) => void;
  onDensityChange: (density: 'table' | 'compact') => void;
  onClearSelection: () => void;
  onAddToShortlist: () => void;
  onCompare: () => void;
}

export function ReviewListControls({
  filters,
  resultCount,
  selectedCount,
  density,
  onFiltersChange,
  onDensityChange,
  onClearSelection,
  onAddToShortlist,
  onCompare,
}: ReviewListControlsProps) {
  const patch = (next: Partial<ReviewListFilters>) => onFiltersChange({ ...filters, ...next });

  return (
    <div className="review-list-toolbar">
      <div>
        <p className="section-kicker">Exact comparison</p>
        <h2 id="review-list-title">{resultCount} submissions</h2>
      </div>
      <div className="review-list-controls">
        <label className="review-search-control">
          <span>Search submissions</span>
          <input
            type="search"
            value={filters.query}
            placeholder="Name, creator, or ID"
            onChange={(event) => patch({ query: event.target.value })}
          />
        </label>
        <label>
          <span>Tier</span>
          <select value={filters.tier} onChange={(event) => patch({ tier: event.target.value as ReviewListFilters['tier'] })}>
            <option value="all">All tiers</option>
            <option value="above-floor">Above floor</option>
            <option value="tied-floor">Tied at 0.4%</option>
            <option value="unpriced">Unpriced / no pool</option>
          </select>
        </label>
        <label>
          <span>Decision</span>
          <select value={filters.decision} onChange={(event) => patch({ decision: event.target.value as ReviewListFilters['decision'] })}>
            <option value="all">All decisions</option>
            <option value="undecided">Undecided</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="selected">Selected</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </label>
        <label>
          <span>Outcome</span>
          <select value={filters.outcome} onChange={(event) => patch({ outcome: event.target.value as ReviewListFilters['outcome'] })}>
            <option value="all">All outcomes</option>
            <option value="priced">Priced</option>
            <option value="unpriced">Unpriced</option>
            <option value="no-pool">No pool</option>
          </select>
        </label>
        <label>
          <span>Price</span>
          <select value={filters.price} onChange={(event) => patch({ price: event.target.value as ReviewListFilters['price'] })}>
            <option value="all">Any price</option>
            <option value="under-1">Under $1</option>
            <option value="1-3">$1 to $3</option>
            <option value="over-3">Over $3</option>
          </select>
        </label>
        <label>
          <span>Winner</span>
          <select value={filters.winner} onChange={(event) => patch({ winner: event.target.value as ReviewListFilters['winner'] })}>
            <option value="all">All records</option>
            <option value="winner">Winner only</option>
            <option value="not-winner">Not selected</option>
          </select>
        </label>
        <label className="review-check-control">
          <input
            type="checkbox"
            checked={filters.groupByTier}
            onChange={(event) => patch({ groupByTier: event.target.checked })}
          />
          <span>Group by tier</span>
        </label>
        <div className="density-toggle" role="group" aria-label="List presentation">
          <button type="button" aria-pressed={density === 'table'} onClick={() => onDensityChange('table')}>Table</button>
          <button type="button" aria-pressed={density === 'compact'} onClick={() => onDensityChange('compact')}>Compact</button>
        </div>
      </div>
      <div className="review-bulk-bar" aria-label="Bulk actions">
        <strong>{selectedCount} selected</strong>
        <button type="button" className="secondary-action" disabled={!selectedCount} title="Select submissions first." onClick={onAddToShortlist}>Add to shortlist</button>
        <button type="button" className="secondary-action" disabled={!selectedCount} title="Select submissions first." onClick={onCompare}>Compare</button>
        <button type="button" className="text-action" disabled={!selectedCount} title="Select submissions first." onClick={onClearSelection}>Clear selection</button>
      </div>
    </div>
  );
}
