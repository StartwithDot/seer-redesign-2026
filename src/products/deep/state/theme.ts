export type Theme = 'light' | 'dark';
let sessionTheme: Theme | null = null;

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark';
}

export function readStoredTheme(): Theme {
  if (sessionTheme) return sessionTheme;
  try {
    const shellPreference = window.localStorage.getItem('seer-theme-preference');
    const stored = window.localStorage.getItem('seer-theme');
    if (isTheme(stored)) return stored;
    if (isTheme(shellPreference)) return shellPreference;
  } catch {
    return 'dark';
  }
  return 'dark';
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function persistTheme(theme: Theme): void {
  sessionTheme = theme;
  try {
    window.localStorage.setItem('seer-theme', theme);
    window.localStorage.setItem('seer-theme-preference', theme);
  } catch {
    document.documentElement.dataset.themeFallback = theme;
  }
  applyTheme(theme);
}

export function syncStoredTheme(value: string | null): Theme | null {
  if (!isTheme(value)) return null;
  sessionTheme = value;
  applyTheme(value);
  return value;
}

persistTheme(readStoredTheme());
