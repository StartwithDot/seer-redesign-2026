import { useCallback, useEffect, useMemo, useState } from 'react';
import { marketCollections, markets } from '../data/markets';
import type { ExplorerHashRoute } from '../types';

const defaultHash = '#/markets';

export function parseHash(hash: string): ExplorerHashRoute {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  const [pathname = '/markets', search = ''] = raw.split('?');
  const query = new URLSearchParams(search);
  const cleanPath = pathname.replace(/\/+$/, '') || '/markets';
  const segments = cleanPath.split('/').filter(Boolean);

  if (cleanPath === '/markets') return { name: 'markets', pathname: cleanPath, query };
  if (cleanPath === '/leaderboard') return { name: 'leaderboard', pathname: cleanPath, query };
  if (cleanPath === '/create-market') return { name: 'create', pathname: cleanPath, query };
  if (cleanPath === '/account') return { name: 'account', pathname: cleanPath, query };
  if (segments[0] === 'collections' && segments.length === 2 && marketCollections.some((item) => item.id === segments[1])) return { name: 'collections', pathname: cleanPath, collectionId: segments[1], query };
  if (cleanPath === '/policies/verified') {
    return { name: 'policy', pathname: cleanPath, policy: 'verified', query };
  }
  if (cleanPath === '/policies/rules') {
    return { name: 'policy', pathname: cleanPath, policy: 'rules', query };
  }
  if (segments[0] === 'markets' && segments.length === 3) {
    const chainId = /^\d+$/.test(segments[1]) ? Number(segments[1]) : Number.NaN;
    if (Number.isInteger(chainId) && chainId > 0) {
      return { name: 'market', pathname: cleanPath, chainId, slug: segments[2], query };
    }
  }
  return { name: 'not-found', pathname: cleanPath, query };
}

export function currentExplorerHash() {
  if (window.location.hash) return window.location.hash;
  const match = window.location.pathname?.match(/^\/explorer\/market\/([^/]+)\/?$/);
  if (match) {
    let id: string;
    try { id = decodeURIComponent(match[1]); } catch { return '#/not-found'; }
    const market = markets.find((item) => item.id === id || item.slug === id);
    return market ? `#/markets/${market.chainId}/${market.slug}${window.location.search || ''}` : '#/not-found';
  }
  return `${defaultHash}${window.location.search || ''}`;
}

export function explorerRouteUrl(hash: string) {
  const route = parseHash(hash);
  if (route.name === 'market') {
    const market = markets.find((item) => item.chainId === route.chainId && item.slug === route.slug);
    if (market) return `/explorer/market/${encodeURIComponent(market.id)}${route.query.size ? `?${route.query}` : ''}`;
  }
  if (route.name === 'markets') return `/explorer${route.query.size ? `?${route.query}` : ''}`;
  return `/explorer${hash.startsWith('#') ? hash : `#${hash}`}`;
}

export function pathRoutesEnabled() {
  return typeof document !== 'undefined' && document.documentElement.dataset.explorerRoutes === 'path';
}

export function useExplorerRoute() {
  const [hash, setHash] = useState(currentExplorerHash);
  const route = useMemo(() => parseHash(hash), [hash]);
  useEffect(() => {
    const onHashChange = () => setHash(currentExplorerHash());
    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('popstate', onHashChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('popstate', onHashChange);
    };
  }, []);
  const navigate = useCallback((nextHash: string, options?: { replace?: boolean }) => {
    const normalized = nextHash.startsWith('#') ? nextHash : `#${nextHash}`;
    // The standalone preview retains hash URLs. Integrated Explorer uses canonical paths.
    const url = window.location.pathname?.startsWith('/explorer') && pathRoutesEnabled() ? explorerRouteUrl(normalized) : normalized;
    if (options?.replace) window.history.replaceState(null, '', url);
    else if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== url) window.history.pushState(null, '', url);
    setHash(normalized);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }, []);
  return { route, navigate, hash };
}
