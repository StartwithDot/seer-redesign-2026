import { CapturedPoolInspector } from './CapturedPoolInspector';
import { chainById } from '../data/chains';
import { getMarketExplorer } from '../data/externalLinks';
import { formatCompactMoney, formatMoney } from '../lib/format';
import type { Market } from '../types';
import { CopyButton } from './CopyButton';

interface MarketPoolInspectorProps {
  market: Market;
}

function tickLiquidity(market: Market, index: number) {
  const centerDistance = Math.abs(index - Math.floor(market.pool.ticks.length / 2));
  return market.liquidity * Math.max(0.18, 0.68 - centerDistance * 0.13);
}

export function MarketPoolInspector({ market }: MarketPoolInspectorProps) {
  return market.pool.source === 'captured-api' ? <CapturedPoolInspector market={market} /> : <SamplePoolInspector market={market} />;
}

function SamplePoolInspector({ market }: MarketPoolInspectorProps) {
  const chain = chainById(market.chainId);
  const balances = market.pool.balances.map((balance) => {
    const outcome = market.outcomes.find((item) => item.id === balance.outcomeId);
    const total = balance.shares + balance.collateral;
    return { ...balance, name: outcome?.name ?? balance.outcomeId, total };
  });
  const maxTick = Math.max(...market.pool.ticks.map((_, index) => tickLiquidity(market, index)));
  const maxTotal = Math.max(1, ...balances.map((balance) => balance.total));

  return (
    <section className="pool-inspector" aria-labelledby={`${market.id}-pool-title`}>
      <div className="pool-heading">
        <div>
          <span className="field-label">Pool inspector</span>
          <h2 id={`${market.id}-pool-title`}>Illustrative depth near the sample price.</h2>
        </div>
        <div className="pool-last-price">
          <span>Last price</span>
          <strong>{formatMoney(market.pool.lastPrice, 2)}</strong>
        </div>
      </div>

      <div className="pool-id-row">
        <div>
          <span className="field-label">Pool Id</span>
          <code>{market.pool.id}</code>
        </div>
        <CopyButton value={market.pool.id} label="Copy pool Id" />
        <a
          className="secondary-button compact-button"
          href={getMarketExplorer(chain, market.pool.id)}
          target="_blank"
          rel="noreferrer"
        >
          View pool record ↗
        </a>
      </div>

      <div className="pool-inspector-grid">
        <figure className="liquidity-ladder-chart">
          <figcaption>Illustrative liquidity by relative price tick</figcaption>
          <div className="tick-bars" aria-label="Liquidity chart">
            {market.pool.ticks.map((tick, index) => {
              const value = tickLiquidity(market, index);
              return (
                <div key={tick} className="tick-bar">
                  <span style={{ height: `${Math.max(10, (value / maxTick) * 100)}%` }} />
                  <small>{tick > 0 ? '+' : ''}{tick.toFixed(2)}</small>
                </div>
              );
            })}
          </div>
        </figure>

        <div className="pool-balances">
          <div className="pool-table-heading">
            <strong>Outcome</strong>
            <span>Shares</span>
            <span>Collateral</span>
            <span>Total</span>
          </div>
          {balances.map((balance) => (
            <div className="pool-balance-row" key={balance.outcomeId}>
              <strong>{balance.name}</strong>
              <span>{Math.round(balance.shares).toLocaleString('en-US')}</span>
              <span>{formatCompactMoney(balance.collateral)}</span>
              <b>{formatCompactMoney(balance.total)}</b>
            </div>
          ))}
        </div>
      </div>

      <div className="shares-total-ladder" aria-label="Shares to total pool ladder">
        {balances.map((balance) => (
          <div key={`ladder-${balance.outcomeId}`}>
            <span>{balance.name}</span>
            <i><b style={{ width: `${Math.max(3, (balance.total / maxTotal) * 100)}%` }} /></i>
            <code>{Math.round(balance.shares).toLocaleString('en-US')} / {Math.round(balance.total).toLocaleString('en-US')}</code>
          </div>
        ))}
      </div>
    </section>
  );
}
