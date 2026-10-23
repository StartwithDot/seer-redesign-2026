import { useEffect, useRef, useState } from 'react';

export function DifferenceHelp({ leg }: { leg: 'up' | 'down' }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const formula = leg === 'up'
    ? 'UP difference = predicted UP minus current UP.'
    : 'DOWN difference = 1 minus predicted UP minus current DOWN.';

  useEffect(() => {
    if (!open) return;
    const closeOnOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  return (
    <div className="deep-difference-help" ref={rootRef}>
      <button
        type="button"
        aria-label={`Explain ${leg.toUpperCase()} difference`}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        ?
      </button>
      {open && (
        <div className="deep-difference-help__panel" role="dialog" aria-label={`${leg.toUpperCase()} difference help`}>
          <button className="deep-icon-button" type="button" aria-label="Close difference help" onClick={() => setOpen(false)}>×</button>
          <strong>{leg.toUpperCase()} difference</strong>
          <p>{formula}</p>
          <small>Positive values mean the forecast is above the market-derived term.</small>
        </div>
      )}
    </div>
  );
}
