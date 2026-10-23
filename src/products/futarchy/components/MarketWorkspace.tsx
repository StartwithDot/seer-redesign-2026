import { useEffect, useMemo, useState } from 'react';
import type { Market } from '../data/types';
import { signedPercent } from '../data/format';
import { buildSignalSeries } from '../data/signalSeries';
import { getTwapRecommendation } from '../data/twap';
import type { WalletController } from '../hooks/useWallet';
import { DecisionSpine } from './DecisionSpine';
import { EvidenceDrawer } from './EvidenceDrawer';
import { CollateralDrawer } from './CollateralDrawer';
import { ActivityPanel } from './ActivityPanel';
import { LifecycleDrawer } from './LifecycleDrawer';
import { LiquidityDrawer } from './LiquidityDrawer';
import { MarketArtwork } from './MarketArtwork';
import { MarketActionBar } from './MarketActionBar';
import { MarketAvatar } from './MarketAvatar';
import { MarketSummary } from './MarketSummary';
import { DataActions } from './DataActions';
import { marketExport } from '../data/entityGraph';
import { entityHref } from '../data/explorer';
import { PositionDrawer, type PositionTab } from './PositionDrawer';
import { ResolutionDrawer } from './ResolutionDrawer';
import { RelatedMarkets } from './RelatedMarkets';
import { RouteBar } from './RouteBar';
import { SignalChart } from './SignalChart';
import { TradeDrawer } from './TradeDrawer';
import { TwapGauge } from './TwapGauge';

interface MarketWorkspaceProps {
  market: Market;
  organizationName: string;
  wallet: WalletController;
  onNavigate: (hash: string) => void;
  onOpenWallet: () => void;
}

const verdictLabel = { include: 'Include', neutral: 'Neutral', exclude: 'Exclude' } as const;

type ActionDrawer = 'trade' | 'position' | 'transactions' | 'collateral' | 'liquidity' | 'resolution' | 'lifecycle' | 'activity' | null;

