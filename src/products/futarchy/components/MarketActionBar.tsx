import type { Market } from '../data/types';

interface MarketActionBarProps {
  market: Market;
  onOpenTrade: () => void;
  onOpenPosition: () => void;
  onOpenTransactions: () => void;
  onOpenCollateral: () => void;
  onOpenLiquidity: () => void;
  onOpenResolution: () => void;
  onOpenLifecycle: () => void;
  onOpenActivity: () => void;
}

export function MarketActionBar({ market, onOpenTrade, onOpenPosition, onOpenTransactions, onOpenCollateral, onOpenLiquidity, onOpenResolution, onOpenLifecycle, onOpenActivity }: MarketActionBarProps) {
  const tradingClosed = market.status === 'resolved';
  return (
    <div className="market-action-bar" aria-label="Market actions">
      <button className="primary-button" type="button" onClick={onOpenTrade} disabled={tradingClosed} title={tradingClosed ? 'Trading is closed for this resolved market' : 'Open the trade ticket'}>
        Trade market
      </button>
      <button className="quiet-button" type="button" onClick={onOpenPosition}>Position</button>
      <button className="quiet-button" type="button" onClick={onOpenTransactions}>Transactions</button>
      <button className="quiet-button" type="button" onClick={onOpenCollateral}>Collateral</button>
      <button className="quiet-button" type="button" onClick={onOpenLiquidity}>Liquidity</button>
      <button className="quiet-button" type="button" onClick={onOpenResolution}>Resolution</button>
      <button className="quiet-button" type="button" onClick={onOpenLifecycle}>Lifecycle</button>
      <button className="quiet-button" type="button" onClick={onOpenActivity}>Activity</button>
    </div>
  );
}
