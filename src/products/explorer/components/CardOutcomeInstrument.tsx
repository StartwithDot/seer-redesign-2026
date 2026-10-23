import type { Market, MarketOutcome } from '../types';
import { formatExactPercent, formatNumber } from '../lib/format';
import { outcomeDisplayValue } from '../lib/marketOutcomes';
import { isInvalidOutcome, isScalarMarket, scalarValue } from '../lib/marketKind';

interface Props { market: Market; onQuickBuy: (market: Market, outcomeId?: string) => void; onOpen: (market: Market) => void }
function Buy({ market, outcome, onQuickBuy, label }: { market: Market; outcome: MarketOutcome; onQuickBuy: Props['onQuickBuy']; label?: string }) {
  return <button className={`instrument-buy trade-tone-${outcome.color}`} type="button" onClick={(event) => { event.stopPropagation(); onQuickBuy(market, outcome.id); }} aria-label={`Buy ${outcome.name} at ${outcomeDisplayValue(market, outcome)}`}>{label ?? `Buy ${outcome.name}`}</button>;
}
export function CardOutcomeInstrument({ market, onQuickBuy, onOpen }: Props) {
  const valid = market.outcomes.filter((outcome) => outcome.id !== 'estimate' && !isInvalidOutcome(outcome));
  const scalar = isScalarMarket(market);
  if (scalar) {
    const value = scalarValue(market);
    const [min, max] = market.bounds ?? [0, 100];
    const up = valid.find((outcome) => outcome.name.toLowerCase() === 'up');
    const down = valid.find((outcome) => outcome.name.toLowerCase() === 'down');
    return <div className="scalar-instrument"><div className="instrument-live">Market estimate</div><div className="scalar-track">{value !== null && <span style={{ left: `${Math.max(0, Math.min(100, (value - min) / Math.max(.001, max - min) * 100))}%` }} />}</div>
      <div className="scalar-values"><span>{min}</span><strong>{value === null ? 'Unavailable' : formatNumber(value)} {market.unit}</strong><span>{max}</span></div>
      <div className="instrument-actions">{up && <Buy market={market} outcome={up} onQuickBuy={onQuickBuy} />}{down && <Buy market={market} outcome={down} onQuickBuy={onQuickBuy} />}</div></div>;
  }
  if (market.status === 'resolved') {
    const winner = valid.find((outcome) => outcome.chance === 100) ?? valid.find((outcome) => outcome.index !== undefined && Number(market.payoutNumerators?.[outcome.index]) > 0);
    return <div className="resolved-winner"><span>Resolved</span><strong>{winner?.name ?? 'View settlement'}</strong></div>;
  }
  if (valid.length === 2) {
    const [yes, no] = valid;
    if (market.type === 'futarchy' || market.cardTreatment === 'head-to-head') {
      return <div className="head-to-head-instrument">{[yes, no].map((outcome) => <button key={outcome.id} type="button" className={`head-to-head-side trade-tone-${outcome.color}`} onClick={(event) => { event.stopPropagation(); onQuickBuy(market, outcome.id); }}><span>{outcome.name}</span><strong>{formatExactPercent(outcome.chance)}</strong><small>Buy</small></button>)}<span className="head-to-head-versus" aria-hidden="true">VS</span></div>;
    }
    if (market.cardTreatment === 'micro-binary') {
      return <div className="micro-binary-instrument">{[yes, no].map((outcome) => <Buy key={outcome.id} market={market} outcome={outcome} onQuickBuy={onQuickBuy} label={`${outcome.name} ${formatExactPercent(outcome.chance)}`} />)}</div>;
    }
    const total = yes.chance + no.chance;
    const position = Number.isFinite(total) && total > 0 ? yes.chance / total * 100 : null;
    return <div className="binary-instrument"><div className="tug-track">{position !== null && <><span className={`tug-yes tone-${yes.color}`} style={{ width: `${position}%` }} /><span className={`tug-no tone-${no.color}`} style={{ width: `${100 - position}%` }} /></>}</div>
      <div className="binary-values"><strong className={`trade-tone-${yes.color}`}><span>{yes.name}</span>{formatExactPercent(yes.chance)}</strong><strong className={`trade-tone-${no.color}`}><span>{no.name}</span>{formatExactPercent(no.chance)}</strong></div>
      <div className="instrument-actions"><Buy market={market} outcome={yes} onQuickBuy={onQuickBuy} /><Buy market={market} outcome={no} onQuickBuy={onQuickBuy} /></div></div>;
  }
  const ranked = [...valid].sort((a, b) => (Number.isFinite(b.chance) ? b.chance : -Infinity) - (Number.isFinite(a.chance) ? a.chance : -Infinity));
  if (market.cardTreatment === 'three-way' && ranked.length >= 3) {
    return <div className="three-way-instrument" role="group" aria-label="Top three outcomes">{ranked.slice(0, 3).map((outcome) => <button key={outcome.id} type="button" className={`trade-tone-${outcome.color}`} onClick={(event) => { event.stopPropagation(); onQuickBuy(market, outcome.id); }}><span title={outcome.name}>{outcome.name}</span><strong>{outcomeDisplayValue(market, outcome)}</strong></button>)}</div>;
  }
  const max = Math.max(1, ...ranked.map((outcome) => Number.isFinite(outcome.chance) ? outcome.chance : 0));
  return <div className="multi-instrument">{ranked.slice(0, 2).map((outcome) => <div key={outcome.id}><span title={outcome.name}>{outcome.name}</span><strong>{outcomeDisplayValue(market, outcome)}</strong><Buy market={market} outcome={outcome} onQuickBuy={onQuickBuy} label="Buy" /><span className="rank-bar"><i className={`tone-${outcome.color}`} style={{ width: `${Number.isFinite(outcome.chance) ? outcome.chance / max * 100 : 0}%` }} /></span></div>)}
    {market.outcomes.length > 2 && <button type="button" className="more-outcomes" onClick={(event) => { event.stopPropagation(); onOpen(market); }}>+{market.outcomes.length - 2} more outcomes →</button>}</div>;
}
