import { useMemo, useState } from 'react';
import type { PredictionRecord } from '../data/predictions';
import type { Repository } from '../data/types';
import { usePredictions } from '../state/Predictions';
import { useTradeState } from '../state/TradeState';
import { navigateDeep, setDeepQueryParam, useDeepPath } from '../state/router';
import { DifferenceHelp } from './DifferenceHelp';
import { Icon } from './Icons';

type RepositoryMode = 'market' | 'positions';
type RepositorySort = 'up-desc' | 'name-asc' | 'name-desc' | 'change-desc' | 'difference-desc';

const sortLabels: Record<RepositorySort, string> = {
  'up-desc': 'UP descending',
  'name-asc': 'Repository A–Z',
  'name-desc': 'Repository Z–A',
  'change-desc': 'Change',
  'difference-desc': 'Difference',
};

function MarketAvatar({ repository }: { repository: Repository }) {
  return (
    <span className="deep-avatar" aria-hidden="true">
      <span>{repository.owner.slice(0, 2).toUpperCase()}</span>
      <img
        src={`https://github.com/${repository.owner}.png?size=64`}
        alt=""
        loading="lazy"
        onError={(event) => { event.currentTarget.style.display = 'none'; }}
      />
    </span>
  );
}

function SplitMark({ repository, prediction }: { repository: Repository; prediction?: PredictionRecord }) {
  const sum = repository.upPrice + repository.downPrice;
  const residual = 1 - sum;
  const total = Math.max(1, sum);
  return (
    <span
      className={`deep-rail__split ${residual < 0 ? 'is-over' : ''}`}
      aria-label={`UP ${repository.upPrice.toFixed(4)}, DOWN ${repository.downPrice.toFixed(4)}, ${residual < 0 ? 'over-1' : 'unpriced residual'} ${Math.abs(residual).toFixed(4)}`}
    >
      <i style={{ width: `${repository.upPrice / total * 100}%` }} />
      {residual > 0 && <i className="deep-split__residual" style={{ width: `${residual / total * 100}%` }} />}
      <i className="deep-split__down" style={{ width: `${repository.downPrice / total * 100}%` }} />
      {residual < 0 && <i className="deep-split-overlap" style={{ width: `${Math.abs(residual) / total * 100}%` }} />}
      {prediction && <i className="deep-split-prediction" style={{ left: `${prediction.up / total * 100}%` }} title={`Forecast UP ${prediction.up.toFixed(4)}`} />}
    </span>
  );
}

