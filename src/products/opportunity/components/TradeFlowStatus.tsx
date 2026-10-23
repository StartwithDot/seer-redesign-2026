import type { TransactionState } from '../data/transactions';

type TradeFlowPhase = 'wallet' | 'quote' | 'review' | 'signature' | 'receipt';

const steps: Array<{ id: TradeFlowPhase; label: string }> = [
  { id: 'wallet', label: 'Wallet' },
  { id: 'quote', label: 'Live quote' },
  { id: 'review', label: 'Review' },
  { id: 'signature', label: 'Confirm' },
  { id: 'receipt', label: 'Receipt' },
];

export function TradeFlowStatus({ phase, transaction }: {
  phase: TradeFlowPhase;
  transaction: TransactionState;
}) {
  const currentIndex = steps.findIndex((step) => step.id === phase);
  const failed = transaction.status === 'failed' || transaction.status === 'rejected';
  return (
    <ol className="trade-flow-status" aria-label="Trade progress">
      {steps.map((step, index) => {
        const state = index < currentIndex ? 'complete' : index === currentIndex ? (failed ? 'error' : 'current') : 'upcoming';
        return (
          <li key={step.id} data-state={state} aria-current={state === 'current' || state === 'error' ? 'step' : undefined}>
            <span aria-hidden="true">{state === 'complete' ? '✓' : index + 1}</span>
            <small>{step.label}</small>
          </li>
        );
      })}
    </ol>
  );
}
