import { useEffect, useRef } from 'react';

const scrollPositions = new Map<string, number>();

export function useRouteScroll(routeKey: string, groupKey = routeKey) {
  const previousGroup = useRef(groupKey);
  useEffect(() => {
    const saved = scrollPositions.get(routeKey);
    const stayedInGroup = previousGroup.current === groupKey;
    previousGroup.current = groupKey;
    window.scrollTo(0, saved ?? (stayedInGroup ? window.scrollY : 0));

    return () => {
      scrollPositions.set(routeKey, window.scrollY);
    };
  }, [groupKey, routeKey]);
}
