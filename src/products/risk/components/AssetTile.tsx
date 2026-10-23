import { useEffect, useRef, useState } from 'react';
import { annualToQuarterlyPd, formatPercent, pdAtHorizon } from '../data/math';
import type { AssetRecord } from '../data/types';
import { AssetBandGauge } from './AssetBandGauge';
import { AssetSparkline } from './AssetSparkline';
import { CheckIcon } from './Icons';
import { GroupGlyph } from './GroupGlyph';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { formatPdPercent } from '../data/format';
import { AssetPortrait } from './AssetPortrait';

interface AssetTileProps {
  asset: AssetRecord;
  edited?: boolean;
  estimate?: number;
  onOpen: (assetId: string) => void;
  onToggle: (assetId: string) => void;
  selected: boolean;
}

export function AssetTile({ asset, edited = false, estimate, onOpen, onToggle, selected }: AssetTileProps) {
  const tileRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const tile = tileRef.current;
    if (!tile) return;
    if (reducedMotion || typeof IntersectionObserver === 'undefined') { setVisible(true); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: '80px' });
    observer.observe(tile);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return <article
    ref={tileRef}
    className={`risk-asset-tile ${selected ? 'is-selected' : ''} ${visible ? 'is-visible' : ''} ${edited ? 'is-edited' : ''}`}
    data-group={asset.group}
  >
    <button className="risk-asset-tile-open" type="button" onClick={() => onOpen(asset.id)}>
      <span className="risk-asset-tile-head">
        <span className="risk-asset-identity-mark"><AssetPortrait asset={asset} /><GroupGlyph group={asset.group} size={12} /></span>
        <span><strong>{asset.ticker}</strong><small>{asset.name}</small></span>
        <span className="risk-grade-chip">{asset.grade || 'Not rated'}</span>
      </span>
      <span className="risk-asset-tile-values">
        <span><small>PD Ann.</small><strong>{formatPdPercent(asset.pdAnn)}</strong></span>
        <span><small>PD Quart.</small><strong>{formatPdPercent(annualToQuarterlyPd(asset.pdAnn))}</strong></span>
        <span><small>{edited ? 'Your PD' : 'PD at horizon'}</small><strong>{formatPercent(estimate ?? pdAtHorizon(asset.pdAnn, 12))}</strong></span>
      </span>
      <AssetSparkline asset={asset} />
      <AssetBandGauge asset={asset} />
    </button>
    <button
      className={`risk-asset-tile-select ${selected ? 'is-selected' : ''}`}
      type="button"
      aria-pressed={selected}
      aria-label={`${selected ? 'Remove' : 'Add'} ${asset.ticker} ${selected ? 'from' : 'to'} comparison`}
      onClick={() => onToggle(asset.id)}
    >
      {selected ? <CheckIcon /> : <span aria-hidden="true">+</span>}
    </button>
  </article>;
}
