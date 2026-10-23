import { useMemo, useState } from 'react';
import type { SubmissionDossier } from '../data/types';
import {
  defaultReviewListFilters,
  filterDossiers,
  sortDossiers,
  groupDossiersByTier,
  type ReviewListFilters,
  type ReviewSortKey,
  type ReviewSortState,
} from '../data/reviewList';
import { ReviewListControls } from './ReviewListControls';
import { ReviewListPagination } from './ReviewListPagination';
import { ReviewListRows } from './ReviewListRows';

interface ReviewListProps {
  dossiers: SubmissionDossier[];
  selectedId: string;
  sort: ReviewSortState;
  density: 'table' | 'compact';
  page: number;
  pageSize: 25 | 50 | 100;
  selectedIds: string[];
  expandedId: string | null;
  shortlistIds: string[];
  onSelect: (submissionId: string) => void;
  onSortChange: (sort: ReviewSortState) => void;
  onDensityChange: (density: 'table' | 'compact') => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: 25 | 50 | 100) => void;
  onSelectedIdsChange: (ids: string[]) => void;
  onExpandedChange: (submissionId: string | null) => void;
  onShortlistToggle: (submissionId: string) => void;
  onCompare: (submissionIds: string[]) => void;
  onOpenDossier: (submissionId: string) => void;
  onCopyLink: (submissionId: string) => void;
}

const columns: Array<{ key: ReviewSortKey; label: string }> = [
  { key: 'rank', label: 'Rank' },
  { key: 'name', label: 'Submission' },
  { key: 'creator', label: 'Creator' },
  { key: 'odds', label: 'Odds' },
  { key: 'price', label: 'Price' },
  { key: 'delta', label: '24h delta' },
  { key: 'tier', label: 'Tier' },
  { key: 'position', label: 'Position' },
  { key: 'decision', label: 'Decision' },
  { key: 'winner', label: 'Winner' },
];

export function ReviewList({
  dossiers,
  selectedId,
  sort,
  density,
  page,
  pageSize,
  selectedIds,
  expandedId,
  shortlistIds,
  onSelect,
  onSortChange,
  onDensityChange,
  onPageChange,
  onPageSizeChange,
  onSelectedIdsChange,
  onExpandedChange,
  onShortlistToggle,
  onCompare,
  onOpenDossier,
  onCopyLink,
}: ReviewListProps) {
  const [filters, setFilters] = useState<ReviewListFilters>(defaultReviewListFilters);
  const filtered = useMemo(() => filterDossiers(dossiers, filters), [dossiers, filters]);
  const sorted = useMemo(() => {
    const ordered = sortDossiers(filtered, sort);
    return filters.groupByTier ? groupDossiersByTier(ordered) : ordered;
  }, [filtered, sort, filters.groupByTier]);
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const pageItems = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const updateFilters = (next: ReviewListFilters) => {
    setFilters(next);
    onPageChange(1);
  };

  const toggleSort = (key: ReviewSortKey) => {
    onSortChange({ key, direction: sort.key === key && sort.direction === 'asc' ? 'desc' : 'asc' });
  };

  return (
    <section className={`review-list review-list--${density}`} aria-labelledby="review-list-title">
      <ReviewListControls
        filters={filters}
        resultCount={sorted.length}
        selectedCount={selectedIds.length}
        density={density}
        onFiltersChange={updateFilters}
        onDensityChange={onDensityChange}
        onClearSelection={() => onSelectedIdsChange([])}
        onAddToShortlist={() => selectedIds.forEach((id) => {
          if (!shortlistIds.includes(id)) onShortlistToggle(id);
        })}
        onCompare={() => onCompare(selectedIds)}
      />
      <ReviewListRows
        dossiers={pageItems}
        columns={columns}
        sort={sort}
        density={density}
        selectedId={selectedId}
        selectedIds={selectedIds}
        expandedId={expandedId}
        shortlistIds={shortlistIds}
        groupByTier={filters.groupByTier}
        onSelect={onSelect}
        onToggleSort={toggleSort}
        onSelectedIdsChange={onSelectedIdsChange}
        onExpandedChange={onExpandedChange}
        onShortlistToggle={onShortlistToggle}
        onOpenDossier={onOpenDossier}
        onCopyLink={onCopyLink}
      />
      <ReviewListPagination
        page={safePage}
        pageCount={pageCount}
        pageSize={pageSize}
        total={sorted.length}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </section>
  );
}
