import capturedEvents from './captures/events.capture.json';
import type { Market, MarketOutcome } from '../types';
import { getAddressExplorer, getMarketExplorer } from './externalLinks';
import { chainById } from './chains';
import { markets } from './markets';
import { capturedActivity, capturedHolders } from './capturedEvidence';

export interface MarketEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
}

export interface MarketIdentifier {
  id: string;
  label: string;
  value: string;
  href: string;
}

export interface MarketComment {
  id: string;
  author: string;
  address: string;
  timestamp: string;
  body: string;
}

export interface RelatedMarket {
  id: string;
  question: string;
  outcome: string;
  status: 'open' | 'resolving' | 'resolved';
  parentOutcome: string | null;
  href: string;
  external: boolean;
}

export interface MarketHolder {
  exactBalance?: string;
  id: string;
  account: string;
  address: string;
  balance: number;
  share: number;
}

export interface MarketActivity {
  id: string;
  action: 'Buy' | 'Sell' | 'Add liquidity' | 'Mint' | 'Merge' | 'Redeem' | 'Report';
  unit?: string;
  amount: number;
  outcome: string;
  timestamp: string;
  transaction: string;
  account: string;
  isMine: boolean;
}

const accounts = [
  { name: 'signal.eth', address: '0x8f1F3A182A92078520dB730224650e25552d42D8' },
  { name: '0x7B21...91A4', address: '0x7B21a9094cD7F9a95b0ECbD46b5392af19f991A4' },
  { name: 'atlas-research.eth', address: '0x47355A3f932042D480eD34dD92f458B2f0441226' },
  { name: '0xC214...771E', address: '0xC21467B29A4B493b2Ee0d8dc985E3195519b771E' },
];

function stableHex(seed: string, length: number) {
  let hash = 2166136261;
  for (const character of seed) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  const chunks: string[] = [];
  while (chunks.join('').length < length) {
    hash = Math.imul(hash ^ (hash >>> 13), 1274126177);
    chunks.push((hash >>> 0).toString(16).padStart(8, '0'));
  }
  return chunks.join('').slice(0, length);
}

