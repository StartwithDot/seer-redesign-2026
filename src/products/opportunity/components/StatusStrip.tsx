import type { MarketRecord } from '../data/types';
import { marketImageFor } from '../data/marketAssets';

function relativeTime(iso: string) {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  return `${Math.round(minutes / 60)} hr ago`;
}

interface StatusStripProps {
  market: MarketRecord;
  updatedAt: string;
  dataStatus: 'loading' | 'ready' | 'error';
}

export function StatusStrip({ market, updatedAt, dataStatus }: StatusStripProps) {
  const marketAgeMinutes = Math.round((Date.now() - new Date(market.signal?.updatedAt ?? updatedAt).getTime()) / 60000);
  const stale = marketAgeMinutes > 30;
  return (
    <details className="status-disclosure">
      <summary>Source &amp; market status <span>{market.source === 'sample' ? 'Sample data' : 'Saved snapshot'}</span><span className="disclosure-mark" aria-hidden="true">+</span></summary>
      <section className="status-strip" aria-label="Pilot status">
      <div>
        <span className="live-badge"><span /> {market.status === 'active' ? 'Live pilot' : market.status}</span>
        <strong>{market.title}</strong>
        <span>{market.submissionCount} submissions · {market.decidedCount} decided</span>
      </div>
      <div>
        <span>Market state</span>
        <strong>{market.status === 'active' ? 'Open for trading and review' : market.status}</strong>
        {stale && <small className="stale-notice">Saved snapshot. Trading requests a fresh wallet quote.</small>}
      </div>
      <div>
        <span>Data freshness</span>
        <strong>{dataStatus === 'error' ? 'Snapshot reload failed' : market.signal ? `Snapshot ${new Date(market.signal.updatedAt).toLocaleString()}` : 'Archived source snapshot'}</strong>
        <small>Loaded {relativeTime(updatedAt)} · {market.source === 'sample' ? 'Deterministic sample' : 'Captured source data'}</small>
      </div>
      {marketImageFor(market) && <a className="source-evidence-link" href={marketImageFor(market)!} target="_blank" rel="noreferrer">Open source image <span aria-hidden="true">↗</span></a>}
      </section>
    </details>
  );
}
