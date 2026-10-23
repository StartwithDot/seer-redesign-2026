import { useEffect, useRef } from 'react';
import type { LiveTradeQuote } from '../data/liveTrade';
import type { ConfirmedTransaction } from '../data/transactions';
import { CopyButton } from './RecordActions';
import { formatTokenAmount } from '../data/redemption';
import { liveTransactionRecordId, saveLiveTransactionRecord } from '../data/liveTransactionRecords';

export function TradeConfirmation({ quote, receipt, approval, marketId, marketTitle, onNext }: {
  quote: LiveTradeQuote; receipt: ConfirmedTransaction; approval: boolean;
  marketId: string; marketTitle: string; onNext: () => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  const recordId = liveTransactionRecordId(receipt.hash);
  useEffect(() => {
    heading.current?.focus();
    saveLiveTransactionRecord({
      id: recordId,
      hash: receipt.hash,
      block: Number(BigInt(receipt.block)),
      account: receipt.account,
      target: receipt.to,
      label: receipt.label,
      transactionType: approval ? 'approval' : 'trade',
      marketId,
      marketTitle,
      outcomeId: quote.outcome.id,
      outcomeTitle: quote.outcome.title,
      mode: quote.mode,
      amount: formatTokenAmount(quote.amount),
      inputUnit: quote.mode === 'buy' ? 'sDAI' : 'shares',
      confirmedAt: receipt.confirmedAt,
    });
  }, [approval, marketId, marketTitle, quote, receipt, recordId]);
  const href = `/opportunity/explorer?record=${encodeURIComponent(recordId)}`;
  return <section className="trade-confirmation" aria-label={approval ? 'Approval confirmation' : 'Trade confirmation'}>
    <h3 tabIndex={-1} ref={heading}>{approval ? 'Token approval confirmed' : 'Trade confirmed'}</h3>
    <p role="status">{approval ? 'Request a fresh quote to continue.' : `${quote.mode === 'buy' ? 'Bought' : 'Sold'} ${quote.outcome.title} on Gnosis Chain.`}</p>
    <dl>
      <div><dt>Block</dt><dd>{Number(BigInt(receipt.block)).toLocaleString()}</dd></div>
      <div><dt>{approval ? 'Approved amount' : 'Order input'}</dt><dd>{formatTokenAmount(quote.amount)} {quote.mode === 'buy' ? 'sDAI' : 'shares'}</dd></div>
    </dl>
    <code className="trade-address">{receipt.hash}</code>
    <div className="gallery-links">
      <CopyButton value={receipt.hash} label="Copy transaction hash" />
      <a href={`https://gnosisscan.io/tx/${receipt.hash}`} target="_blank" rel="noreferrer">Gnosisscan receipt ↗</a>
      <a href={href}>Open explorer record</a>
    </div>
    <button type="button" className="secondary-action" onClick={onNext}>{approval ? 'Refresh trade quote' : 'New order'}</button>
  </section>;
}
