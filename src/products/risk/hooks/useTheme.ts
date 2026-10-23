import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';
const readTheme = (): Theme => {
  try {
    const saved = window.localStorage.getItem('seer-theme');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch { /* The document theme also works when storage is unavailable. */ }
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
};
export const applyTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
};
applyTheme(readTheme());

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readTheme);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === 'seer-theme' || event.key === null) setTheme(readTheme());
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  useEffect(() => {
    if (typeof MutationObserver === 'undefined') return;
    const observer = new MutationObserver(() => {
      const next = document.documentElement.dataset.theme;
      if (next === 'light' || next === 'dark') setTheme(next);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    applyTheme(theme);
    try {
      window.localStorage.setItem('seer-theme', theme);
      // Keep the host's legacy preference aligned with the canonical product key.
      window.localStorage.setItem('seer-theme-preference', theme);
    } catch { /* Theme remains usable without storage. */ }
  }, [theme]);
  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    applyTheme(next);
    // The host bootstrap reads this preference. Persist both to retain a user toggle after reload.
    try { window.localStorage.setItem('seer-theme', next); window.localStorage.setItem('seer-theme-preference', next); } catch { /* In-memory theme still works. */ }
    setTheme(next);
  };
  return { theme, toggleTheme };
}
