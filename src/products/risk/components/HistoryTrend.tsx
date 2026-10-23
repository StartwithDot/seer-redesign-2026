import { useState } from 'react';
import type { AssetRecord, UserEstimates } from '../data/types';
import { HistoryChart, type HistoryMode, type HistoryRange } from './HistoryChart';

export function HistoryTrend({ assets, estimates }: { assets: AssetRecord[]; estimates: UserEstimates }) {
  const [mode, setMode] = useState<HistoryMode>('ridges');
  const [range, setRange] = useState<HistoryRange>('all');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState(0);
  return <HistoryChart
    assets={assets}
    compact
    estimates={estimates}
    mode={mode}
    onModeChange={setMode}
    onRangeChange={(nextRange) => { setRange(nextRange); setZoom(1); setPan(0); }}
    onZoomChange={setZoom}
    onPanChange={setPan}
    pan={pan}
    range={range}
    zoom={zoom}
  />;
}
