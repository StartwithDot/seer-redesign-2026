import { useEffect, useRef, type RefObject } from 'react';

export function useMenuKeyboard(open: boolean, root: RefObject<HTMLElement | null>, close: () => void) {
  const closeRef = useRef(close);
  closeRef.current = close;
  useEffect(() => {
    if (!open || !root.current) return;
    const container = root.current;
    const menu = container.querySelector<HTMLElement>('.deep-menu--contests') ?? container.querySelector<HTMLElement>('.deep-menu');
    const trigger = document.activeElement instanceof HTMLButtonElement && container.contains(document.activeElement)
      ? document.activeElement : container.querySelector<HTMLButtonElement>('button[aria-expanded]');
    const items = () => Array.from(menu?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? []);
    items()[0]?.focus();
    const handle = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); closeRef.current(); trigger?.focus(); return; }
      if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
      const buttons = items();
      if (!buttons.length) return;
      event.preventDefault();
      const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1
        : (current + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next].focus();
    };
    const focusOut = (event: FocusEvent) => {
      if (event.relatedTarget && !container.contains(event.relatedTarget as Node)) closeRef.current();
    };
    container.addEventListener('keydown', handle);
    container.addEventListener('focusout', focusOut);
    return () => { container.removeEventListener('keydown', handle); container.removeEventListener('focusout', focusOut); };
  }, [open, root]);
}
