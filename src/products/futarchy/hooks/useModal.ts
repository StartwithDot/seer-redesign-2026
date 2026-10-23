import { useEffect, useRef, type RefObject } from 'react';

// One stack for all product dialogs, including a wallet opened over an action drawer.
const stack: HTMLElement[] = [];
let originalOverflow = '';
const selector = 'a[href]:not([tabindex="-1"]), button:not(:disabled):not([tabindex="-1"]), input:not(:disabled):not([tabindex="-1"]), select:not(:disabled):not([tabindex="-1"]), textarea:not(:disabled):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"]):not(:disabled)';
const visible = (node: HTMLElement) => !node.closest('[inert], [hidden]') && node.getClientRects().length > 0;
const inertNodes = new Map<HTMLElement, { count: number; original: boolean }>();
const hide = (node: HTMLElement) => {
  const entry = inertNodes.get(node) || { count: 0, original: node.inert };
  entry.count += 1;
  inertNodes.set(node, entry);
  node.inert = true;
};
const restore = (node: HTMLElement) => {
  const entry = inertNodes.get(node);
  if (!entry) return;
  entry.count -= 1;
  if (!entry.count) { node.inert = entry.original; inertNodes.delete(node); }
};
const syncLayers = () => {
  const top = stack.at(-1);
  // A newly mounted dialog can lie in a sibling hidden by another dialog's effect.
  for (const [node, entry] of inertNodes) node.inert = entry.original || Boolean(entry.count && (!top || !node.contains(top)));
  stack.forEach((node, index) => {
    const layer = node.closest<HTMLElement>('[data-modal-layer]');
    if (layer) layer.style.zIndex = String(140 + index * 10);
  });
};

export function useModal<T extends HTMLElement>(panel: RefObject<T | null>, open: boolean, onClose: () => void, initial?: RefObject<HTMLElement | null>) {
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const node = panel.current;
    if (!open || !node) return;
    const previous = document.activeElement as HTMLElement | null;
    const hidden: HTMLElement[] = [];
    // Inert every sibling along the path to the body, without hiding this dialog.
    let branch: HTMLElement = node;
    while (branch.parentElement && branch !== document.body) {
      for (const sibling of branch.parentElement.children) {
        if (sibling !== branch && sibling instanceof HTMLElement && !sibling.hasAttribute('data-modal-backdrop')) {
          hidden.push(sibling);
          hide(sibling);
        }
      }
      branch = branch.parentElement;
    }
    if (!stack.length) { originalOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; }
    stack.push(node);
    const layer = node.closest<HTMLElement>('[data-modal-layer]');
    syncLayers();
    const focusFirst = () => (initial?.current || [...node.querySelectorAll<HTMLElement>(selector)].find(visible) || node).focus();
    focusFirst();
    const onKey = (event: KeyboardEvent) => {
      if (stack.at(-1) !== node) return;
      if (event.key === 'Escape') {
        event.preventDefault(); event.stopImmediatePropagation(); close.current();
      } else if (event.key === 'Tab') {
        const controls = [...node.querySelectorAll<HTMLElement>(selector)].filter(visible);
        const first = controls[0]; const last = controls.at(-1);
        if (!first) { event.preventDefault(); node.focus(); }
        else if (event.shiftKey && (document.activeElement === first || !controls.includes(document.activeElement as HTMLElement))) {
          event.preventDefault(); last?.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !controls.includes(document.activeElement as HTMLElement))) {
          event.preventDefault(); first.focus();
        }
      }
    };
    const onFocus = (event: FocusEvent) => {
      if (stack.at(-1) === node && !node.contains(event.target as Node)) focusFirst();
    };
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('focusin', onFocus);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('focusin', onFocus);
      const index = stack.indexOf(node);
      if (index >= 0) stack.splice(index, 1);
      hidden.forEach(restore);
      if (layer) layer.style.removeProperty('z-index');
      syncLayers();
      if (!stack.length) document.body.style.overflow = originalOverflow;
      const top = stack.at(-1);
      if (previous?.isConnected && !previous.closest('[inert]') && (!top || top.contains(previous))) previous.focus();
      else if (top) top.focus();
      else if (!document.activeElement || document.activeElement === document.body) document.getElementById('futarchy-main')?.focus({ preventScroll: true });
    };
  }, [open, panel, initial]);
}
