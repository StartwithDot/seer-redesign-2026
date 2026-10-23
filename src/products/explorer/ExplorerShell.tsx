import { useEffect, useState, type ReactNode } from 'react';
import { Dialog } from './components/Dialog';
import { CreateMarketPage } from './components/CreateMarketPage';
import { CommandPalette } from './components/CommandPalette';
import { ExplorerHeader } from './components/ExplorerHeader';
import { GuidedTour } from './components/GuidedTour';
import { MobileNavSheet } from './components/MobileNavSheet';
import { ProductFooter } from './components/ProductFooter';
import { QuickBuySheet } from './components/QuickBuySheet';
import { WalletSheet } from './components/WalletSheet';
import { useExplorerRoute } from './hooks/useExplorerRoute';
import { useRouteScroll } from './hooks/useRouteScroll';
import { useWallet } from './hooks/useWallet';
import type { WalletController } from './hooks/useWallet';
import { applyTheme, getStoredTheme, isTheme, THEME_STORAGE_KEY, type Theme } from './lib/theme';
import type { ExplorerHashRoute, Market } from './types';
import './styles/base.css';
import './styles/shell.css';
import './styles/pages.css';
import './styles/creation-and-collections.css';
import './styles/market-workbench.css';
import './styles/records.css';
import './styles/overlays.css';
import './styles/trade-and-leaderboard.css';
import './styles/quality.css';
import './styles/audit.css';
import './styles/redesign.css';
import './styles/spec-qa.css';

type Overlay = 'search' | 'help' | 'wallet' | 'mobile' | null;

interface ExplorerShellProps {
  children: (context: {
    route: ExplorerHashRoute;
    navigate: (hash: string, options?: { replace?: boolean }) => void;
    onQuickBuy: (market: Market, outcomeId?: string) => void;
    onOpenWallet: () => void;
    wallet: WalletController;
  }) => ReactNode;
}

export function ExplorerShell({ children }: ExplorerShellProps) {
  const { route, navigate } = useExplorerRoute();
  const wallet = useWallet();
  const [theme, setTheme] = useState<Theme>(getStoredTheme);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [createOpen, setCreateOpen] = useState(false);
  useEffect(() => { const open = () => setCreateOpen(true); window.addEventListener('explorer:create', open); return () => window.removeEventListener('explorer:create', open); }, []);
  const [quickBuy, setQuickBuy] = useState<{ market: Market; outcomeId?: string } | null>(null);
  const routeKey = `${route.pathname}?${route.query.toString()}`;
  useRouteScroll(routeKey, route.name === 'market' ? `market:${route.slug}` : route.name);

  useEffect(() => {
    const syncTheme = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) return;
      const next = isTheme(event.newValue) ? event.newValue : 'dark';
      applyTheme(next);
      setTheme(next);
    };
    window.addEventListener('storage', syncTheme);
    return () => window.removeEventListener('storage', syncTheme);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const typing = (event.target as HTMLElement)?.closest('input, textarea, select, [contenteditable="true"]');
      if (!overlay && !quickBuy && !createOpen && (((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') || (event.key === '/' && !typing))) {
        event.preventDefault();
        setOverlay('search');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [overlay, quickBuy, createOpen]);

  const closeOverlay = () => setOverlay(null);
  const openQuickBuy = (market: Market, outcomeId?: string) => setQuickBuy({ market, outcomeId });

  return (
    <div className="explorer-shell">
      <a className="product-skip" href="#explorer-main" onClick={(event) => { event.preventDefault(); const main = document.getElementById('explorer-main'); main?.focus(); main?.scrollIntoView(); }}>Skip to content</a>
      <ExplorerHeader
        route={route}
        navigate={navigate}
        wallet={wallet}
        theme={theme}
        onThemeChange={setTheme}
        onSearch={() => setOverlay('search')}
        onHelp={() => setOverlay('help')}
        onWallet={() => setOverlay('wallet')}
        onMobile={() => setOverlay('mobile')}
      />
      <main id="explorer-main" tabIndex={-1}>
        {children({
          route,
          navigate,
          onQuickBuy: openQuickBuy,
          onOpenWallet: () => setOverlay('wallet'),
          wallet,
        })}
      </main>
      <Dialog open={createOpen} suspended={overlay === 'wallet'} title="Create a market" className="create-flow-dialog" onClose={() => setCreateOpen(false)}><CreateMarketPage query={new URLSearchParams()} wallet={wallet} onOpenWallet={() => setOverlay('wallet')} /></Dialog>
      <ProductFooter navigate={navigate} />
      <CommandPalette open={overlay === 'search'} route={route} onClose={closeOverlay} navigate={navigate} onHelp={() => setOverlay('help')} />
      <GuidedTour open={overlay === 'help'} onClose={() => { try { localStorage.setItem('explorer-tour-seen', 'true'); } catch { /* In-memory dismissal. */ } closeOverlay(); }} />
      <WalletSheet open={overlay === 'wallet'} wallet={wallet} onClose={closeOverlay} />
      <MobileNavSheet
        open={overlay === 'mobile'}
        connected={Boolean(wallet.account)}
        theme={theme}
        onThemeChange={setTheme}
        wallet={wallet}
        onClose={closeOverlay}
        navigate={navigate}
        onSearch={() => setOverlay('search')}
        onHelp={() => setOverlay('help')}
        onWallet={() => setOverlay('wallet')}
      />
      <QuickBuySheet
        open={Boolean(quickBuy)}
        market={quickBuy?.market ?? null}
        outcomeId={quickBuy?.outcomeId}
        wallet={wallet}
        onClose={() => setQuickBuy(null)}
        onOpenWallet={() => { setQuickBuy(null); setOverlay('wallet'); }}
      />
    </div>
  );
}
