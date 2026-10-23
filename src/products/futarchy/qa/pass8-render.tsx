import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { check } from './assert';
import { ResearchContext, type MarketDataState } from '../hooks/useMarketData';
import { marketSnapshot } from '../data/marketSnapshot';
import { explorerMarkets } from '../data/explorer';
import { getWalletPortfolio } from '../data/portfolio';
import { getActivityTrades } from '../data/activity';
import { DataList } from '../components/DataList';
import { ListRegion } from '../components/ListState';
import { WalletDataGate } from '../components/WalletDataGate';
import { HomeView } from '../components/HomeView';
import { ExplorerView } from '../components/ExplorerView';
import { ExplorerEntityView } from '../components/ExplorerEntityView';
import { ExplorerGuideView } from '../components/ExplorerGuideView';
import { AssetBalanceTable } from '../components/AssetBalanceTable';
import { OutcomePositionTable } from '../components/OutcomePositionTable';
import { TradeHistoryTable } from '../components/TradeHistoryTable';
import { ActivityTable } from '../components/ActivityTable';
import { TransactionLog } from '../components/TransactionLog';
import { ContractProvenancePanel } from '../components/ContractProvenancePanel';
import { LifecycleDrawer } from '../components/LifecycleDrawer';
import { OrganizationView, MarketView } from '../components/RouteViews';
import { PositionDrawer } from '../components/PositionDrawer';
import { CollateralDrawer } from '../components/CollateralDrawer';
import { ResolutionDrawer } from '../components/ResolutionDrawer';
import { SearchPalette } from '../components/SearchPalette';
import { TradeDrawer } from '../components/TradeDrawer';
import type { WalletController } from '../hooks/useWallet';

const idle = () => {};
const readyData: MarketDataState = { loading: false, error: null, snapshot: marketSnapshot, reload: async () => {} };
const address = `0x${'1'.repeat(40)}`;
const wallet: WalletController = { status: 'connected', address, chainId: 100, balance: '0.0000', connect: async () => {}, refresh: async () => {}, switchChain: async () => {}, disconnect: idle };

const render = (children: ReactNode, state: MarketDataState = readyData) => renderToStaticMarkup(<ResearchContext.Provider value={state}>{children}</ResearchContext.Provider>);
function verifyMobileCells(html: string) {
  check.ok(html.includes('<table')); check.ok(html.includes('<caption'));
  for (const table of html.matchAll(/<table[\s\S]*?<\/table>/g)) for (const cell of table[0].matchAll(/<td\b([^>]*)>/g)) check.includes(cell[1], 'data-label=');
}

