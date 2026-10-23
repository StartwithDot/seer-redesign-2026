import { useEffect, useState } from 'react';
import { marketAnalysis, type AnalysisData, type AnalysisMode } from '../data/analytics';
import type { PriceHistoryRange } from '../data/priceHistory';
import type { MarketRecord } from '../data/types';
import { AnalysisPlot } from './AnalysisPlot';

const modes: Array<[AnalysisMode, string]> = [['odds', 'Odds history'], ['coverage', 'Coverage'], ['ranks', 'Rank movement'], ['distribution', 'Price distribution']];
export function MarketAnalytics({ market }: { market: MarketRecord }) {
  const [mode, setMode] = useState<AnalysisMode>('odds');
  const [range, setRange] = useState<PriceHistoryRange>('24h');
  const [data, setData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    setData(null); setError('');
    const timer = window.setTimeout(() => {
      try { setData(marketAnalysis(market, mode, range)); }
      catch { setError('This evidence could not be analyzed. Retry to reload the chart.'); }
    }, 0);
    return () => clearTimeout(timer);
  }, [market, mode, range, retry]);
  return <section className="market-analytics" aria-label="Market analytics">
    <h3>Read the market signal</h3>
    <p>Prices guide attention. The sponsor retains the decision.</p>
    <div className="analysis-controls" role="group" aria-label="Analysis">{modes.map(([id, label]) => <button key={id} type="button" aria-pressed={mode === id} onClick={() => setMode(id)}>{label}</button>)}</div>
    {mode === 'odds' && <div className="analysis-controls" role="group" aria-label="History range">{(['24h', '7d', '30d'] as const).map(r => <button key={r} type="button" aria-pressed={range === r} onClick={() => setRange(r)}>{r}</button>)}</div>}
    <button type="button" className="text-action" onClick={() => { setMode('odds'); setRange('24h'); setRetry(r => r + 1); }}>Reset analysis</button>
    {error ? <div role="alert"><p>{error}</p><button type="button" onClick={() => setRetry(r => r + 1)}>Retry analysis</button></div> : !data ? <p role="status">Loading analysis…</p> : !data.lines.length ? <p role="status">No recorded priced outcomes for this market.</p> : <AnalysisPlot key={`${market.id}-${mode}-${range}-${retry}`} data={data} mode={mode}/>}
    {data && <p className="chart-note">{data.note}</p>}
  </section>;
}
