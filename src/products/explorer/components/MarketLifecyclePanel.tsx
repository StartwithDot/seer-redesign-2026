import { marketStateLabels } from '../data/semantics';
import { externalLinks, getAddressExplorer, getMarketExplorer } from '../data/externalLinks';
import { chainById } from '../data/chains';
import type { Market } from '../types';
import { getLeadTradeOutcome } from '../lib/marketOutcomes';

interface MarketLifecyclePanelProps {
  market: Market;
  onReport: () => void;
  navigate: (hash: string) => void;
  onQuickBuy: (market: Market, outcomeId?: string) => void;
}

export function MarketLifecyclePanel({ market, navigate, onQuickBuy, onReport }: MarketLifecyclePanelProps) {
  const chain = chainById(market.chainId);
  return (
    <section className="lifecycle-panel" aria-labelledby="lifecycle-title">
      <div className="lifecycle-heading">
        <div>
          <p className="eyebrow">Lifecycle and evidence</p>
          <h2 id="lifecycle-title">Move from question to settlement.</h2>
        </div>
        <span className="lifecycle-status">{marketStateLabels[market.marketState]}</span>
      </div>
      <div className="lifecycle-actions">
        <button type="button" onClick={() => navigate('#/create-market')}>
          <strong>Create market</strong><span>Open the type workbench</span>
        </button>
        <a href={externalLinks.klerosCuration} target="_blank" rel="noreferrer">
          <strong>Verify market</strong><span>Open Kleros curation ↗</span>
        </a>
        <button type="button" onClick={() => onQuickBuy(market, getLeadTradeOutcome(market)?.id)}>
          <strong>Buy / sell</strong><span>Review exact payout first</span>
        </button>
        <a href={externalLinks.liveApp} target="_blank" rel="noreferrer">
          <strong>Mint / merge / redeem</strong><span>Open live collateral actions ↗</span>
        </a>
        <button type="button" onClick={onReport}><strong>Report answer</strong><span>Review the answer and bond</span></button>
        <a href={externalLinks.kleros} target="_blank" rel="noreferrer">
          <strong>Dispute answer</strong><span>Open Kleros arbitration ↗</span>
        </a>
        <a href={externalLinks.reality} target="_blank" rel="noreferrer">
          <strong>Resolve market</strong><span>Inspect the oracle record ↗</span>
        </a>
        <a href={externalLinks.swapr} target="_blank" rel="noreferrer">
          <strong>Provide liquidity</strong><span>Open the Swapr route ↗</span>
        </a>
      </div>
      <div className="oracle-context">
        <div>
          <span className="field-label">Resolution source</span>
          <strong>Reality.eth</strong>
          <p>Bonded reporters answer the written rule before the deadline.</p>
          <a href={externalLinks.reality} target="_blank" rel="noreferrer">Open Reality.eth ↗</a>
        </div>
        <div>
          <span className="field-label">Dispute layer</span>
          <strong>Kleros</strong>
          <p>Challenged answers move to decentralized arbitration with evidence.</p>
          <a href={externalLinks.kleros} target="_blank" rel="noreferrer">Open Kleros court ↗</a>
        </div>
        <div>
          <span className="field-label">On-chain records</span>
          <strong>{chain.name}</strong>
          <p>Inspect the creator and sample market identifier on the chain explorer.</p>
          <div className="resource-links">
            <a href={getAddressExplorer(chain, market.creatorAddress)} target="_blank" rel="noreferrer">Creator ↗</a>
            <a href={getMarketExplorer(chain, market.id)} target="_blank" rel="noreferrer">Market id ↗</a>
          </div>
        </div>
      </div>
    </section>
  );
}
