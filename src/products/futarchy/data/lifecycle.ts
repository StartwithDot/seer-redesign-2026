import type { Market } from './types';

export interface LifecycleStep {
  id: string;
  label: string;
  detail: string;
  status: 'complete' | 'current' | 'upcoming';
  time: string;
}

export function getLifecycleSteps(market: Market): LifecycleStep[] {
  const resolved = market.status === 'resolved';
  return [
    { id: 'create', label: 'Create', detail: 'FutarchyFactory opens the proposal market.', status: 'complete', time: 'Market creation' },
    { id: 'verify', label: 'Verify', detail: 'Proposal metadata and resolution source are checked.', status: 'complete', time: 'Before opening' },
    { id: 'mint', label: 'Mint / merge / redeem', detail: 'Conditional tokens move between collateral and outcome balances.', status: resolved ? 'complete' : 'current', time: 'Position lifecycle' },
    { id: 'trade', label: 'Buy / sell', detail: 'YES and NO prices are updated by market trades.', status: resolved ? 'complete' : 'current', time: 'Until close' },
    { id: 'report', label: 'Report', detail: 'Reality.eth accepts the first answer after the close time.', status: resolved ? 'complete' : 'upcoming', time: market.closesAt },
    { id: 'dispute', label: 'Dispute', detail: 'A challenged answer can move to Kleros resolution.', status: resolved ? 'complete' : 'upcoming', time: 'After report' },
    { id: 'resolve', label: 'Resolve', detail: 'The final outcome unlocks redemption.', status: resolved ? 'complete' : 'upcoming', time: market.resolutionDate },
    { id: 'liquidity', label: 'Provide liquidity', detail: 'Swapr pools can be supplied across YES and NO pairs.', status: 'upcoming', time: 'Optional' },
  ];
}
