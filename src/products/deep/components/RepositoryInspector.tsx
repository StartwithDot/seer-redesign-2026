import { useState } from 'react';
import { refreshMarketVolume } from '../data/api';
import type { PricePoint, Repository } from '../data/types';
import { Icon } from './Icons';
import { useEffect } from 'react';
import { downloadCsv } from '../data/prediction-csv';

function formatRange(start: number, end: number): string {
  const format = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', timeZone: 'UTC' });
  return `${format.format(new Date(start * 1000))} – ${format.format(new Date(end * 1000))}, 2026 UTC`;
}

function pointsToPath(points: PricePoint[], min: number, max: number, start: number, end: number): string {
  return points.map((point, index) => {
    const x = 42 + ((point.timestamp - start) / Math.max(1, end - start)) * 858;
    const y = 244 - ((point.price - min) / Math.max(0.001, max - min)) * 196;
    const clampedY = Math.max(30, Math.min(244, y));
    if (index === 0) return `M${x.toFixed(1)},${clampedY.toFixed(1)}`;
    const previousY = 244 - ((points[index - 1].price - min) / Math.max(0.001, max - min)) * 196;
    return `L${x.toFixed(1)},${Math.max(30, Math.min(244, previousY)).toFixed(1)} L${x.toFixed(1)},${clampedY.toFixed(1)}`;
  }).join(' ');
}

export function PriceHistoryChart({ repository }: { repository: Repository }) {
  const values = [...repository.upHistory, ...repository.downHistory].map((point) => point.price);
  const min = Math.floor(Math.min(...values) * 20) / 20;
  const max = Math.ceil(Math.max(...values) * 20) / 20;
  const timestamps = [...repository.upHistory, ...repository.downHistory].map(point => point.timestamp);
  const start = Math.min(...timestamps);
  const end = Math.max(...timestamps);
  return (
    <figure className="deep-chart">
      <div>
        <p className="deep-eyebrow">UP and DOWN history</p>
        <h2>Price change over time</h2>
      </div>
      <svg viewBox="0 0 940 290" role="img" aria-label={`UP and DOWN price history for ${repository.owner}/${repository.name}`}>
        {[0, 1, 2, 3, 4].map((line) => {
          const value = min + ((max - min) * line / 4);
          const y = 244 - (line / 4) * 196;
          return (
            <g key={line}>
              <line className="deep-chart__grid" x1="42" x2="900" y1={y} y2={y} />
              <text x="4" y={y + 4}>{value.toFixed(2)}</text>
            </g>
          );
        })}
        <path className="deep-chart__line deep-chart__line--down" d={pointsToPath(repository.downHistory, min, max, start, end)} />
        <path className="deep-chart__line" d={pointsToPath(repository.upHistory, min, max, start, end)} />
        {[0, .5, 1].map(fraction => <text key={fraction} x={42 + fraction * 858} y="278" textAnchor={fraction === 1 ? 'end' : fraction === 0 ? 'start' : 'middle'}>
          {new Date((start + fraction * (end - start)) * 1000).toLocaleDateString('en', { month: 'short', day: 'numeric', timeZone: 'UTC' })}
        </text>)}
      </svg>
      <div className="deep-chart__legend" aria-label="Series legend">
        <span><i className="is-up" /> UP · original work</span>
        <span><i className="is-down" /> DOWN · dependencies</span>
      </div>
      <figcaption>
        <span>Step-held prices · {formatRange(repository.upStats.startedAt, repository.upStats.endedAt)}</span>
        <span>UP is blue. DOWN is grey.</span>
      </figcaption>
    </figure>
  );
}

function SplitBar({ repository }: { repository: Repository }) {
  const sum = repository.upPrice + repository.downPrice;
  const residual = 1 - sum;
  const total = Math.max(1, sum);
  return (
    <div
      className="deep-split"
      aria-label={`UP ${repository.upPrice.toFixed(4)}, DOWN ${repository.downPrice.toFixed(4)}, ${residual >= 0 ? 'unpriced residual' : 'over-1 amount'} ${Math.abs(residual).toFixed(4)}`}
    >
      <i className="deep-split__up" style={{ width: `${repository.upPrice / total * 100}%` }} />
      <i className="deep-split__down" style={{ width: `${repository.downPrice / total * 100}%` }} />
      {residual > 0 && <i className="deep-split__residual" style={{ width: `${residual * 100}%` }} />}
      {residual < 0 && <i className="deep-split-overlap" style={{ width: `${Math.abs(residual) / total * 100}%` }} />}
    </div>
  );
}

