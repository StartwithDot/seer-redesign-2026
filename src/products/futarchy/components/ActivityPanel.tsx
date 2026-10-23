import { useEffect, useRef, useState } from 'react';
import { activityPair, getActivityTrades } from '../data/activity';
import type { Market } from '../data/types';
import type { WalletController } from '../hooks/useWallet';
import { ActionDrawerFrame } from './ActionDrawerFrame';
import { AssetBalanceTable } from './AssetBalanceTable';
import { OutcomePositionTable } from './OutcomePositionTable';
import { DataActions } from './DataActions';
import { ActivityTable } from './ActivityTable';
import { TradeHistoryTable } from './TradeHistoryTable';
import { useWalletPortfolio } from '../hooks/useWalletPortfolio';
import { DataList } from './DataList';
import { WalletDataGate } from './WalletDataGate';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ActivityPanelProps {
  market: Market;
  wallet: WalletController;
  onClose: () => void;
  onOpenWallet: () => void;
}

type ActivityTab = 'recent' | 'mine' | 'position';

const tabs: { id: ActivityTab; label: string }[] = [
  { id: 'recent', label: 'Recent Activity' },
  { id: 'mine', label: 'My Trades' },
  { id: 'position', label: 'Position' },
];

export function ActivityPanel({ market, wallet, onClose, onOpenWallet }: ActivityPanelProps) {
  const reduced = useReducedMotion();
  const [tab, setTab] = useState<ActivityTab>('recent');
  const [limit, setLimit] = useState(30);
  const [feed, setFeed] = useState(() => getActivityTrades(market));
  const [freshIds, setFreshIds] = useState<string[]>([]);
  const [playing, setPlaying] = useState(true);
  const sequence = useRef(1000);
  useEffect(() => { setFeed(getActivityTrades(market)); setFreshIds([]); }, [market]);
  useEffect(() => { if (reduced) setFreshIds([]); }, [reduced]);
  useEffect(() => {
    if (!playing || reduced || market.status !== 'active' || tab !== 'recent') return;
    let highlight: number | undefined;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      const pair = activityPair(market, sequence.current++, Date.now());
      setFeed(current => [...pair, ...current].slice(0, 90));
      setFreshIds(pair.map(trade => trade.id));
      highlight = window.setTimeout(() => setFreshIds([]), 1800);
    }, 6000);
    return () => { window.clearInterval(timer); window.clearTimeout(highlight); };
  }, [market, playing, reduced, tab]);
  const trades = feed.slice(0, limit);
  const resource = useWalletPortfolio(wallet, market);
  const portfolio = resource.data;

  return (
    <ActionDrawerFrame eyebrow="MARKET ACTIVITY" title={`${market.proposal} activity`} onClose={onClose} footer={<div className="trade-drawer-actions"><button className="quiet-button" type="button" onClick={onClose}>Close</button>{!wallet.address && <button className="primary-button" type="button" onClick={onOpenWallet}>Connect wallet</button>}</div>}>
      <div className="activity-tabs" role="tablist" aria-label="Activity views">
        {tabs.map((item) => <button key={item.id} type="button" role="tab" id={`activity-tab-${item.id}`} aria-controls={`activity-panel-${item.id}`} tabIndex={tab === item.id ? 0 : -1} aria-selected={tab === item.id} onKeyDown={event => { const index = tabs.findIndex(value => value.id === item.id); const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length : event.key === 'ArrowLeft' ? (index + tabs.length - 1) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : -1; if (next >= 0) { event.preventDefault(); setTab(tabs[next].id); document.getElementById(`activity-tab-${tabs[next].id}`)?.focus(); } }} onClick={() => setTab(item.id)}>{item.label}</button>)}
      </div>
      {(tab === 'recent' || portfolio) && <DataActions title={`${market.id}-${tab}-example`} rows={tab === 'recent' ? trades.map(t => ({ ...t, provenance: 'Example replay, not on-chain' })) : tab === 'mine' ? portfolio!.trades.map(t => ({ ...t, provenance: 'Example wallet-scoped data' })) : portfolio!.positions.map(p => ({ ...p, provenance: 'Example wallet-scoped data' }))} />}
      <div role="tabpanel" id={`activity-panel-${tab}`} aria-labelledby={`activity-tab-${tab}`}>
      {tab === 'recent' && (
        <section className="activity-section" aria-labelledby="recent-activity-title">
          <div className="trade-section-heading"><div><span className="eyebrow">RECENT ACTIVITY</span><h3 id="recent-activity-title">The latest market trades.</h3></div><label className="activity-range">Trades<select value={limit} onChange={(event) => setLimit(Number(event.target.value))}><option value={30}>Last 30</option><option value={60}>Last 60</option><option value={90}>Last 90</option></select></label></div>
          <div className="activity-feed-status"><p>{reduced ? 'Static activity snapshot · reduced motion' : market.status === 'active' ? 'Example activity replay · updates every 6 seconds' : 'Historical example trades · feed stopped'}</p>{market.status === 'active' && !reduced && <button type="button" className="quiet-button" onClick={() => setPlaying(value => !value)}>{playing ? 'Pause updates' : 'Resume updates'}</button>}</div>
          <ActivityTable trades={trades} freshIds={freshIds} />
        </section>
      )}
      {tab !== 'recent' && <WalletDataGate chainId={market.chainId} wallet={wallet} onOpenWallet={onOpenWallet}><DataList label="Wallet activity" count={portfolio ? 1 : 0} source={resource} layout="table" emptyTitle="No account data available.">{portfolio && (tab === 'mine' ? <TradeHistoryTable trades={portfolio.trades} /> : <><AssetBalanceTable assets={portfolio.assets} /><OutcomePositionTable positions={portfolio.positions} /></>)}</DataList></WalletDataGate>}
      </div>
    </ActionDrawerFrame>
  );
}
