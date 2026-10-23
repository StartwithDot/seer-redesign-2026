import { useEffect, useMemo, useState } from 'react';
import { buildTradeOutcomeOptions, type TradeMode } from '../data/trade';
import { tradeOutcomeById, liveQuoteGuard, parseTradeAmount, addTradeAmount } from '../data/liveTrade';
import { formatTokenAmount } from '../data/redemption';
import type { SubmissionDossier } from '../data/types';
import type { WalletStatus } from '../hooks/useWallet';
import { useOpportunityWallet } from '../hooks/WalletContext';
import { useLiveTrade } from '../hooks/useLiveTrade';
import { OverlayDialog } from './OverlayDialog';
import { TradeOrderReview } from './TradeOrderReview';
import { TradeConfirmation } from './TradeConfirmation';
import { TransactionStatus } from './TransactionStatus';
import { LiveTradeQuoteSummary } from './LiveTradeQuoteSummary';
import { TradeFlowStatus } from './TradeFlowStatus';

interface TradeDrawerProps {
  dossier: SubmissionDossier; initialMode: TradeMode; walletStatus: WalletStatus;
  walletBalance: string | null; collateralBalance: string | null;
  onOpenWallet: () => void; onClose: () => void;
}
export function TradeDrawer({ dossier, initialMode, onOpenWallet, onClose }: TradeDrawerProps) {
  const wallet = useOpportunityWallet();
  const options = useMemo(() => buildTradeOutcomeOptions(dossier), [dossier]);
  const [mode, setMode] = useState(initialMode);
  const [outcomeId, setOutcomeId] = useState(dossier.submission.id);
  const [amount, setAmount] = useState('10');
  const [slippage, setSlippage] = useState('0.5');
  const [reviewing, setReviewing] = useState(false);
  const [dismissedHash, setDismissedHash] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now);
  const outcome = dossier.market.source === 'verified' ? tradeOutcomeById.get(outcomeId) ?? null : null;
  const live = useLiveTrade(outcome, mode, amount, slippage);
  const quote = live.quote;
  const guard = quote ? liveQuoteGuard(quote, wallet.address, now) : null;
  let validation: string | null = null;
  try { parseTradeAmount(amount); } catch (error) { validation = error instanceof Error ? error.message : 'Enter an amount.'; }
  const closed = dossier.market.status !== 'active';
  const unavailable = closed ? 'This market is closed for trading.' : !outcome ? 'No verified token mapping for this submission. Trading unavailable.' : null;
  const canQuote = !unavailable && wallet.status === 'connected' && !validation && !live.busy && live.status !== 'loading';
  useEffect(() => { setReviewing(false); }, [amount, mode, outcomeId, slippage, wallet.address, wallet.status, wallet.receipts.length]);
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer); }, []);
  const receipt = live.receipt && live.receipt.hash !== dismissedHash ? live.receipt : null;
  const activeQuote = quote ?? live.submitted?.quote ?? null;
  const transactionLabels = activeQuote ? [
    `Approve ${activeQuote.mode === 'buy' ? 'sDAI' : activeQuote.outcome.title}`,
    `${activeQuote.mode === 'buy' ? 'Buy' : 'Sell'} ${activeQuote.outcome.title}`,
  ] : [];
  const relevantTransaction = transactionLabels.includes(wallet.transaction.label ?? '')
    ? wallet.transaction
    : { status: 'idle' as const, hash: null, message: null, label: null, account: null };
  const phase = wallet.status !== 'connected' ? 'wallet'
    : receipt ? 'receipt'
      : ['confirming', 'pending', 'rejected', 'failed'].includes(relevantTransaction.status) ? 'signature'
        : reviewing ? 'review'
          : quote ? 'quote'
            : 'quote';
  return <OverlayDialog title={`${mode === 'buy' ? 'Buy' : 'Sell'} outcome shares`}
    description="Request a live quote, review the order, and confirm in your wallet." variant="drawer" onClose={onClose}>
    <form className="trade-ticket" onSubmit={event => { event.preventDefault(); if (canQuote) void live.refresh(); }}>
      <p className="trade-payout-hint" title="Profit or loss is the settlement received minus the amount paid for the shares.">Winning shares receive the market’s settlement rate. Other shares receive zero. Your entry price determines profit or loss.</p>
      <TradeFlowStatus phase={phase} transaction={relevantTransaction} />
      <div className="trade-mode" role="group" aria-label="Trade mode">{(['buy', 'sell'] as const).map(value =>
        <button key={value} type="button" disabled={live.busy} aria-pressed={mode === value} onClick={() => setMode(value)}>{value === 'buy' ? 'Buy' : 'Sell'}</button>)}</div>
      <label className="trade-field"><span>Outcome</span><select value={outcomeId} disabled={live.busy} onChange={event => setOutcomeId(event.target.value)}>
        {options.map(option => <option key={option.id} value={option.id}>{option.label}{!tradeOutcomeById.has(option.id) ? ' · Trading unavailable' : ''}</option>)}
      </select></label>
      <label className="trade-field"><span>{mode === 'buy' ? 'Pay with' : 'Receive'}</span><select value="sDAI" disabled title="Trades use sDAI. Currency conversion is unavailable.">
        <option value="sDAI">sDAI</option><option disabled>xDAI · Conversion unavailable</option><option disabled>sUSDS · Network unavailable</option>
      </select></label>
      <fieldset className="trade-amount" disabled={live.busy}><legend>{mode === 'buy' ? 'Amount in sDAI' : 'Shares to sell'}</legend>
        <div><input type="text" inputMode="decimal" value={amount} aria-label={mode === 'buy' ? 'Amount in sDAI' : 'Outcome shares to sell'}
          aria-invalid={Boolean(validation)} aria-describedby="trade-amount-message" onChange={event => setAmount(event.target.value)} />
          <button type="button" onClick={() => setAmount('')}>Clear</button>
          <button type="button" disabled={live.holding === null || live.holding === 0n} title="Max uses the connected wallet balance."
            onClick={() => { if (live.holding !== null) setAmount(formatTokenAmount(live.holding)); }}>Max</button></div>
        <div className="quick-amounts">{[1, 5, 10, 100].map(value => {
          let next: string | null = null;
          try { next = addTradeAmount(amount, value); } catch { /* Correct the amount before using an increment. */ }
          return <button type="button" key={value} disabled={next === null} title={next === null ? 'Correct the amount before adding.' : `Add ${value} to the current amount.`} onClick={() => { if (next !== null) setAmount(next); }}>+{value}</button>;
        })}</div>
      </fieldset>
      <p id="trade-amount-message" role="status">{validation ?? (live.holding === null ? live.holdingError ?? 'Connect to read the available balance.' : `Available: ${formatTokenAmount(live.holding)} ${mode === 'buy' ? 'sDAI' : 'shares'}`)}</p>
      <label className="trade-field"><span>Maximum slippage</span><select value={slippage} disabled={live.busy} onChange={event => setSlippage(event.target.value)}>
        {['0.1', '0.5', '1', '2', '5'].map(value => <option key={value} value={value}>{value}%</option>)}
      </select></label>
      {unavailable && <p role="status">{unavailable}</p>}
      {wallet.status !== 'connected' ? <button type="button" className="primary-action" onClick={onOpenWallet}>
        {wallet.status === 'wrong-network' ? 'Switch network' : 'Connect wallet'}</button> : <button type="submit" className="secondary-action" disabled={!canQuote}
          title={unavailable ?? validation ?? (live.busy ? 'Wait for the pending transaction.' : undefined)}>{live.status === 'loading' ? 'Requesting quote…' : 'Refresh live quote'}</button>}
      {live.error && <p role="alert">{live.error}</p>}
      {quote && <LiveTradeQuoteSummary quote={quote} slippage={slippage} now={now} />}
      {quote && !reviewing && <button type="button" className="primary-action" disabled={Boolean(guard) || live.busy} title={guard ?? undefined}
        onClick={() => setReviewing(true)}>Review order</button>}
      {reviewing && quote && <TradeOrderReview key={quote.quotedAt} quote={quote} busy={live.busy} guard={guard}
        onConfirm={() => void live.execute()} onEdit={() => setReviewing(false)} />}
      {receipt && live.submitted && <TradeConfirmation quote={live.submitted.quote} receipt={receipt} approval={live.submitted.approval}
        marketId={dossier.market.id} marketTitle={dossier.market.title}
        onNext={() => { setDismissedHash(receipt.hash); setReviewing(false); if (live.submitted?.approval) void live.refresh(); }} />}
      <TransactionStatus labels={transactionLabels} />
      {outcome && <a href={`https://app.seer.pm/markets/100/${outcome.contract}`} target="_blank" rel="noreferrer">Open source market ↗</a>}
    </form>
  </OverlayDialog>;
}
