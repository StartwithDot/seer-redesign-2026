import { getStoredTheme, storeTheme, type Theme } from '../lib/theme';

interface ThemeToggleProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function ThemeToggle({ theme, onThemeChange }: ThemeToggleProps) {
  const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      className="icon-button theme-toggle"
      data-tour-target="theme"
      type="button"
      data-tooltip={`Use ${nextTheme} theme`}
      aria-label={`Use ${nextTheme} theme`}
      onClick={() => {
        storeTheme(nextTheme);
        onThemeChange(nextTheme);
      }}
    >
      <span aria-hidden="true">{theme === 'dark' ? '☼' : '◐'}</span>
    </button>
  );
}

export function readInitialTheme() {
  return getStoredTheme();
}
