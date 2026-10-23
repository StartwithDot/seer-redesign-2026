import { archivedRows } from './archive';
import { loadMarketVolumes } from './market-volume';
export { toHorizontalStepPoints } from './price-series';
import rowsJson from './rows.json';
import marketJson from './markets-data.json';
import chartsJson from './get-market-charts.json';
import type {
  ArchivedMarketRow,
  ChartMarketTotals,
  ChartOutcomeSeries,
  MarketPool,
  MiddleMarket,
  PriceLegStats,
  PricePoint,
  Repository,
  TokenAmount,
} from './types';

type RawRow = { name: string; id: string; up: number; down: number; vol: string; liq: string };
type RawPool = {
  liquidity: string;
  tick: string;
  token0: string;
  token1: string;
  ticks: Array<{ tickIdx: string; liquidityNet: string }>;
  feeTier: string;
  price: number;
};
type RawMarket = {
  id: string;
  wrappedTokens: string[];
  parentOutcome: number;
  marketStatus: string;
};
type RawMarketsData = {
  markets: RawMarket[];
  marketsData: Record<string, { id: string; upPrice: number; upPool: RawPool; downPrice: number; downPool: RawPool }>;
  middleMarkets: Record<string, { id: string; payoutReported: boolean }>;
  parentMarketStatus: Record<string, string>;
  parentWrappedTokens: Record<string, string | string[]>;
};
type RawSeries = {
  marketId: string;
  outcomeId: string;
  outcomeName: 'UP' | 'DOWN' | 'Invalid result';
  lastPrice: number | null;
  points: Array<[number, number]>;
};
type RawChart = {
  series: RawSeries[];
  totalVolumeMarket: string;
  totalVolumeTokens: string;
  totalLiquidityMarket: string;
  totalLiquidityTokens: string;
};
const rows = rowsJson as RawRow[];
const marketSnapshot = marketJson as unknown as RawMarketsData;
const charts = chartsJson as Record<string, RawChart>;

function round6(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}

function parseTokenAmount(value: string): TokenAmount {
  const [amount, ...unit] = value.trim().split(/\s+/);
  return { amount: Number(amount), unit: unit.join(' ') };
}

function legStats(points: PricePoint[]): PriceLegStats {
  const prices = points.map((point) => point.price);
  return {
    minimum: round6(Math.min(...prices)),
    maximum: round6(Math.max(...prices)),
    changeCount: prices.reduce((count, price, index) => count + (index > 0 && price !== prices[index - 1] ? 1 : 0), 0),
    startedAt: points[0]?.timestamp ?? 0,
    endedAt: points.at(-1)?.timestamp ?? 0,
  };
}

function normalizePool(raw: RawPool): MarketPool {
  return {
    liquidity: raw.liquidity,
    tick: Number.parseInt(raw.tick, 10),
    token0: raw.token0,
    token1: raw.token1,
    ticks: raw.ticks.map((tick) => ({
      tickIndex: Number.parseInt(tick.tickIdx, 10),
      liquidityNet: tick.liquidityNet,
    })),
    feeTier: Number.parseInt(raw.feeTier, 10),
    price: round6(raw.price),
  };
}