export function MarketWorkspace({ market, organizationName, wallet, onNavigate, onOpenWallet }: MarketWorkspaceProps) {
  const initialEvidence = new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('evidence');
  const [evidenceOpen, setEvidenceOpenState] = useState(initialEvidence === 'twap' || initialEvidence === 'resolution');
  const [evidenceSection, setEvidenceSection] = useState<'twap' | 'resolution'>(initialEvidence === 'twap' ? 'twap' : 'resolution');
  const [actionDrawer, setActionDrawerState] = useState<ActionDrawer>(() => {
    const value = new URLSearchParams(location.hash.split('?')[1]).get('drawer');
    return ['trade', 'position', 'transactions', 'collateral', 'liquidity', 'resolution', 'lifecycle', 'activity'].includes(value || '') ? value as ActionDrawer : null;
  });
  const [positionTab, setPositionTab] = useState<PositionTab>('position');
  const series = useMemo(() => buildSignalSeries(market), [market]);
  const resolved = market.status === 'resolved';

  const routeHash = window.location.hash;
  const updateRoute = (patch: Record<string, string | null>) => {
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    for (const [key, value] of Object.entries(patch)) {
      if (value === null) params.delete(key); else params.set(key, value);
    }
    onNavigate(`#/m/${market.id}${params.size ? `?${params}` : ''}`);
  };
  const setActionDrawer = (next: ActionDrawer) => {
    setActionDrawerState(next);
    setEvidenceOpenState(false);
    updateRoute({ drawer: next, evidence: null });
  };
  const setEvidenceOpen = (open: boolean) => {
    setEvidenceOpenState(open);
    updateRoute({ evidence: open ? evidenceSection : null });
  };
  const openEvidence = (section: 'twap' | 'resolution') => {
    setEvidenceSection(section);
    setEvidenceOpenState(true);
    setActionDrawerState(null);
    updateRoute({ evidence: section, drawer: null });
  };
  useEffect(() => {
    const params = new URLSearchParams(routeHash.split('?')[1]);
    const evidence = params.get('evidence');
    setEvidenceOpenState(evidence === 'twap' || evidence === 'resolution');
    setEvidenceSection(evidence === 'twap' ? 'twap' : 'resolution');
    const drawer = params.get('drawer');
    setActionDrawerState(['trade', 'position', 'transactions', 'collateral', 'liquidity', 'resolution', 'lifecycle', 'activity'].includes(drawer || '') ? drawer as ActionDrawer : null);
  }, [routeHash]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target?.matches('input, textarea, select, [contenteditable="true"]');
      if (event.key === 'Escape' && !typing && !evidenceOpen && !actionDrawer) {
        event.preventDefault();
        onNavigate('#/');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [actionDrawer, evidenceOpen, onNavigate]);

  const openPosition = (tab: PositionTab = 'position') => {
    setPositionTab(tab);
    setActionDrawer(tab === 'transactions' ? 'transactions' : 'position');
  };

  return (
    <div className="route-view market-workspace">
      <RouteBar label={market.proposal} parentLabel="Milestones" fallback={() => onNavigate('#/')} />
      <header className="market-header">
        <div className="market-identity">
          <MarketAvatar market={market} large />
          <div>
            <span className="eyebrow">{organizationName} · {market.token} · {market.chain}</span>
            <h1>{market.proposal}</h1>
            <p>{market.question}</p>
            <span className="market-condition">{market.condition}</span>
          </div>
          <MarketArtwork market={market} />
        </div>
        <div className="market-header-side">
          <DataActions title={`market-${market.id}`} rows={marketExport([market.id])} href={routeHash} />
          <a className="text-link" href={entityHref('market', market.id)}>Explorer record ↗</a>
          <div className="market-header-actions">
            <button className="quiet-button" type="button" onClick={() => openEvidence('resolution')}>Evidence & resolution</button>
            <button className="quiet-button" type="button" onClick={() => openEvidence('twap')}>TWAP detail</button>
            {resolved && <button className="quiet-button" type="button" disabled title="This market is resolved and read-only">Trading closed</button>}
          </div>
          <div className={`market-verdict${resolved ? ' is-locked' : ''}`}>
            <span>MARKET SIGNAL</span>
            <strong>{resolved ? '▣ ' : ''}{verdictLabel[market.verdict]}</strong>
            <small>{signedPercent(market.impact)} expected impact</small>
            {resolved && <small>Locked after resolution</small>}
          </div>
        </div>
      </header>

      <MarketActionBar
        market={market}
        onOpenTrade={() => setActionDrawer('trade')}
        onOpenPosition={() => openPosition('position')}
        onOpenTransactions={() => openPosition('transactions')}
        onOpenCollateral={() => setActionDrawer('collateral')}
        onOpenLiquidity={() => setActionDrawer('liquidity')}
        onOpenResolution={() => setActionDrawer('resolution')}
        onOpenLifecycle={() => setActionDrawer('lifecycle')}
        onOpenActivity={() => setActionDrawer('activity')}
      />

      <MarketSummary market={market} />

      <div className="market-signal-layout">
        <SignalChart market={market} series={series} />
        <TwapGauge market={market} impact={getTwapRecommendation(market).impact} />
      </div>

      <details className="workspace-spine is-compact"><summary>How the two worlds branch</summary>
        <header>
          <div><span className="eyebrow">DECISION SPINE</span><h2>One history. Two possible worlds.</h2></div>
          <span>{market.condition}</span>
        </header>
        <DecisionSpine market={market} compact />
      </details>

      <RelatedMarkets market={market} onNavigate={onNavigate} />

      <EvidenceDrawer
        market={market}
        open={evidenceOpen}
        section={evidenceSection}
        onClose={() => setEvidenceOpen(false)}
      />
      {actionDrawer === 'trade' && (
        <TradeDrawer
          market={market}
          wallet={wallet}
          onClose={() => setActionDrawer(null)}
          onOpenWallet={() => {
            setActionDrawer(null);
            onOpenWallet();
          }}
          onOpenPosition={() => openPosition('position')}
        />
      )}
      {(actionDrawer === 'position' || actionDrawer === 'transactions') && (
        <PositionDrawer
          market={market}
          wallet={wallet}
          initialTab={actionDrawer === 'transactions' ? 'transactions' : positionTab}
          onClose={() => setActionDrawer(null)}
          onOpenWallet={() => {
            setActionDrawer(null);
            onOpenWallet();
          }}
          onOpenCollateral={() => setActionDrawer('collateral')}
        />
      )}
      {actionDrawer === 'collateral' && (
        <CollateralDrawer
          market={market}
          wallet={wallet}
          onClose={() => setActionDrawer(null)}
          onOpenWallet={() => {
            setActionDrawer(null);
            onOpenWallet();
          }}
          onBackToPosition={() => openPosition('position')}
        />
      )}
      {actionDrawer === 'liquidity' && (
        <LiquidityDrawer market={market} wallet={wallet} onClose={() => setActionDrawer(null)} onOpenWallet={() => {
          setActionDrawer(null);
          onOpenWallet();
        }} />
      )}
      {actionDrawer === 'resolution' && (
        <ResolutionDrawer market={market} wallet={wallet} onClose={() => setActionDrawer(null)} onOpenWallet={() => {
          setActionDrawer(null);
          onOpenWallet();
        }} />
      )}
      {actionDrawer === 'lifecycle' && <LifecycleDrawer market={market} onClose={() => setActionDrawer(null)} />}
      {actionDrawer === 'activity' && (
        <ActivityPanel market={market} wallet={wallet} onClose={() => setActionDrawer(null)} onOpenWallet={() => {
          setActionDrawer(null);
          onOpenWallet();
        }} />
      )}
    </div>
  );
}
