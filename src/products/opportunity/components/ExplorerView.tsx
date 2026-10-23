import { useEffect, useMemo } from 'react';
import {
  activeFilterChips,
  cloneFilters,
  emptyFilters,
  emptyRange,
  filterMarkets,
  filterObjectRecords,
  sortMarkets,
  type ExplorerPreset,
} from '../data/explorer';
import { resolveExplorerRecord } from '../data/records';
import { searchGlobal } from '../data/search';
import { useExplorerData } from '../hooks/useExplorerData';
import { useExplorerQueryState } from '../hooks/useExplorerQueryState';
import { ExplorerAnalyticalField } from './ExplorerAnalyticalField';
import { ExplorerCompactList } from './ExplorerCompactList';
import { ExplorerDataState, ExplorerLoadingRows } from './ExplorerDataState';
import { ExplorerFilters } from './ExplorerFilters';
import { ExplorerLedger } from './ExplorerLedger';
import { ExplorerPagination } from './ExplorerPagination';
import { ExplorerRecordDrawer } from './ExplorerRecordDrawer';
import { ExplorerResultsHeader } from './ExplorerResultsHeader';
import { ExplorerSearchResults } from './ExplorerSearchResults';

const pageSizeByView = { table: 6, compact: 8, field: 12 } as const;

export function ExplorerView() {
  const queryState = useExplorerQueryState();
  const data = useExplorerData();
  const { filters, sort, density, page, recordId } = queryState;
  const filteredMarkets = useMemo(() => filterMarkets(data.markets, filters), [data.markets, filters]);
  const sortedMarkets = useMemo(
    () => sortMarkets(filteredMarkets, sort, filters.query),
    [filteredMarkets, filters.query, sort],
  );
  const pageSize = pageSizeByView[density];
  const pageCount = Math.max(1, Math.ceil(sortedMarkets.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const pageMarkets = sortedMarkets.slice((safePage - 1) * pageSize, safePage * pageSize);
  const searchRecords = useMemo(() => filterObjectRecords(searchGlobal(filters.query, null), data.markets, filters), [data.markets, filters]);
  const selectedRecord = searchRecords.find(record => record.id === queryState.previewId) ?? null;
  const objectPageCount = Math.max(1, Math.ceil(searchRecords.length / 10));
  const resolvedRecord = useMemo(() => resolveExplorerRecord(recordId), [recordId]);
  const chips = activeFilterChips(filters);

  useEffect(() => {
    if (safePage !== page) queryState.setPage(safePage);
  }, [page, queryState, safePage]);

  useEffect(() => {
    if (queryState.objectPage > objectPageCount) queryState.setObjectPage(objectPageCount);
  }, [queryState.objectPage, objectPageCount, queryState.setObjectPage]);

  const removeFilter = (key: (typeof chips)[number]['key']) => {
    const next = cloneFilters(filters);
    if (key === 'query') next.query = '';
    else if (key === 'kind') next.kind = 'all';
    else if (key === 'status') next.status = 'all';
    else if (key === 'decision') next.decision = 'all';
    else if (key === 'outcomes') next.outcomes = 'all';
    else if (key === 'winnerCount') next.winnerCount = 'all';
    else if (key === 'outcomeRange') next.outcomeRange = { ...emptyRange };
    else if (key === 'createdAtFrom') {
      next.createdAtFrom = '';
      next.createdAtTo = '';
    } else if (key === 'volume') next.volume = { ...emptyRange };
    else if (key === 'liquidity') next.liquidity = { ...emptyRange };
    else if (key === 'odds') next.odds = { ...emptyRange };
    else if (key === 'submissions') next.submissions = { ...emptyRange };
    queryState.setFilters(next);
  };

  const applyPreset = (preset: ExplorerPreset) => {
    queryState.setFilters(cloneFilters(preset.filters));
    queryState.setSort(preset.sort);
    queryState.setDensity(preset.density);
  };

  return (
    <div className="destination-view explorer-view">
      <header className="destination-header">
        <div>
          <p className="section-kicker">Universal Explorer</p>
          <h1>Explore every opportunity.</h1>
          <p>Find markets, submissions, creators, wallets, and transactions.</p>
        </div>
        <span className="destination-count">{data.markets.length} canonical market records</span>
      </header>

      <ExplorerFilters
        filters={filters}
        sort={sort}
        density={density}
        onChange={queryState.setFilters}
        onApplyPreset={applyPreset}
        onReset={() => queryState.setFilters(cloneFilters(emptyFilters))}
      />
      <ExplorerDataState status={data.status} updatedAt={data.updatedAt} onRefresh={data.refresh} />

      {filters.query.trim() ? (
        <ExplorerSearchResults
          key={filters.query}
          query={filters.query}
          records={searchRecords}
          selectedRecord={selectedRecord}
          onSelect={record => queryState.selectPreview(record.id)}
          onOpenRecord={queryState.openRecord}
          page={queryState.objectPage}
          onPageChange={queryState.setObjectPage}
        />
      ) : null}

      <ExplorerResultsHeader
        count={sortedMarkets.length}
        total={data.markets.length}
        chips={chips}
        sort={sort}
        density={density}
        onRemoveFilter={removeFilter}
        onSortChange={queryState.setSort}
        onDensityChange={queryState.setDensity}
      />

      {data.status === 'loading' ? (
        <ExplorerLoadingRows />
      ) : (
        <>
          {density === 'table' && <ExplorerLedger markets={pageMarkets} onOpenRecord={queryState.openRecord} />}
          {density === 'compact' && <ExplorerCompactList markets={pageMarkets} onOpenRecord={queryState.openRecord} />}
          {density === 'field' && <ExplorerAnalyticalField markets={pageMarkets} onOpenRecord={queryState.openRecord} />}
          {!pageMarkets.length && (
            <div className="destination-empty">
              <strong>No market records match the current filters.</strong>
              <p>Remove one filter or reset the full query to recover the canonical ledger.</p>
              <button type="button" onClick={() => queryState.setFilters(cloneFilters(emptyFilters))}>Reset all filters</button>
            </div>
          )}
          <ExplorerPagination page={safePage} pageCount={pageCount} onChange={queryState.setPage} />
        </>
      )}

      {resolvedRecord && (
        <ExplorerRecordDrawer
          record={resolvedRecord}
          onClose={queryState.closeRecord}
          onOpenRecord={queryState.openRecord}
        />
      )}
      {recordId && !resolvedRecord && <div className="destination-empty" role="alert"><strong>Record not found</strong><p>This ID is not in the available evidence.</p><button type="button" onClick={queryState.closeRecord}>Close record</button></div>}
    </div>
  );
}
