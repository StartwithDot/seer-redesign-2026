import { useEffect, useMemo, useState } from 'react';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

const THEME_KEY = 'seer-theme';
const PREFERENCE_KEY = 'seer-theme-preference';

function readPreference(): ThemePreference {
  try {
    const stored = window.localStorage.getItem(THEME_KEY);
    const preference = window.localStorage.getItem(PREFERENCE_KEY);
    // The shared key is authoritative, including changes made by another Seer product.
    if (stored === 'light' || stored === 'dark') {
      return preference === 'system' && stored === systemTheme() ? 'system' : stored;
    }
    if (preference === 'system' || preference === 'light' || preference === 'dark') return preference;
  } catch { /* Storage can be unavailable. */ }
  return 'light';
}

function systemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(preference: ThemePreference): ResolvedTheme {
  return preference === 'system' ? systemTheme() : preference;
}

export function applyTheme(preference: ThemePreference): ResolvedTheme {
  const resolved = resolveTheme(preference);
  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = resolved;
  try {
    window.localStorage.setItem(THEME_KEY, resolved);
    window.localStorage.setItem(PREFERENCE_KEY, preference);
  } catch { /* The selected theme still applies for this session. */ }
  return resolved;
}

export function useTheme() {
  const [preference, setPreferenceState] = useState<ThemePreference>(() => readPreference());
  const [resolved, setResolved] = useState<ResolvedTheme>(() => applyTheme(readPreference()));
  const setPreference = (next: ThemePreference) => {
    setResolved(applyTheme(next));
    setPreferenceState(next);
  };

  useEffect(() => {
    setResolved(applyTheme(preference));
    if (preference !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setResolved(applyTheme('system'));
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [preference]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== THEME_KEY && event.key !== PREFERENCE_KEY) return;
      const next = readPreference();
      setPreferenceState(next);
      setResolved(resolveTheme(next));
      document.documentElement.dataset.theme = resolveTheme(next);
      document.documentElement.style.colorScheme = resolveTheme(next);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return useMemo(
    () => ({ preference, resolved, setPreference }),
    [preference, resolved],
  );
}
