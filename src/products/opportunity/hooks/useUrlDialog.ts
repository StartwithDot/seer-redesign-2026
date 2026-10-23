import { useCallback, useEffect, useState } from 'react';

export function useUrlDialog(parameter: string) {
  const read = useCallback(() => typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get(parameter), [parameter]);
  const [value, setState] = useState(read);
  useEffect(() => {
    const restore = () => setState(read());
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, [read]);
  const setValue = useCallback((next: string | null) => {
    const url = new URL(window.location.href);
    const ownedKey = `opportunityDialog:${parameter}`;
    if (next === null && window.history.state?.[ownedKey]) { window.history.back(); return; }
    const push = next !== null && read() === null;
    if (next === null) url.searchParams.delete(parameter);
    else url.searchParams.set(parameter, next);
    window.history[push ? 'pushState' : 'replaceState']({ ...window.history.state, [ownedKey]: next !== null && (push || Boolean(window.history.state?.[ownedKey])) }, '', `${url.pathname}${url.search}${url.hash}`);
    setState(next);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, [parameter, read]);
  return [value, setValue] as const;
}
