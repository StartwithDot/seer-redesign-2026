import { useEffect, useState } from 'react';

// One row on phones, two on larger screens. Pagination retains the full catalog.
const sizeFor = (width: number) => width >= 1800 ? 12 : width >= 1200 ? 10 : width >= 761 ? 6 : 2;
export function useMarketPageSize() {
  const [size, setSize] = useState(() => sizeFor(typeof window.innerWidth === 'number' ? window.innerWidth : 1440));
  useEffect(() => {
    const update = () => setSize(sizeFor(window.innerWidth));
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return size;
}
