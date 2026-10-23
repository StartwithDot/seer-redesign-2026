import { useId, useRef, useState } from 'react';
import { InfoIcon } from './Icons';

export function Tooltip({ label, children }: { label: string; children: string }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const pointerState = useRef<boolean | null>(null);
  return <span className="risk-tooltip" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
    <button className="risk-info-button" type="button" aria-label={label} aria-describedby={open ? id : undefined} aria-expanded={open}
      onPointerDown={() => { pointerState.current = open; }}
      onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} onClick={() => {
        const beforeFocus = pointerState.current;
        pointerState.current = null;
        setOpen(current => beforeFocus === null ? !current : !beforeFocus);
      }}
      onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); setOpen(false); } }}><InfoIcon /></button>
    {open && <span id={id} role="tooltip">{children}</span>}
  </span>;
}
