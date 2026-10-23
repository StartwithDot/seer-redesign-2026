import type { Market } from '../types';
import { outcomeDisplayValue } from '../lib/marketOutcomes';
import { formatNumber } from '../lib/format';
import { externalLinks } from '../data/externalLinks';
import { OutcomeAvatar } from './OutcomeAvatar';

export function CapturedTradePreview({ market, selectedOutcomeId, onSelect, onClose }: { market: Market; selectedOutcomeId?: string; onSelect: (id: string) => void; onClose?: () => void }) {
  const outcome = market.outcomes.find((item) => item.id === selectedOutcomeId) ?? market.outcomes[0];
  return <div className="captured-trade-preview">
    <div className="ticket-header"><OutcomeAvatar outcome={outcome} /><div><span className="field-label">Saved outcome price</span><strong>{outcome.name}</strong><small>{outcomeDisplayValue(market, outcome)}</small></div></div>
    <label>Outcome<select value={outcome.id} onChange={(event) => onSelect(event.target.value)}>{market.outcomes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
    <dl className="quote-metrics"><div><dt>Recorded price</dt><dd>{formatNumber(outcome.price, 4)} {market.collateralSymbol} / share</dd></div><div><dt>Executable quote</dt><dd>Unavailable</dd></div></dl>
    <p className="notice">This captured record has no live quote, verified allowance or transaction route. Open the live market to check current liquidity, buy or sell, manage complete sets, and report an answer.</p>
    {onClose && <a className="secondary-button" href={`#/markets/${market.chainId}/${market.slug}?outcome=${encodeURIComponent(outcome.id)}`} onClick={onClose}>Open trading page →</a>}
    <a className="primary-button full-button" href={`${externalLinks.liveApp}#/markets/${market.chainId}/${market.slug}`} target="_blank" rel="noreferrer">Open this market in Seer ↗</a>
  </div>;
}
