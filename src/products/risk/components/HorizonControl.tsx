import { formatMonths } from '../data/math';
import type { CSSProperties } from 'react';

interface HorizonControlProps {
  onChange: (horizon: number) => void;
  value: number;
}

export function HorizonControl({ onChange, value }: HorizonControlProps) {
  const label = value === 3 ? 'Quart.' : value === 12 ? 'Ann.' : formatMonths(value);
  return <div className="risk-horizon-control">
    <span className="risk-horizon-label">Horizon</span>
    <button aria-pressed={value === 3} type="button" onClick={() => onChange(3)}>Quart.</button>
    <input
      aria-label="Estimate horizon from quarterly to annual"
      aria-valuetext={label}
      max="12"
      min="3"
      onChange={(event) => onChange(Number(event.target.value))}
      step="1"
      style={{ '--risk-range-progress': `${(value - 3) / 9 * 100}%` } as CSSProperties}
      type="range"
      value={value}
    />
    <button aria-pressed={value === 12} type="button" onClick={() => onChange(12)}>Ann.</button>
    <output aria-live="polite">{value}m</output>
  </div>;
}
