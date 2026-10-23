import poolCapture from './captures/pools.capture.json';
import ticksYes from './captures/pool-ticks-0xbbf8f7e40a9234d965f59802c1b3720b21bcc32e.capture.json';
import ticksNo from './captures/pool-ticks-0xfe414db77da686f2050877565b7223b7da4b7c36.capture.json';
import type { CapturedPool } from '../types';

interface Token { id: string; symbol: string; decimals: string }
interface Pool {
  id: string; token0: Token; token1: Token; tick: string; sqrtPrice: string; liquidity: string;
  totalValueLockedToken0?: string; totalValueLockedToken1?: string;
  ticks?: { tickIdx: string; liquidityGross: string; liquidityNet: string; price0: string; price1: string }[];
}
const basePools = (poolCapture as { data: { data: { pools: Pool[] } } }).data.data.pools;
const tickPools = [ticksYes, ticksNo].flatMap((capture) => (capture as { data: { pools: Pool[] } }).data.pools);
export const capturedPoolTokens = [...basePools, ...tickPools].flatMap((pool) => [pool.token0, pool.token1]);

export function capturedPoolsFor(record: { collateralToken: string; wrappedTokens: string[]; outcomes: string[] }): CapturedPool[] {
  return [...basePools, ...tickPools.filter((pool) => !basePools.some((base) => base.id === pool.id))].filter((pool) =>
    [pool.token0.id, pool.token1.id].includes(record.collateralToken) &&
    record.wrappedTokens.some((token) => [pool.token0.id, pool.token1.id].includes(token)),
  ).map((pool) => {
    const outcomeFirst = pool.token0.id !== record.collateralToken;
    const token = outcomeFirst ? pool.token0 : pool.token1;
    const index = record.wrappedTokens.indexOf(token.id);
    const ticks = tickPools.find((item) => item.id === pool.id)?.ticks ?? [];
    const ratio = (Number(pool.sqrtPrice) / 2 ** 96) ** 2 * 10 ** (Number(pool.token0.decimals) - Number(pool.token1.decimals));
    return {
      id: pool.id, outcomeId: record.outcomes[index].trim().toLowerCase() === 'invalid' ? 'invalid' : `outcome-${index}`,
      token0: { address: pool.token0.id, symbol: pool.token0.symbol, decimals: Number(pool.token0.decimals) },
      token1: { address: pool.token1.id, symbol: pool.token1.symbol, decimals: Number(pool.token1.decimals) },
      tick: Number(pool.tick), sqrtPrice: pool.sqrtPrice, liquidity: pool.liquidity, price: outcomeFirst ? ratio : 1 / ratio,
      outcomeBalance: (outcomeFirst ? pool.totalValueLockedToken0 : pool.totalValueLockedToken1) === undefined ? null : Number(outcomeFirst ? pool.totalValueLockedToken0 : pool.totalValueLockedToken1),
      collateralBalance: (outcomeFirst ? pool.totalValueLockedToken1 : pool.totalValueLockedToken0) === undefined ? null : Number(outcomeFirst ? pool.totalValueLockedToken1 : pool.totalValueLockedToken0),
      ticks: ticks.map((tick) => ({ index: Number(tick.tickIdx), gross: tick.liquidityGross, net: tick.liquidityNet, price0: tick.price0, price1: tick.price1 })),
    };
  });
}
