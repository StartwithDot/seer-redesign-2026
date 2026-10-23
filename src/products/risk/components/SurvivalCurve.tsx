import { useState } from 'react';
import { useChartWidth } from '../hooks/useChartWidth';

interface Props { market: number[]; user: number[]; ghosts: number[][]; horizon: number; hasEdits: boolean; }

export function SurvivalCurve({ market, user, ghosts, horizon, hasEdits }: Props) {
  const { ref, width } = useChartWidth();
  const [inspection, setInspection] = useState<number | null>(null);
  const height = width < 480 ? 212 : 260;
  const left = 44, right = width - 24, top = 24, bottom = height - 36;
  const x = (index: number) => left + index / (market.length - 1) * (right - left);
  const y = (value: number) => top + (1 - value) * (bottom - top);
  const path = (values: number[]) => values.map((value, index) => `${index ? 'L' : 'M'}${x(index)} ${y(value)}`).join(' ');
  const marketEnd = y(market[market.length - 1]);
  const userEnd = y(user[user.length - 1]);
  const labelPositions = [{ id: 'market', y: marketEnd - 12 }, ...(hasEdits ? [{ id: 'user', y: userEnd - 12 }] : [])].sort((a, b) => a.y - b.y);
  labelPositions.forEach((label, index) => { label.y = Math.max(top + 16, label.y, index ? labelPositions[index - 1].y + 24 : 0); });
  const overflow = Math.max(0, labelPositions[labelPositions.length - 1].y - (bottom - 8));
  labelPositions.forEach(label => { label.y -= overflow; });
  const marketLabel = labelPositions.find(label => label.id === 'market')!.y;
  const userLabel = labelPositions.find(label => label.id === 'user')?.y;

  return <div ref={ref} className="risk-survival-curve" tabIndex={0} role="group" aria-label="Portfolio survival projection. Use arrow keys to inspect the horizon."
    onBlur={() => setInspection(null)} onPointerLeave={() => setInspection(null)}
    onPointerMove={event => { const rect = event.currentTarget.getBoundingClientRect(); setInspection(Math.min(market.length - 1, Math.max(0, Math.round((event.clientX - rect.left - left) / (right - left) * (market.length - 1))))); }}
    onKeyDown={event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      setInspection(current => event.key === 'Home' ? 0 : event.key === 'End' ? market.length - 1 : Math.min(market.length - 1, Math.max(0, (current ?? market.length - 1) + (event.key === 'ArrowLeft' ? -1 : 1))));
    }}>
    <div className="risk-curve-caption"><span>Chance of no default</span><output aria-live="polite">{inspection !== null ? `${Number((inspection * horizon / (market.length - 1)).toFixed(1))}m · ${(market[inspection] * 100).toFixed(2)}%` : 'Market projection'}</output></div>
    <svg viewBox={`0 0 ${width} ${height}`} style={{ height }} aria-label={`Market survival at ${horizon} months`} role="img">
      <defs><linearGradient id="risk-survival-area" x1="0" y1="0" x2="0" y2="1"><stop stopColor="var(--risk-violet)" stopOpacity=".12" /><stop offset="1" stopColor="var(--risk-violet)" stopOpacity=".01" /></linearGradient></defs>
      {[1, .5, 0].map(value => <g key={value}><line className="risk-tide-grid" x1={left} x2={right} y1={y(value)} y2={y(value)} /><text className="risk-tide-axis-label" x={left - 10} y={y(value) + 4} textAnchor="end">{value * 100}%</text></g>)}
      {[0, .25, .5, .75, 1].map(fraction => <g key={fraction}><line className="risk-tide-grid is-vertical" x1={left + fraction * (right - left)} x2={left + fraction * (right - left)} y1={top} y2={bottom} /><text className="risk-tide-axis-label" x={left + fraction * (right - left)} y={bottom + 24} textAnchor={fraction === 0 ? 'start' : fraction === 1 ? 'end' : 'middle'}>{fraction === 0 ? 'Now' : `${Number((fraction * horizon).toFixed(2))}m`}</text></g>)}
      <path d={`${path(market)} L${right} ${bottom} L${left} ${bottom} Z`} fill="url(#risk-survival-area)" />
      {ghosts.map((values, index) => <path key={index} className={`risk-tide-ghost ${index ? 'is-second' : ''}`} d={path(values)} />)}
      <path className="risk-tide-market" d={path(market)} />
      {hasEdits && <path className="risk-tide-user" d={path(user)} />}
      <circle className="risk-curve-endpoint" cx={right} cy={marketEnd} r="4" />
      <text className="risk-tide-end-label is-market" x={right - 8} y={marketLabel} textAnchor="end">Market</text>
      {hasEdits && <text className="risk-tide-end-label is-user" x={right - 8} y={userLabel} textAnchor="end">Your estimate</text>}
      {inspection !== null && <g><line className="risk-curve-crosshair" x1={x(inspection)} x2={x(inspection)} y1={top} y2={bottom} /><circle className="risk-curve-endpoint" cx={x(inspection)} cy={y(market[inspection])} r="4" /></g>}
    </svg>
    <div className="risk-tide-legend"><span className="is-market">Market</span><span className="is-ghost">Saved history</span>{hasEdits && <span className="is-user">Your estimate</span>}</div>
  </div>;
}
