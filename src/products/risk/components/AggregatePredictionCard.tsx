import { RollingNumber } from './RollingNumber';
import { useEffect, useMemo, useState } from 'react';
import { portfolioSurvival, portfolioSurvivalFromEstimates, scaleEstimatesToPortfolioSurvival } from '../data/math';
import { editedAssetIds } from '../data/prediction-state';
import { formatSignedPoints } from '../data/format';
import type { AssetRecord, UserEstimates } from '../data/types';

interface AggregatePredictionCardProps {
  assets: AssetRecord[];
  estimates: UserEstimates;
  onReset: () => void;
  onEstimatesChange: (estimates: UserEstimates) => void;
}

export function AggregatePredictionCard({ assets, estimates, onEstimatesChange, onReset }: AggregatePredictionCardProps) {
  const [finePointer, setFinePointer] = useState(true);
  const marketSurvival = portfolioSurvival(assets, 12) * 100;
  const userSurvival = portfolioSurvivalFromEstimates(assets, estimates, 12) * 100;
  const target = Math.min(100, Math.max(0, Math.round(userSurvival * 100) / 100));
  const targetQuarterly = Math.pow(target / 100, .25) * 100;
  const marketQuarterly = Math.pow(marketSurvival / 100, .25) * 100;
  const editedCount = editedAssetIds(assets, estimates).length;

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)');
    const sync = () => setFinePointer(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  const rescale = useMemo(() => (value: number) => {
    const scaled = scaleEstimatesToPortfolioSurvival(assets, estimates, value);
    onEstimatesChange({ ...estimates, ...scaled });
  }, [assets, estimates, onEstimatesChange]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const changes: Record<string, number> = {
      PageUp: 1,
      PageDown: -1,
      Home: -target,
      End: 100 - target,
    };
    const change = changes[event.key];
    if (change === undefined) return;
    event.preventDefault();
    const next = Math.min(100, Math.max(0, target + change));
    event.currentTarget.value = String(next);
    rescale(next);
  };

  return <section className="risk-aggregate-prediction" aria-labelledby="risk-no-to-all-title">
    <header>
      <div><p className="risk-kicker">NO TO ALL</p><h3 id="risk-no-to-all-title">Chance no listed asset defaults.</h3></div>
      <span>{editedCount ? `${editedCount} estimates shaped this view` : 'Market estimate'}</span>
    </header>
    <div className="risk-aggregate-prediction-values">
      <div><small>Your Ann.</small><strong><RollingNumber value={target} suffix="%" /></strong></div>
      <div><small>Your Quart.</small><strong><RollingNumber value={targetQuarterly} suffix="%" /></strong></div>
      <div><small>Market Ann.</small><strong><RollingNumber value={marketSurvival} suffix="%" /></strong></div>
      <div><small>Market Quart.</small><strong><RollingNumber value={marketQuarterly} suffix="%" /></strong></div>
      <div><small>Delta Ann.</small><strong>{formatSignedPoints(target - marketSurvival)}</strong></div>
      <div><small>Delta Quart.</small><strong>{formatSignedPoints(targetQuarterly - marketQuarterly)}</strong></div>
    </div>
    <label className="risk-aggregate-slider">
      <span>Aggregate chance, 0 to 100</span>
      <input
        disabled={!assets.length}
        type="range"
        min="0"
        max="100"
        step={finePointer ? '.01' : '1'}
        value={target}
        aria-valuetext={`${target.toFixed(1)} percent chance no listed asset defaults`}
        onChange={(event) => rescale(Number(event.target.value))}
        onKeyDown={onKeyDown}
      />
      <span className="risk-slider-scale" aria-hidden="true"><b>0%</b><b>25%</b><b>50%</b><b>75%</b><b>100%</b></span>
    </label>
    {editedCount > 0 && <button className="risk-text-button risk-aggregate-reset" type="button" onClick={onReset}>Reset aggregate to market estimates</button>}
  </section>;
}
