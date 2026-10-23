import './state/theme';
import { Component, useLayoutEffect, type ReactNode, type FC } from 'react';
import './deep.css';
import './deep-pass2.css';
import './deep-pass3.css';
import './deep-pass4.css';
import './deep-pass5.css';
import './deep-pass6.css';
import './deep-pass7.css';
import './deep-pass8.css';
import './deep-pass9.css';
import './deep-pass10.css';
import './deep-accessibility.css';
import './deep-audit.css';
import './deep-redesign.css';
import { AppShell } from './components/AppShell';
import { ContestsPage } from './pages/ContestsPage';
import { ContestDetailPage } from './pages/ContestDetailPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { MarketsPage } from './pages/MarketsPage';
import { RepositoryDetailPage } from './pages/RepositoryDetailPage';
import { DeepStateProvider } from './state/DeepState';
import { PredictionStateProvider } from './state/Predictions';
import { TradeStateProvider } from './state/TradeState';
import { restoreBootstrappedUrl, useDeepPath } from './state/router';

function resolveRoute(path: string) {
  let parsedPath: string;
  try { parsedPath = decodeURI(new URL(path, window.location.origin).pathname); }
  catch { parsedPath = '/deep/invalid-link'; }
  const pathname = parsedPath.replace(/\/+$/, '') || '/deep';
  if (pathname === '/deep') {
    const round = new URL(path, window.location.origin).searchParams.get('round');
    if (round && round !== 'round-3-originality') return { kind: 'contest' as const, content: <ContestDetailPage contestId={round} /> };
    return { kind: 'markets' as const, content: <MarketsPage /> };
  }
  if (pathname === '/deep/leaderboard') return { kind: 'leaderboard' as const, content: <LeaderboardPage /> };
  if (pathname === '/deep/contests') return { kind: 'contests' as const, content: <ContestsPage /> };
  const contestMatch = pathname.match(/^\/deep\/contests\/([^/]+)$/);
  if (contestMatch) return {
    kind: 'contest' as const,
    content: <ContestDetailPage contestId={contestMatch[1]} />,
  };
  const repositoryMatch = pathname.match(/^\/deep\/repo\/([^/]+)\/([^/]+)$/);
  if (repositoryMatch) return {
    kind: 'repository' as const,
    content: <RepositoryDetailPage owner={repositoryMatch[1]} repoName={repositoryMatch[2]} />,
  };
  return {
    kind: 'markets' as const,
    content: (
      <section className="deep-page deep-state-page">
        <p className="deep-eyebrow">Route not found</p>
        <h1>Deep view not found</h1>
        <a className="deep-button deep-button--primary" href="/deep">Return to the field</a>
      </section>
    ),
  };
}

const DeepRouter: FC = () => {
  const path = useDeepPath();
  const route = resolveRoute(path);
  const pathname = new URL(path, window.location.origin).pathname;
  useLayoutEffect(() => {
    restoreBootstrappedUrl();
    window.scrollTo({ top: 0 });
    document.getElementById('deep-main')?.scrollTo({ top: 0 });
  }, [pathname]);
  return <AppShell routeKind={route.kind}>{route.content}</AppShell>;
};

class DeepRenderBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <div className="deep-app"><main className="deep-render-error" role="alert">
      <h1>Deep could not load this view</h1>
      <p>Reload to retry the recorded market data, or open the live Deep app.</p>
      <button className="deep-button" onClick={() => window.location.reload()}>Reload Deep</button>
      <a className="deep-button" href="https://deep.seer.pm">Open live Deep</a>
    </main></div>;
    return this.props.children;
  }
}

export const Page: FC = () => (
  <DeepRenderBoundary>
  <DeepStateProvider>
    <PredictionStateProvider>
      <TradeStateProvider>
        <DeepRouter />
      </TradeStateProvider>
    </PredictionStateProvider>
  </DeepStateProvider>
  </DeepRenderBoundary>
);