function normalizeTokens(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function normalizeChartSeries(raw: RawSeries): ChartOutcomeSeries {
  return {
    marketId: raw.marketId.toLowerCase(),
    outcomeId: raw.outcomeId,
    outcomeName: raw.outcomeName,
    lastPrice: raw.lastPrice == null ? null : round6(raw.lastPrice),
    points: raw.points.map(([timestamp, price]) => ({ timestamp, price: round6(price) })),
  };
}

function repositoryGroup(name: string): string {
  const value = name.toLowerCase();
  if (/spec|eip|protocol|reality|conditional/.test(value)) return 'Protocol';
  if (/crypto|curve|hash|bls|zk|ecc|algebra/.test(value)) return 'Cryptography';
  if (/test|verify|formal|act|hevm|halmos/.test(value)) return 'Verification';
  if (/wallet|metamask|rainbow|argent|safe/.test(value)) return 'Wallets';
  if (/market|swap|uniswap|balancer|compound|aave|lido/.test(value)) return 'Markets';
  if (/language|solidity|vyper|solady|solmate/.test(value)) return 'Languages';
  return 'Developer tools';
}

const currentRanks = new Map([...rows].sort((a, b) => b.up - a.up).map((row, index) => [row.id.toLowerCase(), index + 1]));
const firstRanks = new Map(
  rows
    .map((candidate) => ({
      id: candidate.id.toLowerCase(),
      first: charts[candidate.id.toLowerCase()]?.series.find((series) => series.outcomeName === 'UP')?.points[0]?.[1] ?? candidate.up,
    }))
    .sort((a, b) => b.first - a.first)
    .map((item, index) => [item.id, index + 1]),
);

function buildRepository(row: RawRow): Repository {
  const marketId = row.id.toLowerCase();
  const chart = charts[marketId];
  const marketMetadata = Object.values(marketSnapshot.marketsData).find((market) => market.id.toLowerCase() === marketId);
  if (!marketMetadata) throw new Error(`Market pool metadata was not returned for ${row.name}.`);
  const market = marketSnapshot.markets.find((item) => item.id.toLowerCase() === marketId);
  const chartSeries = (chart?.series ?? []).map(normalizeChartSeries);
  const upHistory = chartSeries.find((series) => series.outcomeName === 'UP')?.points ?? [];
  const downHistory = chartSeries.find((series) => series.outcomeName === 'DOWN')?.points ?? [];
  const firstUpPrice = upHistory[0]?.price ?? round6(row.up);
  const firstDownPrice = downHistory[0]?.price ?? round6(row.down);
  const currentRank = currentRanks.get(marketId) ?? rows.length;
  const firstRank = firstRanks.get(marketId) ?? rows.length;
  const volumeToken = parseTokenAmount(row.vol);
  const liquidityToken = parseTokenAmount(row.liq);
  const parentKey = String(market?.parentOutcome ?? '');
  const middleMarket = marketSnapshot.middleMarkets[parentKey];
  const middleMarkets: MiddleMarket[] = middleMarket ? [{
    id: middleMarket.id,
    payoutReported: middleMarket.payoutReported,
  }] : [];
  return {
    marketId,
    owner: row.name.split('/')[0],
    name: row.name.split('/').slice(1).join('/'),
    group: repositoryGroup(row.name),
    marketStatus: market?.marketStatus === 'open' ? 'open' : market?.marketStatus === 'closed' ? 'closed' : 'unknown',
    upPrice: round6(row.up),
    downPrice: round6(row.down),
    firstUpPrice,
    firstDownPrice,
    currentRank,
    firstRank,
    rankChange: firstRank - currentRank,
    volume: volumeToken.amount,
    liquidity: liquidityToken.amount,
    volumeToken,
    liquidityToken,
    volumeMarket: chart?.totalVolumeMarket ?? `${volumeToken.amount} ${volumeToken.unit}`,
    volumeTokens: chart?.totalVolumeTokens ?? String(volumeToken.amount),
    liquidityMarket: chart?.totalLiquidityMarket ?? `${liquidityToken.amount} ${liquidityToken.unit}`,
    liquidityTokens: chart?.totalLiquidityTokens ?? String(liquidityToken.amount),
    updatedAt: new Date((upHistory.at(-1)?.timestamp ?? downHistory.at(-1)?.timestamp ?? 0) * 1000).toISOString(),
    pools: {
      up: normalizePool(marketMetadata.upPool),
      down: normalizePool(marketMetadata.downPool),
    },
    chart: {
      series: chartSeries,
      volumeMarket: chart?.totalVolumeMarket ?? 'Unavailable',
      volumeTokens: chart?.totalVolumeTokens ?? 'Unavailable',
      liquidityMarket: chart?.totalLiquidityMarket ?? 'Unavailable',
      liquidityTokens: chart?.totalLiquidityTokens ?? 'Unavailable',
    },
    upHistory,
    downHistory,
    upStats: legStats(upHistory),
    downStats: legStats(downHistory),
    provenance: {
      realityQuestionId: null,
      klerosCaseId: null,
      marketAddress: marketMetadata?.id ?? row.id,
      wrappedOutcomeTokens: market?.wrappedTokens ?? [],
      parentOutcome: market?.parentOutcome ?? null,
      parentWrappedTokens: normalizeTokens(marketSnapshot.parentWrappedTokens[parentKey]),
      parentMarketStatus: marketSnapshot.parentMarketStatus[parentKey] ?? null,
      middleMarkets,
    },
  };
}

export const repositories: Repository[] = rows.map(buildRepository).sort((a, b) => b.upPrice - a.upPrice);

export function getArchivedMarketRows(contestId: string): ArchivedMarketRow[] {
  return archivedRows(contestId);
}

export async function refreshMarketVolume(repository: Repository): Promise<ChartMarketTotals> {
  const response = (await loadMarketVolumes())[repository.marketId];
  if (!response) throw new Error('The market-volume response did not include this market.');
  return response;
}
