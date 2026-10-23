import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { HashRoute } from '../data/types';
import { readStorage, writeStorage } from '../data/browserStorage';

export const parseHash = (value: string): HashRoute => {
  const raw = value.split('?')[0].replace(/^#\/?/, '');
  const [section = '', id = '', entityId = ''] = raw.split('/');
  if (section === 'explorer') {
    let decoded = entityId;
    try { decoded = decodeURIComponent(entityId); } catch { /* Show unknown record. */ }
    return { name: 'explorer', kind: id || undefined, id: decoded || undefined, key: `explorer:${id}/${decoded}` };
  }
  if ((section === 'organization' || section === 'org') && id) return { name: 'organization', id, key: `organization:${id}` };
  if ((section === 'm' || section === 'market') && id) return { name: 'market', id, key: `market:${id}` };
  if (section === 'create') return { name: 'create', key: 'create' };
  return { name: 'home', key: 'home' };
};

export function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash || '#/');
  const previousHash = useRef(hash);
  const route = useMemo(() => parseHash(hash), [hash]);

  const storeScroll = useCallback((value: string) => {
    writeStorage(`futarchy-scroll:${value}`, String(window.scrollY), 'session');
  }, []);

  const navigate = useCallback((next: string, options?: { replace?: boolean }) => {
    storeScroll(previousHash.current);
    const target = next.startsWith('#') ? next : `#${next}`;
    if (options?.replace) window.history.replaceState(null, '', target);
    else window.history.pushState(null, '', target);
    previousHash.current = target;
    setHash(target);
  }, [storeScroll]);

  useEffect(() => {
    const onHashChange = () => {
      storeScroll(previousHash.current);
      previousHash.current = window.location.hash || '#/';
      setHash(previousHash.current);
    };
    const onScroll = () => storeScroll(previousHash.current);
    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('popstate', onHashChange);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('popstate', onHashChange);
      window.removeEventListener('scroll', onScroll);
    };
  }, [storeScroll]);

  useEffect(() => {
    const stored = Number(readStorage(`futarchy-scroll:${hash}`, 'session') || 0);
    const frame = window.requestAnimationFrame(() => window.scrollTo({ top: Number.isFinite(stored) ? stored : 0, behavior: 'auto' }));
    return () => window.cancelAnimationFrame(frame);
  }, [hash]);

  return { route, hash, navigate };
}
