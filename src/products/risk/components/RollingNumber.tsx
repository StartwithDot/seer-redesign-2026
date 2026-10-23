import { useReducedMotion } from '../hooks/useReducedMotion';
import { useEffect, useRef, useState } from 'react';

interface RollingNumberProps {
  decimals?: number;
  duration?: number;
  suffix?: string;
  value: number;
}

export function RollingNumber({ decimals = 2, duration = 620, suffix = '', value }: RollingNumberProps) {
  const reducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(value);
  const previousValue = useRef(value);

  useEffect(() => {
    if (reducedMotion || previousValue.current === value) {
      previousValue.current = value;
      setDisplayValue(value);
      return;
    }

    const startValue = previousValue.current;
    const startedAt = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(startValue + (value - startValue) * eased);
      previousValue.current = startValue + (value - startValue) * eased;
      if (progress < 1) frame = requestAnimationFrame(tick);
      else {
        previousValue.current = value;
        setDisplayValue(value);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, value, reducedMotion]);

  return <span className="risk-roll-number">{displayValue.toFixed(decimals)}{suffix}</span>;
}
