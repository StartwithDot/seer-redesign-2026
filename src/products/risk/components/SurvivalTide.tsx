import { useMemo, useState, type ReactNode } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useVisibility } from '../hooks/useVisibility';
import { tideCurves } from '../data/tide';
import { hazardShares, portfolioSurvival, portfolioSurvivalFromEstimates } from '../data/math';
import type { AssetRecord, UserEstimates } from '../data/types';
import { AssetPreviewCard } from './AssetPreviewCard';
import { SurvivalCurve } from './SurvivalCurve';
import { TideAssetList } from './TideAssetList';

interface Props {
  assets: AssetRecord[];
  estimates: UserEstimates;
  hazardHighlight: boolean;
  horizon: number;
  onOpenAsset: (id: string) => void;
  onPreviewAsset: (id: string | null) => void;
  previewAssetId: string | null;
  controls?: ReactNode;
}

export function SurvivalTide({ assets, estimates, hazardHighlight, horizon, onOpenAsset, onPreviewAsset, previewAssetId, controls }: Props) {
  const reducedMotion = useReducedMotion();
  const { ref, visible } = useVisibility<HTMLElement>();
  const [hoveredAssetId, setHoveredAssetId] = useState<string | null>(null);
  const activeAsset = assets.find(asset => asset.id === (hoveredAssetId || previewAssetId)) || [...assets].sort((a, b) => b.pdAnn - a.pdAnn)[0];
  const shares = useMemo(() => hazardShares(assets, horizon), [assets, horizon]);
  const curves = useMemo(() => tideCurves(assets, estimates, horizon), [assets, estimates, horizon]);
  const hasEdits = assets.some(asset => estimates[asset.id] !== undefined);

  return <div className="risk-tide-layout">
    <figure ref={ref} className="risk-survival-tide">
      <figcaption><h2>Survival over time</h2>{controls}</figcaption>
      <div className="risk-tide-body">
        <SurvivalCurve market={curves.market} user={curves.user} ghosts={curves.ghosts} horizon={horizon} hasEdits={hasEdits} />
        {activeAsset && <TideAssetList assets={assets} activeId={activeAsset.id} shares={shares} hazardHighlight={hazardHighlight} horizon={horizon} animate={visible && !reducedMotion} onPreview={onPreviewAsset} onHover={setHoveredAssetId} onOpen={onOpenAsset} />}
      </div>
    </figure>
    {activeAsset && <AssetPreviewCard asset={activeAsset} estimate={estimates[activeAsset.id]} hazardShare={shares[activeAsset.id] || 0} onOpen={() => onOpenAsset(activeAsset.id)} />}
  </div>;
}

export { portfolioSurvival, portfolioSurvivalFromEstimates };
