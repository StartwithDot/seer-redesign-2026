import { mobileWorkspace, mobileWorkspaceHref } from '../data/workspace';
import { navigateDeep, useDeepPath } from '../state/router';
import type { DeepRouteKind } from './Header';

export function MobileNavigation({ routeKind }: { routeKind: DeepRouteKind }) {
  const path = useDeepPath();
  const workspace = mobileWorkspace(new URL(path, window.location.origin).searchParams.get('workspace'));
  return <nav className="deep-mobile-nav" aria-label="Mobile Deep sections">
    {(['chart', 'list', 'desk'] as const).map(value => <button key={value} type="button"
      aria-current={routeKind === 'markets' && workspace === value ? 'page' : undefined}
      onClick={() => navigateDeep(mobileWorkspaceHref(value, path, window.location.origin))}>
      {value === 'chart' ? 'Chart' : value === 'list' ? 'List' : 'Desk'}
    </button>)}
    <button type="button" aria-current={routeKind === 'leaderboard' ? 'page' : undefined}
      onClick={() => navigateDeep('/deep/leaderboard')}>Board</button>
  </nav>;
}
