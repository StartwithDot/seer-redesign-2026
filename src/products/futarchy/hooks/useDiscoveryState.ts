import { useCallback, useEffect, useState } from 'react';
import { parseDiscoveryFilters, serializeDiscoveryFilters } from '../data/discovery';
import type { DiscoveryFilters } from '../data/types';

export type NavigateFunction = (hash: string, options?: { replace?: boolean }) => void;

export function useDiscoveryState(onNavigate: NavigateFunction) {
  const [filters, setFilters] = useState<DiscoveryFilters>(() => parseDiscoveryFilters(window.location.hash));

  const updateFilters = useCallback((next: DiscoveryFilters, replace = false) => {
    setFilters(next);
    const query = new URLSearchParams(serializeDiscoveryFilters(next));
    query.set('section', 'milestones');
    onNavigate(`#/?${query}`, { replace });
  }, [onNavigate]);

  useEffect(() => {
    const syncFilters = () => setFilters(parseDiscoveryFilters(window.location.hash));
    window.addEventListener('popstate', syncFilters);
    window.addEventListener('hashchange', syncFilters);
    return () => {
      window.removeEventListener('popstate', syncFilters);
      window.removeEventListener('hashchange', syncFilters);
    };
  }, []);

  return { filters, updateFilters };
}
