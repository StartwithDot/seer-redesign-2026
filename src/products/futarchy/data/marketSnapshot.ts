import { coreMarkets } from './markets';
import { closedMarkets } from './closedMarkets';
import { organizations } from './organizations';
import type { Market, Organization } from './types';

export interface MarketSnapshot {
  markets: Market[];
  organizations: Organization[];
}

export const marketSnapshot: MarketSnapshot = {
  markets: [...coreMarkets, ...closedMarkets],
  organizations,
};
