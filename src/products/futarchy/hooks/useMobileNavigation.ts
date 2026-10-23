import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

/** A navigation disclosure: normal Tab order, optional arrow navigation, no focus trap. */
export function useMobileNavigation() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pendingFocus = useRef<'first' | 'last' | null>(null);

  useEffect(() => {
    if (!open) return;
    const controls = () => [...(menuRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [])];
    if (pendingFocus.current) {
      const items = controls();
      (pendingFocus.current === 'first' ? items[0] : items.at(-1))?.focus();
      pendingFocus.current = null;
    }
    const contains = (target: EventTarget | null) => target instanceof Node &&
      (menuRef.current?.contains(target) || toggleRef.current?.contains(target));
    const keydown = (event: globalThis.KeyboardEvent) => {
      if (!contains(event.target)) return;
      if (event.key === 'Escape') {
        // Consume before workspace shortcuts can navigate away from the market.
        event.preventDefault();
        event.stopImmediatePropagation();
        setOpen(false);
        toggleRef.current?.focus({ preventScroll: true });
        return;
      }
      const items = controls();
      const index = items.indexOf(document.activeElement as HTMLButtonElement);
      const next = event.key === 'ArrowDown' ? (index + 1) % items.length
        : event.key === 'ArrowUp' ? (index < 0 ? items.length - 1 : (index - 1 + items.length) % items.length)
        : event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : -1;
      if (next >= 0 && items.length) { event.preventDefault(); items[next]?.focus(); }
    };
    const outside = (event: PointerEvent | FocusEvent) => {
      if (!contains(event.target)) setOpen(false);
    };
    window.addEventListener('keydown', keydown, true);
    document.addEventListener('pointerdown', outside);
    document.addEventListener('focusin', outside);
    return () => {
      window.removeEventListener('keydown', keydown, true);
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('focusin', outside);
    };
  }, [open]);

  const onToggleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (open || !['ArrowDown', 'ArrowUp'].includes(event.key)) return;
    event.preventDefault();
    pendingFocus.current = event.key === 'ArrowDown' ? 'first' : 'last';
    setOpen(true);
  };

  return { open, setOpen, menuRef, toggleRef, onToggleKeyDown };
}
