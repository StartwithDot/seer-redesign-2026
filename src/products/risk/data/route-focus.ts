import type { RiskSection } from './types';

const sectionIds: Record<RiskSection, string> = {
  overview: 'risk-overview', assets: 'risk-assets-section', history: 'risk-history-section', participate: 'risk-participate',
};
let cancelPending: (() => void) | undefined;

// Lazy routes can mount after navigation. Focus only the latest requested destination.
export function focusRiskSection(section: RiskSection) {
  cancelPending?.();
  let timer: number, firstAttempt: number;
  let cancelled = false;
  const cleanup = () => { cancelled = true; observer.disconnect(); window.clearTimeout(timer); window.clearTimeout(firstAttempt); };
  const focus = () => {
    if (cancelled) return;
    const target = document.getElementById(sectionIds[section]);
    if (!target) return;
    cleanup();
    target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    target.focus({ preventScroll: true });
  };
  const observer = new MutationObserver(focus);
  observer.observe(document.getElementById('product-main') || document.body, { childList: true, subtree: true });
  timer = window.setTimeout(cleanup, 10000);
  cancelPending = cleanup;
  firstAttempt = window.setTimeout(focus, 0);
}
