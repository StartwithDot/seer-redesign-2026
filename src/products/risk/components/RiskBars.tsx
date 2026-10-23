import type { AssetRecord, UserEstimates } from '../data/types';
import { annualToQuarterlyPd, hazardShares, pdAtHorizon, riskBand, scalePd } from '../data/math';
import { formatPdPercent } from '../data/format';
import { AssetPortrait } from './AssetPortrait';

export function RiskBars({ assets, estimates = {}, hazardHighlight, horizon, selected, onPreviewAsset, onOpenAsset, previewAssetId }: {
  assets: AssetRecord[];
  estimates?: UserEstimates;
  hazardHighlight: boolean;
  horizon: number;
  selected: string[];
  onPreviewAsset?: (id: string) => void;
  onOpenAsset?: (id: string) => void;
  previewAssetId?: string;
}) {
  const visible = [...(selected.length ? assets.filter(asset => selected.includes(asset.id)) : assets)].sort((a, b) => b.pdAnn - a.pdAnn);
  const shares = hazardShares(visible, horizon);
  return <section className={`risk-bars ${hazardHighlight ? 'is-hazard-highlight' : ''}`} aria-label="Asset probability of default ranking">
    <header className="risk-bars-heading"><h2>Asset risk</h2><span>Chance of default · {horizon} months</span></header>
    <div className="risk-bar-scroll" tabIndex={0} role="region" aria-label="All selected asset risk bars">
      <div className="risk-bar-scale-row" aria-hidden="true"><div className="risk-bar-axis"><span>0%</span><span>2%</span><span>5%</span><span>10%</span><span>100%</span></div></div>
      {visible.map(asset => <div className={`risk-bar-row ${asset.id === previewAssetId ? 'is-active' : ''}`} key={asset.id}>
        <button className="risk-bar-identity" type="button" onClick={() => onPreviewAsset?.(asset.id)} onDoubleClick={() => onOpenAsset?.(asset.id)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); onOpenAsset?.(asset.id); } }} aria-pressed={asset.id === previewAssetId} title={`${asset.name}. Select to preview; Enter opens details.`}>
          <AssetPortrait asset={asset} /><strong>{asset.ticker}</strong>
        </button>
        <div className="risk-bar-track"><span style={{ width: `${Math.max(.3, scalePd(pdAtHorizon(asset.pdAnn, horizon)))}%` }} />{estimates[asset.id] !== undefined && <i className="risk-bar-user-marker" style={{ left: `${scalePd(pdAtHorizon(estimates[asset.id], horizon))}%` }} aria-label={`${asset.ticker} your estimate ${formatPdPercent(pdAtHorizon(estimates[asset.id], horizon))}`} />}</div>
        <span className="risk-bar-values" title={`${formatPdPercent(asset.pdAnn)} annual; ${formatPdPercent(annualToQuarterlyPd(asset.pdAnn))} quarterly`}><b>{formatPdPercent(pdAtHorizon(asset.pdAnn, horizon))}</b></span>
        <small>{hazardHighlight ? `${((shares[asset.id] || 0) * 100).toFixed(1)}% share` : riskBand(asset.pdAnn)}</small>
      </div>)}
    </div>
  </section>;
}
