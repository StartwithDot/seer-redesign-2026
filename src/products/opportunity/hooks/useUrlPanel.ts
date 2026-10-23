import { useCallback, useEffect, useState } from 'react';

export type PanelId = 'search' | 'help' | 'protocol' | 'wallet';

function panelFromLocation(): PanelId | null {
  const value = new URLSearchParams(window.location.search).get('panel');
  return value === 'search' || value === 'help' || value === 'protocol' || value === 'wallet'
    ? value
    : null;
}

function setPanelInUrl(panel: PanelId | null, mode: 'push' | 'replace') {
  const url = new URL(window.location.href);
  if (panel) url.searchParams.set('panel', panel);
  else url.searchParams.delete('panel');
  window.history[mode === 'push' ? 'pushState' : 'replaceState'](
    { ...window.history.state, opportunityPanel: Boolean(panel) && (mode === 'push' || Boolean(window.history.state?.opportunityPanel)) },
    '',
    `${url.pathname}${url.search}${url.hash}`,
  );
}

export function useUrlPanel() {
  const [panel, setPanelState] = useState<PanelId | null>(() => panelFromLocation());

  useEffect(() => {
    const onPopState = () => setPanelState(panelFromLocation());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const openPanel = useCallback((next: PanelId) => {
    setPanelInUrl(next, panelFromLocation() ? 'replace' : 'push');
    setPanelState(next);
  }, []);

  const closePanel = useCallback(() => {
    if (window.history.state?.opportunityPanel) {
      window.history.back();
      return;
    }
    setPanelInUrl(null, 'replace');
    setPanelState(null);
  }, []);

  return { panel, openPanel, closePanel, setPanelState };
}
