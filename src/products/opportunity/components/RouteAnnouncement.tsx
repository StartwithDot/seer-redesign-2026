import { useEffect, useState } from 'react';
import { useOpportunityWallet } from '../hooks/WalletContext';

export function RouteAnnouncement({ route, walletMessage }: { route: string; walletMessage: string | null }) {
  const { transaction } = useOpportunityWallet();
  const [announcement, setAnnouncement] = useState('');
  useEffect(() => {
    const name = route.includes('/review/') ? 'Review opportunity' : route.endsWith('/explorer') ? 'Universal Explorer' : route.endsWith('/archive') ? 'Decision Archive' : 'Opportunity Board';
    document.title = `${name} · Seer`;
    const timer = window.setTimeout(() => {
      setAnnouncement(`${name} loaded.`);
      // Drawers own their own focus. Route changes without a drawer return to the main heading.
      if (!document.querySelector('[role="dialog"]')) {
        const heading = document.querySelector<HTMLElement>('#product-main h1');
        if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
      }
    }, 120);
    return () => window.clearTimeout(timer);
  }, [route]);
  return <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{transaction.status === 'idle' ? walletMessage || announcement : `${transaction.label}: ${transaction.status}. ${transaction.message}`}</div>;
}
