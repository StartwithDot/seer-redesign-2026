import { useEffect, useRef, type RefObject } from 'react';

const selector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';
const stack: HTMLElement[] = [];
let previousOverflow = '';

export function useFocusTrap(active: boolean, containerRef: RefObject<HTMLElement | null>, onClose: () => void) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;
    const restore = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (!stack.length) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    stack.push(container);
    const items = () => [...container.querySelectorAll<HTMLElement>(selector)].filter((element) => element.getClientRects().length > 0 && !element.closest('[hidden], [inert]'));
    const focusFirst = () => (items()[0] ?? container).focus();
    focusFirst();
    const onFocus = (event: FocusEvent) => {
      if (stack.at(-1) === container && !container.contains(event.target as Node)) focusFirst();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (stack.at(-1) !== container) return;
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeRef.current(); return; }
      if (event.key !== 'Tab') return;
      const focusable = items();
      if (!focusable.length) { event.preventDefault(); container.focus(); return; }
      const first = focusable[0];
      const last = focusable.at(-1)!;
      if (event.shiftKey && (document.activeElement === first || document.activeElement === container)) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === container)) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('focusin', onFocus);
    return () => {
      const index = stack.indexOf(container);
      const wasTop = index === stack.length - 1;
      if (index >= 0) stack.splice(index, 1);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('focusin', onFocus);
      if (!stack.length) document.body.style.overflow = previousOverflow;
      if (wasTop && restore?.isConnected) restore.focus();
    };
  }, [active, containerRef]);
}
