import { marketArtwork } from '../data/artwork';
import type { Market } from '../data/types';

export function MarketArtwork({ market, compact = false }: { market: Market; compact?: boolean }) {
  const artwork = marketArtwork[market.artworkId];
  return (
    <figure className={`market-artwork${compact ? ' is-compact' : ''}`}>
      <img src={artwork.src} alt={artwork.alt} />
      {!compact && <figcaption>{market.token} market study</figcaption>}
    </figure>
  );
}
