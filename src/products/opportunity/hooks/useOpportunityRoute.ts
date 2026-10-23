import { useCallback, useEffect, useState } from 'react';

export type OpportunityRoute =
  | { name: 'not-found'; pathname: string }
  | { name: 'board'; pathname: '/opportunity' }
  | { name: 'explorer'; pathname: '/opportunity/explorer' }
  | { name: 'review'; pathname: `/opportunity/review/${string}`; marketId: string }
  | { name: 'archive'; pathname: '/opportunity/archive' };

export function parseOpportunityRoute(pathname: string): OpportunityRoute {
  const clean = pathname.replace(/\/+$/, '') || '/opportunity';
  if (clean === '/opportunity/explorer') return { name: 'explorer', pathname: clean };
  if (clean === '/opportunity/archive') return { name: 'archive', pathname: clean };
  const review = clean.match(/^\/opportunity\/review\/([^/]+)$/);
  if (review) {
    return {
      name: 'review',
      pathname: `/opportunity/review/${review[1]}`,
      marketId: (() => { try { return decodeURIComponent(review[1]); } catch { return review[1]; } })(),
    };
  }
  return clean === '/opportunity' ? { name: 'board', pathname: '/opportunity' } : { name: 'not-found', pathname: clean };
}

export function useOpportunityRoute() {
  const [route, setRoute] = useState<OpportunityRoute>(() =>
    parseOpportunityRoute(window.location.pathname),
  );

  useEffect(() => {
    const onPopState = () => setRoute(parseOpportunityRoute(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((href: string, replace = false) => {
    const next = new URL(href, window.location.origin);
    if (next.origin !== window.location.origin || !/^\/opportunity(?:\/|$)/.test(next.pathname)) return;
    const sampleCount = new URLSearchParams(window.location.search).get('n');
    if (sampleCount && !next.searchParams.has('n')) next.searchParams.set('n', sampleCount);
    next.searchParams.delete('panel');
    const current = `${window.location.pathname}${window.location.search}`;
    const target = `${next.pathname}${next.search}${next.hash}`;
    const pathnameChanged = next.pathname !== window.location.pathname;
    if (current === target) {
      setRoute(parseOpportunityRoute(next.pathname));
      return;
    }
    const dossier = next.searchParams.get('drawer') === 'submission';
    const overlay = ['submission', 'shortlist', 'compare', 'decision', 'trade'].includes(next.searchParams.get('drawer') ?? '');
    const destination = `${next.pathname}${next.search}${next.hash}`;
    const state = replace ? window.history.state ?? {} : {};
    const method = replace || window.history.state?.opportunityPanel ? 'replaceState' : 'pushState';
    window.history[method]({ ...state, opportunityPanel: false,
      opportunityDossier: dossier && (replace ? Boolean(state.opportunityDossier) : true),
      opportunityOverlay: overlay && (replace ? Boolean(state.opportunityOverlay) : true),
    }, '', destination);
    setRoute(parseOpportunityRoute(next.pathname));
    window.dispatchEvent(new PopStateEvent('popstate'));
    if (pathnameChanged) window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return { route, navigate };
}
