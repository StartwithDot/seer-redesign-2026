import { type ReactNode } from 'react';
import { navigateDeep, setDeepQueryParam, useDeepPath } from '../state/router';
import { ShareView } from './ShareView';
import { Footer } from './Footer';
import { GlobalAlerts } from './GlobalAlerts';
import { GuideDrawer } from './GuideDrawer';
import { Header, type DeepRouteKind } from './Header';
import { FundsDrawer } from './FundsDrawer';
import { RouteStatus } from './RouteStatus';
import { ContestTabs } from './ContestTabs';

export function AppShell({ routeKind, children }: { routeKind: DeepRouteKind; children: ReactNode }) {
  const path = useDeepPath();
  const guideOpen = new URL(path, window.location.origin).searchParams.get('dialog') === 'guide';
  const setGuideOpen = (open: boolean) => setDeepQueryParam('dialog', open ? 'guide' : '', 'push');
  return (
    <div className="deep-app" onClick={event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[href]');
      if (!anchor || anchor.target || anchor.hasAttribute('download')) return;
      const url = new URL(anchor.href, window.location.origin);
      if (url.origin !== window.location.origin || !(url.pathname === '/deep' || url.pathname.startsWith('/deep/')) || anchor.getAttribute('href')?.startsWith('#')) return;
      event.preventDefault();
      navigateDeep(`${url.pathname}${url.search}${url.hash}`);
    }}>
      <a className="deep-skip" href="#deep-main">Skip to content</a>
      <Header routeKind={routeKind} onGuide={() => setGuideOpen(true)} />
      {(routeKind === 'contest' || routeKind === 'contests') && (
        <div className="deep-v4-contest-strip"><ContestTabs /></div>
      )}
      <GlobalAlerts />
      <main id="deep-main" className="deep-main" tabIndex={-1}>{children}</main>
      <RouteStatus pathname={new URL(path, window.location.origin).pathname} />
      <div className="deep-v4-footer-tools"><ShareView /></div>
      <Footer />
      <GuideDrawer open={guideOpen} onClose={() => setGuideOpen(false)} />
      <FundsDrawer open={new URL(path, window.location.origin).searchParams.get('dialog') === 'funds'} onClose={() => setDeepQueryParam('dialog', '', 'push')} />
    </div>
  );
}
