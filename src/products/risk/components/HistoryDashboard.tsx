import { SourceDataPanel } from './SourceDataPanel';
import { useState } from 'react';
import type { AssetRecord, UserEstimates } from '../data/types';
import { HistoryChart, type HistoryMode, type HistoryRange } from './HistoryChart';
import { HistoryMovers } from './HistoryMovers';

interface HistoryDashboardProps {
  assets: AssetRecord[];
  estimates: UserEstimates;
}

export function HistoryDashboard({ assets, estimates }: HistoryDashboardProps) {
  const [mode, setMode] = useState<HistoryMode>('ridges');
  const [range, setRange] = useState<HistoryRange>('all');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState(0);

  return <div className="risk-history-dashboard">
    <HistoryMovers assets={assets} />
    <details className="risk-history-disclosure"><summary>Inspect historical chart</summary><HistoryChart
      assets={assets}
      estimates={estimates}
      mode={mode}
      onModeChange={setMode}
      onRangeChange={(nextRange) => { setRange(nextRange); setZoom(1); setPan(0); }}
      onZoomChange={setZoom}
      onPanChange={setPan}
      pan={pan}
      range={range}
      zoom={zoom}
    /></details>
    <SourceDataPanel />
  </div>;
}
