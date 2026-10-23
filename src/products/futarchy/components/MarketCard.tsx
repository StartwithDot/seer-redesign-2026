import { compactMoney, countdownLabel, dateLabel, exactPrice, signedPercent } from '../data/format';
import { marketArtwork } from '../data/artwork';
import type { Market } from '../data/types';
import { MarketAvatar } from './MarketAvatar';

const verdictLabel = {
  include: 'Include',
  neutral: 'Neutral',
  exclude: 'Exclude',
} as const;

interface MarketCardProps {
  market: Market;
  organizationName: string;
  now: number;
  onNavigate: (hash: string) => void;
}

export function MarketCard({ market, organizationName, now, onNavigate }: MarketCardProps) {
  const artwork = marketArtwork[market.artworkId];
  return (
    <article className="market-card">
      <figure className="market-card-art">
        <img src={artwork.src} alt="" loading="lazy" />
        <MarketAvatar market={market} />
      </figure>
      <div className="market-card-top">
        <div>
          <strong>{market.proposal}</strong>
          <span>{market.token} · {organizationName} · {market.chain}</span>
        </div>
        <div className="market-card-status">
          <span className={`status-chip status-${market.status}`}>{market.status === 'active' ? 'Active' : market.status === 'awaiting' ? 'Awaiting' : 'Resolved'}</span>
          <small>{countdownLabel(market.closesAt, now)}</small>
        </div>
      </div>
      <button className="market-card-question" type="button" onClick={() => onNavigate(`#/m/${market.id}`)}>
        {market.question}
      </button>
      <div className="market-prices">
        <span><small>YES PRICE</small><strong>{exactPrice(market.yesPrice, market.collateral)}</strong></span>
        <span><small>NO PRICE</small><strong>{exactPrice(market.noPrice, market.collateral)}</strong></span>
        <span><small>IMPACT</small><strong className={market.impact > 0 ? 'positive' : market.impact < 0 ? 'negative' : ''}>{signedPercent(market.impact)}</strong></span>
      </div>
      <footer>
        <span>{compactMoney(market.volume)} volume</span>
        <span>{market.status === 'resolved' ? `Ended ${dateLabel(market.closesAt)}` : `Closes ${dateLabel(market.closesAt)}`}</span>
        <strong className={`verdict verdict-${market.verdict}`}>{verdictLabel[market.verdict]}</strong>
      </footer>
    </article>
  );
}
