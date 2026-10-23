import { useEffect, useRef, useState } from 'react';
import type { ThemePreference } from '../hooks/useTheme';

interface AppearanceMenuProps {
  preference: ThemePreference;
  resolved: 'light' | 'dark';
  onChange: (preference: ThemePreference) => void;
}

const options: Array<{ value: ThemePreference; label: string }> = [
  { value: 'system', label: 'Use system' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export function AppearanceMenu({ preference, resolved, onChange }: AppearanceMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className="appearance-menu" ref={wrapperRef}>
      <button
        ref={triggerRef}
        className="header-icon-button"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true">{resolved === 'dark' ? '☾' : '☀'}</span>
        <span className="sr-only">Appearance settings</span>
        <span className="header-tool-label">Appearance</span>
      </button>
      {open && (
        <div className="appearance-popover" role="dialog" aria-label="Appearance">
          <p>Appearance</p>
          <div role="radiogroup" aria-label="Theme preference">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={preference === option.value}
                tabIndex={preference === option.value ? 0 : -1}
                onKeyDown={event => {
                  const index = options.findIndex(item => item.value === option.value);
                  const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : ['ArrowDown', 'ArrowRight'].includes(event.key) ? (index + 1) % options.length : ['ArrowUp', 'ArrowLeft'].includes(event.key) ? (index + options.length - 1) % options.length : -1;
                  if (next < 0) return;
                  event.preventDefault();
                  onChange(options[next].value);
                  event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[next]?.focus();
                }}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
              >
                <span>{option.label}</span>
                <span aria-hidden="true">{preference === option.value ? '●' : '○'}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
