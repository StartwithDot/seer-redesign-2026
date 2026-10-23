import { useCallback, useEffect, useMemo, useState } from 'react';
import { Dialog } from '../components/Dialog';
import { FanChart } from '../components/FanChart';
import { MarketToolbar } from '../components/MarketToolbar';
import { OutcomeTable, type OutcomeTab } from '../components/OutcomeTable';
import { PredictionsPanel } from '../components/PredictionsPanel';
import { SwarmField } from '../components/SwarmField';
import { TradeRail } from '../components/TradeRail';
import { ExpandedTimeFigureDialog, TimeFigureChart } from '../components/TimeFigureChart';
import { reportedTotals, repositories } from '../data/repositories';
import { sortRepositories, type FanRange, type MarketSort } from '../data/deep-view';
import type { Repository } from '../data/types';
import { usePredictions } from '../state/Predictions';
import { readDeepQueryParam, setDeepQueryParam, useDeepPath } from '../state/router';

type ChartView = 'fan' | 'history' | 'swarm';

function readSort(value: string | null): MarketSort {
  if (value === 'change' || value === 'change-desc') return 'change';
  if (value === 'volume') return 'volume';
  if (value === 'name' || value === 'name-asc') return 'name-asc';
  if (value === 'name-desc') return 'name-desc';
  if (value === 'difference' || value === 'difference-desc') return 'difference';
  return 'probability';
}

function isTab(value: string): value is OutcomeTab {
  return value === 'all' || value === 'top' || value === 'positions' || value === 'agents' || value === 'discussion';
}

function isView(value: string): value is ChartView {
  return value === 'fan' || value === 'history' || value === 'swarm';
}

