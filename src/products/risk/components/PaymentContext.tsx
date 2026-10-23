import { PAYMENT_CONTEXT, MARKET_LINKS } from '../data/market';
import { ArrowUpRight, InfoIcon } from './Icons';

export function PaymentContext({ compact = false }: { compact?: boolean }) {
  return <div className={`risk-payment-context ${compact ? 'is-compact' : ''}`}>
    <div className="risk-payment-heading">
      <InfoIcon />
      <div>
        <strong>Prepared on Gnosis Chain</strong>
        <span>The next round can use the published participation collateral.</span>
      </div>
    </div>
    <div className="risk-payment-methods">
      {PAYMENT_CONTEXT.map((method) => <div key={method.id} title={method.detail}>
        <strong>{method.name}</strong>
        <span>{method.detail}</span>
      </div>)}
    </div>
    {!compact && <a href={MARKET_LINKS.acquireXdai} target="_blank" rel="noreferrer">How to acquire xDAI <ArrowUpRight /></a>}
  </div>;
}
