import type { CapturedPool } from '../types';

// Anchor at the captured active liquidity and cross initialized ticks in either
// direction. BigInt preserves raw on-chain precision; missing ticks are not filled.
export function poolLadder(pool: CapturedPool) {
  if (pool.tick === null || pool.liquidity === null || !/^[0-9]+$/.test(pool.liquidity)) return [];
  const ticks = [...pool.ticks].sort((a, b) => a.index - b.index);
  if (ticks.some((tick) => !/^-?[0-9]+$/.test(tick.net))) return [];
  return ticks.slice(0, -1).map((lower, index) => {
    const upper = ticks[index + 1];
    let liquidity = BigInt(pool.liquidity!);
    if (lower.index > pool.tick!) {
      for (const tick of ticks) if (tick.index > pool.tick! && tick.index <= lower.index) liquidity += BigInt(tick.net);
    } else {
      for (const tick of ticks) if (tick.index > lower.index && tick.index <= pool.tick!) liquidity -= BigInt(tick.net);
    }
    return { lower: lower.index, upper: upper.index, liquidity: liquidity.toString(), active: lower.index <= pool.tick! && pool.tick! < upper.index };
  });
}
