import type { Market } from '../types';

interface MarketOutcomeActionsProps {
  market: Market;
  poolOpen: boolean;
  selectedOutcomeId: string;
  onTogglePool: () => void;
  onAddLiquidity: () => void;
  navigate: (hash: string) => void;
}

export function MarketOutcomeActions({
  market,
  poolOpen,
  selectedOutcomeId,
  onTogglePool,
  onAddLiquidity,
  navigate,
}: MarketOutcomeActionsProps) {
  return (
    <div className="outcome-actions" aria-label="Outcome and liquidity actions">
      <button type="button" className="primary-button" onClick={onAddLiquidity}>Add Liquidity</button>
      <button
        type="button"
        className="secondary-button"
        aria-expanded={poolOpen}
        aria-controls={`${market.id}-pool-inspector`}
        onClick={onTogglePool}
      >
        {poolOpen ? 'Hide pool details' : 'View pool details'}
      </button>
      <button
        type="button"
        className="secondary-button"
        onClick={() => navigate(`#/create-market?parent=${encodeURIComponent(market.slug)}&chainId=${market.chainId}&outcome=${encodeURIComponent(selectedOutcomeId)}`)}
      >
        New conditional market
      </button>
    </div>
  );
}