export function getMarketEvents(market: Market): MarketEvent[] {
  if (market.provenance.origin === 'captured-api') {
    const records = capturedEvents as Record<string, { data: { id: string; event_at: string; title: string; description: string }[] }>;
    return (records[market.id]?.data ?? []).map((event) => ({ id: event.id, timestamp: event.event_at, title: event.title, description: event.description }));
  }
  const events: MarketEvent[] = [
    {
      id: `${market.id}-created`,
      timestamp: `${market.createdAt}T14:12:00Z`,
      title: 'Market created',
      description: `The ${market.type.replaceAll('-', ' ')} question and its conditional token positions were recorded on-chain.`,
    },
    {
      id: `${market.id}-opened`,
      timestamp: `${market.openingDate}T09:00:00Z`,
      title: 'Trading opened',
      description: 'The outcome pool opened with public price and liquidity updates.',
    },
  ];

  if (market.parent) {
    events.push({
      id: `${market.id}-parent-linked`,
      timestamp: `${market.createdAt}T15:05:00Z`,
      title: 'Conditional parent linked',
      description: `${market.parent.outcome} tokens were declared as collateral. The position becomes worthless if the parent resolves the other way.`,
    });
  }
  if (market.hasRewards && market.reward) {
    events.push({
      id: `${market.id}-rewards`,
      timestamp: `${market.openingDate}T16:30:00Z`,
      title: `${market.reward.token} liquidity rewards activated`,
      description: `Farming incentives run until ${market.reward.endsAt} while the displayed reward balance lasts.`,
    });
  }
  if (market.verification === 'challenged') {
    events.push({
      id: `${market.id}-challenge`,
      timestamp: '2026-10-21T11:42:00Z',
      title: 'Verification challenged',
      description: 'A curator submitted evidence and the market moved to the Kleros review queue.',
    });
  }
  events.push({
    id: `${market.id}-resolution`,
    timestamp: market.resolutionOpensAt,
    title: market.marketState === 'closed' ? 'Resolution executed' : 'Resolution window scheduled',
    description: market.marketState === 'closed'
      ? 'Winning conditional tokens became redeemable for collateral.'
      : 'Reality.eth reporting opens at the stated UTC timestamp.',
  });
  return events.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

export function getMarketIdentifiers(market: Market): MarketIdentifier[] {
  const chain = chainById(market.chainId);
  if (market.provenance.origin === 'captured-api') return [
    { id: 'market', label: 'Market', value: market.identity.market, href: getAddressExplorer(chain, market.identity.market) },
    { id: 'condition', label: 'Condition Id', value: market.identity.conditionId!, href: getMarketExplorer(chain, market.identity.conditionId!) },
    { id: 'question', label: 'Question Id', value: market.identity.questionId!, href: getMarketExplorer(chain, market.identity.questionId!) },
    { id: 'collateral', label: 'Collateral', value: market.collateralAddress!, href: getAddressExplorer(chain, market.collateralAddress!) },
    { id: 'creator', label: 'Creator', value: market.creatorAddress, href: getAddressExplorer(chain, market.creatorAddress) },
  ];
  const base = market.id.replace('market-', '');
  return [
    {
      id: 'market',
      label: 'Market',
      value: market.id,
      href: getMarketExplorer(chain, market.id),
    },
    {
      id: 'condition',
      label: 'Condition Id',
      value: `0x${stableHex(`${market.id}:condition`, 64)}`,
      href: getMarketExplorer(chain, `${market.id} condition`),
    },
    {
      id: 'question',
      label: 'Question Id',
      value: `0x${stableHex(`${market.id}:question`, 64)}`,
      href: getMarketExplorer(chain, `${market.id} question`),
    },
    {
      id: 'collateral',
      label: 'Collateral',
      value: market.parent?.collateral ?? (market.chainId === 100 ? 'sDAI' : market.chainId === 10 ? 'sUSDS' : 'USDC'),
      href: getMarketExplorer(chain, `${base} collateral token`),
    },
    {
      id: 'creator',
      label: 'Creator',
      value: market.creatorAddress,
      href: getAddressExplorer(chain, market.creatorAddress),
    },
  ];
}

export function getMarketComments(market: Market): MarketComment[] {
  const fixtures: Record<string, MarketComment[]> = {
    'market-clarity': [
      {
        id: 'comment-clarity-1',
        author: 'civic-signal.eth',
        address: accounts[0].address,
        timestamp: '2026-10-22T18:14:00Z',
        body: 'The committee markup matters less than whether a final chamber vote happens before the December close.',
      },
      {
        id: 'comment-clarity-2',
        author: '0x7B21...91A4',
        address: accounts[1].address,
        timestamp: '2026-10-21T09:32:00Z',
        body: 'I am watching the reconciliation language and the published floor schedule.',
      },
    ],
    'market-fed-350': [
      {
        id: 'comment-fed-1',
        author: 'macro-fieldwork.eth',
        address: accounts[2].address,
        timestamp: '2026-10-23T08:05:00Z',
        body: 'The final business day fix is the cleanest observable source for this rule.',
      },
    ],
  };
  return fixtures[market.id] ?? [];
}

export function getRelatedMarkets(market: Market): RelatedMarket[] {
  const direct: RelatedMarket[] = [];
  const parent = market.parent ? markets.find((item) => item.slug === market.parent?.slug) : undefined;
  if (market.parent) {
    direct.push({
      id: `parent-${market.id}`,
      question: market.parent.question,
      outcome: market.parent.outcome,
      status: parent?.status ?? 'open',
      parentOutcome: null,
      href: parent ? `#/markets/${parent.chainId}/${parent.slug}` : 'https://app.seer.pm/',
      external: !parent,
    });
  }
  const children = markets.filter((item) => item.parent?.slug === market.slug);
  for (const child of children) {
    direct.push({
      id: child.id,
      question: child.question,
      outcome: child.outcomes[0]?.name ?? 'Outcome',
      status: child.status,
      parentOutcome: child.parent?.outcome ?? null,
      href: `#/markets/${child.chainId}/${child.slug}`,
      external: false,
    });
  }
  if (market.provenance.origin === 'captured-api') return direct;
  if (direct.length >= 3) return direct.slice(0, 4);

  const topOutcome = market.outcomes.find((outcome) => outcome.id !== 'estimate')?.name ?? 'Yes';
  const generated: RelatedMarket[] = [
    ...direct,
    {
      id: `${market.id}-related-a`,
      question: `If ${topOutcome.toLowerCase()} is correct, will the follow-on decision occur before ${market.endDate.slice(0, 4)} ends?`,
      outcome: topOutcome,
      status: 'open',
      parentOutcome: topOutcome,
      href: 'https://app.seer.pm/',
      external: true,
    },
    {
      id: `${market.id}-related-b`,
      question: `Will a published source confirm the ${market.subject.toLowerCase()} signal before resolution?`,
      outcome: topOutcome,
      status: 'resolving',
      parentOutcome: topOutcome,
      href: 'https://app.seer.pm/',
      external: true,
    },
  ];
  return generated.slice(0, 4);
}

export function getOutcomeHolders(market: Market, outcome: MarketOutcome): MarketHolder[] {
  if (market.provenance.origin === 'captured-api') return capturedHolders(market, outcome);
  if (market.hasPriceHistory === false || !market.outcomes.some((item) => item.id === outcome.id)) return [];
  const balance = market.pool.balances.find((item) => item.outcomeId === outcome.id);
  const total = Math.max(1, balance?.shares ?? market.liquidity * 0.3);
  const weights = [0.41, 0.27, 0.18, 0.14];
  return accounts.map((account, index) => ({
    id: `${market.id}-${outcome.id}-holder-${index}`,
    account: account.name,
    address: account.address,
    balance: Math.round(total * weights[index]),
    share: weights[index] * 100,
  }));
}

export function getMarketActivity(market: Market): MarketActivity[] {
  if (market.provenance.origin === 'captured-api') return capturedActivity(market);
  if (market.hasPriceHistory === false) return [];
  const outcomes = market.outcomes.filter((outcome) => outcome.id !== 'estimate');
  const actions: MarketActivity['action'][] = ['Buy', 'Sell', 'Add liquidity', 'Merge', 'Redeem', 'Report'];
  return actions.map((action, index) => ({
    id: `${market.id}-activity-${index}`,
    action,
    amount: Math.round((market.volume / 48) * (index + 1)),
    outcome: outcomes[index % outcomes.length]?.name ?? 'Outcome',
    timestamp: new Date(Date.parse('2026-10-23T09:30:00Z') - index * 9.25 * 60 * 60 * 1000).toISOString(),
    transaction: `0x${stableHex(`${market.id}:${action}:${index}`, 64)}`,
    account: accounts[index % accounts.length].address,
    isMine: index === 0 || index === 3,
  }));
}
