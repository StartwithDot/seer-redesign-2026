import { useState } from 'react';
import { ASSET_IMAGES } from '../data/imagery';
import type { AssetRecord } from '../data/types';

export function AssetPortrait({ asset }: { asset: AssetRecord }) {
  const [failed, setFailed] = useState(false);
  const src = ASSET_IMAGES[asset.id];
  return <span className={`risk-asset-portrait is-${asset.group.split(' ')[0].toLowerCase()}`} aria-hidden="true">
    {src && !failed ? <img src={src} alt="" width={48} height={48} loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(true)} /> : asset.ticker.slice(0, 2)}
  </span>;
}
