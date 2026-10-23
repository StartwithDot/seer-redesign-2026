import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';

let activePopover: (() => void) | null = null;
const selectors = 'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled)';

export function usePopover(id: string) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ left: 8, top: 8, maxHeight: 400 });
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefix = useRef({ value: '', at: 0 });
  const desiredFocus = useRef<'first' | 'last' | null>(null);
  const cancel = () => { if (timer.current) clearTimeout(timer.current); timer.current = null; };
  const close = () => { cancel(); setOpen(false); };
  const show = () => { cancel(); activePopover?.(); activePopover = close; setOpen(true); };
  const items = () => [...(panel.current?.querySelectorAll<HTMLElement>(selectors) ?? [])].filter((item) => item.getClientRects().length > 0);
  const focus = (edge: 'first' | 'last') => (edge === 'first' ? items()[0] : items().at(-1))?.focus();
  useEffect(() => () => { cancel(); if (activePopover === close) activePopover = null; }, []);
  useLayoutEffect(() => {
    if (!open) return;
    const anchor = root.current?.querySelector<HTMLElement>('.popover-trigger');
    const measure = () => {
      if (!anchor || !panel.current) return;
      const box = anchor.getBoundingClientRect();
      const w = Math.min(panel.current.offsetWidth, innerWidth - 16);
      const h = Math.min(panel.current.scrollHeight, innerHeight - 16);
      const below = box.bottom + 8;
      const top = below + h <= innerHeight - 8 || box.top < h + 16 ? below : box.top - h - 8;
      setPosition({ left: Math.max(8, Math.min(innerWidth - w - 8, box.right - w)), top, maxHeight: Math.max(80, innerHeight - top - 8) });
    };
    measure();
    if (desiredFocus.current) { focus(desiredFocus.current); desiredFocus.current = null; }
    window.addEventListener('resize', measure);
    const scroll = (event: Event) => { if (!panel.current?.contains(event.target as Node)) close(); };
    window.addEventListener('scroll', scroll, true);
    const pointer = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node) && !panel.current?.contains(event.target as Node)) close(); };
    document.addEventListener('pointerdown', pointer);
    const escape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); anchor?.focus(); }
    };
    document.addEventListener('keydown', escape);
    return () => {
      window.removeEventListener('resize', measure); window.removeEventListener('scroll', scroll, true);
      document.removeEventListener('pointerdown', pointer); document.removeEventListener('keydown', escape);
    };
  }, [open, id]);
  const keydown = (event: KeyboardEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).matches('input, select')) return;
    const options = items();
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const edge = event.key === 'ArrowUp' || event.key === 'End' ? 'last' : 'first';
      if (!open) { desiredFocus.current = edge; show(); return; }
      const index = options.indexOf(document.activeElement as HTMLElement);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
      options[next]?.focus();
    } else if (open && event.key.length === 1 && !event.ctrlKey && !event.metaKey && event.key !== ' ') {
      prefix.current = { value: (Date.now() - prefix.current.at > 700 ? '' : prefix.current.value) + event.key.toLowerCase(), at: Date.now() };
      options.find((item) => item.textContent?.trim().toLowerCase().startsWith(prefix.current.value))?.focus();
    }
  };
  const hover = (enter: boolean) => { cancel(); timer.current = setTimeout(enter ? show : close, enter ? 90 : 220); };
  return { open, root, panel, position, close, show, keydown, hover, cancel };
}
