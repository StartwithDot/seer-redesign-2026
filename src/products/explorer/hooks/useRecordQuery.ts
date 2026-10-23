import { useCallback, useEffect, useState } from 'react';

// Read from the URL on every navigation, including browser Back/Forward.
export function useRecordQuery() {
  const read = () => new URLSearchParams(window.location.hash ? window.location.hash.split('?')[1] ?? '' : window.location.search);
  const [query, setQuery] = useState(read);
  useEffect(() => {
    const update = () => setQuery(read());
    window.addEventListener('hashchange', update);
    window.addEventListener('popstate', update);
    return () => {
      window.removeEventListener('hashchange', update);
      window.removeEventListener('popstate', update);
    };
  }, []);
  const update = useCallback((values: Record<string, string | null>) => {
    const next = read();
    for (const [key, value] of Object.entries(values)) {
      if (value === null) next.delete(key);
      else next.set(key, value);
    }
    const path = window.location.hash ? window.location.hash.split('?')[0] : window.location.pathname;
    const hash = `${path}${next.size ? `?${next}` : ''}`;
    if (hash === (window.location.hash || `${window.location.pathname}${window.location.search}`)) return;
    window.history.pushState(null, '', hash);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }, []);
  return { query, update };
}
