import { useEffect, useRef, useState } from 'react';

// Pause data-driven motion outside the viewport and whenever the tab is hidden.
export function useVisibility<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let intersecting = true;
    const sync = () => setVisible(intersecting && document.visibilityState !== 'hidden');
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      sync();
    });
    if (ref.current) observer?.observe(ref.current);
    document.addEventListener('visibilitychange', sync);
    if (!observer) sync();
    return () => { observer?.disconnect(); document.removeEventListener('visibilitychange', sync); };
  }, []);
  return { ref, visible };
}
