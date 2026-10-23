import { useEffect, useRef, useState } from 'react';
import type { LiveTradeQuote } from '../data/liveTrade';
import { formatTokenAmount } from '../data/redemption';

export function TradeOrderReview({ quote, busy, guard, onConfirm, onEdit }: {
  quote: LiveTradeQuote; busy: boolean; guard: string | null; onConfirm: () => void; onEdit: () => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  const [acknowledged, setAcknowledged] = useState(false);
  useEffect(() => { heading.current?.focus(); }, []);
  const approve = quote.allowance < quote.amount;
  const inputUnit = quote.mode === 'buy' ? 'sDAI' : 'shares';
  const outputUnit = quote.mode === 'buy' ? 'shares' : 'sDAI';
  return <section className="trade-order-review" aria-label="Review live order">
    <h3 ref={heading} tabIndex={-1}>Review {quote.mode}</h3>
    <dl>
      <div><dt>Outcome</dt><dd>{quote.outcome.title}</dd></div>
      <div><dt>Spend</dt><dd>{formatTokenAmount(quote.amount)} {inputUnit}</dd></div>
      <div><dt>Minimum receive</dt><dd>{formatTokenAmount(quote.minimum)} {outputUnit}</dd></div>
      <div><dt>Recipient</dt><dd className="trade-address">{quote.account}</dd></div>
    </dl>
    <a href={`https://gnosisscan.io/address/${quote.router}`} target="_blank" rel="noreferrer">Inspect trading router ↗</a>
    <label className="trade-acknowledgement"><input type="checkbox" checked={acknowledged} disabled={busy}
      onChange={event => setAcknowledged(event.target.checked)} />
      {approve ? `Allow this router to spend ${formatTokenAmount(quote.amount)} ${inputUnit}.` : `Exchange ${formatTokenAmount(quote.amount)} ${inputUnit} for at least ${formatTokenAmount(quote.minimum)} ${outputUnit}.`}
    </label>
    {approve && <p>After approval confirms, refresh and review the trade.</p>}
    {guard && <p role="status">{guard}</p>}
    <button type="button" className="primary-action" disabled={!acknowledged || busy || Boolean(guard)}
      title={guard ?? (!acknowledged ? 'Review and acknowledge this order first.' : undefined)} onClick={onConfirm}>
      {busy ? 'Transaction in progress…' : approve ? 'Approve token' : 'Confirm trade'}</button>
    <button type="button" className="secondary-action" disabled={busy} onClick={onEdit} title="Wait for the pending transaction.">Edit order</button>
  </section>;
}
