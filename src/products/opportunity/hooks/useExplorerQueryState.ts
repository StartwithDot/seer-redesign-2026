import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  applyExplorerStateToSearch,
  cloneFilters,
  filtersFromSearch,
  type ExplorerDensity,
  type ExplorerFilters,
  type ExplorerSort,
} from '../data/explorer';

function currentSort(params: URLSearchParams): ExplorerSort {
  const value = params.get('sort');
  return value === 'featured' || value === 'newest' || value === 'outcomes' ||
    value === 'volume' ||
    value === 'liquidity' ||
    value === 'coverage' ||
    value === 'concentration' ||
    value === 'readiness'
    ? value
    : 'relevance';
}

function currentDensity(params: URLSearchParams): ExplorerDensity {
  const value = params.get('view');
  return value === 'compact' || value === 'field' ? value : 'table';
}

function stateFromLocation() {
  const params = new URLSearchParams(window.location.search);
  return {
    filters: filtersFromSearch(params),
    sort: currentSort(params),
    density: currentDensity(params),
    page: Math.max(1, Math.floor(Number(params.get('page')) || 1)),
    objectPage: Math.max(1, Math.floor(Number(params.get('objectPage')) || 1)),
    previewId: params.get('preview'),
    recordId: params.get('record'),
  };
}

function replaceExplorerUrl(
  filters: ExplorerFilters,
  sort: ExplorerSort,
  density: ExplorerDensity,
  page: number,
  objectPage: number,
  previewId: string | null,
  recordId: string | null,
  mode: 'push' | 'replace',
) {
  const url = new URL(window.location.href);
  for (const key of [
    'q',
    'kind',
    'status',
    'decision',
    'outcomes',
    'winners',
    'outcomeCountMin',
    'outcomeCountMax',
    'from',
    'to',
    'volumeMin',
    'volumeMax',
    'liquidityMin',
    'liquidityMax',
    'oddsMin',
    'oddsMax',
    'submissionsMin',
    'submissionsMax',
    'sort',
    'view',
    'page',
    'objectPage',
    'preview',
    'record',
  ]) {
    url.searchParams.delete(key);
  }
  applyExplorerStateToSearch(url.searchParams, filters, sort, density, page);
  if (objectPage > 1) url.searchParams.set('objectPage', String(objectPage));
  if (previewId) url.searchParams.set('preview', previewId);
  if (recordId) url.searchParams.set('record', recordId);
  window.history[mode === 'push' ? 'pushState' : 'replaceState'](
    { ...window.history.state, opportunityRecord: Boolean(recordId) && (mode === 'push' || Boolean(window.history.state?.opportunityRecord)) },
    '',
    `${url.pathname}${url.search}${url.hash}`,
  );
}

export function useExplorerQueryState() {
  const [state, setState] = useState(stateFromLocation);
  const stateRef = useRef(state);

  useEffect(() => {
    const onPopState = () => {
      const next = stateFromLocation();
      stateRef.current = next;
      setState(next);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const update = useCallback(
    (next: Partial<typeof state>, mode: 'push' | 'replace' = 'replace') => {
      const merged = { ...stateRef.current, ...next };
      replaceExplorerUrl(
        merged.filters,
        merged.sort,
        merged.density,
        merged.page,
        merged.objectPage,
        merged.previewId,
        merged.recordId,
        mode,
      );
      stateRef.current = merged;
      setState(merged);
    },
    [],
  );

  const setFilters = useCallback(
    (filters: ExplorerFilters) => update({ filters: cloneFilters(filters), page: 1, objectPage: 1, previewId: null }),
    [update],
  );
  const setSort = useCallback((sort: ExplorerSort) => update({ sort, page: 1 }), [update]);
  const setDensity = useCallback((density: ExplorerDensity) => update({ density }), [update]);
  const setPage = useCallback((page: number) => update({ page }), [update]);
  const setObjectPage = useCallback((objectPage: number) => update({ objectPage }), [update]);
  const selectPreview = useCallback((previewId: string | null) => update({ previewId }), [update]);
  const openRecord = useCallback((recordId: string) => update({ recordId }, 'push'), [update]);
  const closeRecord = useCallback(() => {
    if (window.history.state?.opportunityRecord) window.history.back();
    else update({ recordId: null }, 'replace');
  }, [update]);

  return useMemo(
    () => ({ ...state, setFilters, setSort, setDensity, setPage, setObjectPage, selectPreview, openRecord, closeRecord }),
    [state, setFilters, setSort, setDensity, setPage, setObjectPage, selectPreview, openRecord, closeRecord],
  );
}
