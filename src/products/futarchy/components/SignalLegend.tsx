import { InfoTooltip } from './InfoTooltip';

const steps = [
  {
    title: 'Compare forks',
    description: 'The market prices the same asset in the pass and fail worlds.',
  },
  {
    title: 'Measure impact',
    description: 'The gap between those prices is the proposed decision impact.',
  },
  {
    title: 'Read the verdict',
    description: 'The ±1% corridor turns the impact into Include, Neutral or Exclude.',
  },
];

export function SignalLegend() {
  return (
    <ol className="signal-legend" aria-label="How the market signal works">
      {steps.map((step, index) => (
        <li key={step.title}>
          <InfoTooltip variant="signal" label={step.title} text={step.description}>
            <span aria-hidden="true">{index + 1}</span>
            <strong>{step.title}</strong>
          </InfoTooltip>
        </li>
      ))}
    </ol>
  );
}
