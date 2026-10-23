import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { currentMarket } from '../data/markets';

const steps = [
  { title: 'Browse markets', body: 'Find active and completed opportunities. Filter by status or search by name.', target: '.market-rail', route: '/opportunity' },
  { title: 'Across the markets', body: 'Select a market in the ticker. Hover or focus pauses the moving prices.', target: '.market-ticker', route: '/opportunity' },
  { title: 'Field', body: 'Compare selection odds. Select a candidate to inspect its record.', target: '.review-field-viewport', view: 'field' },
  { title: 'Review cut', body: 'Narrow the review queue. Coverage shows how much odds it captures.', target: '.review-cut-controls', view: 'cut' },
  { title: 'Sponsor decision', body: 'Amber marks sponsor authority. Shortlisting never selects a protocol winner.', target: '.decision-lane__signal', view: 'cut' },
  { title: 'Step bar', body: 'Follow the process from entries through pricing, decision and payout.', target: '.decision-stepper', view: 'field' },
  { title: 'Ticket', body: 'Buy or sell with a real wallet and fresh quote.', target: '.trade-mode', view: 'trade' },
  { title: 'Connect wallet', body: 'Connect a supported provider. Account and network changes invalidate quotes.', target: '.wallet-trigger' },
];

export function GuidedTour({ onClose, onNavigate }: { onClose: () => void; onNavigate: (href: string) => void }) {
  const [step, setStep] = useState(0);
  const [box, setBox] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [card, setCard] = useState({ left: 16, top: 16 });
    const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const current = steps[step];
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const element = dialog.current;
    element?.showModal();
    return () => { element?.close(); if (previous?.isConnected) previous.focus(); };
  }, []);
  useEffect(() => {
    if (current.route) onNavigate(current.route);
    else if (step < 7 && !window.location.pathname.startsWith('/opportunity/review/')) onNavigate(`/opportunity/review/${currentMarket.id}`);
    const prepare = () => {
      window.dispatchEvent(new CustomEvent('opportunity:tour-step', { detail: current.view ?? 'close' }));
      if (step === 5) {
        const details = document.querySelector<HTMLDetailsElement>('.decision-lane__details');
        if (details) details.open = true;
      }
      else {
        const details = document.querySelector<HTMLDetailsElement>('.decision-lane__details');
        if (details) details.open = false;
      }
    };
    prepare();
    const timer = window.setTimeout(prepare, 650);
    return () => clearTimeout(timer);
  }, [step, current, onNavigate]);
  useLayoutEffect(() => {
    let lastTarget: HTMLElement | undefined;
    const opened = new Map<HTMLDetailsElement, boolean>();
    const measure = () => {
      const headerBottom = document.querySelector('.product-header')?.getBoundingClientRect().bottom ?? 72;
      const safeTop = Math.max(16, headerBottom + 12);
      const cw = Math.min(320, innerWidth - 32), ch = panel.current?.offsetHeight ?? 208;
      const compact = innerWidth <= 760;
      const safeBottom = innerHeight - (compact ? ch + 32 : 16);
      const target = Array.from(document.querySelectorAll<HTMLElement>(current.target)).find(el => el.getClientRects().length || !!el.closest('.board-ticker-disclosure'));
      if (!target) {
        setBox(previous => previous.w ? { x: 0, y: 0, w: 0, h: 0 } : previous);
        setCard({ left: compact ? 16 : innerWidth - cw - 16, top: Math.max(16, innerHeight - ch - 16) });
        return;
      }
      if (lastTarget !== target) {
        for (let node: HTMLElement | null = target; node; node = node.parentElement) {
          if (node instanceof HTMLDetailsElement) { opened.set(node, node.open); node.open = true; }
        }
        const before = target.getBoundingClientRect();
        if (before.top < safeTop || before.bottom > safeBottom) {
          target.scrollIntoView({ block: 'center', behavior: 'instant' });
          const after = target.getBoundingClientRect();
          window.scrollBy({ top: after.top - safeTop, behavior: 'instant' });
        }
        lastTarget = target;
      }
      const rect = target.getBoundingClientRect();
      const x = Math.max(8, rect.left - 4), y = Math.max(safeTop, rect.top - 4);
      const w = Math.max(0, Math.min(innerWidth - 8, rect.right + 4) - x);
      const h = Math.max(0, Math.min(safeBottom, rect.bottom + 4) - y);
      const visible = w > 0 && h > 0;
      const nextBox = visible ? { x, y, w, h } : { x: 0, y: 0, w: 0, h: 0 };
      setBox(previous => previous.x === nextBox.x && previous.y === nextBox.y && previous.w === nextBox.w && previous.h === nextBox.h ? previous : nextBox);
      const positions = [{ left: x + w + 16, top: y }, { left: x - cw - 16, top: y }, { left: x, top: y + h + 16 }, { left: x, top: y - ch - 16 }];
      const position = positions.map(p => ({ left: Math.max(16, Math.min(p.left, innerWidth - cw - 16)), top: Math.max(safeTop, Math.min(p.top, innerHeight - ch - 16)) })).find(p => p.left >= x + w + 8 || p.left + cw <= x - 8 || p.top >= y + h + 8 || p.top + ch <= y - 8);
      setCard(previous => {
        const next = compact ? { left: 16, top: Math.max(16, innerHeight - ch - 16) } : position ?? { left: innerWidth - cw - 16, top: Math.max(safeTop, innerHeight - ch - 16) };
        return previous.left === next.left && previous.top === next.top ? previous : next;
      });
    };
    measure();
    const timer = window.setInterval(measure, 250);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
      opened.forEach((wasOpen, details) => { if (details.isConnected) details.open = wasOpen; });
    };
  }, [current]);
  const { x, y, w, h } = box;
  const clip = `polygon(0 0,100% 0,100% 100%,0 100%,0 0,${x}px ${y}px,${x}px ${y+h}px,${x+w}px ${y+h}px,${x+w}px ${y}px,${x}px ${y}px)`;
  return <dialog ref={dialog} className="guided-tour" role="dialog" aria-modal="true" aria-labelledby="guided-tour-title" onCancel={event => { event.preventDefault(); onClose(); }} onKeyDown={event => {
    if (event.key === 'ArrowRight') setStep(n => Math.min(7, n + 1));
    if (event.key === 'ArrowLeft') setStep(n => Math.max(0, n - 1));
  }}>
    <div className="guided-tour-scrim" style={{ clipPath: w && h ? clip : undefined }} />
    {!!w && !!h && <div className="guided-tour-ring" style={{ left: x, top: y, width: w, height: h }} aria-hidden="true" />}
    <div ref={panel} className="guided-tour-card" style={card}>
      <p>{step + 1} / 8</p><h2 id="guided-tour-title">{current.title}</h2><p>{current.body}</p>
      <div><button type="button" disabled={step === 0} title="First tour step" onClick={() => setStep(n => n - 1)}>Back</button><button type="button" onClick={onClose}>Skip</button><button type="button" className="primary-action" onClick={() => step === 7 ? onClose() : setStep(n => n + 1)}>{step === 7 ? 'Finish' : 'Next'}</button></div>
    </div>
  </dialog>;
}
