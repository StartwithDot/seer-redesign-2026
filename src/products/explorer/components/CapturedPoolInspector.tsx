import { useState } from 'react';
import type { Market } from '../types';
import { formatNumber } from '../lib/format';
import { chainById } from '../data/chains';
import { getAddressExplorer } from '../data/externalLinks';
import { CapturedLiquidityLadder } from './CapturedLiquidityLadder';
import { CopyButton } from './CopyButton';

export function CapturedPoolInspector({ market }: { market: Market }) {
  const records = market.pool.records ?? [];
  const [selected, setSelected] = useState(records[0]?.id ?? '');
  const pool = records.find((item) => item.id === selected) ?? records[0];
  if (!pool) return <section className="pool-inspector"><h2>Pool records unavailable</h2><p>No matching outcome and collateral pool was captured.</p></section>;
  const outcome = market.outcomes.find((item) => item.id === pool.outcomeId);
  return <section className="pool-inspector" aria-label="Captured pool inspector">
    <div className="pool-heading"><div><span className="field-label">Captured Algebra pools</span><h2>Outcome and collateral reserves</h2></div></div>
    <label>Pool<select value={pool.id} onChange={(event) => setSelected(event.target.value)}>{records.map((item) => <option value={item.id} key={item.id}>{market.outcomes.find((entry) => entry.id === item.outcomeId)?.name} · {item.token0.symbol} / {item.token1.symbol}</option>)}</select></label>
    <p>Saved subgraph records, not an executable quote. Reserves use token units; they cannot be added together as a dollar total.</p>
    <div className="pool-id-row"><code>{pool.id}</code><CopyButton value={pool.id} label="Copy pool address" /><a href={getAddressExplorer(chainById(market.chainId), pool.id)} target="_blank" rel="noreferrer">View contract ↗</a></div>
    <dl className="source-metrics">
      <div><dt>{outcome?.name} shares</dt><dd>{formatNumber(pool.outcomeBalance ?? Number.NaN, 4)}</dd></div>
      <div><dt>{market.collateralSymbol} reserves</dt><dd>{formatNumber(pool.collateralBalance ?? Number.NaN, 4)}</dd></div>
      <div><dt>Pool price · {market.collateralSymbol} per share</dt><dd>{formatNumber(pool.price ?? Number.NaN, 6)}</dd></div>
      <div><dt>Current tick</dt><dd>{pool.tick ?? 'Unavailable'}</dd></div>
    </dl>
    <details><summary>Tokens and raw liquidity</summary><dl className="source-identities">{[pool.token0, pool.token1].map((token) => <div key={token.address}><dt>{token.symbol} · {token.decimals} decimals</dt><dd><a href={getAddressExplorer(chainById(market.chainId), token.address)} target="_blank" rel="noreferrer"><code>{token.address}</code></a></dd></div>)}<div><dt>Active liquidity · raw units</dt><dd><code>{pool.liquidity}</code></dd></div><div><dt>Square root price · Q96</dt><dd><code>{pool.sqrtPrice}</code></dd></div></dl></details>
    {pool.ticks.length ? <CapturedLiquidityLadder key={pool.id} pool={pool} /> : <p>No tick ladder was captured for this pool. Reserve balances do not describe executable depth.</p>}

  </section>;
}
