import { useState } from 'react';
import { marketImageFor } from '../data/marketAssets';
import type { MarketRecord } from '../data/types';

const lightStudy = new URL('../assets/opportunity-light.webp', import.meta.url).href;
const darkStudy = new URL('../assets/opportunity-dark.webp', import.meta.url).href;

export function MarketArtwork({ market, compact = false }: { market: MarketRecord; compact?: boolean }) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  if (market.id === 'seer-ai-job-board-name') {
    return <div className="opportunity-artwork">
      <img className="opportunity-artwork-light" src={lightStudy} alt="A glass platform rises above a series of steps, the Opportunity Markets study from Seer’s landing." decoding="async" />
      <img className="opportunity-artwork-dark" src={darkStudy} alt="A glass platform rises above a series of steps, the Opportunity Markets study from Seer’s landing." decoding="async" />
    </div>;
  }
  const source = marketImageFor(market);
  if (source && failedSource !== source) return <img className="market-work-image" src={source} alt={`Submitted work for ${market.title}`} loading={compact ? 'lazy' : 'eager'} decoding="async" onError={() => setFailedSource(source)} />;
  return <div className="tonal-market-placeholder">
    <span aria-hidden="true">{market.title.slice(0, 1)}</span>
    <small>{source ? 'Image unavailable' : 'Sample market visual'}</small>
    {source && <a href={source} target="_blank" rel="noreferrer">Open original image ↗</a>}
  </div>;
}
