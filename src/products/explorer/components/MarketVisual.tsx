import { useState } from 'react';
import type { Market } from '../types';

interface MarketVisualProps {
  market: Market;
  compact?: boolean;
}

export function MarketVisual({ market, compact = false }: MarketVisualProps) {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const image = market.provenance.origin !== 'illustrative-fixture' && market.image && failedImage !== market.image ? market.image : undefined;
  const avatar = image ?? market.subject.slice(0, 1).toUpperCase();
  return (
    <figure className={`market-visual ${compact ? 'is-compact' : ''}`} data-subject={market.subject.toLowerCase()}>
      {!compact && <div className={`market-avatar ${image ? 'has-image' : ''}`} aria-hidden="true">
        {image ? <img src={avatar} alt="" onError={() => setFailedImage(image!)} /> : avatar}
      </div>}
      {image ? (
        <img src={image} alt={market.imageAlt ?? market.question} loading="lazy" onError={() => setFailedImage(image)} />
      ) : (
        <div className="tonal-market-art" role="img" aria-label={`${market.subject} branching market artwork`}>
          <svg className="subject-branch" viewBox="0 0 320 180" aria-hidden="true">
            <path className="branch-trunk" d="M-12 90H108" />
            <path d="M108 90C150 90 160 30 214 30H332" />
            <path d="M108 90C156 90 170 60 222 60H332" />
            <path d="M108 90H332" />
            <path d="M108 90C156 90 170 120 222 120H332" />
            <path d="M108 90C150 90 160 150 214 150H332" />
          </svg>
          <strong aria-hidden="true">{market.subject.slice(0, 1).toUpperCase()}</strong>
        </div>
      )}
      <figcaption>{market.subject}</figcaption>
    </figure>
  );
}
