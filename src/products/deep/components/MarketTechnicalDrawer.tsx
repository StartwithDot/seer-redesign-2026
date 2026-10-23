import type { MarketPool, Repository } from '../data/types';
import { Dialog } from './Dialog';

function PoolDetails({ label, pool }: { label: string; pool: MarketPool }) {
  return (
    <section className="deep-pool-details">
      <header>
        <span>{label}</span>
        <strong>{pool.price.toFixed(6)}</strong>
      </header>
      <dl>
        <div><dt>Liquidity</dt><dd><code>{pool.liquidity}</code></dd></div>
        <div><dt>Tick</dt><dd><code>{pool.tick}</code></dd></div>
        <div><dt>Token 0</dt><dd><code>{pool.token0}</code></dd></div>
        <div><dt>Token 1</dt><dd><code>{pool.token1}</code></dd></div>
        <div><dt>Fee tier</dt><dd>{pool.feeTier / 10_000}%</dd></div>
        <div><dt>Pool price</dt><dd>{pool.price.toFixed(6)}</dd></div>
      </dl>
      <table>
        <caption>{label} liquidity ticks</caption>
        <thead><tr><th>Tick index</th><th>Net liquidity</th></tr></thead>
        <tbody>
          {pool.ticks.map((tick) => (
            <tr key={`${pool.token0}-${tick.tickIndex}`}>
              <td><code>{tick.tickIndex}</code></td>
              <td><code>{tick.liquidityNet}</code></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function MarketTechnicalDrawer({
  repository,
  open,
  onClose,
}: {
  repository: Repository;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog
      open={open}
      title="Market pool data"
      description="Uniswap v3 pool fields for the UP and DOWN outcome pools."
      onClose={onClose}
      className="deep-technical-drawer"
    >
      <PoolDetails label="UP pool" pool={repository.pools.up} />
      <PoolDetails label="DOWN pool" pool={repository.pools.down} />
      <details className="deep-outcome-records">
        <summary>Recorded outcome series</summary>
        {repository.chart.series.map(series => <section key={series.outcomeId}>
          <h3>{series.outcomeName}</h3>
          <dl><div><dt>Market id</dt><dd><code>{series.marketId}</code></dd></div>
            <div><dt>Outcome id</dt><dd><code>{series.outcomeId}</code></dd></div>
            <div><dt>Last price</dt><dd>{series.lastPrice?.toFixed(6) ?? 'Unavailable'}</dd></div>
            <div><dt>Recorded points</dt><dd>{series.points.length}</dd></div></dl>
        </section>)}
      </details>
    </Dialog>
  );
}
