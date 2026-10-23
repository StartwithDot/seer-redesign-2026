import { useEffect, useRef, useState } from 'react';
import { formatNumber } from '../lib/format';
import { useReducedMotion } from '../hooks/useReducedMotion';

export function RollingNumber({ value, format = formatNumber }: { value: number; format?: (value: number) => string }) {
  const [display, setDisplay] = useState(value);
  const current = useRef(value);
  const reduced = useReducedMotion();
  useEffect(() => {
    const from = current.current;
    if (!Number.isFinite(value) || !Number.isFinite(from) || reduced) {
      current.current = value; setDisplay(value); return;
    }
    let frame = 0;
    let start: number | null = null;
    const step = (time: number) => {
      start ??= time;
      const progress = Math.min(1, (time - start) / 400);
      current.current = from + (value - from) * (1 - (1 - progress) ** 4);
      setDisplay(current.current);
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value, reduced]);
  return <span className="rolling-number"><span aria-hidden="true">{format(display)}</span><span className="sr-only">{format(value)}</span></span>;
}
