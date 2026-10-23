import { archivedRows, archivedMarketCount } from './archive';
import type { Contest } from './types';
import { repositories } from './repositories';

export const contests: Contest[] = [
  {
    id: 'round-3-originality',
    name: 'Round 3 · Originality',
    status: 'live',
    kind: 'originality',
    marketCount: 98,
    priceRange: `${Math.min(...repositories.map(row => row.upPrice)).toFixed(4)} to ${Math.max(...repositories.map(row => row.upPrice)).toFixed(4)}`,
    volume: 293.82,
    liquidity: 929.08,
    lastTrade: '2026-10-18T19:30:00Z',
    sourceState: 'live snapshot',
  },
  {
    id: 'zcash-nu7',
    name: 'Zcash · NU7',
    status: 'ended',
    kind: 'multi-outcome',
    marketCount: null,
    priceRange: null,
    volume: null,
    liquidity: null,
    lastTrade: null,
    sourceState: 'not included in current API snapshot',
  },
  {
    id: 'zcash-grants',
    name: 'Zcash · Grants',
    status: 'ended',
    kind: 'yes-no',
    marketCount: null,
    priceRange: null,
    volume: null,
    liquidity: null,
    lastTrade: null,
    sourceState: 'not included in current API snapshot',
  },
  {
    id: 'octant',
    name: 'Octant',
    status: 'ended',
    kind: 'single-price',
    marketCount: null,
    priceRange: null,
    volume: null,
    liquidity: null,
    lastTrade: null,
    sourceState: 'not included in current API snapshot',
  },
  {
    id: 'round-2-l2',
    name: 'Round 2 · L2',
    status: 'ended',
    kind: 'multi-outcome',
    marketCount: null,
    priceRange: null,
    volume: null,
    liquidity: null,
    lastTrade: null,
    sourceState: 'not included in current API snapshot',
  },
  {
    id: 'round-2-l1',
    name: 'Round 2 · L1',
    status: 'ended',
    kind: 'single-price',
    marketCount: null,
    priceRange: null,
    volume: null,
    liquidity: null,
    lastTrade: null,
    sourceState: 'not included in current API snapshot',
  },
  {
    id: 'round-2-originality',
    name: 'Round 2 · Originality',
    status: 'ended',
    kind: 'originality',
    marketCount: null,
    priceRange: null,
    volume: null,
    liquidity: null,
    lastTrade: null,
    sourceState: 'not included in current API snapshot',
  },
  {
    id: 'round-1',
    name: 'Round 1',
    status: 'ended',
    kind: 'yes-no',
    marketCount: null,
    priceRange: null,
    volume: null,
    liquidity: null,
    lastTrade: null,
    sourceState: 'not included in current API snapshot',
  },
];

for (const contest of contests.filter(item => item.status === 'ended')) {
  const rows = archivedRows(contest.id);
  if (!rows.length) continue;
  const prices = rows.flatMap(row => row.primaryPrice == null ? [] : [row.primaryPrice]);
  contest.marketCount = archivedMarketCount(contest.id);
  contest.priceRange = prices.length ? `${Math.min(...prices).toFixed(4)} to ${Math.max(...prices).toFixed(4)}` : null;
  contest.sourceState = 'saved contest response';
}

export const activeContest = contests[0];
export const archivedContests = contests.filter((contest) => contest.status === 'ended');
