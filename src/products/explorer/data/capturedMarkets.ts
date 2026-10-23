import catalog from './captures/markets.capture.json';
import { capturedPoolsFor, capturedPoolTokens } from './capturedPools';
import { sampleClock } from './clock';
import { hasCapturedHistory } from './capturedHistory';
import { outcomeTone } from '../lib/marketKind';
import type { Market, MarketState, OracleQuestion } from '../types';

interface RawQuestion {
  id: string; index: number; best_answer: string; bond: string; min_bond: string;
  opening_ts: number; finalize_ts: number; timeout: number; is_pending_arbitration: boolean;
}
interface RawMarket {
  id: string; url: string; marketName: string; chainId: number; creator: string;
  factory: string; transactionHash: string; templateId: string; conditionId: string; questionId: string;
  blockTimestamp: number; openingTs: number; finalizeTs: number; outcomes: string[]; wrappedTokens: string[];
  odds: (number | null)[]; collateralToken: string; outcomesSupply: string; payoutReported: boolean;
  payoutNumerators: string[]; images?: { market?: string; outcomes?: string[] };
  verification: { status: string; itemID?: string }; liquidityUSD: number; incentive: number;
  volumeUSD: number; volumeNotionalUSD: number; openInterestUSD: number; parentOutcome: string;
  parentMarket: { id: string }; lowerBound: string; upperBound: string; hasAnswers: boolean;
  questionsInArbitration: string; questions: RawQuestion[]; categories: string[];
  poolBalance: ({ token0: { symbol: string; balance: number }; token1: { symbol: string; balance: number } } | null)[];
}
const records = (catalog as { markets: RawMarket[] }).markets;
const zero = /^0x0+$/i;
const timestamp = (seconds: number) => new Date(seconds * 1000).toISOString();
const bound = (value: string) => { const raw = BigInt(value); return Number(raw) / (raw >= 10n ** 15n || raw <= -(10n ** 15n) ? 1e18 : 1); };

function lifecycle(raw: RawMarket): MarketState {
  const now = Date.parse(sampleClock) / 1000;
  if (Number(raw.questionsInArbitration) > 0 || raw.questions.some((q) => q.is_pending_arbitration)) return 'in-dispute';
  if (raw.payoutReported) return 'closed';
  if (raw.questions.length ? raw.questions.every((q) => now < q.opening_ts) : now < raw.openingTs) return 'reports-not-open';
  if (raw.questions.some((q) => zero.test(q.best_answer) || /^0xf{63}e$/i.test(q.best_answer)) || (!raw.questions.length && !raw.hasAnswers)) return 'reports-open';
  return raw.questions.some((q) => !(q.finalize_ts > 0 && q.finalize_ts <= now)) ? 'waiting-for-answer' : 'pending-execution';
}

