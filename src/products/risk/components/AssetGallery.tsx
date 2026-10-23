import type { AssetRecord } from '../data/types';
import { AssetTile } from './AssetTile';
import { isEstimateEdited } from '../data/prediction-state';

interface AssetGalleryProps {
  assets: AssetRecord[];
  estimates: Record<string, number>;
  onOpen: (assetId: string) => void;
  onToggle: (assetId: string) => void;
  selected: string[];
}

export function AssetGallery({ assets, estimates, onOpen, onToggle, selected }: AssetGalleryProps) {
  if (!assets.length) {
    return <div className="risk-gallery-empty"><strong>No assets match</strong><span>Change search or group filters.</span></div>;
  }
  return <div className="risk-asset-gallery">
    {assets.map((asset) => <AssetTile
      key={asset.id}
      asset={asset}
      edited={isEstimateEdited(asset, estimates)}
      estimate={estimates[asset.id]}
      onOpen={onOpen}
      onToggle={onToggle}
      selected={selected.includes(asset.id)}
    />)}
  </div>;
}
