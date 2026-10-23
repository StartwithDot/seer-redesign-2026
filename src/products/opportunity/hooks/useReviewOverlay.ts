import { useCallback, useEffect, useState } from 'react';

export type ReviewOverlay = 'shortlist' | 'compare' | 'decision' | 'dossier' | 'trade' | null;

function fromLocation(): ReviewOverlay {
  const value = new URLSearchParams(window.location.search).get('drawer');
  return value === 'submission' ? 'dossier' : value === 'shortlist' || value === 'compare' || value === 'decision' || value === 'trade' ? value : null;
}

export function useReviewOverlay(navigate: (href: string, replace?: boolean) => void) {
  const [overlay, setState] = useState(fromLocation);
  useEffect(() => {
    const restore = () => setState(fromLocation());
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, []);
  const setOverlay = useCallback((next: ReviewOverlay, replace = false, updates: Record<string, string | null> = {}) => {
    const url = new URL(window.location.href);
    if (!next && !replace && (window.history.state?.opportunityOverlay || window.history.state?.opportunityDossier)) {
      window.history.back();
      return;
    }
    for (const [key, value] of Object.entries(updates)) {
      if (value === null) url.searchParams.delete(key);
      else url.searchParams.set(key, value);
    }
    if (next) url.searchParams.set('drawer', next === 'dossier' ? 'submission' : next);
    else url.searchParams.delete('drawer');
    if (next !== 'compare') url.searchParams.delete('compare');
    if (next !== 'trade') url.searchParams.delete('mode');
    navigate(`${url.pathname}${url.search}${url.hash}`, replace || next === fromLocation() || !next);
    setState(next);
  }, [navigate]);
  return { overlay, setOverlay };
}
