import { useReducedMotion } from '../hooks/useReducedMotion';
import { useMemo, type CSSProperties } from 'react';
import { hazardAtHorizon, riskBand, survivalAtHorizon } from '../data/math';
import type { AssetRecord, UserEstimates } from '../data/types';
import { GroupGlyph } from './GroupGlyph';
import { useVisibility } from '../hooks/useVisibility';

interface HazardRainProps {
  assets: AssetRecord[];
  estimates: UserEstimates;
  horizon: number;
  onOpenAsset: (assetId: string) => void;
}

interface RainDrop {
  delay: number;
  duration: number;
  left: number;
  top: number;
}

export function HazardRain({ assets, estimates, horizon, onOpenAsset }: HazardRainProps) {
  const reducedMotion = useReducedMotion();
  const { ref, visible: inViewport } = useVisibility<HTMLElement>();
  const visible = assets.slice(0, 8);
  const drops = useMemo(() => {
    const output: RainDrop[] = [];
    if (reducedMotion || !inViewport) return output;
    visible.forEach((asset, assetIndex) => {
      const estimate = estimates[asset.id] ?? asset.pdAnn;
      const count = Math.max(1, Math.min(8, Math.round(estimate * 2.1)));
      for (let index = 0; index < count; index += 1) {
        const seed = (assetIndex + 1) * 37 + index * 19;
        output.push({
          delay: (seed % 170) / 100,
          duration: Math.max(.72, 1.9 - estimate * .045),
          left: (assetIndex + .22 + ((seed % 56) / 100)) / Math.max(1, visible.length) * 100,
          top: 8 + (seed % 67),
        });
      }
    });
    return output.slice(0, 64);
  }, [estimates, visible, reducedMotion, inViewport]);

  const expectedEvents = visible.reduce((total, asset) =>
    total + hazardAtHorizon(estimates[asset.id] ?? asset.pdAnn, horizon), 0);

  return <figure ref={ref} className="risk-hazard-rain">
    <figcaption>
      <div><p className="risk-kicker">Hazard Rain</p><h2>Defaults arrive as rare events.</h2></div>
      <p>Drop density follows each asset hazard. Depth keeps the shared severity scale.</p>
    </figcaption>
    <div className="risk-rain-stage" aria-label={`Hazard Rain for ${visible.map((asset) => asset.ticker).join(', ')}`}>
      <div className="risk-rain-zones" aria-hidden="true"><span>Low</span><span>Moderate</span><span>High</span><span>Critical</span></div>
      <div className="risk-rain-drops" aria-hidden="true">
        {drops.map((drop, index) => <i key={index} style={{ '--drop-delay': `${drop.delay}s`, '--drop-duration': `${drop.duration}s`, left: `${drop.left}%`, top: `${drop.top}%` } as CSSProperties} />)}
      </div>
      <div className="risk-rain-assets">
        {visible.map((asset) => {
          const estimate = estimates[asset.id] ?? asset.pdAnn;
          return <button key={asset.id} type="button" onClick={() => onOpenAsset(asset.id)} style={{ '--rain-offset': `${Math.min(22, estimate * 1.5)}px` } as CSSProperties} aria-label={`${asset.ticker}, ${riskBand(estimate)} risk, ${(survivalAtHorizon(estimate, horizon) * 100).toFixed(2)} percent survival. Open dossier`}>
            <GroupGlyph group={asset.group} size={17} /><strong>{asset.ticker}</strong><span>{riskBand(estimate)}</span>
          </button>;
        })}
      </div>
    </div>
    <figcaption className="risk-rain-readout"><span>Cumulative hazard</span><output>{expectedEvents.toFixed(3)}</output><small>{horizon} month model</small></figcaption>
  </figure>;
}
