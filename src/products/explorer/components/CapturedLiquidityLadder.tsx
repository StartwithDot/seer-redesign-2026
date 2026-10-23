import { useState } from 'react';
import type { CapturedPool } from '../types';
import { poolLadder } from '../data/poolLadder';
import { formatNumber } from '../lib/format';

export function CapturedLiquidityLadder({ pool }: { pool: CapturedPool }) {
  const [nonzero, setNonzero] = useState(true);
  const rows = poolLadder(pool);
  const visible = rows.filter((row) => !nonzero || row.liquidity !== '0');
  const max = Math.max(...rows.map((row) => Number(row.liquidity)), 1);
  return <details>
    <summary>Captured liquidity ladder ({pool.ticks.length} ticks)</summary>
    <p>Liquidity between captured tick boundaries, anchored to the saved active liquidity. Raw liquidity is not shares, dollar depth or a trade quote. Uncaptured boundaries may change these intervals.</p>
    <label><input type="checkbox" checked={nonzero} onChange={(event) => setNonzero(event.target.checked)} /> Hide empty intervals</label>
    <div className="captured-tick-scroll" tabIndex={0} role="region" aria-label="Liquidity intervals">
      <table><caption>Current tick {pool.tick}. Highlighted interval contains the saved pool price.</caption><thead><tr><th scope="col">Tick interval</th><th scope="col">Raw liquidity</th></tr></thead><tbody>{visible.map((row) => <tr key={row.lower} aria-current={row.active ? 'true' : undefined}><th scope="row">{row.lower} to {row.upper}{row.active ? ' · Current' : ''}</th><td><span className="captured-depth-bar" style={{ width: `${Math.max(0, Number(row.liquidity) / max * 100)}%` }} aria-hidden="true" /><code>{row.liquidity}</code></td></tr>)}</tbody></table>
      {!visible.length && <p>No nonempty captured intervals.</p>}
    </div>
    <details><summary>Exact tick records</summary><div className="captured-tick-scroll" tabIndex={0} role="region" aria-label="Raw tick records"><table><caption>Token 1 per token 0: {pool.token1.symbol} / {pool.token0.symbol}</caption><thead><tr><th scope="col">Tick</th><th scope="col">Gross</th><th scope="col">Net</th><th scope="col">Price</th></tr></thead><tbody>{pool.ticks.map((tick) => <tr key={tick.index}><th scope="row">{tick.index}</th><td>{tick.gross}</td><td>{tick.net}</td><td title={tick.price0}>{formatNumber(Number(tick.price0), 6)}</td></tr>)}</tbody></table></div></details>
  </details>;
}
