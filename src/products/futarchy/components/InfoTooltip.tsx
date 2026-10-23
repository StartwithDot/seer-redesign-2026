import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

interface InfoTooltipProps {
  label: string;
  text: string;
  children: ReactNode;
  variant: 'metric' | 'signal';
}

/** One interaction model for pointer, keyboard and touch explanations. */
export function InfoTooltip({ label, text, children, variant }: InfoTooltipProps) {
  const id = useId();
  const root = useRef<HTMLSpanElement>(null);
  const tip = useRef<HTMLSpanElement>(null);
  const pinned = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ left: 8, top: 8 });
  const cancelClose = () => clearTimeout(timer.current);
  const dismiss = () => { cancelClose(); pinned.current = false; setOpen(false); };

  useEffect(() => () => clearTimeout(timer.current), []);

  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const button = root.current?.querySelector('button')?.getBoundingClientRect();
      const box = tip.current?.getBoundingClientRect();
      if (!button || !box) return;
      const above = button.top - box.height - 8;
      const top = variant === 'signal' && above >= 8 ? above : button.bottom + 8;
      setPosition({
        left: Math.max(8, Math.min(button.left, window.innerWidth - box.width - 8)),
        top: Math.max(8, Math.min(top, window.innerHeight - box.height - 8)),
      });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true); };
  }, [open, variant]);

  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      // Dismiss the explanation before an enclosing drawer handles Escape.
      event.preventDefault(); event.stopImmediatePropagation(); dismiss();
    };
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) dismiss();
    };
    window.addEventListener('keydown', escape, true);
    document.addEventListener('pointerdown', outside);
    return () => { window.removeEventListener('keydown', escape, true); document.removeEventListener('pointerdown', outside); };
  }, [open]);

  return <span
    ref={root}
    className={`info-tooltip ${variant === 'metric' ? 'metric-info' : 'signal-info'}`}
    onPointerEnter={event => { cancelClose(); if (event.pointerType !== 'touch') setOpen(true); }}
    onPointerLeave={() => {
      cancelClose();
      if (!pinned.current && !root.current?.contains(document.activeElement)) timer.current = setTimeout(() => setOpen(false), 140);
    }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) dismiss(); }}
  >
    <button
      type="button"
      aria-label={label}
      aria-expanded={open}
      aria-describedby={id}
      onFocus={() => { cancelClose(); setOpen(true); }}
      onClick={() => { if (pinned.current) dismiss(); else { pinned.current = true; setOpen(true); } }}
    >{children}</button>
    <span ref={tip} id={id} role="tooltip" hidden={!open} className="info-tooltip-content" style={position}>{text}</span>
  </span>;
}
