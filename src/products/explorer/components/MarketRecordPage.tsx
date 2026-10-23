import { useEffect, useState } from 'react';
import { rememberMarket } from '../data/recentMarkets';
import { useRecordQuery } from '../hooks/useRecordQuery';
import { getAddressExplorer } from '../data/externalLinks';
import { chainById } from '../data/chains';
import type { WalletController } from '../hooks/useWallet';
import type { Market } from '../types';
import { formatAddress, formatDate } from '../lib/format';
import { getLeadTradeOutcome } from '../lib/marketOutcomes';
import { MarketActivityPanel } from './MarketActivityPanel';
import { SignalContext } from './SignalContext';
import { WalletPositionInspector } from './WalletPositionInspector';
import { VerificationMark } from './VerificationMark';
import { getRealityUrl, getVerificationUrl } from '../data/externalLinks';
import { AddLiquidityDialog } from './AddLiquidityDialog';
import { MarketEvidenceTabs } from './MarketEvidenceTabs';
import { MarketEventsAndIdentifiers } from './MarketEventsAndIdentifiers';
import { MarketLifecyclePanel } from './MarketLifecyclePanel';
import { MarketOutcomeActions } from './MarketOutcomeActions';
import { MarketOutcomesPanel } from './MarketOutcomesPanel';
import { MarketPoolInspector } from './MarketPoolInspector';
import { MarketRecordBanners } from './MarketRecordBanners';
import { MarketRecordHeader } from './MarketRecordHeader';
import { MarketSourceDetails } from './MarketSourceDetails';
import { MarketRecordMeta } from './MarketRecordMeta';
import { MarketTradingPanel } from './MarketTradingPanel';
import { ReportAnswerDialog } from './ReportAnswerDialog';
import { PriceHistoryChart } from './PriceHistoryChart';
import { ScalarMarketSummary } from './ScalarMarketSummary';

interface MarketRecordPageProps {
  market: Market;
  navigate: (hash: string) => void;
  onQuickBuy: (market: Market, outcomeId?: string) => void;
  onOpenWallet: () => void;
  wallet: WalletController;
}

export function MarketRecordPage({
  market,
  navigate,
  onQuickBuy,
  onOpenWallet,
  wallet,
}: MarketRecordPageProps) {
  useEffect(() => rememberMarket(market.id), [market.id]);
  const leadOutcome = getLeadTradeOutcome(market) ?? market.outcomes[0];
  const { query, update } = useRecordQuery();
  const requestedOutcome = query.get('outcome');
  const selectedOutcomeId = market.outcomes.find((item) => item.id === requestedOutcome)?.id ?? leadOutcome.id;
  const setSelectedOutcomeId = (id: string) => update({ outcome: id });
  const poolOpen = query.get('pool') !== '0' && (query.get('panel') === 'liquidity' || query.get('pool') === '1');
  const setPoolOpen = (open: boolean) => update({ pool: open ? '1' : '0' });
  const [liquidityOpen, setLiquidityOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const panels = ['overview', 'activity', 'positions', 'liquidity', 'resolution', 'community'] as const;
  const panel = panels.find((item) => item === query.get('panel')) ?? (query.has('tab') ? 'community' : poolOpen ? 'liquidity' : 'overview');

  return (
    <section className="market-record-page" data-align="container">
      <MarketRecordHeader market={market} navigate={navigate} />
      <SignalContext market={market} />
      <div className="record-source-compact"><a href={getRealityUrl(market)} target="_blank" rel="noreferrer"><small>Oracle</small>Reality.eth ↗</a><a href={getVerificationUrl(market)} target="_blank" rel="noreferrer"><small>Arbitration</small>Kleros ↗</a><span><small>Chain</small>{chainById(market.chainId).name}</span><span><small>Created</small>{formatDate(market.createdAt)}</span><VerificationMark status={market.verification} />{/^0x[\da-f]{40}$/i.test(market.identity.market) && <a href={getAddressExplorer(chainById(market.chainId), market.identity.market)} target="_blank" rel="noreferrer"><small>Contract</small>{formatAddress(market.identity.market)} ↗</a>}</div>
      <MarketRecordBanners market={market} navigate={navigate} />

      <div className="record-workbench">
        <div className="record-evidence">
          <div className="record-main-tabs" role="tablist" aria-label="Market information">{panels.map((item, index) => <button id={`record-tab-${item}`} key={item} type="button" role="tab" aria-selected={panel === item} aria-controls={`record-panel-${item}`} tabIndex={panel === item ? 0 : -1} onClick={() => update({ panel: item })} onKeyDown={(event) => { if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return; event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? panels.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + panels.length) % panels.length; update({ panel: panels[next] }); document.getElementById(`record-tab-${panels[next]}`)?.focus(); }}>{item[0].toUpperCase() + item.slice(1)}</button>)}</div>
          <div role="tabpanel" id={`record-panel-${panel}`} aria-labelledby={`record-tab-${panel}`}>
          {panel === 'overview' && <>
            <ScalarMarketSummary market={market} />
            <PriceHistoryChart market={market} selectedOutcomeId={requestedOutcome ? selectedOutcomeId : undefined} />
            <MarketOutcomesPanel market={market} selectedOutcomeId={selectedOutcomeId} onSelect={setSelectedOutcomeId} onQuickBuy={(outcomeId) => onQuickBuy(market, outcomeId)} />
            <MarketOutcomeActions selectedOutcomeId={selectedOutcomeId} market={market} poolOpen={poolOpen} onTogglePool={() => update({ panel: 'liquidity', pool: '1' })} onAddLiquidity={() => setLiquidityOpen(true)} navigate={navigate} />
            <MarketRecordMeta market={market} />
          </>}
          {panel === 'activity' && <><MarketActivityPanel market={market} account={wallet.account?.address} /><details className="record-disclosure"><summary>Events and market identifiers</summary><MarketEventsAndIdentifiers market={market} /></details></>}
          {panel === 'positions' && <WalletPositionInspector market={market} wallet={wallet} onOpenWallet={onOpenWallet} />}
          {panel === 'liquidity' && <><MarketOutcomeActions selectedOutcomeId={selectedOutcomeId} market={market} poolOpen={poolOpen} onTogglePool={() => setPoolOpen(!poolOpen)} onAddLiquidity={() => setLiquidityOpen(true)} navigate={navigate} /><div id={`${market.id}-pool-inspector`} hidden={!poolOpen}>{poolOpen && <MarketPoolInspector market={market} />}</div></>}
          {panel === 'resolution' && <><MarketSourceDetails market={market} /><MarketLifecyclePanel market={market} navigate={navigate} onQuickBuy={onQuickBuy} onReport={() => setReportOpen(true)} /><MarketEventsAndIdentifiers market={market} /></>}
          {panel === 'community' && <MarketEvidenceTabs market={market} wallet={wallet} onOpenWallet={onOpenWallet} navigate={navigate} />}
          </div>
        </div>

        <MarketTradingPanel
          market={market}
          selectedOutcomeId={selectedOutcomeId}
          onSelectedOutcomeChange={setSelectedOutcomeId}
          onOpenWallet={onOpenWallet}
          wallet={wallet}
        />
      </div>


      <ReportAnswerDialog open={reportOpen} market={market} wallet={wallet} onClose={() => setReportOpen(false)} onOpenWallet={onOpenWallet} />
      <AddLiquidityDialog open={liquidityOpen} market={market} onClose={() => setLiquidityOpen(false)} />
    </section>
  );
}
