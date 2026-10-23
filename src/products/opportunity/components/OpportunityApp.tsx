import { lazy, Suspense, useEffect, useState } from 'react';
import { GuidedTour } from './GuidedTour';
import { RouteBoundary, RouteStatus, OfflineNotice } from './RouteStates';
import { Shell, type ShellNavItem } from '../../shared/Shell';
import { useOpportunityRoute } from '../hooks/useOpportunityRoute';
import { useTheme } from '../hooks/useTheme';
import { useUrlPanel } from '../hooks/useUrlPanel';
import { useWallet } from '../hooks/useWallet';
import { WalletProvider } from '../hooks/WalletContext';
const ArchiveView = lazy(() => import('./ArchiveView').then(module => ({ default: module.ArchiveView })));
import { BoardView } from './BoardView';
import { CommandPalette } from './CommandPalette';
const ExplorerView = lazy(() => import('./ExplorerView').then(module => ({ default: module.ExplorerView })));
import { HeaderActions } from './HeaderActions';
import { HelpTour } from './HelpTour';
import { ProtocolDrawer } from './ProtocolDrawer';
const ReviewView = lazy(() => import('./ReviewView').then(module => ({ default: module.ReviewView })));
import { WalletDrawer } from './WalletDrawer';
import '../styles/base.css';
import '../styles/pass-seven.css';
import '../styles/analytics-archive.css';
import '../styles/board.css';
import '../styles/board-signals.css';
import '../styles/board-next.css';
import '../styles/board-state.css';
import '../styles/overlays.css';
import '../styles/overlay-panels.css';
import '../styles/destinations.css';
import '../styles/explorer-next.css';
import '../styles/explorer-controls.css';
import '../styles/explorer-result-views.css';
import '../styles/explorer-record-dossiers.css';
import '../styles/explorer-responsive.css';
import '../styles/destination-review.css';
import '../styles/review-lab.css';
import '../styles/review-dossier.css';
import '../styles/review-responsive.css';
import '../styles/review-list.css';
import '../styles/review-cut.css';
import '../styles/review-decisions.css';
import '../styles/decision-flow.css';
import '../styles/submission-chart.css';
import '../styles/submission-actions.css';
import '../styles/trade-ticket.css';
import '../styles/pass-eight.css';
import '../styles/pass-nine.css';
import '../styles/pass-ten.css';
import '../styles/archive-gallery.css';
import '../styles/archive-positions.css';
import '../styles/audit.css';
import '../styles/art-direction.css';
import '../styles/refinement.css';
import { RouteAnnouncement } from './RouteAnnouncement';

export function OpportunityApp() {
  const { route, navigate } = useOpportunityRoute();
  const { panel, openPanel, closePanel } = useUrlPanel();
  const theme = useTheme();
  const wallet = useWallet();
  const [tour, setTour] = useState(false);
  const finishTour = () => {
    try { window.localStorage.setItem('opportunity-tour-complete', 'true'); } catch { /* Session remains usable. */ }
    setTour(false);
    window.dispatchEvent(new CustomEvent('opportunity:tour-step', { detail: 'close' }));
  };
  const startTour = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('explainer');
    navigate(`${url.pathname}${url.search}`, true);
    setTour(true);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const typing = (event.target as HTMLElement)?.closest('input,textarea,select,[contenteditable="true"]');
      if (((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') || (event.key === '/' && !typing)) {
        event.preventDefault();
        openPanel('search');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [openPanel]);

  const openReview = (marketId: string, submissionId?: string) => navigate(`/opportunity/review/${marketId}${submissionId ? `?submission=${encodeURIComponent(submissionId)}` : ''}`);
  const navItems: ShellNavItem[] = [
    { id: 'board', label: 'Opportunity', href: '/opportunity', active: route.name === 'board' && panel !== 'protocol' },
    { id: 'explorer', label: 'Explorer', href: '/opportunity/explorer', active: route.name === 'explorer' && panel !== 'protocol' },
    { id: 'protocol', label: 'Protocol', href: '/opportunity?panel=protocol', active: panel === 'protocol', onClick: () => openPanel('protocol') },
    { id: 'archive', label: 'Archive', href: '/opportunity/archive', active: route.name === 'archive' && panel !== 'protocol' },
  ];

  return (
    <WalletProvider wallet={wallet}>
      <Shell
        productLabel="Opportunity Markets"
        footer={<footer className="opportunity-footer"><span>Seer · Information Finance</span><nav aria-label="Seer products"><a href="/explorer">Explorer</a><a href="/deep">Deep</a><a href="/futarchy">Futarchy</a><a href="/opportunity">Opportunity</a><a href="/risk">Risk</a></nav><span>Source snapshots · Samples labeled</span></footer>}
        pageClassName="opportunity-shell"
        theme={theme.resolved}
        navItems={navItems}
        onNavigate={navigate}
        headerControls={
          <HeaderActions
            themePreference={theme.preference}
            resolvedTheme={theme.resolved}
            onThemeChange={theme.setPreference}
            walletStatus={wallet.status}
            walletAddress={wallet.shortAddress}
            onOpenPanel={openPanel}
          />
        }
      >
        <RouteAnnouncement route={route.pathname} walletMessage={wallet.message} />
        <OfflineNotice />
        <RouteBoundary key={route.pathname}>
        <Suspense fallback={<RouteStatus kind="loading" />}>
        {route.name === 'not-found' && <RouteStatus kind="not-found" onRecover={() => navigate('/opportunity')} />}
        {route.name === 'board' && (
          <BoardView onOpenProtocol={() => openPanel('protocol')} onOpenReview={openReview} />
        )}
        {route.name === 'explorer' && <ExplorerView />}
        {route.name === 'archive' && <ArchiveView />}
        {route.name === 'review' && (
          <ReviewView
            key={route.marketId}
            marketId={route.marketId}
            initialSubmissionId={new URLSearchParams(window.location.search).get('submission')}
            walletStatus={wallet.status}
            walletAddress={wallet.address}
            walletBalance={wallet.balance}
            collateralBalance={wallet.collateralBalance}
            onSignMessage={wallet.signMessage}
            onOpenWallet={() => openPanel('wallet')}
            onNavigate={navigate}
            onBack={() => navigate('/opportunity')}
          />
        )}
        </Suspense>
        </RouteBoundary>
      {panel === 'search' && <CommandPalette onClose={closePanel} onNavigate={navigate} />}
      {panel === 'help' && (
        <HelpTour onClose={closePanel} onNavigate={navigate} onOpenPanel={openPanel} onStartTour={startTour} />
      )}
      {panel === 'protocol' && <ProtocolDrawer onClose={closePanel} />}
      {panel === 'wallet' && <WalletDrawer wallet={wallet} onClose={closePanel} />}
      {tour && <GuidedTour onClose={finishTour} onNavigate={navigate} />}
      </Shell>
    </WalletProvider>
  );
}
