import { exactPrice, money } from '../data/format';
import type { TradeQuote } from '../data/trading';
import type { Market } from '../data/types';

interface TradeQuotePanelProps {
  market: Market;
  quote: TradeQuote;
  loading: boolean;
  tradeAnyway: boolean;
  onTradeAnywayChange: (checked: boolean) => void;
}

export function TradeQuotePanel({ market, quote, loading, tradeAnyway, onTradeAnywayChange }: TradeQuotePanelProps) {
  return (
    <section className={`trade-quote-panel${quote.highImpact ? ' has-impact-warning' : ''}`} aria-labelledby="trade-quote-title">
      <div className="trade-section-heading">
        <div>
          <span className="eyebrow">QUOTE ESTIMATE</span>
          <h3 id="trade-quote-title">What this trade can return.</h3>
        </div>
        <span className={`quote-status is-${loading ? 'loading' : quote.state}`} aria-live="polite">
          {loading ? 'Updating' : quote.state === 'ready' ? 'Quote ready' : quote.state === 'empty' ? 'Enter an amount' : quote.state === 'no-output' ? 'No output' : 'Quote unavailable'}
        </span>
      </div>

      <div className="trade-quote-outputs">
        <article>
          <span>RECEIVE IF YES</span>
          <strong>{quote.receiveIfYes === null ? 'Unavailable' : money(quote.receiveIfYes, 2)}</strong>
          <small>Estimated value in the YES world</small>
        </article>
        <article>
          <span>RECOVER IF NO</span>
          <strong>{quote.recoverIfNo === null ? 'Unavailable' : money(quote.recoverIfNo, 2)}</strong>
          <small>{quote.recoverError ?? 'Estimated value in the NO world'}</small>
        </article>
      </div>

      <dl className="trade-quote-meta">
        <div><dt>Execution price</dt><dd>{quote.state === 'ready' ? exactPrice(quote.executionPrice, market.collateral) : 'Unavailable'}</dd></div>
        <div><dt>Price impact</dt><dd className={quote.deepImpact ? 'negative' : quote.highImpact ? 'warning' : ''}>{quote.priceImpact.toFixed(2)}%</dd></div>
        <div><dt>Pool depth</dt><dd>{money(quote.poolDepth, 0)}</dd></div>
      </dl>

      {quote.highImpact && (
        <label className="trade-override">
          <input type="checkbox" checked={tradeAnyway} onChange={(event) => onTradeAnywayChange(event.target.checked)} />
          <span>
            <strong>Trade anyway</strong>
            <small>I understand this trade moves the estimated market price by {quote.priceImpact.toFixed(2)}%.</small>
          </span>
        </label>
      )}

      {quote.state === 'unavailable' && (
        <p className="trade-alert" role="alert">This amount exceeds the available pool depth. Lower the amount to request a quote.</p>
      )}
      {quote.state === 'no-output' && (
        <p className="trade-alert" role="alert">This amount is too small to return an outcome token. Increase the amount.</p>
      )}
    </section>
  );
}
