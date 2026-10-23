import { useMemo, useState } from 'react';
import { survivalAtHorizon } from '../data/math';
import type { AssetRecord } from '../data/types';

interface AssetSparklineProps {
  asset: AssetRecord;
  compact?: boolean;
}

export function AssetSparkline({ asset, compact = false }: AssetSparklineProps) {
  const [replayKey, setReplayKey] = useState(0);
  const curve = useMemo(() => Array.from({ length: 25 }, (_, index) =>
    survivalAtHorizon(asset.pdAnn, index / 2)), [asset.pdAnn]);
  const spread = Math.max(.01, 1 - curve[curve.length - 1]);
  const y = (survival: number) => 3 + (1 - survival) / spread * 34;
  const path = curve.map((survival, index) =>
    `${index ? 'L' : 'M'} ${(3 + index / 24 * 114).toFixed(2)} ${y(survival).toFixed(2)}`).join(' ');
  const endY = y(curve[curve.length - 1]);

  return <svg
    className={`risk-asset-sparkline ${compact ? 'is-compact' : ''}`}
    viewBox="0 0 120 42"
    role="img"
    aria-label={`${asset.ticker} projected survival from now to 12 months, ending at ${(curve.at(-1)! * 100).toFixed(3)} percent. Each curve uses its own vertical range.`}
    onMouseEnter={() => setReplayKey((key) => key + 1)}
  >
    <path className="risk-asset-sparkline-grid" d="M3 36.5 H117" />
    <path key={`${asset.id}-${replayKey}`} className="risk-asset-sparkline-path" d={path} pathLength={1} />
    <circle cx="117" cy={endY} r="2.5" />
  </svg>;
}
