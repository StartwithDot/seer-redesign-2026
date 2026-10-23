import { useEffect, useMemo, useRef, useState } from 'react';
import type { MarketSort } from '../data/deep-view';
import type { Repository } from '../data/types';
import { readPreference, writePreference } from '../data/local-preferences';
import { useDeepState } from '../state/DeepState';
import { usePredictions } from '../state/Predictions';
import { useTradeState } from '../state/TradeState';
import { OutcomeRow } from './OutcomeRow';

export type OutcomeTab = 'all' | 'top' | 'positions' | 'agents' | 'discussion';
const tabs: Array<{ id: OutcomeTab; label: string }> = [
  { id: 'all', label: 'All outcomes' },
  { id: 'top', label: 'Top 10' },
  { id: 'positions', label: 'My positions' },
  { id: 'agents', label: 'Agent activity' },
  { id: 'discussion', label: 'Discussion' },
];

function useMobileRow(): boolean {
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 700px)').matches);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 700px)');
    const update = () => setMobile(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return mobile;
}

export function OutcomeTable({
  repositories,
  selected,
  tab,
  sort,
  onTabChange,
  onSortChange,
  onSelect,
  onIsolate,
  onOpenPredictions,
  onOpenGuide,
  onClearFilters,
}: {
  repositories: Repository[];
  selected: Repository;
  tab: OutcomeTab;
  sort: MarketSort;
  onTabChange: (tab: OutcomeTab) => void;
  onSortChange: (sort: MarketSort) => void;
  onSelect: (repository: Repository) => void;
  onIsolate: (repository: Repository) => void;
  onOpenPredictions: () => void;
  onOpenGuide: () => void;
  onClearFilters: () => void;
}) {
  const { wallet, connectWallet, copyText, copyState } = useDeepState();
  const { status: predictionStatus, predictions } = usePredictions();
  const { holdingsByMarket, portfolio } = useTradeState();
  const [starred, setStarred] = useState<Set<string>>(() => new Set(readPreference<string[]>('deep-watchlist', [])));
  const [scrollTop, setScrollTop] = useState(0);
  const [watchOnly, setWatchOnly] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mobile = useMobileRow();
  const rowHeight = mobile ? 88 : 58;
  const viewportHeight = mobile ? 520 : 464;
  const rows = useMemo(() => {
    const visible = watchOnly ? repositories.filter((repository) => starred.has(repository.marketId)) : repositories;
    if (tab === 'top') return [...visible].sort((a, b) => b.upPrice - a.upPrice).slice(0, 10);
    if (tab === 'positions') return visible.filter((repository) => {
      const holding = holdingsByMarket.get(repository.marketId);
      return holding && ((Number.isFinite(holding.up) && holding.up > 0) || (Number.isFinite(holding.down) && holding.down > 0));
    });
    return visible;
  }, [holdingsByMarket, repositories, tab, watchOnly, starred]);
  const start = Math.max(0, Math.floor(scrollTop / rowHeight) - 3);
  const end = Math.min(rows.length, Math.ceil((scrollTop + viewportHeight) / rowHeight) + 3);

  useEffect(() => {
    setScrollTop(0);
    scrollRef.current?.scrollTo({ top: 0 });
  }, [tab, sort, repositories, watchOnly]);

  const toggleStar = (repository: Repository) => {
    setStarred((current) => {
      const next = new Set(current);
      if (next.has(repository.marketId)) next.delete(repository.marketId);
      else next.add(repository.marketId);
      writePreference('deep-watchlist', [...next]);
      return next;
    });
  };

  const marketLink = `${window.location.origin}/deep?iso=${selected.marketId}`;
  const focusRelative = (index: number, delta: number) => {
    const next = Math.max(0, Math.min(rows.length - 1, index + delta));
    scrollRef.current?.scrollTo({ top: Math.max(0, next * rowHeight - rowHeight), behavior: 'auto' });
    window.requestAnimationFrame(() => {
      document.getElementById(`deep-v4-outcome-${rows[next].marketId}`)?.focus();
    });
  };

  return (
    <section className="deep-v4-outcomes" aria-labelledby="deep-outcomes-title">
      <div className="deep-v4-tabs" role="tablist" aria-label="Outcome views" onKeyDown={(event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const current = tabs.findIndex((item) => item.id === tab);
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
        onTabChange(tabs[next].id);
        event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
      }}>
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            tabIndex={tab === item.id ? 0 : -1}
            onClick={() => onTabChange(item.id)}
          >
            {item.label}{item.id === 'all' ? ` (${repositories.length})` : ''}
          </button>
        ))}
      </div>
      <header className="deep-v4-outcomes__header">
        <div><p>Ranked outcomes</p><h2 id="deep-outcomes-title">Repository market prices</h2></div>
        {tab !== 'agents' && tab !== 'discussion' && <button className="deep-v4-watch-filter" type="button" aria-pressed={watchOnly} onClick={() => setWatchOnly(!watchOnly)}>{watchOnly ? "Show all outcomes" : `Watchlist (${starred.size})`}</button>}
      </header>

      {tab === 'agents' ? (
        <div className="deep-v4-tab-state">
          <span className="deep-v4-agent-orbit" aria-hidden="true"><i /><i /><i /></span>
          <div>
            <h3>{predictionStatus === 'ready' ? `${predictions.size} agent forecasts loaded` : 'No agent forecast set loaded'}</h3>
            <p>Participant type is not reported by the market API. Uploaded forecasts stay local.</p>
          </div>
          <button type="button" onClick={onOpenPredictions}>{predictionStatus === 'ready' ? 'Review forecasts' : 'Upload predictions'}</button>
        </div>
      ) : tab === 'discussion' ? (
        <div className="deep-v4-tab-state">
          <div>
            <h3>Discussion is not in the recorded Deep API</h3>
            <p>Share this selected market or open the guide for verified market mechanics.</p>
            <code>{marketLink}</code>
          </div>
          <div className="deep-v4-tab-state__actions">
            <button type="button" onClick={() => void copyText(marketLink, 'Market link')}>Copy market link</button>
            <button type="button" onClick={onOpenGuide}>Open guide</button>
          </div>
          {copyState && <output role="status">{copyState}</output>}
        </div>
      ) : tab === 'positions' && portfolio.status !== 'ready' ? (
        <div className="deep-v4-tab-state">
          <div>
            <h3>{wallet.status === 'connected' ? 'Read your Optimism positions' : 'Connect to read positions'}</h3>
            <p>Balances are read from the connected wallet. Unavailable never means zero.</p>
            {portfolio.error && <small role="alert">{portfolio.error}</small>}
          </div>
          <button
            type="button"
            disabled={portfolio.status === 'loading'}
            onClick={() => wallet.status === 'connected' ? portfolio.refresh() : void connectWallet()}
          >
            {portfolio.status === 'loading' ? `${portfolio.progress.checked}/${portfolio.progress.total} tokens` : wallet.status === 'connected' ? 'Read positions' : 'Connect wallet'}
          </button>
        </div>
      ) : rows.length === 0 ? (
        <div className="deep-v4-tab-state">
          <div><h3>{watchOnly ? 'No saved outcomes match' : 'No outcomes in this view'}</h3><p>{watchOnly ? 'Show all outcomes to start adding repositories to your watchlist.' : 'Try another search or category.'}</p></div>
          {watchOnly && <button type="button" onClick={() => setWatchOnly(false)}>Show all outcomes</button>}
          {repositories.length === 0 && <button type="button" onClick={onClearFilters}>Clear search and category</button>}
        </div>
      ) : (
        <div className="deep-v4-table" role="table" aria-rowcount={rows.length + 1}>
          <div className="deep-v4-table__head" role="row">
            <span role="columnheader">#</span>
            <button type="button" role="columnheader" aria-sort={sort === 'name-asc' ? 'ascending' : sort === 'name-desc' ? 'descending' : 'none'} onClick={() => onSortChange(sort === 'name-asc' ? 'name-desc' : 'name-asc')}>Outcome</button>
            <button type="button" role="columnheader" aria-sort={sort === 'probability' ? 'descending' : 'none'} onClick={() => onSortChange('probability')}>Probability</button>
            <button type="button" role="columnheader" aria-sort={sort === 'change' ? 'descending' : 'none'} onClick={() => onSortChange('change')}>1W change</button>
            <button type="button" role="columnheader" aria-sort={sort === 'volume' ? 'descending' : 'none'} onClick={() => onSortChange('volume')}>Volume</button>
            <span role="columnheader">Traders</span>
            <span role="columnheader">Agent vs human</span>
            <span role="columnheader" aria-label="Watchlist" />
          </div>
          <div
            ref={scrollRef}
            className="deep-v4-table__viewport"
            style={{ height: Math.min(viewportHeight, rows.length * rowHeight) }}
            onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
          >
            <div className="deep-v4-table__spacer" style={{ height: rows.length * rowHeight }}>
              {rows.slice(start, end).map((repository, visibleIndex) => {
                const index = start + visibleIndex;
                return (
                  <OutcomeRow
                    key={repository.marketId}
                    repository={repository}
                    rank={repository.currentRank}
                    selected={selected.marketId === repository.marketId}
                    prediction={predictions.get(repository.marketId)}
                    holding={holdingsByMarket.get(repository.marketId)}
                    starred={starred.has(repository.marketId)}
                    top={index * rowHeight}
                    rowIndex={index}
                    onSelect={onSelect}
                    onIsolate={onIsolate}
                    onRestore={() => onIsolate(selected)}
                    onToggleStar={toggleStar}
                    onFocusRelative={focusRelative}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
