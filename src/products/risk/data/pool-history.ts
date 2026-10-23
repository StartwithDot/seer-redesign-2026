import snapshot from './pool-snapshot.json';

export interface RawPoolHistoryPoint {
  poolId: string;
  poolLiquidity: string;
  pointLiquidity: string | null;
  token0Id: string;
  token1Id: string;
  token0Name: string;
  token1Name: string;
  sqrtPrice: string;
  token0Price: string;
  token1Price: string;
  periodStartUnix: number;
}

export function decodePdToken(name: string): string | null {
  if (!/PD$/i.test(name)) return null;
  const key = name.replace(/PD$/i, '').toUpperCase();
  const aliases: Record<string, string> = {
    WEETH: 'weETH', STETH: 'stETH', ETHPLUS: 'ETH+', BSDETH: 'bsdETH', RETH: 'rETH',
    PUFETH: 'pufETH', AVETH: 'avETH', SOLVBTC: 'solvBTC', TBTC: 'tBTC', CBBTC: 'cbBTC',
    AVUSD: 'avUSD', IUSD: 'iUSD', GACLO1: 'GACLO-1', BUIDLI: 'BUIDL-I', MFONE: 'mF-ONE',
    SATUSDPLUS: 'satUSD+', NOTOALL: 'No to All',
  };
  return aliases[key] || key;
}

// Keep API order, all 35 series, empty entries, exact string precision and token identities.
export const POOL_SERIES = snapshot.data.map((series, index) => ({
  index,
  ticker: series.length ? decodePdToken(series[0].pool.token0.name) || decodePdToken(series[0].pool.token1.name) : null,
  points: series.map((point): RawPoolHistoryPoint => ({
    poolId: point.pool.id, poolLiquidity: point.pool.liquidity,
    pointLiquidity: 'liquidity' in point ? point.liquidity ?? null : null,
    token0Id: point.pool.token0.id, token1Id: point.pool.token1.id,
    token0Name: point.pool.token0.name, token1Name: point.pool.token1.name,
    sqrtPrice: point.sqrtPrice, token0Price: point.token0Price, token1Price: point.token1Price,
    periodStartUnix: point.periodStartUnix,
  })),
}));

export const POOL_HISTORY: Record<string, RawPoolHistoryPoint[]> = Object.fromEntries(
  POOL_SERIES.filter((series) => series.ticker).map((series) => [series.ticker!, series.points]),
);
