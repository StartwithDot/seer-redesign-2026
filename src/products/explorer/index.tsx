import React from 'react';
import { AccountPage } from './components/AccountPage';
import { CollectionsPage } from './components/CollectionsPage';
import { CreateMarketPage } from './components/CreateMarketPage';
import { LeaderboardPage } from './components/LeaderboardPage';
import { MarketIndex } from './components/MarketIndex';
import { MarketRecordPage } from './components/MarketRecordPage';
import { NotFoundPage } from './components/NotFoundPage';
import { PolicyPage } from './components/PolicyPage';
import { ExplorerShell } from './ExplorerShell';
import { getMarketRecord } from './data/markets';
import { initializeTheme } from './lib/theme';

initializeTheme();

class ExplorerBoundary extends React.Component<React.PropsWithChildren, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <div className="explorer-shell"><section className="empty-state" role="alert"><h1>Explorer could not open</h1><p>Reload to retry loading the market index.</p><button type="button" className="primary-button" onClick={() => window.location.reload()}>Reload Explorer</button></section></div>;
    return this.props.children;
  }
}

export const Page: React.FC = () => <ExplorerBoundary><ExplorerPage /></ExplorerBoundary>;

const ExplorerPage: React.FC = () => (
  <ExplorerShell>
    {({ route, navigate, onQuickBuy, onOpenWallet, wallet }) => {
      if (route.name === 'markets') {
        return <MarketIndex route={route} navigate={navigate} onQuickBuy={onQuickBuy} />;
      }
      if (route.name === 'market') {
        const market = getMarketRecord(route.chainId, route.slug);
        return market ? (
          <MarketRecordPage
            key={market.id}
            market={market}
            navigate={navigate}
            onQuickBuy={onQuickBuy}
            onOpenWallet={onOpenWallet}
            wallet={wallet}
          />
        ) : (
          <NotFoundPage routePath={route.pathname} navigate={navigate} />
        );
      }
      if (route.name === 'leaderboard') return <LeaderboardPage wallet={wallet} onOpenWallet={onOpenWallet} />;
      if (route.name === 'create') return <CreateMarketPage key={route.query.toString()} query={route.query} wallet={wallet} onOpenWallet={onOpenWallet} />;
      if (route.name === 'policy') return <PolicyPage policy={route.policy} navigate={navigate} />;
      if (route.name === 'account') {
        return (
          <AccountPage
            wallet={wallet}
            view={route.query.get('view') ?? 'account'}
            navigate={navigate}
            onWallet={onOpenWallet}
          />
        );
      }
      if (route.name === 'collections') return <CollectionsPage key={route.collectionId} collectionId={route.collectionId} navigate={navigate} onQuickBuy={onQuickBuy} wallet={wallet} onOpenWallet={onOpenWallet} />;
      return <NotFoundPage routePath={route.pathname} navigate={navigate} />;
    }}
  </ExplorerShell>
);
