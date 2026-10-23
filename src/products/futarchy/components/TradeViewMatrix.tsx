import type { MarketOutcome } from '../data/types';
import type { TradeSide } from '../data/trading';

interface TradeViewMatrixProps {
  outcome: MarketOutcome;
  side: TradeSide;
  onSelect: (outcome: MarketOutcome, side: TradeSide) => void;
}

const cells = [
  { view: 'Bullish', world: 'YES world', description: 'Buy YES', outcome: 'yes', side: 'buy' },
  { view: 'Bearish', world: 'YES world', description: 'Sell YES', outcome: 'yes', side: 'sell' },
  { view: 'Bullish', world: 'NO world', description: 'Buy NO', outcome: 'no', side: 'buy' },
  { view: 'Bearish', world: 'NO world', description: 'Sell NO', outcome: 'no', side: 'sell' },
] as const;

export function TradeViewMatrix({ outcome, side, onSelect }: TradeViewMatrixProps) {
  return (
    <section className="trade-view-matrix" aria-labelledby="trade-view-matrix-title">
      <div className="trade-section-heading">
        <div>
          <span className="eyebrow">YOUR VIEW</span>
          <h3 id="trade-view-matrix-title">Map conviction to the right world.</h3>
        </div>
        <p>Choose a world first, then buy or sell the outcome that matches your view.</p>
      </div>
      <div className="trade-matrix-grid">
        {cells.map((cell) => {
          const selected = outcome === cell.outcome && side === cell.side;
          return (
            <button
              key={`${cell.world}-${cell.view}`}
              type="button"
              aria-pressed={selected}
              className={selected ? 'is-selected' : ''}
              onClick={() => onSelect(cell.outcome, cell.side)}
            >
              <span>{cell.world}</span>
              <strong>{cell.view}</strong>
              <small>{cell.description}</small>
            </button>
          );
        })}
      </div>
    </section>
  );
}
