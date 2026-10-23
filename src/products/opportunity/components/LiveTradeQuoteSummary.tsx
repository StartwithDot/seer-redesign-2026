import type { LiveTradeQuote } from '../data/liveTrade';
import { formatTokenAmount } from '../data/redemption';

export function LiveTradeQuoteSummary({ quote, slippage, now }: { quote: LiveTradeQuote; slippage: string; now: number }) {
  const age = Math.max(0, Math.floor((now - quote.quotedAt) / 1000));
  const unit = quote.mode === 'buy' ? 'shares' : 'sDAI';
  const average = quote.mode === 'buy' ? Number(quote.amount) / Number(quote.receive) : Number(quote.receive) / Number(quote.amount);
  return <section className="trade-live-quote" aria-label="Live trading quote">
    <h3>{age >= 30 ? 'Quote expired' : 'Live quote'}</h3>
    <dl>
      <div><dt>Estimated receive</dt><dd>{formatTokenAmount(quote.receive)} {unit}</dd></div>
      <div><dt>Minimum receive</dt><dd>{formatTokenAmount(quote.minimum)} {unit}</dd></div>
      <div><dt>Average price</dt><dd>{average.toFixed(6)} sDAI per share</dd></div>
      <div><dt>Slippage</dt><dd>{slippage}%</dd></div>
      <div><dt title={quote.priceImpactNote}>Estimated price impact</dt><dd>{quote.priceImpactPercent === null ? 'Reference unavailable' : `${quote.priceImpactPercent.toFixed(2)}%`}</dd></div>
      <div><dt>Quote age</dt><dd>{age}s · expires at 30s</dd></div>
    </dl>
    <p className="trade-reference-note">{quote.referenceAmount === null ? quote.priceImpactNote : `Compared with a live ${formatTokenAmount(quote.referenceAmount)} ${quote.mode === 'buy' ? 'sDAI' : 'share'} quote from the same router.`}</p>
    {age >= 30 && <p role="status">Refresh and review before confirming.</p>}
  </section>;
}
