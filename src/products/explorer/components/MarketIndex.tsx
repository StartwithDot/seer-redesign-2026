import { markets as initialMarkets } from '../data/markets';
import { topicKey } from '../lib/marketKind';
import { useEffect, useMemo, useState } from 'react';
import { readRecentMarkets } from '../data/recentMarkets';
import { loadMarketSnapshot } from '../data/marketService';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useSavedMarkets } from '../hooks/useSavedMarkets';
import type { ExplorerHashRoute, Market } from '../types';
import {
  filterMarketRecords,
  parseMarketFilters,
  serializeMarketQuery,
  sortMarketRecords,
  type MarketUrlState,
} from '../lib/marketFilters';
import { ActiveFilterTags } from './ActiveFilterTags';
import { FeedbackState } from './FeedbackState';
import { MarketCard } from './MarketCard';
import { MarketFilterDrawer } from './MarketFilterDrawer';
import { MarketTable } from './MarketTable';
import { ExplorerStage } from './ExplorerStage';
import { SignalContext } from './SignalContext';
import { IndexFilterBar, matchesIndexKind } from './IndexFilterBar';

interface MarketIndexProps {
  route: Extract<ExplorerHashRoute, { name: 'markets' }>;
  navigate: (hash: string, options?: { replace?: boolean }) => void;
  onQuickBuy: (market: Market, outcomeId?: string) => void;
}

type MarketView = 'recent' | 'all' | 'trending' | 'ending' | 'new';
type MarketLayout = 'cards' | 'table';

const viewOptions: { id: MarketView; label: string }[] = [
  { id: 'all', label: 'All markets' },
  { id: 'recent', label: 'Recent' },
  { id: 'trending', label: 'Trending' },
  { id: 'ending', label: 'Ending soon' },
  { id: 'new', label: 'Newest' },
];

function isView(value: string | null): value is MarketView {
  return value === 'recent' || value === 'all' || value === 'trending' || value === 'ending' || value === 'new';
}

function isLayout(value: string | null): value is MarketLayout {
  return value === 'cards' || value === 'table';
}

