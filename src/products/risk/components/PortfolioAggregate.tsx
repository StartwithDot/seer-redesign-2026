import { useState, type CSSProperties } from 'react';
import { hazardShares, portfolioSurvival, portfolioSurvivalFromEstimates } from '../data/math';
import { formatPdPercent } from '../data/format';
import type { AssetRecord, UserEstimates } from '../data/types';
import { RollingNumber } from './RollingNumber';
import { ArrowUpRight } from './Icons';

const sculpture = new URL('../../../../public/img/app_risk.webp', import.meta.url).href;

export function AggregateGauge({ assets, estimates, hazardHighlight, horizon, onToggleHazard }: {
  assets: AssetRecord[];
  estimates: UserEstimates;
  hazardHighlight: boolean;
  horizon: number;
  onToggleHazard: () => void;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const survival = portfolioSurvival(assets, horizon);
  const comparisonHorizon = horizon === 3 ? 12 : 3;
  const comparisonSurvival = portfolioSurvival(assets, comparisonHorizon);
  const hasEdits = assets.some(asset => estimates[asset.id] !== undefined);
  const annualSurvival = portfolioSurvival(assets, 12);
  const quarterlySurvival = portfolioSurvival(assets, 3);
  const shares = hazardShares(assets, horizon);
  const leaders = [...assets].sort((a, b) => (shares[b.id] || 0) - (shares[a.id] || 0)).slice(0, 3);

  return <figure className="risk-portfolio-aggregate">
    <div className="risk-portfolio-value" title={`Chance that no selected asset defaults: ${(annualSurvival * 100).toFixed(2)}% annual; ${(quarterlySurvival * 100).toFixed(2)}% quarterly`}>
      <span>Chance no selected asset defaults</span>
      <strong><RollingNumber value={survival * 100} suffix="%" /></strong>
      <span className="risk-portfolio-horizon">{horizon === 12 ? 'Annual' : horizon === 3 ? 'Quarterly' : `${horizon} months`} · {assets.length} {assets.length === 1 ? 'asset' : 'assets'}</span>
      <div className="risk-portfolio-comparison">
        <span><b>{(comparisonSurvival * 100).toFixed(2)}%</b> {comparisonHorizon === 12 ? 'annual' : 'quarterly'}</span>
        {hasEdits && <span className="is-user"><b>{(portfolioSurvivalFromEstimates(assets, estimates, horizon) * 100).toFixed(2)}%</b> your estimate</span>}
      </div>
    </div>
    <div className={`risk-portfolio-sculpture ${imageFailed ? 'is-fallback' : ''}`} aria-hidden="true">
      {!imageFailed && <img src={sculpture} alt="" width="480" height="360" fetchPriority="high" onError={() => setImageFailed(true)} />}
      {imageFailed && <svg viewBox="0 0 240 240"><circle cx="120" cy="120" r="92" fill="none" stroke="var(--product-surface-soft)" strokeWidth="12" /><circle cx="120" cy="120" r="92" fill="none" stroke="var(--risk-violet)" strokeWidth="12" strokeDasharray={`${survival * 578} 578`} transform="rotate(-90 120 120)" /><path d="M120 120 170 65" stroke="var(--product-secondary)" strokeWidth="2" /></svg>}
    </div>
    <figcaption className="risk-hazard-leaders">
      <div className="risk-hazard-heading"><span>Largest hazard contributions</span><button className="risk-inline-button" type="button" aria-pressed={hazardHighlight} onClick={onToggleHazard}>{hazardHighlight ? 'Show survival' : 'Show shares'}<ArrowUpRight size={16} /></button></div>
      {leaders.map(asset => <div className="risk-hazard-leader" key={asset.id}>
        <strong>{asset.ticker}</strong><span className="risk-hazard-track" aria-hidden="true"><i style={{ '--risk-share': `${(shares[asset.id] || 0) * 100}%` } as CSSProperties} /></span><b>{((shares[asset.id] || 0) * 100).toFixed(1)}%</b><small>{formatPdPercent(asset.pdAnn)} PD</small>
      </div>)}
    </figcaption>
  </figure>;
}
