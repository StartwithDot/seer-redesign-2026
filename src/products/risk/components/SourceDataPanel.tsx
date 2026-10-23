import { useState } from 'react';
import { POOL_SERIES } from '../data/pool-history';
import { downloadTextFile } from '../data/prediction-csv';
import { PoolSeriesInspector } from './PoolSeriesInspector';
import { MarketRecordPanel } from './MarketRecordPanel';

export function SourceDataPanel({ ticker }: { ticker?: string }) {
  const [notice, setNotice] = useState('');
  const series = POOL_SERIES.filter((entry) => !ticker || entry.ticker?.toLowerCase() === ticker.toLowerCase());
  const exportSource = () => {
    try {
      downloadTextFile('seer-risk-pool-source.json', JSON.stringify(series, null, 2), 'application/json');
      setNotice('Original pool fields exported, including exact token prices and liquidity.');
    } catch { setNotice('Download unavailable. The source fields remain visible below.'); }
  };
  return <details className="risk-source-data">
    <summary>Inspect saved market data{ticker ? ` · ${ticker}` : ' · 35 API series'}</summary>
    <p>33 asset series, one No to All series, and one empty API series. Pool observations are from August 2026. These are saved prices, not a live feed.</p>
    <p>Annual PD = 1 − (1 − pool price)⁴. Asset histories are scaled so their final point equals the saved market estimate. No to All is an independently traded survival outcome; it is not an asset default estimate.</p>
    <button type="button" className="risk-secondary-button" onClick={exportSource}>Export original pool fields</button>
    <p role="status">{notice}</p>
    <div className="risk-source-series">
      {series.map(entry => <PoolSeriesInspector key={entry.index} entry={entry} />)}
    </div>
    <MarketRecordPanel />
  </details>;
}
