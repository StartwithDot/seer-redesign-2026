import { createContext, useContext } from 'react';
import type { MarketSnapshot } from '../data/marketSnapshot';

export interface MarketDataState {
  loading: boolean;
  error: string | null;
  snapshot: MarketSnapshot | null;
  reload: () => Promise<void>;
}

export const ResearchContext = createContext<MarketDataState | null>(null);

export function useMarketData() {
  const state = useContext(ResearchContext);
  if (!state) throw new Error('Market data requires the research provider');
  return state;
}
