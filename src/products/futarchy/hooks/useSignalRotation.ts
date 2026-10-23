import { useEffect } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface SignalRotationOptions {
  count: number;
  selectedIndex: number;
  paused: boolean;
  onSelect: (index: number) => void;
}

export function useSignalRotation({ count, selectedIndex, paused, onSelect }: SignalRotationOptions) {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (paused || reduced || count < 2) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') onSelect((selectedIndex + 1) % count);
    }, 8_000);
    return () => window.clearInterval(timer);
  }, [count, onSelect, paused, reduced, selectedIndex]);
}
