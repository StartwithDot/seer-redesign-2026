import type { KeyboardEvent } from 'react';
import { formatPdPercent, formatSignedPoints } from '../data/format';
import { annualToQuarterlyPd, predictionSliderPd, predictionSliderValue, riskBand, scalePd } from '../data/math';
import type { AssetRecord } from '../data/types';
import { CheckIcon, ChevronIcon, InfoIcon } from './Icons';

interface PredictionRowProps {
  asset: AssetRecord;
  edited: boolean;
  expanded: boolean;
  estimate: number;
  onDetails: (assetId: string) => void;
  onEstimateChange: (assetId: string, value: number) => void;
  onToggle: (assetId: string) => void;
}

export function PredictionRow({ asset, edited, expanded, estimate, onDetails, onEstimateChange, onToggle }: PredictionRowProps) {
  const sliderValue = predictionSliderValue(estimate);
  const delta = estimate - asset.pdAnn;
  const detailsId = `prediction-details-${asset.id}`;

  const onSliderKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const changes: Record<string, number> = {
      ArrowUp: 1,
      ArrowRight: 1,
      ArrowDown: -1,
      ArrowLeft: -1,
      PageUp: 100,
      PageDown: -100,
      Home: -sliderValue,
      End: 1000 - sliderValue,
    };
    const change = changes[event.key];
    if (change === undefined) return;
    event.preventDefault();
    const next = Math.min(1000, Math.max(0, sliderValue + change));
    onEstimateChange(asset.id, Number(predictionSliderPd(next).toFixed(4)));
  };

  return <article className={`risk-prediction-row ${edited ? 'is-edited' : ''} ${expanded ? 'is-expanded' : ''}`}>
    <div className="risk-prediction-row-header">
      <button className="risk-prediction-row-toggle" type="button" aria-expanded={expanded} aria-controls={detailsId} onClick={() => onToggle(asset.id)}>
        <span className={`risk-prediction-state ${edited ? 'is-edited' : ''}`} aria-label={edited ? 'Edited estimate' : 'Market estimate'}>
          {edited ? <CheckIcon size={14} /> : <span aria-hidden="true">−</span>}
        </span>
        <span className="risk-prediction-identity">
          <strong>{asset.ticker}</strong>
          <small>{formatPdPercent(asset.pdAnn)} market</small>
        </span>
        <span className="risk-prediction-market">{formatPdPercent(asset.pdAnn)} <small>Ann.</small></span>
        <ChevronIcon size={17} />
      </button>
      <button className="risk-inline-button risk-prediction-details-button" type="button" onClick={() => onDetails(asset.id)}>
        <InfoIcon size={15} /> Details
      </button>
    </div>
    {expanded && <div className="risk-prediction-row-details" id={detailsId}>
      <dl className="risk-prediction-metrics">
        <div><dt>Market PD Ann.</dt><dd>{formatPdPercent(asset.pdAnn)}</dd></div>
        <div><dt>Market PD Quart.</dt><dd>{formatPdPercent(annualToQuarterlyPd(asset.pdAnn))}</dd></div>
        <div><dt>Your PD Ann.</dt><dd><strong>{formatPdPercent(estimate)}</strong></dd></div>
        <div><dt>Delta</dt><dd className={delta > 0 ? 'is-positive' : delta < 0 ? 'is-negative' : ''}>{formatSignedPoints(delta)}</dd></div>
      </dl>
      <label className="risk-prediction-slider">
        <span>Your annual probability of default</span>
        <input
          type="range"
          min="0"
          max="1000"
          step="1"
          value={sliderValue}
          aria-label={`${asset.ticker} annual probability of default`}
          aria-valuetext={`${formatPdPercent(estimate)} annual probability of default`}
          onChange={(event) => onEstimateChange(asset.id, Number(predictionSliderPd(Number(event.target.value)).toFixed(4)))}
          onKeyDown={onSliderKeyDown}
        />
        <span className="risk-prediction-slider-scale" aria-hidden="true"><b>0%</b><b>2%</b><b>5%</b><b>10%</b><b>100%</b></span>
      </label>
      <div className="risk-prediction-band">
        <span className="risk-band-track" aria-label={`${riskBand(estimate)} risk band`}>
          <i style={{ left: `${scalePd(estimate)}%` }} />
        </span>
        <small>{riskBand(estimate)} · {formatPdPercent(annualToQuarterlyPd(estimate))} Quart.</small>
      </div>
    </div>}
  </article>;
}
