import { useState } from 'react';
import type { AssetRecord } from '../data/types';

export function ProbabilityEditor({ asset, value, onChange }: { asset: AssetRecord; value: number; onChange: (value: number) => void }) {
  const [error, setError] = useState('');
  const errorId = `pd-error-${asset.id}`;
  return <div className="risk-probability-editor">
    <label htmlFor={`pd-number-${asset.id}`}>Your estimate (annual %)</label>
    <input id={`pd-number-${asset.id}`} type="number" min={0} max={100} step={0.001} value={Number(value.toFixed(3))} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} onChange={(event) => {
      const next = event.target.valueAsNumber;
      if (Number.isFinite(next) && next >= 0 && next <= 100) { setError(''); onChange(next); }
      else setError('Enter a probability from 0 to 100%.');
    }} />
    <input aria-label={`${asset.ticker} annual probability slider`} type="range" min={0} max={100} step={0.001} value={value} onChange={(event) => { setError(''); onChange(Number(event.target.value)); }} />
    <div className="risk-range-labels"><span>0%</span><span>100%</span></div>
    {error && <p className="risk-input-error" id={errorId} role="alert">{error}</p>}
  </div>;
}