export function MarketIndex({ route, navigate, onQuickBuy }: MarketIndexProps) {
  const urlSearch = route.query.get('marketName') ?? '';
  const urlView = route.query.get('view');
  const urlLayout = route.query.get('layout');
  const urlPage = Number(route.query.get('page') ?? '1');
  const urlTopic = route.query.get('topic') ?? '';
  const [draft, setDraft] = useState({ value: urlSearch, origin: urlSearch });
  const search = draft.value;
  const setSearch = (value: string) => setDraft({ value, origin: urlSearch });
  const view: MarketView = isView(urlView) ? urlView : 'all';
  const layout: MarketLayout = isLayout(urlLayout) ? urlLayout : 'table';
  const kind = route.query.get('kind') ?? 'All';
  const page = Number.isSafeInteger(urlPage) && urlPage > 0 ? urlPage : 1;
  const [filterOpen, setFilterOpen] = useState(false);
  const { savedMarkets, toggleSaved } = useSavedMarkets();
  const [snapshot, setSnapshot] = useState<Market[] | null>(initialMarkets);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const debouncedSearch = useDebouncedValue(search, 250);
  const filters = useMemo(() => parseMarketFilters(route.query), [route.query]);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    setLoadError(null);
    loadMarketSnapshot(controller.signal)
      .then((result) => {
        if (active) { setSnapshot(result.markets); window.clearTimeout(timeout); }
      })
      .catch((error: Error) => {
        if (active) { setLoadError(error.message); window.clearTimeout(timeout); }
      });
    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [reloadKey]);

  useEffect(() => setDraft({ value: urlSearch, origin: urlSearch }), [urlSearch]);
  // A URL navigation is authoritative. Only an unchanged local draft may debounce into it.
  useEffect(() => {
    if (draft.origin !== urlSearch || search !== debouncedSearch || debouncedSearch === urlSearch) return;
    const current = new URLSearchParams(window.location.hash ? window.location.hash.split('?')[1] ?? '' : window.location.search);
    if ((current.get('marketName') ?? '') !== urlSearch) return;
    if (debouncedSearch.trim()) current.set('marketName', debouncedSearch.trim());
    else current.delete('marketName');
    current.delete('page');
    navigate(`#/markets${current.size ? `?${current}` : ''}`, { replace: true });
  }, [debouncedSearch, draft.origin, search, urlSearch, navigate]);
  const queryState: MarketUrlState = { search: urlSearch, view, layout, page, topic: urlTopic, filters };

  const filteredMarkets = useMemo(() => {
    const source = filterMarketRecords(snapshot ?? [], search, urlTopic, filters).filter((market) => matchesIndexKind(market, kind));
    const recent = readRecentMarkets();
    const scoped = view === 'recent' ? source.filter((market) => recent.includes(market.id)).sort((a, b) => recent.indexOf(a.id) - recent.indexOf(b.id)) : source;
    const sorted = sortMarketRecords(scoped, filters);
    if (filters.sort !== 'default') return sorted;
    const direction = filters.direction === 'asc' ? -1 : 1;
    if (view === 'trending') return sortMarketRecords(scoped, { ...filters, sort: 'volume' });
    if (view === 'ending') {
      return [...sorted]
        .filter((market) => market.status !== 'resolved')
        .sort((a, b) => direction * a.endDate.localeCompare(b.endDate));
    }
    if (view === 'new') return [...sorted].sort((a, b) => direction * b.createdAt.localeCompare(a.createdAt));
    return sorted;
  }, [filters, search, snapshot, urlTopic, view, kind]);

  const pageSize = layout === 'table' ? 20 : 8;
  const pageCount = Math.max(1, Math.ceil(filteredMarkets.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageMarkets = filteredMarkets.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const applyUrlState = (next: Partial<MarketUrlState>) => {
    const nextQuery = new URLSearchParams(serializeMarketQuery({ ...queryState, ...next }));
    if (kind !== 'All') nextQuery.set('kind', kind);
    navigate(`#/markets${nextQuery.size ? `?${nextQuery}` : ''}`);
  };

  const clearAll = () => {
    setSearch('');
    navigate('#/markets');
  };

  return (
    <section className="market-index-page" data-align="container">
      <ExplorerStage markets={snapshot ?? initialMarkets} onOpen={(market) => navigate(`#/markets/${market.chainId}/${market.slug}`)} />
      <SignalContext />
      <div className="market-board-heading">
        <div><h2>Market explorer</h2><span className="result-count" aria-live="polite">{snapshot ? `${filteredMarkets.length} markets` : 'Loading markets'}</span></div>
        <div className="index-secondary-links"><a href="#/leaderboard" onClick={(e) => { e.preventDefault(); navigate('#/leaderboard'); }}>Leaderboard ↗</a><a href="#/collections/default" onClick={(e) => { e.preventDefault(); navigate('#/collections/default'); }}>My collections ↗</a></div>
      </div>
      <IndexFilterBar filters={filters} kind={kind} onKind={(nextKind) => { const query = new URLSearchParams(serializeMarketQuery({ ...queryState, page: 1 })); if (nextKind !== 'All') query.set('kind', nextKind); navigate(`#/markets${query.size ? `?${query}` : ''}`); }} onChange={(next) => applyUrlState({ filters: next, page: 1 })} onAdvanced={() => setFilterOpen(true)} />
      <div className="index-view-row">
        <div className="view-tabs" role="group" aria-label="Market views">{viewOptions.map((option) => <button key={option.id} type="button" aria-pressed={view === option.id} className={view === option.id ? 'is-active' : ''} onClick={() => applyUrlState({ view: option.id, page: 1 })}>{option.label}</button>)}</div>
        <select className="index-topic-select" aria-label="Market topic" value={urlTopic} onChange={(event) => applyUrlState({ topic: event.target.value, page: 1 })}><option value="">All topics</option>{[...new Set((snapshot ?? []).map((market) => market.subject))].map((topic) => <option key={topic} value={topicKey(topic)}>{topic}</option>)}</select>
        <label className="market-search-field"><span aria-hidden="true">⌕</span><input type="search" aria-label="Filter market index" value={search} placeholder="Filter this index…" onChange={(e) => setSearch(e.target.value)} />{search && <button type="button" aria-label="Clear search" onClick={() => setSearch('')}>×</button>}</label>
        <div className="view-switch" role="group" aria-label="Market board layout"><button type="button" aria-pressed={layout === 'table'} onClick={() => applyUrlState({ layout: 'table', page: 1 })}>Index</button><button type="button" aria-pressed={layout === 'cards'} onClick={() => applyUrlState({ layout: 'cards', page: 1 })}>Cards</button></div>
      </div>
      {kind !== 'All' && <div className="kind-active"><button type="button" onClick={() => { const query = new URLSearchParams(route.query); query.delete('kind'); navigate(`#/markets${query.size ? `?${query}` : ''}`); }}>{kind} ×</button><button type="button" onClick={() => { setSearch(''); navigate('#/markets'); }}>Clear all</button></div>}
      <ActiveFilterTags
        search={search}
        topic={urlTopic}
        filters={filters}
        onSearchClear={() => {
          setSearch('');
          applyUrlState({ search: '', page: 1 });
        }}
        onTopicClear={() => applyUrlState({ topic: '', page: 1 })}
        onFiltersChange={(next) => applyUrlState({ filters: next, page: 1 })}
        onClear={clearAll}
      />

      {loadError && <div className="catalog-refresh-notice" role="status"><span>Catalog refresh unavailable. Showing bundled market records.</span><button type="button" onClick={() => setReloadKey((key) => key + 1)}>Retry refresh</button></div>}
      {!snapshot && loadError ? (
        <FeedbackState
          kind="error"
          title="The market index could not load"
          body={loadError}
          action={<button className="primary-button" type="button" onClick={() => setReloadKey((key) => key + 1)}>Try again</button>}
        />
      ) : !snapshot ? (
        <FeedbackState kind="loading" title="Loading market records" body="Reading captured markets and illustrative examples." />
      ) : filteredMarkets.length ? (
        <>
          {layout === 'table' ? (
            <MarketTable
              markets={pageMarkets}
              filters={filters}
              onSort={(sort) => applyUrlState({ filters: { ...filters, sort, direction: filters.sort === sort && filters.direction === 'desc' ? 'asc' : 'desc' }, page: 1 })}
              onOpen={(market) => navigate(`#/markets/${market.chainId}/${market.slug}`)}
              onQuickBuy={onQuickBuy}
            />
          ) : (
            <div className="market-board">
              {pageMarkets.map((market, index) => (
                <MarketCard
                  key={market.id}
                  market={market}
                  featured={index === 0 && !search && currentPage === 1}
                  saved={savedMarkets.has(market.id)}
                  onOpen={(selected) => navigate(`#/markets/${selected.chainId}/${selected.slug}`)}
                  onQuickBuy={onQuickBuy}
                  onToggleSaved={toggleSaved}
                />
              ))}
            </div>
          )}
          {pageCount > 1 && (
            <nav className="pagination" aria-label="Market pages">
              <button type="button" disabled={currentPage <= 1} title={currentPage <= 1 ? "Already on the first page" : "Previous market page"} onClick={() => applyUrlState({ page: currentPage - 1 })}>Previous</button>
              <span aria-live="polite">Page {currentPage} of {pageCount}</span>
              <button type="button" disabled={currentPage >= pageCount} title={currentPage >= pageCount ? "Already on the last page" : "Next market page"} onClick={() => applyUrlState({ page: currentPage + 1 })}>Next</button>
            </nav>
          )}
        </>
      ) : (
        <FeedbackState
          kind="empty"
          title="No markets match this view"
          body="Try a broader phrase, another topic, or remove one of the active filters."
          action={<button className="primary-button" type="button" onClick={clearAll}>Reset market board</button>}
        />
      )}
      <MarketFilterDrawer
        open={filterOpen}
        markets={snapshot ?? []}
        filters={filters}
        onClose={() => setFilterOpen(false)}
        onApply={(next) => {

          applyUrlState({ filters: next, page: 1 });
        }}
      />
    </section>
  );
}
