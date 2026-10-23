import { useMemo, useState } from 'react';
import { money } from '../data/format';
import { closePositions, getPosition, type EnginePosition } from '../data/positionEngine';
import type { Market, MarketOutcome } from '../data/types';
import type { OutcomePosition } from '../data/portfolio';

interface PositionEnginePanelProps {
  market: Market;
  owner: string;
  positions: OutcomePosition[];
  onClosePair: () => void;
}

const createPosition = (owner: string, market: Market, holding?: OutcomePosition): EnginePosition => ({
  id: `${market.id}-engine`,
  marketId: market.id,
  owner,
  currency: market.collateral === 'USDS' ? 'USDS' : 'sDAI',
  yesUnits: holding?.yesUnits || 0,
  noUnits: holding?.noUnits || 0,
  yesStandard: 'ERC20 wrapped',
  noStandard: 'ERC20 wrapped',
  yesSurplus: Math.max(0, (holding?.yesUnits || 0) - (holding?.noUnits || 0)),
  noSurplus: Math.max(0, (holding?.noUnits || 0) - (holding?.yesUnits || 0)),
});

export function PositionEnginePanel({ market, owner, positions, onClosePair }: PositionEnginePanelProps) {
  const [outcome, setOutcome] = useState<MarketOutcome>('yes');
  const [units, setUnits] = useState('');
  const position = useMemo(() => createPosition(owner, market, positions.find(position => position.category === 'currency')), [market, owner, positions]);
  const requestedUnits = Math.max(0, Number.parseFloat(units) || 0);
  const snapshot = closePositions(position, market, outcome, requestedUnits);
  const eligibility = snapshot.closeable[outcome];
  const token = getPosition(position, outcome, requestedUnits);

  return (
    <section className="position-engine" aria-labelledby="position-engine-title">
      <div className="trade-section-heading">
        <div><span className="eyebrow">POSITION ENGINE</span><h3 id="position-engine-title">Close or swap with a matching pair.</h3></div>
        <span className="engine-standard">{token.standard}</span>
      </div>
      <p className="engine-disclosure">Matched units and surplus use contract balances.</p>
      <div className="engine-controls">
        <fieldset>
          <legend>Close outcome</legend>
          <label><input type="radio" name="engine-outcome" checked={outcome === 'yes'} onChange={() => setOutcome('yes')} /> YES</label>
          <label><input type="radio" name="engine-outcome" checked={outcome === 'no'} onChange={() => setOutcome('no')} /> NO</label>
        </fieldset>
        <label className="field-label"><span>Units to close</span><input inputMode="decimal" value={units} onChange={(event) => setUnits(event.target.value.replace(/[^0-9.]/g, ''))} /></label>
      </div>
      <dl className="engine-metrics">
        <div><dt>Matched units</dt><dd>{eligibility.matchedUnits.toFixed(4)}</dd></div>
        <div><dt>Shortfall</dt><dd className={eligibility.shortfall > 0 ? 'negative' : ''}>{eligibility.shortfall.toFixed(4)}</dd></div>
        <div><dt>Tracked surplus</dt><dd>{eligibility.surplus.toFixed(4)} {position.currency}</dd></div>
        <div><dt>Wrapped route</dt><dd>{snapshot.smartSwap.wrappedRoute}</dd></div>
      </dl>
      <div className={`engine-status ${eligibility.canClose ? 'is-ready' : 'is-blocked'}`} role="status">
        <strong>{eligibility.canClose ? 'Close plan ready' : 'Close plan blocked'}</strong>
        <span>{eligibility.reason}</span>
      </div>
      <p className="engine-footnote">Matched collateral return: {money(eligibility.matchedUnits, 2)} {position.currency}.</p>
      <button className="quiet-button" type="button" onClick={onClosePair}>Open collateral operations</button>
    </section>
  );
}