export function MarketsPage() {
  const deepPath = useDeepPath();
  const { status: predictionStatus, predictions } = usePredictions();
  const initialId = readDeepQueryParam('iso', repositories[0].marketId);
  const [selected, setSelected] = useState<Repository>(() => repositories.find((item) => item.marketId === initialId) ?? repositories[0]);
  const [isolated, setIsolated] = useState(selected);
  const [query, setQuery] = useState(() => readDeepQueryParam('q', ''));
  const [fanRange, setFanRange] = useState<FanRange>('ALL');
  const params = new URL(deepPath, window.location.origin).searchParams;
  const predictionsOpen = params.get('dialog') === 'forecasts';
  const mobileTradeOpen = params.get('dialog') === 'trade-preview';
  const setPredictionsOpen = (open: boolean) => setDeepQueryParam('dialog', open ? 'forecasts' : '', 'push');
  const setMobileTradeOpen = (open: boolean) => setDeepQueryParam('dialog', open ? 'trade-preview' : '', 'push');
  const category = params.get('category') ?? 'all';
  const sort = readSort(params.get('sort'));
  const tab: OutcomeTab = isTab(params.get('tab') ?? '') ? params.get('tab') as OutcomeTab : 'all';
  const view: ChartView = isView(params.get('view') ?? '') ? params.get('view') as ChartView : 'fan';
  const expanded = params.get('dialog') === 'chart';
  const categories = useMemo(() => [...new Set(repositories.map((repository) => repository.group))].sort(), []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = repositories.filter((repository) => {
      const categoryMatch = category === 'all' || repository.group === category;
      const queryMatch = !normalized || `${repository.owner}/${repository.name} ${repository.group} ${repository.marketId}`.toLowerCase().includes(normalized);
      return categoryMatch && queryMatch;
    });
    return sortRepositories(result, sort, predictions);
  }, [category, predictions, query, sort]);

  const selectRepository = useCallback((repository: Repository) => {
    setSelected(repository);
    setIsolated(repository);
    setDeepQueryParam('iso', repository.marketId, 'push');
  }, []);

  useEffect(() => {
    setQuery(readDeepQueryParam('q', ''));
    const marketId = readDeepQueryParam('iso', selected.marketId);
    const next = repositories.find((repository) => repository.marketId === marketId);
    if (next && next.marketId !== selected.marketId) { setSelected(next); setIsolated(next); }
  }, [deepPath, selected.marketId]);

  useEffect(() => {
    if (!filtered.length || filtered.some((repository) => repository.marketId === selected.marketId)) return;
    setSelected(filtered[0]);
    setIsolated(filtered[0]);
    setDeepQueryParam('iso', filtered[0].marketId);
  }, [filtered, selected.marketId]);

  const updateQuery = (next: string) => {
    setQuery(next);
    setDeepQueryParam('q', next);
  };

  const openFunds = () => setDeepQueryParam('dialog', 'funds', 'push');
  const openGuide = () => setDeepQueryParam('dialog', 'guide', 'push');

  return (
    <section className="deep-v4-page">
      <MarketToolbar
        category={category}
        categories={categories}
        sort={sort}
        query={query}
        resultCount={filtered.length}
        predictionsReady={predictionStatus === 'ready' && predictions.size > 0}
        onCategoryChange={(value) => setDeepQueryParam('category', value === 'all' ? '' : value, 'push')}
        onSortChange={(value) => setDeepQueryParam('sort', value, 'push')}
        onQueryChange={updateQuery}
        onOpenPredictions={() => setPredictionsOpen(true)}
      />

      <div className="deep-v4-layout">
        <div className="deep-v4-main">
          <section className="deep-v4-context" aria-label="Market context">
            <div><span>Asked by</span><strong>Deep Funding grant evaluators</strong></div>
            <div><span>Priced</span><strong>How reviewers may judge 98 repositories</strong></div>
            <div><span>How to use</span><strong>Read via the interface, or an agent via API</strong></div>
          </section>

          <header className="deep-v4-title">
            <div>
              <p><span className="deep-v4-live-dot" /> Round 3 · Originality · Recorded snapshot</p>
              <h1>How will evaluators judge each repository’s originality?</h1>
            </div>
            <div className="deep-v4-meta" aria-label="Market metadata">
              <span><b>Outcomes</b>{reportedTotals.marketCount}</span>
              <span><b>Volume</b>~${reportedTotals.volume.toFixed(2)}</span>
              <span><b>Closes in</b>Not reported</span>
            </div>
          </header>

          <section className="deep-v4-chart-card" aria-labelledby="deep-fan-title">
            <header className="deep-v4-chart-card__header">
              <div><p>Independent repository markets</p><h2 id="deep-fan-title">One question, 98 priced answers</h2></div>
              <div className="deep-v4-view-switch" role="tablist" aria-label="Market chart views" onKeyDown={(event) => {
                if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
                event.preventDefault();
                const views: ChartView[] = ['fan', 'history', 'swarm'];
                const index = views.indexOf(view);
                const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (index + (event.key === 'ArrowRight' ? 1 : -1) + 3) % 3;
                setDeepQueryParam('view', views[next], 'push');
                event.currentTarget.querySelectorAll<HTMLButtonElement>('button')[next]?.focus();
              }}>
                {(['fan', 'history', 'swarm'] as const).map((item) => (
                  <button key={item} type="button" role="tab" tabIndex={view === item ? 0 : -1} aria-selected={view === item} onClick={() => setDeepQueryParam('view', item, 'push')}>
                    {item === 'fan' ? 'Fan' : item === 'history' ? 'History' : 'Swarm'}
                  </button>
                ))}
              </div>
            </header>
            <div className={`deep-v4-chart-card__body is-${view}`}>
              {view === 'fan' ? (
                <FanChart
                  repositories={filtered}
                  selected={selected}
                  isolated={isolated}
                  range={fanRange}
                  onRangeChange={setFanRange}
                  onSelect={selectRepository}
                  onIsolate={setIsolated}
                />
              ) : view === 'history' ? (
                <TimeFigureChart
                  repositories={filtered}
                  selected={selected}
                  isolated={isolated}
                  onSelect={selectRepository}
                  onIsolate={setIsolated}
                  onExpand={() => setDeepQueryParam('dialog', 'chart', 'push')}
                />
              ) : (
                <SwarmField
                  repositories={filtered}
                  selected={selected}
                  isolated={isolated}
                  onSelect={selectRepository}
                  onIsolate={setIsolated}
                  onReturnToChart={() => setDeepQueryParam('view', 'history', 'push')}
                />
              )}
            </div>
          </section>

          <OutcomeTable
            repositories={filtered}
            selected={selected}
            tab={tab}
            sort={sort}
            onTabChange={(value) => setDeepQueryParam('tab', value, 'push')}
            onSortChange={(value) => setDeepQueryParam('sort', value, 'push')}
            onSelect={selectRepository}
            onIsolate={setIsolated}
            onOpenPredictions={() => setPredictionsOpen(true)}
            onOpenGuide={openGuide}
            onClearFilters={() => {
              setQuery('');
              setDeepQueryParam('q', '');
              setDeepQueryParam('category', '');
            }}
          />
        </div>

        <TradeRail
          key={selected.marketId}
          selected={selected}
          repositories={repositories}
          onSelect={selectRepository}
          onOpenPredictions={() => setPredictionsOpen(true)}
          onOpenFunds={openFunds}
        />
      </div>

      <button className="deep-v4-mobile-trade" type="button" onClick={() => setMobileTradeOpen(true)}>
        <span><small>{selected.owner}/{selected.name}</small><strong>{(selected.upPrice * 100).toFixed(1)}% UP</strong></span>
        <b>Trade</b>
      </button>

      <Dialog open={predictionsOpen} title="Agent forecasts" description="Upload, validate, and export the existing Deep prediction CSV flow." onClose={() => setPredictionsOpen(false)} className="deep-v4-prediction-dialog">
        <PredictionsPanel />
      </Dialog>
      <Dialog open={mobileTradeOpen} title="Selected outcome" description="Preview the selected market and trading setup." onClose={() => setMobileTradeOpen(false)} className="deep-v4-trade-sheet">
        <TradeRail
          key={selected.marketId}
          mobile
          selected={selected}
          repositories={repositories}
          onSelect={selectRepository}
          onOpenPredictions={() => { setMobileTradeOpen(false); setPredictionsOpen(true); }}
          onOpenFunds={() => { setMobileTradeOpen(false); openFunds(); }}
        />
      </Dialog>
      <ExpandedTimeFigureDialog
        open={expanded && filtered.length > 0}
        onClose={() => setDeepQueryParam('dialog', '', 'push')}
        repositories={filtered}
        selected={selected}
        isolated={isolated}
        onSelect={selectRepository}
        onIsolate={setIsolated}
      />
    </section>
  );
}