function adapt(raw: RawMarket): Market {
  const parent = records.find((item) => item.id === raw.parentMarket.id);
  const conditional = !zero.test(raw.parentMarket.id);
  const parentIndex = Number(raw.parentOutcome);
  const pools = capturedPoolsFor(raw);
  const balances = raw.poolBalance.filter((pool) => pool !== null);
  const common = balances[0] ? [balances[0].token0.symbol, balances[0].token1.symbol].filter((symbol) => balances.every((pool) => [pool.token0.symbol, pool.token1.symbol].includes(symbol))) : [];
  const collateralSymbol = capturedPoolTokens.find((token) => token.id === raw.collateralToken)?.symbol
    ?? (raw.collateralToken === '0xaf204776c7245bf4147c2612bf6e5972ee483701' ? 'sDAI' : common.length === 1 ? common[0] : parent?.outcomes[parentIndex]?.trim() ?? 'Unknown collateral');
  const valid = raw.outcomes.filter((name) => name.trim().toLowerCase() !== 'invalid');
  const scalar = raw.templateId === '1' && valid.length === 2 && valid.every((name) => ['UP', 'DOWN'].includes(name.toUpperCase()));
  const kind = raw.templateId === '2' ? 'categorical' : raw.templateId === '3' ? 'multi-categorical' : scalar ? 'scalar' : 'multi-scalar';
  const bounds: [number, number] | undefined = kind.includes('scalar') ? [bound(raw.lowerBound), bound(raw.upperBound)] : undefined;
  const up = raw.odds[raw.outcomes.findIndex((name) => name.toUpperCase() === 'UP')];
  const down = raw.odds[raw.outcomes.findIndex((name) => name.toUpperCase() === 'DOWN')];
  const estimate = scalar && bounds && up != null && down != null && up + down > 0 ? bounds[0] + (bounds[1] - bounds[0]) * up / (up + down) : null;
  const outcomes: Market['outcomes'] = raw.outcomes.map((name, index) => ({
    id: name.trim().toLowerCase() === 'invalid' ? 'invalid' : `outcome-${index}`, name: name.trim(), index,
    chance: raw.odds[index] ?? Number.NaN, price: raw.odds[index] == null ? Number.NaN : raw.odds[index]! / 100,
    color: outcomeTone(name, index), image: raw.images?.outcomes?.[index], wrappedToken: raw.wrappedTokens[index],
    tokenSymbol: pools.flatMap((pool) => [pool.token0, pool.token1]).find((token) => token.address === raw.wrappedTokens[index])?.symbol ?? name.trim(),
    tokenDecimals: 18, invalidValue: name.trim().toLowerCase() === 'invalid' ? raw.odds[index] : undefined,
    settlementValue: kind === 'multi-scalar' ? raw.odds[index] == null ? null : Math.round(raw.odds[index]! / 100 * bounds![1]) : undefined,
  }));
  if (scalar) outcomes.unshift({ id: 'estimate', name: 'Market estimate', chance: estimate ?? Number.NaN, price: Number.NaN, color: 'blue', wrappedToken: null, tokenSymbol: '' });
  const questions: OracleQuestion[] = raw.questions.map((q) => ({ id: q.id, index: q.index, question: raw.marketName,
    answer: q.best_answer, bond: q.bond, minimumBond: q.min_bond, openingTimestamp: q.opening_ts,
    finalizeTimestamp: q.finalize_ts, timeout: q.timeout, arbitration: q.is_pending_arbitration }));
  const state = lifecycle(raw);
  return {
    id: raw.id, slug: raw.url, chainId: raw.chainId, question: raw.marketName,
    summary: 'Captured Seer market. Check current prices and resolution in Seer.',
    type: conditional ? 'conditional' : kind, settlementKind: kind, status: raw.payoutReported ? 'resolved' : state === 'in-dispute' || state === 'pending-execution' ? 'resolving' : 'open', marketState: state,
    verification: ['verified', 'verifying', 'challenged'].includes(raw.verification.status) ? raw.verification.status as Market['verification'] : 'not-verified',
    verificationItemId: raw.verification.itemID, creatorAddress: raw.creator, createdAt: timestamp(raw.blockTimestamp).slice(0, 10),
    openingDate: timestamp(raw.blockTimestamp).slice(0, 10), endDate: timestamp(raw.openingTs).slice(0, 10), resolutionOpensAt: timestamp(raw.openingTs),
    volume: raw.volumeUSD, notional: raw.volumeNotionalUSD, liquidity: raw.liquidityUSD, openInterest: raw.openInterestUSD,
    openInterestCollateral: null, pnl: Number.NaN, collateralSymbol, collateralAddress: raw.collateralToken, collateralUsdRate: null,
    outstandingSupply: raw.outcomesSupply, payoutNumerators: raw.payoutNumerators, scalarEstimate: estimate, bounds,
    unit: raw.marketName.match(/\[([^\]]+)\]\s*$/)?.[1].split(',')[0].trim() ?? '', incentive: raw.incentive,
    hasRewards: raw.incentive > 0, hasPriceHistory: hasCapturedHistory(raw.id), subject: raw.categories.find((value) => value !== 'misc') ?? 'General',
    parent: conditional ? { id: raw.parentMarket.id, chainId: parent?.chainId ?? raw.chainId, question: parent?.marketName ?? 'Parent record unavailable', outcome: parent?.outcomes[parentIndex]?.trim() ?? `Outcome ${parentIndex + 1}`, slug: parent?.url ?? raw.parentMarket.id, collateral: collateralSymbol, parentToken: collateralSymbol } : undefined,
    image: raw.images?.market, imageAlt: raw.marketName, outcomes, oracle: { currentAnswer: null, bond: null, bondSymbol: 'xDAI', questions },
    poolBalances: raw.poolBalance.flatMap((pool, index) => {
      if (!pool || ![pool.token0.symbol, pool.token1.symbol].includes(collateralSymbol)) return [];
      const collateral = pool.token0.symbol === collateralSymbol ? pool.token0 : pool.token1;
      const outcome = pool.token0.symbol === collateralSymbol ? pool.token1 : pool.token0;
      return [{ outcomeId: outcomes.find((o) => o.index === index)!.id, outcomeSymbol: outcome.symbol, outcomeBalance: outcome.balance, collateralSymbol, collateralBalance: collateral.balance }];
    }),
    identity: { market: raw.id, factory: raw.factory, creationTransaction: raw.transactionHash, conditionId: raw.conditionId, questionId: raw.questionId, template: raw.templateId, rawRecord: raw as unknown as Record<string, unknown> },
    provenance: { origin: 'captured-api', label: 'Captured Seer API; capture time unrecorded', capturedAt: '', endpoint: 'https://app.seer.pm/.netlify/functions/markets-search' },
    pool: { id: pools[0]?.id ?? '', source: 'captured-api', collateralSymbol, lastPrice: pools[0]?.price ?? Number.NaN, ticks: [], records: pools, balances: pools.map((pool) => ({ outcomeId: pool.outcomeId, shares: pool.outcomeBalance ?? Number.NaN, collateral: pool.collateralBalance ?? Number.NaN })) },
  };
}
export const capturedMarkets = records.map(adapt);
