import { useMemo, useState } from 'react';
import { usePredictions } from '../state/Predictions';
import { useDeepState } from '../state/DeepState';
import { useTradeState } from '../state/TradeState';
import { Icon } from './Icons';
import { ExecutionProgress } from './ExecutionProgress';

export function StrategyPanel() {
  const { wallet } = useDeepState();
  const { status, predictions } = usePredictions();
  const {
    balances,
    tradeWalletStatus,
    fundsOperation,
    startExecution,
    retryFailedExecution,
    rebalance,
    executionStatus,
    sourceLabel,
  } = useTradeState();
  const [amount, setAmount] = useState('');
  const [touched, setTouched] = useState(false);
  const availableBalance = balances.tradeWallet.sUSDS;
  const numericAmount = Number(amount);
  const amountError = touched && amount.trim() !== '' && !Number.isFinite(availableBalance)
    ? 'Trade-wallet balance unavailable. The starting amount cannot be verified.'
    : touched && amount.trim() !== '' && (!Number.isFinite(numericAmount) || numericAmount <= 0)
      ? 'Starting amount must be greater than zero.'
      : touched && numericAmount > availableBalance
        ? `Available trade-wallet balance is ${availableBalance.toFixed(2)} sUSDS.`
        : '';

  const checks = useMemo(() => [
    { label: 'Wallet connected', complete: wallet.status === 'connected' },
    { label: 'Trade wallet verified', complete: tradeWalletStatus === 'ready' },
    { label: 'sUSDS balance available', complete: availableBalance > 0 },
    { label: 'Prediction CSV loaded', complete: status === 'ready' && predictions.size > 0 },
  ], [availableBalance, predictions.size, status, tradeWalletStatus, wallet.status]);
  const missingPrerequisite = checks.find((check) => !check.complete)?.label;
  const ready = Number.isFinite(availableBalance) && checks.every((check) => check.complete) && !amountError && availableBalance > 0;
  const executionAmount = amount.trim() ? numericAmount : availableBalance;

  return (
    <section id="deep-strategy" tabIndex={-1} className="deep-strategy-panel" aria-labelledby="strategy-title">
      <header>
        <div>
          <p className="deep-eyebrow">Execution</p>
          <h3 id="strategy-title">Review the strategy gate</h3>
        </div>
        <Icon name="check" />
      </header>
      <ul className="deep-checklist">
        {checks.map((check) => (
          <li key={check.label} className={check.complete ? 'is-complete' : ''}>
            <span aria-hidden="true">{check.complete ? '✓' : '·'}</span>
            {check.label}
            {!check.complete && <small>Required</small>}
          </li>
        ))}
      </ul>
      <label className="deep-field">
        <span>Starting sUSDS amount <small>optional</small></span>
        <input
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          value={amount}
          aria-invalid={Boolean(amountError)}
          aria-describedby="starting-amount-help"
          onBlur={() => setTouched(true)}
          onChange={(event) => { setAmount(event.target.value); setTouched(true); }}
        />
        <small id="starting-amount-help">{amountError || (Number.isFinite(availableBalance) ? `Leave empty to use the full ${availableBalance.toFixed(2)} sUSDS trade-wallet balance.` : 'Trade-wallet balance unavailable. Execution requires a verified deployment and transaction adapter.')}</small>
      </label>
      <button
        className="deep-button"
        type="button"
        disabled={!ready || executionStatus === 'running'}
        title={ready ? 'Redistribute existing trade-wallet balances across the highest-difference markets' : `Complete ${missingPrerequisite ?? 'every prerequisite'} first`}
        onClick={() => rebalance(amount.trim() ? numericAmount : undefined)}
      >
        <Icon name="refresh" /> Rebalance existing balances
      </button>
      <button
        className="deep-button deep-button--primary deep-strategy-panel__execute"
        type="button"
        disabled={!ready || executionStatus === 'running'}
        title={ready ? 'Execute the verified strategy' : `Missing prerequisite: ${missingPrerequisite ?? 'review the strategy amount'}`}
        onClick={() => startExecution(executionAmount)}
      >
        {executionStatus === 'running' ? 'Executing' : 'Start Trading'} <Icon name="arrow" />
      </button>
      {fundsOperation.kind === 'rebalance' && fundsOperation.message && (
        <output className={`deep-operation-status is-${fundsOperation.status}`} aria-live="polite">{fundsOperation.message}</output>
      )}
      <ExecutionProgress onRetry={() => retryFailedExecution(executionAmount)} />
      <p className="deep-strategy-panel__note">
        {sourceLabel}. The action remains disabled until every prerequisite is verified. No mock signing or fabricated order is used.
      </p>
    </section>
  );
}
