import { useState } from 'react';
import { chainById } from '../data/chains';
import { externalLinks, getMarketExplorer } from '../data/externalLinks';
import { formatCompactMoney, formatDate, formatNumber, formatToken } from '../lib/format';
import { marketStateLabels, marketTypeLabels } from '../lib/marketFilters';
import type { Market } from '../types';
import { CopyButton } from './CopyButton';
import { Dialog } from './Dialog';

interface MarketCardDrawerProps {
  market: Market;
  open: boolean;
  pinned: boolean;
  onClose: () => void;
  onTogglePinned: () => void;
  onOpenRecord: (market: Market) => void;
}

export function MarketCardDrawer({
  market,
  open,
  pinned,
  onClose,
  onTogglePinned,
  onOpenRecord,
}: MarketCardDrawerProps) {
  const [poolOpen, setPoolOpen] = useState(false);
  const chain = chainById(market.chainId);

  if (!open) return null;

  const content = (
    <>
      <div className="card-drawer-heading">
        <div>
          <span className="field-label">Market details</span>
          <strong>{marketStateLabels[market.marketState]}</strong>
        </div>
        <div className="card-drawer-controls">
          <button
            type="button"
            className="icon-button"
            aria-pressed={pinned}
            data-tooltip={pinned ? 'Unpin details' : 'Pin details'}
            onClick={(event) => {
              event.stopPropagation();
              onTogglePinned();
            }}
          >
            <span aria-hidden="true">{pinned ? '◆' : '◇'}</span>
            <span className="sr-only">{pinned ? 'Unpin details' : 'Pin details'}</span>
          </button>
          <button
            type="button"
            className="icon-button"
            data-tooltip="Close details"
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
          >
            <span aria-hidden="true">×</span>
            <span className="sr-only">Close details</span>
          </button>
        </div>
      </div>

      <div className="drawer-stat-grid">
        <div><span>Open interest</span><strong>{formatCompactMoney(market.openInterest)}</strong></div>
        <div><span>Liquidity</span><strong>{formatCompactMoney(market.liquidity)}</strong></div>
        <div><span>Volume</span><strong>{formatCompactMoney(market.volume)}</strong></div>
        <div><span>Traded notional</span><strong>{formatCompactMoney(market.notional)}</strong></div>
      </div>

      <dl className="drawer-facts">
        <div><dt>Market type</dt><dd>{marketTypeLabels[market.type]}</dd></div>
        <div><dt>Chain</dt><dd>{chain.name}</dd></div>
        <div><dt>Resolution</dt><dd>{formatDate(market.endDate)}</dd></div>
        <div>
          <dt>Rewards</dt>
          <dd>
            {market.reward
              ? `${formatToken(market.reward.remaining, market.reward.token)} until ${formatDate(market.reward.endsAt)}`
              : 'No active rewards'}
          </dd>
        </div>
      </dl>

      {market.parent && (
        <div className="drawer-parent">
          <span className="field-label">Conditional parent</span>
          <strong>{market.parent.question}</strong>
          <p>
            Resolves against <strong>{market.parent.outcome}</strong>, collateralized in{' '}
            <strong>{market.parent.collateral}</strong>.
          </p>
          <a
            href={`#/markets/${market.parent.chainId}/${market.parent.slug}`}
            onClick={(event) => event.stopPropagation()}
          >
            Open parent market →
          </a>
        </div>
      )}

      <button
        className="drawer-section-toggle"
        type="button"
        aria-expanded={poolOpen}
        onClick={(event) => {
          event.stopPropagation();
          setPoolOpen((current) => !current);
        }}
      >
        <span>Pool and liquidity breakdown</span>
        <span aria-hidden="true">{poolOpen ? '−' : '+'}</span>
      </button>
      {poolOpen && (
        <div className="drawer-pool" onClick={(event) => event.stopPropagation()}>
          <div className="pool-id-row">
            <code>{market.pool.id}</code>
            <CopyButton value={market.pool.id} label="Copy pool id" />
            <a href={getMarketExplorer(chain, market.pool.id)} target="_blank" rel="noreferrer">Explorer ↗</a>
          </div>
          <div className="pool-balance-list">
            {market.pool.balances.map((balance) => {
              const outcome = market.outcomes.find((item) => item.id === balance.outcomeId);
              return (
                <div key={balance.outcomeId}>
                  <span>{outcome?.name ?? balance.outcomeId}</span>
                  <strong>{balance.shares.toLocaleString()} shares</strong>
                  <small>{formatToken(balance.collateral, market.pool.collateralSymbol)}</small>
                </div>
              );
            })}
          </div>
          <p>
            Last pool price <strong>{formatNumber(market.pool.lastPrice, 4)}</strong>. Pool price can differ
            from the displayed market chance while liquidity is rebalancing.
          </p>
        </div>
      )}

      <div className="drawer-evidence-links">
        <a href={getMarketExplorer(chain, market.id)} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>
          {chain.shortName} explorer ↗
        </a>
        <a href={externalLinks.klerosCuration} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>
          Kleros verification ↗
        </a>
        <a href={externalLinks.reality} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>
          Reality.eth ↗
        </a>
      </div>

      <button
        className="primary-button full-button"
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onOpenRecord(market);
        }}
      >
        Open full record
      </button>
    </>
  );
  if (pinned) return <Dialog open={open} title={market.question} className="market-details-dialog" onClose={onClose}><div className="market-details-content" onClick={(event) => event.stopPropagation()}>{content}</div></Dialog>;
  return <aside className="market-card-drawer" aria-label={`${market.question} details`} onClick={(event) => event.stopPropagation()} onKeyDown={(event) => { if (event.key === 'Escape') { event.stopPropagation(); onClose(); } }}>{content}</aside>;
}
