import { useId, useMemo, useState } from 'react';
import type { ExplorerMarket } from '../data/explorer';
import { outcomeValue, timestamp } from '../data/format';

type Range = '1D' | '1W' | '1M' | 'All' | 'Custom';
export function EntityHistoryChart({ market }: { market: ExplorerMarket }) {
  const chartId = useId();
  const [range, setRange] = useState<Range>('All');
  const [start, setStart] = useState('2026-10-12');
  const [end, setEnd] = useState('2026-10-23');
  const [cursor, setCursor] = useState<number | null>(null);
  const history = useMemo(() => market.source?.history.map(p => ({ at: p.at, values: [p.yes, p.no] })) || [], [market]);
  const anchor = Math.max(...history.map(p => Date.parse(p.at)));
  const invalid = range === 'Custom' && (!start || !end || start > end);
  const points = history.filter(p => {
    if (invalid) return false;
    const time = Date.parse(p.at);
    if (range === 'Custom') return time >= Date.parse(`${start}T00:00:00Z`) && time <= Date.parse(`${end}T23:59:59Z`);
    const duration = range === '1D' ? 86400000 : range === '1W' ? 604800000 : range === '1M' ? 2592000000 : Infinity;
    return time >= anchor - duration;
  });
  const values = points.flatMap(p => p.values);
  const min = Math.min(...values), max = Math.max(...values);
  const span = Math.max(max - min, Math.abs(max) * .005, .001);
  const low = min - span * .2, high = max + span * .2;
  const x = (i: number) => 32 + (points.length <= 1 ? 0 : i / (points.length - 1)) * 610;
  const y = (value: number) => 224 - (value - low) / (high - low) * 176;
  const path = (series: number) => points.map((p, i) => `${i === 0 ? 'M' : 'H'}${x(i)}${i === 0 ? ',' : 'V'}${y(p.values[series])}`).join(' ');
  const index = Math.min(cursor ?? points.length - 1, points.length - 1);
  const selected = points[index];
  const last = points.at(-1);
  const labelYes = last ? y(last.values[0]) : 0;
  const labelNo = last ? y(last.values[1]) : 0;
  const closeLabels = Math.abs(labelYes - labelNo) < 30;
  return <section className="entity-history" aria-labelledby={`${chartId}-title`}>
    <div className="entity-chart-heading"><div><span className="eyebrow">OUTCOME HISTORY</span><h2 id={`${chartId}-title`}>How the worlds compare.</h2></div><div className="entity-ranges" aria-label="History range">{(['1D', '1W', '1M', 'All', 'Custom'] as Range[]).map(r => <button key={r} aria-pressed={r === range} onClick={() => { setRange(r); setCursor(null); }}>{r}</button>)}</div></div>
    {range === 'Custom' && <div className="entity-custom"><label>From (UTC)<input type="date" value={start} max={end} onChange={e => { setStart(e.target.value); setCursor(null); }} /></label><label>Through (UTC)<input type="date" min={start} value={end} onChange={e => { setEnd(e.target.value); setCursor(null); }} /></label></div>}
    {invalid ? <p role="alert">Choose a start date on or before the end date.</p> : !points.length ? <div className="position-empty" role="status"><strong>{history.length ? 'No observations in this range.' : 'No stored history for this example.'}</strong><p>{history.length ? 'Try All or choose dates between October 12 and October 23, 2026.' : 'Current estimates are available in Overview. A history has not been fabricated.'}</p>{history.length > 0 && <button className="quiet-button" onClick={() => setRange('All')}>Show all history</button>}</div> : <>
      <svg className="entity-step-chart" viewBox="0 0 820 280" role="img" aria-labelledby={`${chartId}-title ${chartId}-desc`} onPointerLeave={() => setCursor(null)} onPointerMove={e => { const rect = e.currentTarget.getBoundingClientRect(); const local = (e.clientX - rect.left) / rect.width * 820; setCursor(Math.max(0, Math.min(points.length - 1, Math.round((local - 32) / 610 * (points.length - 1))))); }}>
        <desc id={`${chartId}-desc`}>Illustrative stored YES and NO prices, step chart. Use the observation slider below for exact values.</desc>
        {[0, 1, 2, 3].map(i => <line key={i} x1="32" x2="642" y1={48 + i * 58} y2={48 + i * 58} className="entity-chart-grid" />)}
        {[0, 1].map(series => <path key={series} d={path(series)} className={`entity-step entity-series-${series}`} />)}
        {selected && <line x1={x(index)} x2={x(index)} y1="30" y2="240" className="entity-chart-cursor" />}
        {last && [0, 1].map(series => <g key={series} className={`entity-series-${series}`}><circle cx={x(points.length - 1)} cy={y(last.values[series])} r="3" /><text x="660" y={(series === 0 ? labelYes : labelNo) + (closeLabels ? (series === 0 ? -16 : 16) : 0) + 4}>{series === 0 ? 'YES' : 'NO'} {outcomeValue(last.values[series], '$')}</text></g>)}
        <text x="32" y="268" className="entity-axis">{points[0].at.slice(0, 10)}</text><text x="642" y="268" textAnchor="end" className="entity-axis">{last?.at.slice(0, 10)}</text>
      </svg>
      <label className="entity-scrubber">Observation<input aria-label="History observation" type="range" min={0} max={points.length - 1} value={index} onChange={e => setCursor(Number(e.target.value))} /></label>
      <output className="entity-chart-output" aria-live="polite">{selected && <><time dateTime={selected.at}>{timestamp(selected.at)}</time><span>YES {outcomeValue(selected.values[0], '$')}</span><span>NO {outcomeValue(selected.values[1], '$')}</span></>}</output>
      <p className="explorer-disclaimer">Stored illustrative observations · step lines hold each value until the next observation. Ranges end at the last stored timestamp.</p>
    </>}
  </section>;
}
