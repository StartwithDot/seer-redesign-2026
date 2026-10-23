import type { DataAvailability } from '../data/types';

const labels: Record<DataAvailability, string> = {
  recorded: 'Recorded',
  unavailable: 'Unavailable',
  'unpriced': 'Unpriced',
  'no-pool': 'No pool',
  withheld: 'Withheld',
  'not-recorded': 'Not recorded',
};

interface ValueStateProps {
  state: DataAvailability;
  label?: string;
}

export function ValueState({ state, label }: ValueStateProps) {
  return <span className={`value-state value-state--${state}`}>{label ?? labels[state]}</span>;
}

interface OptionalValueProps {
  value: string | null;
  state: DataAvailability;
}

export function OptionalValue({ value, state }: OptionalValueProps) {
  return value ? <span>{value}</span> : <ValueState state={state} />;
}
