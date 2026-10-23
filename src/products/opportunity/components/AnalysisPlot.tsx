import { useState } from 'react';
import type { AnalysisData, AnalysisMode } from '../data/analytics';
import { useChartWindow } from '../hooks/useChartWindow';
import { ChartWindowControls } from './ChartWindowControls';

export function AnalysisPlot({ data, mode }: { data: AnalysisData; mode: AnalysisMode }) {
  const [active, setActive] = useState(0);
  const [hidden, setHidden] = useState<string[]>([]);
  const view = useChartWindow(data.labels.length);
  const labels = data.labels.slice(view.start, view.end);
  const count = labels.length;
  const index = Math.max(0, Math.min(active - view.start, count - 1));
  const lines = data.lines.filter(l => !hidden.includes(l.id)).map(line => ({ ...line, values: line.values.slice(view.start, view.end) }));
  const max = Math.max(1, ...data.lines.flatMap(l => l.values.filter((v): v is number => v !== null)));
  const x = (i: number) => 48 + i * 560 / Math.max(1, count - 1);
  const y = (v: number) => mode === 'ranks' ? 24 + (v - 1) / Math.max(1, max - 1) * 180 : 204 - v / max * 180;
  return <div className="analysis-plot">
    {mode !== 'distribution' && <ChartWindowControls view={view} total={data.labels.length} />}
    <div className="analysis-readout" role="status"><strong>{labels[index]}</strong>{lines.map(l => <span key={l.id}>{l.label}: {l.values[index]?.toFixed(2) ?? 'Unavailable'} {data.unit}</span>)}</div>
    <svg viewBox="0 0 640 250" role="img" aria-label={`${mode} chart. ${data.note}`} onPointerMove={e => { const b = e.currentTarget.getBoundingClientRect(); setActive(view.start + Math.max(0, Math.min(count - 1, Math.round(((e.clientX - b.left) / b.width * 640 - 48) / 560 * (count - 1))))); }}>
      {[0, .5, 1].map(r => <g key={r}><line x1="48" x2="608" y1={24 + r * 180} y2={24 + r * 180} className="chart-grid-line"/><text x="40" y={28 + r * 180} textAnchor="end">{(mode === 'ranks' ? 1 + r * (max - 1) : max * (1 - r)).toFixed(0)}</text></g>)}
      {mode === 'coverage' && [3, 8, 27].filter(n => n > view.start && n <= view.end).map(n => <g key={n}><line x1={x(n - 1 - view.start)} x2={x(n - 1 - view.start)} y1="24" y2="204" className="chart-grid-line"/><text x={x(n - 1 - view.start)} y="224" textAnchor="middle">Top {n}</text></g>)}
      {mode === 'distribution' ? lines.map(line => <g key={line.id}>{line.values.map((value, i) => value === null ? null : <g key={i}><rect x={x(i) - 32} y={y(value)} width="64" height={204 - y(value)} fill="var(--product-accent)" /><text x={x(i)} y="238" textAnchor="middle">{labels[i]}</text></g>)}</g>) : lines.map((l, j) => <g key={l.id} style={{ opacity: 1 - j % 4 * .15 }}><path className="chart-price-line" strokeDasharray={j % 2 ? '5 3' : undefined} d={l.values.map((v, i) => v === null ? '' : `${i === 0 || l.values[i - 1] === null ? 'M' : 'L'}${x(i)},${y(v)}`).join(' ')}/>{l.values[index] !== null && l.values[index] !== undefined && <circle cx={x(index)} cy={y(l.values[index]!)} r="5" fill="var(--product-accent)"/>}</g>)}
      <line x1={x(index)} x2={x(index)} y1="24" y2="204" className="analysis-crosshair"/>
      {lines[0]?.values.map((value, point) => value === null ? null : <circle key={point} cx={x(point)} cy={y(value)} r="8" className="chart-focus-point" tabIndex={0} role="button" aria-label={`Inspect ${labels[point]}`} onFocus={() => setActive(view.start + point)} onClick={() => setActive(view.start + point)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setActive(view.start + point); } }} />)}
    </svg>
    <label className="analysis-scrubber">Inspect data point<input type="range" min="0" max={Math.max(0, count - 1)} value={index} onChange={e => setActive(view.start + Number(e.target.value))}/></label>
    <div className="analysis-legend" aria-label="Visible series">{data.lines.map(l => <button type="button" key={l.id} aria-pressed={!hidden.includes(l.id)} onClick={() => setHidden(h => h.includes(l.id) ? h.filter(id => id !== l.id) : [...h, l.id])}>{l.label}</button>)}</div>
  </div>;
}
