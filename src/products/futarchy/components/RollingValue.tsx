import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface RollingValueProps {
  value: number;
  format: (value: number) => string;
  className?: string;
}

export function RollingValue({ value, format, className = '' }: RollingValueProps) {
  const reduced = useReducedMotion();
  const previous = useRef(value);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const from = previous.current;
    previous.current = value;
    if (from === value || reduced) {
      setDisplay(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = Math.min(1, (now - start) / 360);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setDisplay(from + (value - from) * eased);
      if (elapsed < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [reduced, value]);

  return <strong className={`rolling-value ${className}`.trim()}>{format(display)}</strong>;
}
