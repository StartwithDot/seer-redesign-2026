import { useEffect, type RefObject } from 'react';

// A mobile keyboard can shrink the visual viewport without changing CSS vh/svh.
// Keep the focused form and sheet close control within the visible area.
export function useDialogViewport(open: boolean, panelRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const panel = panelRef.current;
    if (!open || !panel || typeof window === 'undefined') return;
    const viewport = window.visualViewport;
    if (!viewport) return;
    const layer = panel.parentElement;
    if (!layer) return;
    let frame = 0;
    const sync = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        layer.style.setProperty('--risk-visible-height', `${viewport.height}px`);
        layer.style.setProperty('--risk-visible-top', `${viewport.offsetTop}px`);
        const focused = document.activeElement;
        if (focused instanceof HTMLElement && panel.contains(focused) && focused.matches('input, select, textarea')) {
          focused.scrollIntoView({ block: 'nearest', behavior: 'auto' });
        }
      });
    };
    sync();
    viewport.addEventListener('resize', sync);
    viewport.addEventListener('scroll', sync);
    return () => {
      window.cancelAnimationFrame(frame);
      viewport.removeEventListener('resize', sync);
      viewport.removeEventListener('scroll', sync);
      layer.style.removeProperty('--risk-visible-height');
      layer.style.removeProperty('--risk-visible-top');
    };
  }, [open, panelRef]);
}
