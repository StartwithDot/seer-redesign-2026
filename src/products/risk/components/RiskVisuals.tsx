import { useEffect, useRef, useState } from 'react';
import {
  riskBand,
  scalePd,
  survivalAtHorizon,
} from '../data/math';
import type { AssetRecord, RiskBand, UserEstimates } from '../data/types';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { formatPdPercent } from '../data/format';
export { AggregateGauge } from './PortfolioAggregate';
export { RiskBars } from './RiskBars';

export function RiskBandLadder({ activeAsset, assets, estimates, selected }: { activeAsset: AssetRecord | null; assets: AssetRecord[]; estimates: UserEstimates; selected: string[]; }) {
  const reducedMotion = useReducedMotion();
  const visible = selected.length ? assets.filter((asset) => selected.includes(asset.id)) : assets;
  const userEstimate = activeAsset ? estimates[activeAsset.id] : undefined;
  const previousEstimate = useRef<number | null>(null);
  const previousBand = useRef<RiskBand | null>(null);
  const previousAssetId = useRef(activeAsset?.id);
  const sweepKey = useRef(0);
  const [sweep, setSweep] = useState<{ band: RiskBand; key: number; left: number; width: number } | null>(null);

  useEffect(() => {
    if (previousAssetId.current !== activeAsset?.id) {
      previousAssetId.current = activeAsset?.id;
      previousEstimate.current = null;
      previousBand.current = null;
      setSweep(null);
    }
    if (reducedMotion) { setSweep(null); previousEstimate.current = userEstimate ?? null; previousBand.current = userEstimate === undefined ? null : riskBand(userEstimate); return; }
    if (userEstimate === undefined) return;
    const nextBand = riskBand(userEstimate);
    if (previousEstimate.current !== null && previousBand.current && previousBand.current !== nextBand) {
      const start = scalePd(previousEstimate.current);
      const end = scalePd(userEstimate);
      sweepKey.current += 1;
      setSweep({ band: nextBand, key: sweepKey.current, left: Math.min(start, end), width: Math.max(2, Math.abs(end - start)) });
    }
    previousEstimate.current = userEstimate;
    previousBand.current = nextBand;
  }, [activeAsset?.id, userEstimate, reducedMotion]);

  return <div className="risk-band-panel">
    <div className="risk-band-heading">
      <h2>Annual risk bands</h2>
    </div>
    <div className="risk-band-ladder" aria-label="Probability of Default risk bands">
      {[
        ['Low', '0-2%', 'dense'],
        ['Moderate', '2-5%', 'line'],
        ['High', '5-10%', 'dot'],
        ['Critical', '10-100%', 'cross'],
      ].map(([label, range, pattern]) => <div key={label} className={`risk-band-zone is-${pattern}`}>
        <strong>{label}</strong><span>{range}</span>
      </div>)}
      {visible.map((asset) => <span key={asset.id} className={`risk-band-marker is-${riskBand(asset.pdAnn).toLowerCase()}`} style={{ left: `${scalePd(asset.pdAnn)}%` }} title={`${asset.ticker}: ${asset.pdAnn.toFixed(2)}% PD Ann.`}>
        <span className="sr-only">{asset.ticker}</span>
      </span>)}
      {sweep && <span key={sweep.key} className={`risk-band-sweep is-${sweep.band.toLowerCase()}`} style={{ left: `${sweep.left}%`, width: `${sweep.width}%` }} aria-hidden="true" />}
      {activeAsset && <span className="risk-band-pin is-market" style={{ left: `${scalePd(activeAsset.pdAnn)}%` }} title={`${activeAsset.ticker} market ${formatPdPercent(activeAsset.pdAnn)}`}><span className="sr-only">{activeAsset.ticker} market</span></span>}
      {activeAsset && userEstimate !== undefined && <span className="risk-band-pin is-user" style={{ left: `${scalePd(userEstimate)}%` }} title={`${activeAsset.ticker} your estimate ${formatPdPercent(userEstimate)}`}><span className="sr-only">{activeAsset.ticker} yours</span></span>}
    </div>
    <div className="risk-band-axis" aria-hidden="true"><span>0%</span><span>2%</span><span>5%</span><span>10%</span><span>100%</span></div>
    {activeAsset && <div className="risk-band-comparison"><span>{activeAsset.ticker} market <strong>{formatPdPercent(activeAsset.pdAnn)}</strong></span>{userEstimate !== undefined && <span className="is-user">Your estimate <strong>{formatPdPercent(userEstimate)}</strong></span>}</div>}
  </div>;
}

export function SurvivalReadout({ assets, horizon }: { assets: AssetRecord[]; horizon: number; }) {
  return <div className="risk-survival-readout">
    {assets.slice(0, 4).map((asset) => <div key={asset.id}>
      <span>{asset.ticker}</span>
      <strong>{(survivalAtHorizon(asset.pdAnn, horizon) * 100).toFixed(2)}%</strong>
      <small>survival at {horizon}m</small>
    </div>)}
  </div>;
}
