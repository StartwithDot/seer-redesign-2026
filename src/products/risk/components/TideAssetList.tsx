import type { CSSProperties } from 'react';
import type { AssetRecord } from '../data/types';
import { hazardAtHorizon, riskBand, survivalAtHorizon } from '../data/math';
import { formatPdPercent } from '../data/format';
import { AssetPortrait } from './AssetPortrait';

const bands = [['Critical', '10–100%'], ['High', '5–10%'], ['Moderate', '2–5%'], ['Low', '0–2%']] as const;

export function TideAssetList({ assets, activeId, shares, hazardHighlight, horizon, animate, onPreview, onHover, onOpen }: {
  assets: AssetRecord[];
  activeId: string;
  shares: Record<string, number>;
  hazardHighlight: boolean;
  horizon: number;
  animate: boolean;
  onPreview: (id: string) => void;
  onHover: (id: string | null) => void;
  onOpen: (id: string) => void;
}) {
  return <div className="risk-tide-roster">
    <div className="risk-tide-roster-heading"><span>Assets by risk band</span><span>{hazardHighlight ? 'Share' : 'Annual PD'} · Survival</span></div>
    <div className="risk-tide-roster-scroll" tabIndex={0} role="region" aria-label="All selected assets by annual risk band">
      {bands.map(([band, range]) => {
        const rows = [...assets].filter(asset => riskBand(asset.pdAnn) === band).sort((a, b) => b.pdAnn - a.pdAnn);
        return rows.length > 0 && <section className={`risk-tide-band is-${band.toLowerCase()}`} key={band} aria-label={`${band} risk, ${range} annual probability of default`}>
          <h3><span>{band} <small>{rows.length}</small></span><span>{range}</span></h3>
          {rows.map(asset => <button className={`risk-tide-roster-asset ${asset.id === activeId ? 'is-active' : ''}`} key={asset.id} type="button" aria-pressed={asset.id === activeId}
            onClick={() => onPreview(asset.id)} onDoubleClick={() => onOpen(asset.id)} onMouseEnter={() => onHover(asset.id)} onMouseLeave={() => onHover(null)} onFocus={() => onPreview(asset.id)} onBlur={() => onHover(null)}
            onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); onOpen(asset.id); } }}
            title={`${asset.name}, ${asset.group}. ${(survivalAtHorizon(asset.pdAnn, horizon) * 100).toFixed(2)}% survival at ${horizon} months. Select to preview; Enter opens details.`}>
            <span className="risk-tide-roster-identity"><AssetPortrait asset={asset} /><strong>{asset.ticker}</strong></span>
            <span className="risk-tide-roster-value"><i className="risk-tide-roster-buoy" aria-hidden="true">{animate && <i className="risk-tide-roster-spark" style={{ '--spark-period': `${Math.max(1, 1 / Math.max(.00001, hazardAtHorizon(asset.pdAnn, horizon)))}s` } as CSSProperties} />}</i>{hazardHighlight ? `${((shares[asset.id] || 0) * 100).toFixed(1)}%` : formatPdPercent(asset.pdAnn)}<small>{(survivalAtHorizon(asset.pdAnn, horizon) * 100).toFixed(1)}%</small></span>
          </button>)}
        </section>;
      })}
    </div>
  </div>;
}
