import { useId, useState, type FormEvent } from 'react';
import { validatePositiveAmount } from '../data/trading';
import { useTradeState } from '../state/TradeState';
import { Icon } from './Icons';
import { formatAssetBalance } from '../data/asset-format';

type FundsAction = 'deposit' | 'convert' | 'withdraw';

export function FundsActionForm({ action, onDone }: { action: FundsAction; onDone: () => void }) {
  const { balances, deposit, convert, withdraw, fundsOperation, clearFundsOperation } = useTradeState();
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState<'USDC' | 'USDS'>('USDC');
  const [touched, setTouched] = useState(false);
  const helpId = useId();
  const available = action === 'deposit'
    ? balances.wallet.sUSDS
    : action === 'withdraw'
      ? balances.tradeWallet.sUSDS
      : balances.wallet[source];
  const balanceKnown = Number.isFinite(available);
  const error = touched ? validatePositiveAmount(amount, available, action === 'convert' ? `Convert from ${source}` : action) : null;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (!balanceKnown) return;
    const validationError = validatePositiveAmount(amount, available, action);
    if (validationError) return;
    const numericAmount = Number(amount);
    if (action === 'deposit') deposit(numericAmount);
    if (action === 'convert') convert(source, numericAmount);
    if (action === 'withdraw') withdraw(numericAmount);
    setAmount('');
    setTouched(false);
    onDone();
  };

  return (
    <form className="deep-funds-form" onSubmit={submit}>
      {action === 'convert' && (
        <label className="deep-field">
          <span>Convert from</span>
          <select value={source} onChange={(event) => setSource(event.target.value as 'USDC' | 'USDS')}>
            <option value="USDC">USDC · {Number.isFinite(balances.wallet.USDC) ? `${formatAssetBalance(balances.wallet.USDC)} available` : 'balance unavailable'}</option>
            <option value="USDS">USDS · {Number.isFinite(balances.wallet.USDS) ? `${formatAssetBalance(balances.wallet.USDS)} available` : 'balance unavailable'}</option>
          </select>
        </label>
      )}
      <label className="deep-field">
        <span>{action === 'deposit' ? 'Deposit sUSDS' : action === 'withdraw' ? 'Withdraw sUSDS' : 'Conversion amount'}</span>
        <input
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          value={amount}
          aria-invalid={Boolean(error)}
          aria-describedby={helpId}
          onBlur={() => setTouched(true)}
          onChange={(event) => {
            setAmount(event.target.value);
            setTouched(true);
            clearFundsOperation();
          }}
        />
        <small id={helpId}>{error || (balanceKnown ? `Available: ${formatAssetBalance(available)} ${action === 'convert' ? source : 'sUSDS'}` : 'Balance unavailable. This operation requires a verified transaction adapter.')}</small>
      </label>
      <p className="deep-preview-disclaimer">Transfers and conversion require a verified transaction adapter, unavailable in this build. No rate or fee is estimated.</p>
      <button className="deep-button deep-button--primary" type="submit" disabled title="No verified transaction adapter is configured">
        {action === 'deposit' ? 'Deposit sUSDS' : action === 'convert' ? `Convert to sUSDS` : 'Withdraw sUSDS'}
        <Icon name="arrow" />
      </button>
      {fundsOperation.status === 'error' && <output className="deep-form-error">{fundsOperation.message}</output>}
      <button className="deep-button" type="button" onClick={onDone}>Cancel</button>
    </form>
  );
}
