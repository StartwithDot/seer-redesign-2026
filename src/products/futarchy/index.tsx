import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import type { ShellNavItem } from '../shared/Shell';
import { AppShell } from './components/AppShell';
import { ExplorerNavigation } from './components/ExplorerNavigation';
import { ExplorerGuideView } from './components/ExplorerGuideView';
import { ConnectionBanner, DataBoundary, ViewLoading } from './components/DataBoundary';
const ExplorerView = lazy(() => import('./components/ExplorerView').then(m => ({ default: m.ExplorerView })));
import { CreateView } from './components/CreateView';
import { GuidedTour } from './components/GuidedTour';
import { HomeView } from './components/HomeView';
import { HelpIcon, MoonIcon, SearchIcon, SunIcon, WalletIcon } from './components/Icons';
import { ProductFooter } from './components/ProductFooter';
import { OrganizationView, MarketView } from './components/RouteViews';
import { SearchPalette } from './components/SearchPalette';
import { WalletDrawer } from './components/WalletDrawer';
import { ResearchProvider } from './components/ResearchProvider';
import { readStorage } from './data/browserStorage';
import { shortAddress } from './data/format';
import { useHashRoute } from './hooks/useHashRoute';
import { useTheme } from './hooks/useTheme';
import { useWallet } from './hooks/useWallet';
import './futarchy.css';
import './landing.css';
import './views.css';
import './collections.css';
import './evidence.css';
import './overlays.css';
import './trade.css';
import './position.css';
import './operations.css';
import './signal-lab.css';
import './twap.css';
import './creation.css';
import './explorer.css';
import './activity.css';
import './entity.css';
import './states.css';
import './quality.css';
import './audit.css';

function FutarchyApp() {
  const { route, hash, navigate } = useHashRoute();
  const { theme, toggleTheme } = useTheme();
  const wallet = useWallet();
  const [walletOpen, setWalletOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);

  const jumpHome = useCallback((target: string) => {
    navigate(`#/?section=${encodeURIComponent(target)}`);
  }, [navigate]);

  const startTour = useCallback(() => {
    navigate('#/');
    window.setTimeout(() => setTourOpen(true), 40);
  }, [navigate]);

  useEffect(() => {
    if (readStorage('futarchy-tour-complete') !== 'true') {
      const timer = window.setTimeout(() => setTourOpen(true), 650);
      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('[role="dialog"]')) return;
      const typing = target?.matches('input, textarea, select, [contenteditable="true"]');
      if ((event.key === '/' && !typing) || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k')) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const navItems: ShellNavItem[] = [
    { id: 'explorer', label: 'Explorer', onClick: () => navigate('#/explorer') },
    { id: 'milestones', label: 'Milestones', onClick: () => jumpHome('milestones') },
    { id: 'organizations', label: 'Organizations', onClick: () => jumpHome('organizations') },
    { id: 'create', label: 'Create', onClick: () => navigate('#/create') },
  ];

  const headerControls = (
    <>
      <button className="header-icon-button" type="button" data-tour="theme" onClick={toggleTheme} aria-label={`Use ${theme === 'light' ? 'dark' : 'light'} theme`}>
        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
      </button>
      <button className="header-search-button" type="button" data-tour="search" aria-label="Search Futarchy" aria-haspopup="dialog" onClick={() => setSearchOpen(true)}>
        <SearchIcon /><span>Search</span><kbd>/</kbd>
      </button>
      <button className="header-icon-button" type="button" aria-label="Start guided tour" onClick={startTour}><HelpIcon /></button>
      <button className="wallet-trigger" type="button" data-tour="wallet" aria-label={wallet.address ? `Open wallet ${shortAddress(wallet.address)}` : 'Connect Wallet'} aria-haspopup="dialog" onClick={() => setWalletOpen(true)}>
        <WalletIcon /><span>{wallet.address ? shortAddress(wallet.address) : 'Connect Wallet'}</span>
      </button>
    </>
  );

  return (
    <AppShell navItems={navItems} headerControls={headerControls}>
      <ConnectionBanner />
      <DataBoundary key={route.key} onRetry={() => window.location.reload()}><Suspense fallback={<ViewLoading />}>
      {route.name === 'home' && <HomeView onNavigate={navigate} tourActive={tourOpen} section={new URLSearchParams(hash.split('?')[1]).get('section') || undefined} />}
      {route.name === 'organization' && <OrganizationView id={route.id} onNavigate={navigate} />}
      {route.name === 'market' && <MarketView id={route.id} wallet={wallet} onNavigate={navigate} onOpenWallet={() => setWalletOpen(true)} />}
      {route.name === 'create' && <CreateView onNavigate={navigate} wallet={wallet} onOpenWallet={() => setWalletOpen(true)} />}
      {route.name === 'explorer' && <><ExplorerNavigation current={route.kind || 'markets'} />{['leaderboard', 'policies', 'help'].includes(route.kind || '') ? <ExplorerGuideView section={route.kind!} /> : <ExplorerView kind={route.kind} id={route.id} onNavigate={navigate} />}</>}
      </Suspense></DataBoundary>
      <ProductFooter />
      {walletOpen && <WalletDrawer wallet={wallet} onClose={() => setWalletOpen(false)} />}
      <SearchPalette
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={navigate}
        onToggleTheme={toggleTheme}
        onStartTour={startTour}
      />
      <GuidedTour open={tourOpen} onClose={() => setTourOpen(false)} />
    </AppShell>
  );
}

export const Page = () => <ResearchProvider><FutarchyApp /></ResearchProvider>;