export function checkPass8Renders() {
  const location = { hash: '#/', href: 'https://test.local/futarchy#/' };
  Object.assign(globalThis, { location, window: { location, scrollY: 0, localStorage, sessionStorage: localStorage, matchMedia: () => ({ matches: false }) } });
  const item = <p>Visible market</p>;
  const list = <DataList label="Research results" count={1} emptyTitle="No research" onReset={idle}>{item}</DataList>;
  let html = render(list, { ...readyData, loading: true });
  check.includes(html, 'data-list-state="loading"'); check.includes(html, 'Loading Research results'); check.excludes(html, 'Visible market');
  html = render(list, { ...readyData, error: 'Research unavailable' });
  check.includes(html, 'data-list-state="error"'); check.includes(html, 'role="alert"'); check.includes(html, 'Retry'); check.excludes(html, 'Visible market');
  html = render(<DataList label="Research results" count={0} emptyTitle="No research" onReset={idle}>{item}</DataList>);
  check.includes(html, 'data-list-state="empty"'); check.includes(html, 'Clear filters'); check.excludes(html, 'Visible market');
  html = render(list); check.includes(html, 'data-list-state="ready"'); check.includes(html, 'Visible market');
  html = render(<DataList label="Account table" count={1} emptyTitle="No data" source={{ loading: false, error: 'RPC failed', reload: idle }}>{item}</DataList>);
  check.includes(html, 'RPC failed'); check.excludes(html, 'Visible market');
  html = render(<DataList label="Account table" count={1} emptyTitle="No data" source={{ loading: true, error: null, reload: idle }}>{item}</DataList>, { ...readyData, error: 'Research unavailable' });
  check.includes(html, 'Research unavailable'); check.excludes(html, 'Loading Account table');
  html = renderToStaticMarkup(<ListRegion label="Offline research" state="ready" offline>{item}</ListRegion>);
  check.includes(html, 'data-connectivity="offline"'); check.includes(html, 'aria-describedby="futarchy-connection-status"'); check.includes(html, 'Visible market');
  for (const [state, expected] of [
    [{ ...wallet, address: undefined, status: 'disconnected' as const }, 'Connect wallet'],
    [{ ...wallet, status: 'connecting' as const }, 'Loading wallet account'],
    [{ ...wallet, status: 'switching' as const }, 'Loading wallet network'],
    [{ ...wallet, status: 'wrong-network' as const, chainId: 1 }, 'Switch network'],
    [{ ...wallet, error: 'RPC failed', balance: undefined }, 'Refresh RPC'],
  ] as const) {
    html = render(<WalletDataGate wallet={state} onOpenWallet={idle}>{item}</WalletDataGate>);
    check.includes(html, expected); check.excludes(html, 'Visible market');
  }
  check.includes(render(<WalletDataGate wallet={wallet} onOpenWallet={idle}>{item}</WalletDataGate>), 'Visible market');

  const market = marketSnapshot.markets[0], portfolio = getWalletPortfolio(address, '0.0000', market);
  const tableViews = [
    <AssetBalanceTable assets={portfolio.assets} />, <OutcomePositionTable positions={portfolio.positions} />,
    <TradeHistoryTable trades={portfolio.trades} />, <ActivityTable trades={getActivityTrades(market)} freshIds={[]} />,
    <TransactionLog transactions={portfolio.transactions} />, <ExplorerGuideView section="leaderboard" />,
  ];
  for (const view of tableViews) {
    const markup = render(view); if (markup.includes('<table')) verifyMobileCells(markup);
    for (const state of [{ ...readyData, loading: true }, { ...readyData, error: 'Request failed' }]) {
      html = render(view, state); check.excludes(html, '<table'); check.includes(html, state.loading ? 'list-loading' : 'Request failed');
    }
  }
  for (const view of [<AssetBalanceTable assets={[]} />, <OutcomePositionTable positions={[]} />, <TradeHistoryTable trades={[]} />, <ActivityTable trades={[]} freshIds={[]} />, <TransactionLog transactions={[]} />]) {
    html = render(view); check.includes(html, 'data-list-state="empty"'); check.excludes(html, '<table');
  }
  const home = <HomeView onNavigate={idle} tourActive={false} />;
  html = render(home); verifyMobileCells(html); check.includes(html, 'signal-switcher');
  check.ok(!/NaN|Infinity/.test(html));
  html = render(home, { ...readyData, snapshot: { markets: [], organizations: [] } });
  check.includes(html, 'No active signals.'); check.includes(html, 'No organizations in this snapshot.'); check.excludes(html, 'signal-row-main');
  for (const state of [{ ...readyData, loading: true, snapshot: null }, { ...readyData, error: 'Research unavailable', snapshot: null }]) {
    html = render(home, state); check.excludes(html, 'signal-row-main'); check.excludes(html, '<table');
  }
  for (const view of [<ContractProvenancePanel market={market} />, <LifecycleDrawer market={market} onClose={idle} />]) {
    html = render(view); check.includes(html, 'data-list-state="ready"');
    html = render(view, { ...readyData, error: 'Research unavailable' }); check.includes(html, 'data-list-state="error"');
  }
  html = render(<OrganizationView id={market.organizationId} onNavigate={idle} />); check.includes(html, 'Organization markets');
  html = render(<MarketView id="missing" wallet={wallet} onNavigate={idle} onOpenWallet={idle} />); check.includes(html, 'NOT FOUND');
  html = render(<OrganizationView id={market.organizationId} onNavigate={idle} />, { ...readyData, snapshot: { markets: [], organizations: marketSnapshot.organizations } });
  check.includes(html, 'No markets for this organization.');

  const disconnected = { ...wallet, address: undefined, status: 'disconnected' as const, balance: undefined };
  for (const view of [<PositionDrawer market={market} wallet={disconnected} initialTab="position" onClose={idle} onOpenWallet={idle} onOpenCollateral={idle} />, <CollateralDrawer market={market} wallet={disconnected} onClose={idle} onOpenWallet={idle} onBackToPosition={idle} />, <ResolutionDrawer market={market} wallet={disconnected} onClose={idle} onOpenWallet={idle} />, <TradeDrawer market={market} wallet={disconnected} onClose={idle} onOpenWallet={idle} onOpenPosition={idle} />]) {
    html = render(view); check.includes(html, 'Connect wallet'); check.excludes(html, '<table'); check.excludes(html, 'data-list-state="ready"');
    check.ok(!/disabled=""[^>]*>Connect wallet/.test(html), 'Connection action should be enabled');
  }
  html = render(<ResolutionDrawer market={market} wallet={{ ...wallet, error: 'RPC failed', balance: undefined }} onClose={idle} onOpenWallet={idle} />);
  check.includes(html, 'Refresh RPC'); check.excludes(html, '0.0000</dd>');

  location.hash = '#/explorer?query=NoSuchQuestion';
  html = render(<ExplorerView onNavigate={idle} />); check.includes(html, 'No matching records.'); check.includes(html, 'Clear search and filters');
  location.hash = '#/explorer?view=saved';
  html = render(<ExplorerView onNavigate={idle} />); check.includes(html, 'Your research starts here.'); check.includes(html, 'Browse markets');
  location.hash = '#/explorer';
  for (const state of [{ ...readyData, loading: true }, { ...readyData, error: 'Research unavailable' }]) {
    html = render(<ExplorerView onNavigate={idle} />, state); check.excludes(html, 'class="explorer-result"');
  }
  html = render(<ExplorerEntityView kind="market" id={explorerMarkets[0].id} />); check.includes(html, 'Market outcomes'); check.includes(html, 'Connected records');
  html = render(<SearchPalette open onClose={idle} onNavigate={idle} onToggleTheme={idle} onStartTour={idle} />);
  check.includes(html, 'role="combobox"'); check.includes(html, 'role="listbox"'); check.includes(html, 'role="group"');
  html = render(<SearchPalette open onClose={idle} onNavigate={idle} onToggleTheme={idle} onStartTour={idle} />, { ...readyData, loading: true });
  check.excludes(html, 'role="option"'); check.excludes(html, 'aria-activedescendant=');
  const storage = globalThis.localStorage;
  Object.assign(globalThis, { localStorage: { getItem: () => { throw new Error('Storage denied'); } } });
  location.hash = '#/explorer?view=saved';
  html = render(<ExplorerView onNavigate={idle} />); check.includes(html, 'Saved markets could not be read.'); check.excludes(html, 'Your research starts here.');
  location.hash = '#/explorer?view=entities';
  html = render(<ExplorerView onNavigate={idle} />); check.includes(html, 'Local receipt records could not be read.');
  html = render(<ExplorerEntityView kind="wallet" id={address} />); check.includes(html, 'Local receipt records could not be read.'); check.excludes(html, 'No linked records in this snapshot.');
  Object.assign(globalThis, { localStorage: storage }); location.hash = '#/';
  console.log('Pass 8 render checks passed: loading/error/empty/ready lists, wallet gates, table mobile labels, home/Explorer/routes and command semantics. Browser interactions are checked separately.');
}
