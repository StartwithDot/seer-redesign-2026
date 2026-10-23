import { useCallback, useEffect, useMemo, useState } from 'react';
import { frameProgress, type SignalSeries } from '../data/signalSeries';
import { readStorage, writeStorage } from '../data/browserStorage';
import { useReducedMotion } from './useReducedMotion';

export type SignalView = 'chart' | 'field';

const VIEW_KEY = 'futarchy-signal-view';

const queryIndex = () => {
  const query = window.location.hash.split('?')[1] ?? '';
  const value = new URLSearchParams(query).get('n') ?? new URLSearchParams(window.location.search).get('n');
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 12 ? parsed - 1 : null;
};

export function useSignalPlayback(series: SignalSeries) {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(() => {
    const fixed = queryIndex();
    return fixed === null ? frameProgress(series, series.nowIndex) : frameProgress(series, fixed);
  });
  const [playing, setPlaying] = useState(false);
  const [tick, setTick] = useState(0);
  const [pulse, setPulse] = useState(0);
  const [view, setView] = useState<SignalView>(() => {
    const saved = readStorage(VIEW_KEY, 'session');
    return saved === 'field' ? 'field' : 'chart';
  });

  const setViewMode = useCallback((next: SignalView) => {
    setView(next);
    writeStorage(VIEW_KEY, next, 'session');
  }, []);

  const toggleView = useCallback(() => {
    setViewMode(view === 'chart' ? 'field' : 'chart');
  }, [setViewMode, view]);

  const scrub = useCallback((next: number) => {
    setPlaying(false);
    setProgress(Math.max(0, Math.min(1, next)));
  }, []);

  const replay = useCallback(() => {
    setProgress(0);
    setPlaying(!reduced);
  }, [reduced]);

  useEffect(() => {
    if (reduced) { setTick(0); setPulse(0); setPlaying(false); return; }
    const timer = window.setInterval(() => { if (!document.hidden) setTick((value) => value + 1); }, 1200);
    return () => window.clearInterval(timer);
  }, [reduced]);

  useEffect(() => {
    if (!playing || reduced) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setProgress((value) => {
        const next = value + 1 / (series.maxIndex * 12);
        return Math.min(1, next);
      });
    }, 160);
    return () => window.clearInterval(timer);
  }, [playing, reduced, series.maxIndex]);

  useEffect(() => {
    if (progress >= 1 && playing) setPlaying(false);
  }, [playing, progress]);

  const setDeterministicIndex = useCallback((index: number) => {
    const bounded = Math.max(0, Math.min(series.maxIndex, index));
    setPlaying(false);
    setProgress(frameProgress(series, bounded));
    setPulse((value) => value + 1);
  }, [series]);

  const currentIndex = Math.round(progress * series.maxIndex);
  return useMemo(() => ({
    progress,
    currentIndex,
    playing,
    tick,
    pulse,
    view,
    setProgress: scrub,
    setView: setViewMode,
    toggleView,
    togglePlaying: () => { if (!reduced) setPlaying((value) => !value); },
    replay,
    setDeterministicIndex,
    triggerPulse: () => setPulse((value) => value + 1),
    reducedMotion: reduced,
  }), [currentIndex, progress, playing, pulse, reduced, replay, scrub, setDeterministicIndex, setViewMode, tick, toggleView, view]);
}
