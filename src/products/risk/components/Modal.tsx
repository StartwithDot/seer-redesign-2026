import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon } from './Icons';
import { useDialogViewport } from '../hooks/useDialogViewport';

interface ModalProps {
  children: ReactNode;
  className?: string;
  label: string;
  onClose: () => void;
  open: boolean;
}
const stack: HTMLElement[] = [];
const originalInert = new Map<HTMLElement, boolean>();
function syncBackground() {
  const shell = document.querySelector('.risk-shell');
  for (const [element, value] of originalInert) element.inert = value;
  if (!stack.length) { originalInert.clear(); document.body.classList.remove('risk-modal-open'); return; }
  const top = stack.at(-1)?.parentElement;
  for (const element of Array.from(shell?.children || [])) {
    if (!(element instanceof HTMLElement)) continue;
    if (!originalInert.has(element)) originalInert.set(element, element.inert);
    element.inert = element !== top;
  }
  document.body.classList.add('risk-modal-open');
}
const tabbables = (panel: HTMLElement) => [...panel.querySelectorAll<HTMLElement>(
  'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
)].filter((element) => element.getClientRects().length > 0 && !element.closest('[inert]') && element.tabIndex >= 0);

export function Modal({ children, className = '', label, onClose, open }: ModalProps) {
  const panelRef = useRef<HTMLElement>(null);
  useDialogViewport(open, panelRef);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    const panel = panelRef.current;
    if (!open || !panel) return;
    const previous = document.activeElement as HTMLElement | null;
    stack.push(panel);
    syncBackground();
    (panel.querySelector<HTMLElement>('[data-autofocus]') || tabbables(panel)[0] || panel).focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (stack.at(-1) !== panel) return;
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onCloseRef.current(); return; }
      if (event.key !== 'Tab') return;
      const items = tabbables(panel);
      if (!items.length) { event.preventDefault(); panel.focus(); return; }
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) {
        event.preventDefault(); first.focus();
      }
    };
    const onFocus = (event: FocusEvent) => {
      if (stack.at(-1) === panel && !panel.contains(event.target as Node)) (tabbables(panel)[0] || panel).focus();
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('focusin', onFocus);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('focusin', onFocus);
      const index = stack.indexOf(panel);
      if (index >= 0) stack.splice(index, 1);
      syncBackground();
      if (previous?.isConnected && !previous.closest('[inert]')) previous.focus();
    };
  }, [open]);
  if (!open) return null;
  return createPortal(
    <div className="risk-modal-layer" onMouseDown={(event) => event.target === event.currentTarget && stack.at(-1) === panelRef.current && onClose()}>
      <section ref={panelRef} tabIndex={-1} className={`risk-modal ${className}`} role="dialog" aria-modal="true" aria-label={label}>
        <button className="risk-icon-button risk-modal-close" type="button" onClick={onClose} aria-label={`Close ${label}`}><CloseIcon /></button>
        {children}
      </section>
    </div>, document.querySelector('.risk-shell') || document.body,
  );
}
