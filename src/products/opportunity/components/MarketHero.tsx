import type { MarketRecord } from '../data/types';
import { MarketArtwork } from './MarketArtwork';

interface MarketHeroProps {
  market: MarketRecord;
  onOpenReview: () => void;
  onOpenProtocol: () => void;
}

export function MarketHero({ market, onOpenReview, onOpenProtocol }: MarketHeroProps) {
  const pilot = market.id === 'seer-ai-job-board-name';
  return (
    <section className="market-hero" aria-labelledby="market-title">
      <div className="market-hero-copy">
        <div className="market-badges">
          <span className="live-badge"><span /> {market.status === 'active' ? 'Trading open' : market.status}</span>
          <span className={market.source === 'sample' ? 'sample-badge' : 'verified-badge'}>
            {market.source === 'sample' ? 'Sample market' : market.signal ? `Snapshot · ${new Date(market.signal.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}` : 'Archived source record'}
          </span>
        </div>
        <p className="market-eyebrow">{market.creator} · {market.kind} · {market.network} · {market.collateral}</p>
        <h1 id="market-title">{pilot ? <>Name Seer’s<br />AI job board.</> : market.title}</h1>
        <p className="market-description">{market.description}</p>
        <div className="market-actions">
          <button className="primary-action" type="button" onClick={onOpenReview}>
            Explore submissions <span aria-hidden="true">→</span>
          </button>
          <button className="text-action" type="button" onClick={onOpenProtocol}>
            How it works <span aria-hidden="true">↗</span>
          </button>
        </div>
        <dl className="market-quick-stats">
          <div><dt>Submissions</dt><dd>{market.submissionCount}</dd><small>{market.decidedCount} decided</small></div>
          <div><dt>Market volume</dt><dd>{market.volumeUsd ? `$${market.volumeUsd.toLocaleString()}` : 'Unavailable'}</dd><small>recorded total</small></div>
          <div><dt>Market depth</dt><dd>{market.liquidityUsd ? `$${market.liquidityUsd.toLocaleString()}` : 'No pool'}</dd><small>aggregate recorded liquidity</small></div>
        </dl>
      </div>
      <figure className={`market-evidence ${pilot ? 'market-evidence--sculpture' : ''}`}>
        <MarketArtwork market={market} />
        <figcaption>
          <span>{pilot ? 'Opportunity Markets' : market.source === 'sample' ? 'Sample market' : 'Submitted work'}</span>
          <strong>{pilot ? 'Bring promising work to the surface.' : 'The work behind the market.'}</strong>
        </figcaption>
      </figure>
    </section>
  );
}
