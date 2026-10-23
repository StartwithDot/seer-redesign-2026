import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icons';
import { modalStack } from '../state/modal-stack';

export function Dialog({
  open,
  title,
  description,
  children,
  onClose,
  className = '',
}: {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
}) {
  const titleId = useId();
  const descriptionId = useId();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const panelRef = useRef<HTMLElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const layer = layerRef.current;
    if (!panel || !layer) return;
    const release = modalStack.register(panel, layer);
    (panel?.querySelector<HTMLElement>('[data-dialog-focus]') ?? panel?.querySelector<HTMLElement>('button'))?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (!modalStack.isTop(panel)) return;
      if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); closeRef.current(); }
      if (event.key !== 'Tab' || !panel) return;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, summary, [tabindex]')).filter(element =>
        element.tabIndex >= 0 && !element.matches(':disabled') && !element.closest('[inert]') && element.getClientRects().length > 0);
      if (!focusable.length) { event.preventDefault(); panel.focus(); return; }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (!focusable.includes(document.activeElement as HTMLElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    };
    const keepFocus = (event: FocusEvent) => {
      if (modalStack.isTop(panel) && !panel.contains(event.target as Node)) panel.focus();
    };
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('focusin', keepFocus);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('focusin', keepFocus);
      if (!release()) return;
      if (previous?.isConnected && !previous.closest('[inert]')) previous.focus();
      else (modalStack.top() ?? document.getElementById('deep-main'))?.focus();
    };
  }, [open]);
  if (!open) return null;
  return createPortal(
    <div ref={layerRef} className="deep-app deep-overlay-root">
    <div className="deep-dialog-layer" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={panelRef} tabIndex={-1} className={`deep-dialog ${className}`} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined}>
        <header className="deep-dialog__header">
          <div>
            <h2 id={titleId}>{title}</h2>
            {description && <p id={descriptionId}>{description}</p>}
          </div>
          <button className="deep-icon-button" type="button" onClick={onClose} aria-label={`Close ${title}`}>
            <Icon name="close" />
          </button>
        </header>
        {children}
      </section>
    </div>
    </div>, document.body
  );
}
