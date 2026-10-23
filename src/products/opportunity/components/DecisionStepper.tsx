import type { DecisionStep } from '../data/decisionFlow';

interface DecisionStepperProps {
  steps: DecisionStep[];
}

function StepMark({ state }: { state: DecisionStep['state'] }) {
  if (state === 'complete') {
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <path d="M5 10.5 8.2 14 15 6.5" />
      </svg>
    );
  }
  return <span aria-hidden="true" />;
}

export function DecisionStepper({ steps }: DecisionStepperProps) {
  return (
    <ol className="decision-stepper" aria-label="Opportunity decision story">
      {steps.map((step, index) => (
        <li key={step.id} data-step-state={step.state}>
          <span className="decision-stepper__mark">
            <StepMark state={step.state} />
            <span className="sr-only">
              {step.state === 'complete' ? 'Completed' : step.state === 'current' ? 'Current step' : 'Future step'}
            </span>
          </span>
          <div>
            <span className="decision-stepper__index">{String(index + 1).padStart(2, '0')}</span>
            <strong>{step.label}</strong>
            <p>{step.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
