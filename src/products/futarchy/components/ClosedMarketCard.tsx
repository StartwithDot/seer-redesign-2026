import { marketArtwork } from '../data/artwork';
import { compactMoney, dateLabel, exactPrice, signedPercent } from '../data/format';
import type { Market } from '../data/types';

function WinningFork({ outcome }: { outcome: Market['resolvedOutcome'] }) {
  return (
    <svg className="winning-fork" viewBox="0 0 52 28" aria-label="Winning outcome fork">
      <path d="M2 14h18c7 0 7-9 14-9h16" />
      <path d="M20 14c7 0 7 9 14 9h16" />
      <circle cx="50" cy={outcome === 'no' ? 23 : 5} r="3" />
    </svg>
  );
}

interface ClosedMarketCardProps {
  market: Market;
  organizationName: string;
  onNavigate: (hash: string) => void;
}

export function ClosedMarketCard({ market, organizationName, onNavigate }: ClosedMarketCardProps) {
  const artwork = marketArtwork[market.artworkId];
  return (
    <article className="closed-market-card">
      <figure className="closed-market-art">
        <img src={artwork.src} alt="" loading="lazy" />
        <span className={`token-mark token-${market.token.toLowerCase()}`}>{market.token.slice(0, 1)}</span>
      </figure>
      <header>
        <div><strong>{market.proposal}</strong><span>{market.token} · {organizationName} · {market.chain}</span></div>
        <span className="status-chip status-resolved">Resolved</span>
      </header>
      <button type="button" onClick={() => onNavigate(`#/m/${market.id}`)}>{market.question}</button>
      <dl>
        <div><dt>Outcome</dt><dd className={`outcome-${market.resolvedOutcome}`}>{market.resolvedOutcome?.toUpperCase()}</dd></div>
        <div><dt>Result</dt><dd>{market.finalResult === 'approved' ? 'Approved' : 'Rejected'}</dd></div>
        <div><dt>Impact</dt><dd className={market.impact >= 0 ? 'positive' : 'negative'}>{signedPercent(market.impact)}</dd></div>
      </dl>
      <footer>
        <span>{market.yesPrice ? exactPrice(market.yesPrice, market.collateral) : 'No close price'}</span>
        <span>{compactMoney(market.volume)} volume</span>
        <span>{dateLabel(market.resolutionDate)}</span>
        <WinningFork outcome={market.resolvedOutcome} />
      </footer>
    </article>
  );
}
