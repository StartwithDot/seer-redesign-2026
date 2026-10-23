import { useEffect, useRef, useState } from 'react';

export function RouteStatus({ pathname }: { pathname: string }) {
  const previous = useRef(pathname);
  const [announcement, setAnnouncement] = useState('');
  useEffect(() => {
    const main = document.getElementById('deep-main');
    const title = main?.querySelector('h1')?.textContent ?? 'Deep';
    const previousTitle = document.title;
    document.title = `${title} | Deep`;
    if (previous.current !== pathname) {
      setAnnouncement(title);
      if (!document.querySelector('[aria-modal="true"]')) main?.focus({ preventScroll: true });
    }
    previous.current = pathname;
    return () => { document.title = previousTitle; };
  }, [pathname]);
  return <span className="deep-sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</span>;
}
