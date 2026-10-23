import { useRef, type KeyboardEvent } from 'react';
import { useRecordQuery } from '../hooks/useRecordQuery';
import type { WalletController } from '../hooks/useWallet';
import type { Market } from '../types';
import { MarketActivityPanel } from './MarketActivityPanel';
import { MarketCommentsPanel } from './MarketCommentsPanel';
import { MarketHoldersPanel } from './MarketHoldersPanel';
import { RelatedMarketsPanel } from './RelatedMarketsPanel';

interface MarketEvidenceTabsProps {
  market: Market;
  wallet: WalletController;
  onOpenWallet: () => void;
  navigate: (hash: string) => void;
}

const tabs = [
  { id: 'comments', label: 'Comments' },
  { id: 'related', label: 'Related Conditional Markets' },
  { id: 'holders', label: 'Top Holders' },
  { id: 'activity', label: 'Activity' },
] as const;

type EvidenceTab = typeof tabs[number]['id'];

export function MarketEvidenceTabs({ market, wallet, onOpenWallet, navigate }: MarketEvidenceTabsProps) {
  const { query, update } = useRecordQuery();
  const activeTab: EvidenceTab = tabs.find((tab) => tab.id === query.get('tab'))?.id ?? 'comments';
  const setActiveTab = (tab: EvidenceTab) => update({ tab: tab === 'comments' ? null : tab });
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const moveTab = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? tabs.length - 1
        : Math.max(0, Math.min(tabs.length - 1, index + (event.key === 'ArrowRight' ? 1 : -1)));
    setActiveTab(tabs[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <section className="market-evidence-tabs" aria-labelledby={`${market.id}-evidence-tabs-title`}>
      <div className="evidence-tabs-heading">
        <div>
          <span className="field-label">Participation and ownership</span>
          <h2 id={`${market.id}-evidence-tabs-title`}>Follow the people around the signal.</h2>
        </div>
      </div>
      <div className="evidence-tablist" role="tablist" aria-label="Market evidence">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(element) => { tabRefs.current[index] = element; }}
            id={`${market.id}-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${market.id}-tabpanel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={(event) => moveTab(event, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        id={`${market.id}-tabpanel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`${market.id}-tab-${activeTab}`}
        tabIndex={0}
        className="evidence-tabpanel"
      >
        {activeTab === 'comments' && <MarketCommentsPanel market={market} wallet={wallet} onOpenWallet={onOpenWallet} />}
        {activeTab === 'related' && <RelatedMarketsPanel market={market} navigate={navigate} />}
        {activeTab === 'holders' && <MarketHoldersPanel market={market} />}
        {activeTab === 'activity' && <MarketActivityPanel market={market} account={wallet.account?.address} />}
      </div>
    </section>
  );
}
