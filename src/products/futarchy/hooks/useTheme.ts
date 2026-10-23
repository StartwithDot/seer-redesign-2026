import { useCallback, useEffect, useState } from 'react';
import { readStorage, writeStorage } from '../data/browserStorage';

export type Theme = 'light' | 'dark';
const STORAGE_KEY = 'seer-theme';

const storedTheme = (): Theme => {
  const saved = readStorage(STORAGE_KEY);
  return saved === 'dark' || saved === 'light'
    ? saved
    : window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
};

export const applyStoredTheme = () => {
  document.documentElement.dataset.theme = storedTheme();
};

if (typeof window !== 'undefined') applyStoredTheme();

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => document.documentElement.dataset.theme as Theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    writeStorage(STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && (event.newValue === 'light' || event.newValue === 'dark')) setThemeState(event.newValue);
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    const update = () => { document.documentElement.dataset.theme = next; setThemeState(next); };
    if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.startViewTransition(update);
    } else {
      update();
    }
  }, []);

  return {
    theme,
    toggleTheme: () => setTheme(theme === 'light' ? 'dark' : 'light'),
  };
}