export function RepositoryInspector({ repository }: { repository: Repository }) {
  const [refreshState, setRefreshState] = useState<'idle' | 'busy' | 'success' | 'error'>('idle');
  const [refreshData, setRefreshData] = useState<Awaited<ReturnType<typeof refreshMarketVolume>> | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { setRefreshState('idle'); setRefreshData(null); setError(''); }, [repository.marketId]);
  const residual = 1 - repository.upPrice - repository.downPrice;

  const exportCsv = () => {
    const rows = [
      ['repository', 'market_id', 'up_stored_6dp', 'down_stored_6dp', 'up_display_4dp', 'down_display_4dp', 'sum', 'residual'],
      [
        `${repository.owner}/${repository.name}`,
        repository.marketId,
        repository.upPrice.toFixed(6),
        repository.downPrice.toFixed(6),
        repository.upPrice.toFixed(4),
        repository.downPrice.toFixed(4),
        (repository.upPrice + repository.downPrice).toFixed(6),
        residual.toFixed(6),
      ],
    ];
    const content = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(',')).join('\n');
    downloadCsv(`${repository.owner}-${repository.name}-market.csv`, content);
  };

  const refresh = async () => {
    setRefreshState('busy');
    setError('');
    try {
      setRefreshData(await refreshMarketVolume(repository));
      setRefreshState('success');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Refresh failed.');
      setRefreshState('error');
    }
  };

  return (
    <section className="deep-repo-inspector" aria-labelledby="repository-inspector-title">
      <header>
        <div>
          <p className="deep-eyebrow">Repository inspector</p>
          <h2 id="repository-inspector-title">Price, residual and market depth</h2>
        </div>
        <div className="deep-repo-inspector__actions">
          <button className="deep-button" type="button" onClick={exportCsv}><Icon name="download" /> Export CSV</button>
          <button className="deep-button" type="button" onClick={() => void refresh()} disabled={refreshState === 'busy'} title={refreshState === 'busy' ? 'Waiting for the market-volume response' : 'Refresh market volume'}>
            <Icon name="refresh" /> {refreshState === 'busy' ? 'Refreshing' : 'Refresh volume'}
          </button>
        </div>
      </header>
      <SplitBar repository={repository} />
      <div className="deep-price-pair">
        <div><span>UP · original work</span><strong>{repository.upPrice.toFixed(4)}</strong><small>Stored {repository.upPrice.toFixed(6)}</small></div>
        <div><span>DOWN · dependencies</span><strong>{repository.downPrice.toFixed(4)}</strong><small>Stored {repository.downPrice.toFixed(6)}</small></div>
        <div><span>{residual >= 0 ? 'Unpriced residual' : 'Over-1 amount'}</span><strong>{Math.abs(residual).toFixed(4)}</strong><small>1 − UP − DOWN</small></div>
      </div>
      <dl className="deep-inspector-stats">
        <div><dt>First UP price</dt><dd>{repository.firstUpPrice.toFixed(4)}</dd></div>
        <div><dt>Change since Oct 1</dt><dd>{repository.upPrice - repository.firstUpPrice >= 0 ? '+' : ''}{(repository.upPrice - repository.firstUpPrice).toFixed(4)}</dd></div>
        <div><dt>Rank change</dt><dd>{repository.rankChange > 0 ? `Up ${repository.rankChange}` : repository.rankChange < 0 ? `Down ${Math.abs(repository.rankChange)}` : 'Unchanged'} · #{repository.firstRank} → #{repository.currentRank}</dd></div>
        <div><dt>UP min / max</dt><dd>{repository.upStats.minimum.toFixed(4)} / {repository.upStats.maximum.toFixed(4)}</dd></div>
        <div><dt>DOWN min / max</dt><dd>{repository.downStats.minimum.toFixed(4)} / {repository.downStats.maximum.toFixed(4)}</dd></div>
        <div><dt>Price changes</dt><dd>UP {repository.upStats.changeCount} · DOWN {repository.downStats.changeCount}</dd></div>
        <div><dt>Observed range</dt><dd>{formatRange(repository.upStats.startedAt, repository.upStats.endedAt)}</dd></div>
        <div><dt>DOWN observed range</dt><dd>{formatRange(repository.downStats.startedAt, repository.downStats.endedAt)}</dd></div>
        <div><dt>Volume · tokens</dt><dd>{repository.volumeToken.amount.toFixed(4)} {repository.volumeToken.unit}</dd></div>
        <div><dt>Liquidity · tokens</dt><dd>{repository.liquidityToken.amount.toFixed(4)} {repository.liquidityToken.unit}</dd></div>
      </dl>
      <div className="deep-market-amounts">
        <div><span>Volume · market units</span><strong>{repository.volumeMarket}</strong><small>Token total {repository.volumeTokens}</small></div>
        <div><span>Liquidity · market units</span><strong>{repository.liquidityMarket}</strong><small>Token total {repository.liquidityTokens}</small></div>
      </div>
      <output className="deep-refresh-result" aria-live="polite">
        {refreshState === 'success' && refreshData && `Refreshed: ${refreshData.volumeMarket} volume · ${refreshData.liquidityMarket} liquidity.`}
        {refreshState === 'error' && error}
        {refreshState === 'busy' && 'Reading the saved market-volume response…'}
      </output>
    </section>
  );
}
