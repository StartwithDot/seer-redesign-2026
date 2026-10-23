import { useMemo, useState } from 'react';
import { historyChange } from '../data/history';
import { formatPdPercent, formatSignedPoints } from '../data/format';
import type { AssetRecord } from '../data/types';

interface HistoryMoversProps {
  assets: AssetRecord[];
}

export function HistoryMovers({ assets }: HistoryMoversProps) {
  const [range, setRange] = useState<24 | 168>(24);
  const movers = useMemo(() => assets.map((asset) => ({
    asset,
    change: historyChange(asset, range),
  })).sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 6), [assets, range]);

  return <section className="risk-history-movers" aria-labelledby="risk-movers-title">
    <header>
      <div><p className="risk-kicker">Top movers</p><h3 id="risk-movers-title">Where the signal shifted.</h3></div>
      <div className="risk-segmented" aria-label="Mover range">
        <button type="button" aria-pressed={range === 24} onClick={() => setRange(24)}>24h</button>
        <button type="button" aria-pressed={range === 168} onClick={() => setRange(168)}>7d</button>
      </div>
    </header>
    <ol>{movers.map(({ asset, change }, index) => <li key={asset.id} className={change > 0 ? 'is-up' : change < 0 ? 'is-down' : ''}>
      <span className="risk-mover-rank">{String(index + 1).padStart(2, '0')}</span>
      <span><strong>{asset.ticker}</strong><small>{asset.name}</small></span>
      <svg viewBox="0 0 72 28" role="img" aria-label={`${asset.ticker} slope ${formatSignedPoints(change)}`}>
        <path d={change >= 0 ? 'M3 23 L68 6' : 'M3 6 L68 23'} />
      </svg>
      <b>{formatSignedPoints(change)}</b>
      <small>{formatPdPercent(asset.marketPd)} now</small>
    </li>)}</ol>
  </section>;
}
