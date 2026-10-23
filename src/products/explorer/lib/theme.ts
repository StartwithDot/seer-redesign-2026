export type Theme = 'light' | 'dark';
export const THEME_STORAGE_KEY = 'seer-theme';
export const isTheme = (value: unknown): value is Theme => value === 'light' || value === 'dark';

export function getStoredTheme(): Theme {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isTheme(stored)) return stored;
  } catch { /* The in-memory theme still works when storage is blocked. */ }
  return 'dark';
}
export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}
export function storeTheme(theme: Theme) {
  try { window.localStorage.setItem(THEME_STORAGE_KEY, theme); } catch { /* In-memory selection. */ }
  applyTheme(theme);
}
export function initializeTheme() { applyTheme(getStoredTheme()); }
