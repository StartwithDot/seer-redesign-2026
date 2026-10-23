import { useLeaderboard } from '../state/useLeaderboard';
import { LeaderboardState } from '../components/LeaderboardState';
import { MapBoundary } from '../components/MapBoundary';
import { WalletInspector } from '../components/WalletInspector';
import { WalletAnalysis } from '../components/WalletAnalysis';
import { useEffect, useMemo, useState } from 'react';
import { AccountStatusDrawer } from '../components/AccountStatusDrawer';
import { Icon } from '../components/Icons';
import { LeaderboardMap } from '../components/LeaderboardMap';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { LeaderboardToolbar } from '../components/LeaderboardToolbar';
import {
  isLeaderboardPeriod,
  leaderboardPeriodLabel,
  metadataForPeriod,
  walletsForPeriod,
} from '../data/leaderboard-periods';
import type { LeaderboardPeriod, LeaderboardView, LeaderboardWallet } from '../data/types';
import { useDeepState } from '../state/DeepState';
import { navigateDeep, setDeepQueryParam, useDeepPath } from '../state/router';
import { resolveWalletProfile } from '../data/profiles';

export function LeaderboardPage() {
  const { wallet } = useDeepState();
  const deepPath = useDeepPath();
  const query = new URL(deepPath, window.location.origin).searchParams;
  const queryPeriod = query.get('period') ?? 'all';
  const period: LeaderboardPeriod = isLeaderboardPeriod(queryPeriod) ? queryPeriod : 'all';
  const setPeriod = (next: LeaderboardPeriod, history: 'push' | 'replace' = 'push') => setDeepQueryParam('period', next, history);
  const queryView = query.get('view');
  const view: LeaderboardView = queryView === 'map' || queryView === 'both' ? queryView : 'table';
  const setView = (value: LeaderboardView) => setDeepQueryParam('view', value, 'push');
  const search = query.get('q') ?? '';
  const setSearch = (value: string) => setDeepQueryParam('q', value);
  const [hoveredWallet, setHoveredWallet] = useState<LeaderboardWallet | null>(null);
  const metadata = metadataForPeriod(period);
  const [replayActive, setReplayActive] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const resource = useLeaderboard(period);
  const periodWallets = resource.rows;
  const retry = () => {
    setDeepQueryParam('retry', '');
    setDeepQueryParam('error', '');
    resource.retry();
  };
  const filteredWallets = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return periodWallets;
    return periodWallets.filter((item) =>
      item.address.toLowerCase().includes(query)
      || item.ensName?.toLowerCase().includes(query)
      || resolveWalletProfile(item.address).displayName?.toLowerCase().includes(query)
    );
  }, [periodWallets, search]);
  const activeWallet = useMemo(() => {
    return periodWallets.find((item) => item.address === selectedAddress)
      ?? (['all', '1d', '1w', '1m'] as const).flatMap(walletsForPeriod).find(item => item.address === selectedAddress)
      ?? filteredWallets[0]
      ?? periodWallets[0];
  }, [filteredWallets, periodWallets, selectedAddress]);
  const summary = { walletCount: periodWallets.length, totalVolume: periodWallets.reduce((sum, row) => sum + row.volume, 0), winners: periodWallets.filter(row => row.profitLoss > 0).length, losers: periodWallets.filter(row => row.profitLoss < 0).length };

  useEffect(() => { setHoveredWallet(null); }, [period, search]);
  useEffect(() => {
    if (!replayActive) return;
    const order: LeaderboardPeriod[] = ['1d', '1w', '1m', 'all'];
    let index = 0;
    setPeriod(order[index], 'replace');
    const interval = window.setInterval(() => {
      index += 1;
      if (index >= order.length) { setReplayActive(false); return; }
      setPeriod(order[index], 'replace');
    }, 2200);
    return () => window.clearInterval(interval);
  }, [replayActive]);

  const updatePeriod = (next: LeaderboardPeriod) => {
    setReplayActive(false);
    setPeriod(next);
  };

  return (
    <section className="deep-page deep-leaderboard-page">
      <header className="deep-page__header">
        <div>
          <p className="deep-eyebrow">All Deep markets</p>
          <h1>Wallet landscape</h1>
          <p>Compare profit, volume and market reach.</p>
        </div>
        <div className="deep-page__actions">
          <button className="deep-button" type="button" onClick={() => setAccountOpen(true)}>Account status <Icon name="arrow" /></button>
          <button className="deep-button deep-button--primary" type="button" onClick={() => navigateDeep('/deep')}>Back to the field <Icon name="arrow" /></button>
        </div>
      </header>

      <LeaderboardToolbar
        period={period}
        onPeriodChange={updatePeriod}
        view={view}
        onViewChange={setView}
        search={search}
        onSearchChange={setSearch}
        replayActive={replayActive}
        onToggleReplay={() => setReplayActive((active) => !active)}
      />

      <p className="deep-preview-disclaimer">Saved API rankings · {new Date(metadata.updatedAt).toLocaleString('en', { timeZone: 'UTC', timeZoneName: 'short' })}</p>
      {resource.status === 'ready' && <div className="deep-leaderboard-summary">
        <div><span>Wallets</span><strong>{summary.walletCount}</strong></div>
        <div><span>Total volume</span><strong>${summary.totalVolume.toLocaleString()}</strong></div>
        <div><span>Winners</span><strong>{summary.winners}</strong></div>
        <div><span>Losers</span><strong>{summary.losers}</strong></div>
        <div><span>Period</span><strong>{leaderboardPeriodLabel(period)}</strong></div>
      </div>}

      <div className="deep-your-rank" role="status">
        <span>Your rank</span>
        <strong>{resource.status === 'loading' ? 'Loading rank…' : resource.status === 'error' ? 'Rank unavailable while the snapshot cannot be read' : wallet.status === 'connected' ? (() => { const ranked = periodWallets.find(item => item.address.toLowerCase() === wallet.address?.toLowerCase()); return ranked ? `#${ranked.rank} in this reference dataset` : 'Not present in the available period dataset'; })() : 'Connect wallet to compare your rank'}</strong>
      </div>

      {resource.status !== 'ready' && <LeaderboardState status={resource.status} message={resource.status === 'error' ? resource.error : undefined} onRetry={resource.status === 'error' ? retry : undefined} />}
      {resource.status === 'ready' && !periodWallets.length && period === 'all' && <LeaderboardState status="empty" message="The available snapshot contains no ranked wallets. Reload the snapshot to check again." onRetry={retry} />}
      {resource.status === 'ready' && (periodWallets.length > 0 || period !== 'all') && <div className={`deep-leaderboard-workspace is-${view}`}>
        {(view === 'table' || view === 'both') && (
          filteredWallets.length ? (
            <LeaderboardTable
              wallets={filteredWallets}
              selected={hoveredWallet ?? activeWallet}
              onSelect={(item) => { setSelectedAddress(item.address); setInspectorOpen(true); }}
              periodLabel={leaderboardPeriodLabel(period)}
              onHover={setHoveredWallet}
            />
          ) : (
            <div className="deep-table-empty">
              <strong>{ `No wallet address matches “${search}”.`}</strong>
              {search ? <button className="deep-button" type="button" onClick={() => setSearch('')}>Clear search</button> : <button className="deep-button" type="button" onClick={() => updatePeriod('all')}>Show all-time snapshot</button>}
            </div>
          )
        )}
        {(view === 'map' || view === 'both') && filteredWallets.length > 0 && (
          <MapBoundary key={period} onTable={() => setView('table')}><LeaderboardMap
            wallets={filteredWallets}
            selected={hoveredWallet ?? activeWallet}
            onHover={setHoveredWallet}
            onSelect={(item) => { setSelectedAddress(item.address); setInspectorOpen(true); }}
          /></MapBoundary>
        )}
        {view === 'map' && !filteredWallets.length && (
          <div className="deep-table-empty">
            <strong>{ 'No wallets are available for this search.'}</strong>
            {search ? <button className="deep-button" type="button" onClick={() => setSearch('')}>Clear search</button> : <button className="deep-button" type="button" onClick={() => updatePeriod('all')}>Show all-time snapshot</button>}
          </div>
        )}
      </div>}

      <details className="deep-snapshot-meta"><summary>Ranking data</summary><dl>{Object.entries(metadata).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{String(value)}</dd></div>)}</dl></details>
      {periodWallets.length > 0 && <WalletAnalysis wallets={periodWallets} />}
      {activeWallet && <WalletInspector wallet={activeWallet} open={inspectorOpen} onClose={() => setInspectorOpen(false)} onSelect={item => { setSelectedAddress(item.address); setInspectorOpen(true); }} />}

      <AccountStatusDrawer open={accountOpen} onClose={() => setAccountOpen(false)} walletAddress={wallet.address} />
    </section>
  );
}
