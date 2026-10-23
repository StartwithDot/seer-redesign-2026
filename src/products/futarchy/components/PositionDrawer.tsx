import { useRef, useState } from 'react';
import { money } from '../data/format';
import type { Market } from '../data/types';
import type { WalletController } from '../hooks/useWallet';
import { ActionDrawerFrame } from './ActionDrawerFrame';
import { AssetBalanceTable } from './AssetBalanceTable';
import { OutcomePositionTable } from './OutcomePositionTable';
import { TradeHistoryTable } from './TradeHistoryTable';
import { DataActions } from './DataActions';
import { TransactionLog } from './TransactionLog';
import { PositionEnginePanel } from './PositionEnginePanel';
import { useWalletPortfolio } from '../hooks/useWalletPortfolio';
import { DataList } from './DataList';
import { WalletDataGate } from './WalletDataGate';

export type PositionTab = 'position' | 'trades' | 'transactions';

interface PositionDrawerProps {
  market: Market;
  wallet: WalletController;
  initialTab: PositionTab;
  onClose: () => void;
  onOpenWallet: () => void;
  onOpenCollateral: () => void;
}

const tabs = [
  { id: 'position', label: 'Position' },
  { id: 'trades', label: 'My trades' },
  { id: 'transactions', label: 'Transactions' },
] as const;

export function PositionDrawer({ market, wallet, initialTab, onClose, onOpenWallet, onOpenCollateral }: PositionDrawerProps) {
  const [activeTab, setActiveTab] = useState<PositionTab>(initialTab);
  const tabRefs = useRef(new Map<PositionTab, HTMLButtonElement>());
  const resource = useWalletPortfolio(wallet, market);
  const portfolio = resource.data;

  const moveTab = (index: number) => {
    const next = tabs[(index + tabs.length) % tabs.length];
    setActiveTab(next.id);
    tabRefs.current.get(next.id)?.focus();
  };

  const onTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveTab(index + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveTab(index - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      moveTab(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      moveTab(tabs.length - 1);
    }
  };

  const footer = wallet.address ? (
    <div className="trade-drawer-actions">
      <button className="quiet-button" type="button" onClick={onClose}>Close</button>
      <button className="primary-button" type="button" onClick={onOpenCollateral}>Split collateral</button>
    </div>
  ) : (
    <div className="trade-drawer-actions">
      <button className="quiet-button" type="button" onClick={onClose}>Close</button>
      <button className="primary-button" type="button" onClick={onOpenWallet}>Connect wallet</button>
    </div>
  );

  return (
    <ActionDrawerFrame eyebrow="PORTFOLIO" title={`Position for ${market.proposal}`} onClose={onClose} footer={footer}>
      <WalletDataGate chainId={market.chainId} wallet={wallet} onOpenWallet={onOpenWallet}>
      <DataList label="Wallet portfolio" count={portfolio ? 1 : 0} source={resource} layout="table" emptyTitle="No portfolio data for this account.">
      {portfolio && (
        <>
          <p className="explorer-disclaimer">Token balances read from contracts. History covers this browser’s submitted actions.</p>
          <DataActions title={`${market.id}-${activeTab}`} rows={activeTab === 'position' ? portfolio.positions.map(p => ({ ...p, owner: portfolio.owner, provenance: 'Contract balance' })) : activeTab === 'trades' ? portfolio.trades.map(t => ({ ...t, provenance: 'Browser trade record' })) : portfolio.transactions.map(t => ({ reference: t.reference, action: t.action, createdAt: t.createdAt, status: t.status, owner: t.owner, provenance: 'Wallet submission and receipt' }))} />
          <section className="portfolio-summary" aria-label="Wallet portfolio summary">
            <div><span>REFERENCE WALLET VALUE</span><strong>{portfolio.totalWalletValue === null ? 'Unavailable' : money(portfolio.totalWalletValue, 2)}</strong></div>
            <div><span>ACTIVE PAIRS</span><strong>{portfolio.positions.length}</strong></div>
            <div><span>MARKET COLLATERAL</span><strong>{market.collateral}</strong></div>
          </section>

          <div className="position-tabs" role="tablist" aria-label="Position details">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                ref={(node) => {
                  if (node) tabRefs.current.set(tab.id, node);
                  else tabRefs.current.delete(tab.id);
                }}
                type="button"
                role="tab"
                id={`position-tab-${tab.id}`}
                aria-selected={activeTab === tab.id}
                aria-controls={`position-panel-${tab.id}`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="position-tab-panel" role="tabpanel" id={`position-panel-${activeTab}`} aria-labelledby={`position-tab-${activeTab}`}>
            {activeTab === 'position' && (
              <>
                <AssetBalanceTable assets={portfolio.assets} />
                <OutcomePositionTable positions={portfolio.positions} />
                <PositionEnginePanel market={market} owner={portfolio.owner} positions={portfolio.positions} onClosePair={onOpenCollateral} />
              </>
            )}
            {activeTab === 'trades' && <TradeHistoryTable trades={portfolio.trades} />}
            {activeTab === 'transactions' && <TransactionLog transactions={portfolio.transactions} />}
          </div>
        </>
      )}
      </DataList>
      </WalletDataGate>
    </ActionDrawerFrame>
  );
}