function formatSigned(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(4)}`;
}

function differenceValues(repository: Repository, prediction: PredictionRecord | undefined) {
  if (!prediction) return { up: null, down: null, magnitude: 0 };
  const up = prediction.up - repository.upPrice;
  const down = prediction.down - repository.downPrice;
  return { up, down, magnitude: Math.max(Math.abs(up), Math.abs(down)) };
}

function headerSort(current: RepositorySort, target: RepositorySort, alternate: RepositorySort): RepositorySort {
  return current === target ? alternate : target;
}

export function RepositoryRail({
  repositories,
  totalCount,
  query,
  onQueryChange,
  selected,
  isolated,
  onSelect,
  onIsolate,
  onOpenInspector,
}: {
  repositories: Repository[];
  totalCount: number;
  query: string;
  onQueryChange: (query: string) => void;
  selected: Repository;
  isolated: Repository;
  onSelect: (repository: Repository) => void;
  onIsolate: (repository: Repository) => void;
  onOpenInspector: (repository: Repository) => void;
}) {
  const [mode, setMode] = useState<RepositoryMode>('market');
  const path = useDeepPath();
  const querySort = new URL(path, window.location.origin).searchParams.get('sort') ?? 'up-desc';
  const sort: RepositorySort = Object.hasOwn(sortLabels, querySort) ? querySort as RepositorySort : 'up-desc';
  const setSort = (value: RepositorySort) => setDeepQueryParam('sort', value, 'push');
  const { status: predictionStatus, predictions } = usePredictions();
  const { holdingsByMarket } = useTradeState();

  const sorted = useMemo(() => {
    const result = [...repositories];
    result.sort((left, right) => {
      if (sort === 'name-asc') return `${left.owner}/${left.name}`.localeCompare(`${right.owner}/${right.name}`);
      if (sort === 'name-desc') return `${right.owner}/${right.name}`.localeCompare(`${left.owner}/${left.name}`);
      if (sort === 'change-desc') {
        return (right.upPrice - right.firstUpPrice) - (left.upPrice - left.firstUpPrice);
      }
      if (sort === 'difference-desc') {
        return differenceValues(right, predictions.get(right.marketId)).magnitude
          - differenceValues(left, predictions.get(left.marketId)).magnitude;
      }
      return right.upPrice - left.upPrice;
    });
    return result;
  }, [predictions, repositories, sort]);

  const focusRelative = (index: number, delta: number) => {
    const next = Math.max(0, Math.min(sorted.length - 1, index + delta));
    document.getElementById(`deep-repository-row-${sorted[next].marketId}`)?.focus();
  };

  return (
    <aside className="deep-rail" aria-label="Repository markets">
      <div className="deep-rail__head">
        <div className="deep-rail__counts">
          <strong>{totalCount} repositories</strong>
          <span>{repositories.length} filtered result{repositories.length === 1 ? '' : 's'}</span>
        </div>
        <label className="deep-search">
          <Icon name="search" size={16} />
          <span className="deep-visually-hidden">Search outcomes</span>
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search owner or repository"
          />
          {query && <button type="button" onClick={() => onQueryChange('')}>Clear search</button>}
        </label>
        <div className="deep-rail__tools">
          <div className="deep-segmented" role="group" aria-label="Repository display mode">
            <button type="button" aria-pressed={mode === 'market'} disabled={mode === 'market'} title={mode === 'market' ? 'Current repository display' : 'Read market pairs'} onClick={() => setMode('market')}>Market</button>
            <button
              type="button"
              aria-pressed={mode === 'positions'}
              disabled={predictionStatus === 'loading' || mode === 'positions'}
              title={predictionStatus === 'loading' ? 'Predictions are still loading' : mode === 'positions' ? 'Current repository display' : 'Compare predictions and balances'}
              onClick={() => setMode('positions')}
            >
              Positions
            </button>
          </div>
          <label className="deep-select">
            <span className="deep-visually-hidden">Sort repositories</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as RepositorySort)}>
              {Object.entries(sortLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="deep-rail__table" data-mode={mode} role="table" aria-label="Ranked repository markets">
        <div className="deep-rail__columns" role="row">
          <div role="columnheader" aria-sort={sort.startsWith('name') ? (sort === 'name-asc' ? 'ascending' : 'descending') : 'none'}>
            <button type="button" onClick={() => setSort(headerSort(sort, 'name-asc', 'name-desc'))}>
              Repository {sort.startsWith('name') ? (sort === 'name-asc' ? '↑' : '↓') : ''}
            </button>
          </div>
          {mode === 'market' ? (
            <>
              <div role="columnheader" aria-sort={sort === 'up-desc' ? 'descending' : 'none'}>
                <button type="button" onClick={() => setSort(headerSort(sort, 'up-desc', 'name-asc'))}>
                  UP {sort === 'up-desc' ? '↓ · sorted' : ''}
                </button>
              </div>
              <div role="columnheader">DOWN</div>
              <div role="columnheader" aria-sort={sort === 'change-desc' ? 'descending' : 'none'}>
                <button type="button" onClick={() => setSort(headerSort(sort, 'change-desc', 'name-asc'))}>
                  Change {sort === 'change-desc' ? '↓ · sorted' : ''}
                </button>
              </div>
            </>
          ) : (
            <>
              <div role="columnheader">Market pair</div>
              <div role="columnheader">Predicted pair</div>
              <div role="columnheader">Balance pair</div>
              <div role="columnheader" aria-sort={sort === 'difference-desc' ? 'descending' : 'none'}>
                <button type="button" onClick={() => setSort(headerSort(sort, 'difference-desc', 'name-asc'))}>
                  Difference {sort === 'difference-desc' ? '↓ · sorted' : ''}
                </button>
                <DifferenceHelp leg="up" />
                <DifferenceHelp leg="down" />
              </div>
            </>
          )}
        </div>

        <div className="deep-rail__list">
          {sorted.map((repository, index) => {
            const prediction = predictions.get(repository.marketId);
            const difference = differenceValues(repository, prediction);
            const holding = holdingsByMarket.get(repository.marketId);
            const change = repository.upPrice - repository.firstUpPrice;
            return (
              <div
                key={repository.marketId}
                className={`deep-rail__row ${selected.marketId === repository.marketId ? 'is-selected' : ''} ${isolated.marketId === repository.marketId ? 'is-isolated' : ''}`}
                onPointerEnter={() => onIsolate(repository)}
                onPointerLeave={() => onIsolate(selected)}
              >
                <button
                  id={`deep-repository-row-${repository.marketId}`}
                  className="deep-rail__row-main"
                  type="button"
                  title={`${repository.owner}/${repository.name}`}
                  aria-pressed={selected.marketId === repository.marketId}
                  onClick={() => {
                    onSelect(repository);
                    onOpenInspector(repository);
                  }}
                  onDoubleClick={() => navigateDeep(`/deep/repo/${repository.owner}/${repository.name}`)}
                  onFocus={() => onIsolate(repository)}
                  onBlur={(event) => {
                    if (!event.currentTarget.parentElement?.contains(event.relatedTarget as Node | null)) onIsolate(selected);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      navigateDeep(`/deep/repo/${repository.owner}/${repository.name}`);
                    }
                    if (event.key === 'ArrowDown') {
                      event.preventDefault();
                      focusRelative(index, 1);
                    }
                    if (event.key === 'ArrowUp') {
                      event.preventDefault();
                      focusRelative(index, -1);
                    }
                  }}
                >
                  <span className="deep-rail__identity">
                    <MarketAvatar repository={repository} />
                    <strong>{repository.owner}/{repository.name}</strong>
                    <small title={`#${repository.currentRank} · ${repository.group} · ${repository.marketId} · ${repository.marketStatus}`}>#{repository.currentRank} · {repository.group} · {repository.marketId.slice(0, 8)}… · {repository.marketStatus}</small>
                    <SplitMark repository={repository} prediction={prediction} />
                  </span>
                  {mode === 'market' ? (
                    <>
                      <span className="deep-rail__value"><strong>{repository.upPrice.toFixed(4)}</strong><small>UP</small></span>
                      <span className="deep-rail__value"><strong>{repository.downPrice.toFixed(4)}</strong><small>DOWN</small></span>
                      <span className={`deep-rail__change ${change >= 0 ? 'is-positive' : 'is-negative'}`}>
                        <strong>{formatSigned(change)}</strong><small>since Oct 1</small>
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="deep-rail__value">
                        <strong>{repository.upPrice.toFixed(4)} / {repository.downPrice.toFixed(4)}</strong>
                        <small>market UP / DOWN</small>
                      </span>
                      <span className="deep-rail__value">
                        <strong>{prediction ? `${prediction.up.toFixed(4)} / ${prediction.down.toFixed(4)}` : '– / –'}</strong>
                        <small>{prediction ? 'predicted UP / DOWN' : 'not loaded'}</small>
                      </span>
                      <span className="deep-rail__value">
                        <strong>{holding ? `${Number.isFinite(holding.up) ? holding.up.toFixed(2) : 'Unavailable'} / ${Number.isFinite(holding.down) ? holding.down.toFixed(2) : 'Unavailable'}` : 'Unavailable'}</strong>
                        <small>balance UP / DOWN</small>
                      </span>
                      <span className="deep-rail__differences">
                        <strong>{difference.up === null ? '–' : formatSigned(difference.up)}</strong>
                        <small>UP · predicted − UP</small>
                        <strong>{difference.down === null ? '–' : formatSigned(difference.down)}</strong>
                        <small>DOWN · predicted − DOWN</small>
                      </span>
                    </>
                  )}
                </button>
                <button
                  className="deep-icon-button"
                  type="button"
                  aria-label={`Inspect ${repository.owner}/${repository.name}`}
                  onClick={() => {
                    onSelect(repository);
                    onOpenInspector(repository);
                  }}
                >
                  <Icon name="arrow" />
                </button>
              </div>
            );
          })}
          {!sorted.length && (
            <div className="deep-table-empty">
              <strong>No repositories match “{query}”.</strong>
              <button className="deep-button" type="button" onClick={() => onQueryChange('')}>Clear search</button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
