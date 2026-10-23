import { useEffect, useId, useRef, useState } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';

const steps = [
  ['Find a market', 'Search questions, outcomes and collections. Press / or ⌘K.', '[data-tour-target="search"]'],
  ['Move across Explorer', 'Browse markets, compare traders, or create a question.', '[data-tour-target="primary-nav"], [data-tour-target="mobile-nav"]'],
  ['Explore Seer products', 'Find specialist markets and the wider Seer ecosystem.', '[data-tour-target="products"], [data-tour-target="mobile-nav"]'],
  ['Choose a theme', 'Light and dark keep your place and save your preference.', '[data-tour-target="theme"]'],
  ['Review your wallet', 'Check account, network and balances before trading.', '[data-tour-target="wallet"], [data-tour-target="mobile-nav"]'],
] as const;

export function GuidedTour({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [box, setBox] = useState({ left: 8, top: 80, width: 0, height: 0 });
  const [viewport, setViewport] = useState({ width: 390, height: 800 });
  const root = useRef<HTMLDivElement>(null);
  const mask = useId();
  useFocusTrap(open, root, onClose);
  useEffect(() => { if (!open) setStep(0); }, [open]);
  useEffect(() => {
    if (!open) return;
    let target: HTMLElement | undefined;
    const measure = () => {
      target?.removeAttribute('data-tour-active');
      target = [...document.querySelectorAll<HTMLElement>(steps[step][2])].find((element) => element.getClientRects().length > 0);
      target?.setAttribute('data-tour-active', 'true');
      const rect = target?.getBoundingClientRect();
      setBox(rect ? { left: rect.left - 6, top: rect.top - 6, width: rect.width + 12, height: rect.height + 12 } : { left: 8, top: 80, width: 0, height: 0 });
      setViewport({ width: innerWidth, height: innerHeight });
    };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => { target?.removeAttribute('data-tour-active'); window.removeEventListener('resize', measure); window.removeEventListener('scroll', measure, true); };
  }, [open, step]);
  if (!open) return null;
  const width = Math.min(352, viewport.width - 24);
  const top = Math.max(12, Math.min(viewport.height - 220, box.top + box.height + 16));
  const left = Math.max(12, Math.min(viewport.width - width - 12, box.left));
  return <div className="explorer-tour" ref={root} role="dialog" aria-modal="true" aria-labelledby={`${mask}-title`} aria-describedby={`${mask}-body`} tabIndex={-1}>
    <svg className="tour-shade" width="100%" height="100%" aria-hidden="true"><defs><mask id={mask}><rect width="100%" height="100%" fill="white" /><rect data-tour-cutout x={box.left} y={box.top} width={box.width} height={box.height} rx="12" fill="black" /></mask></defs><rect width="100%" height="100%" fill="black" fillOpacity=".52" mask={`url(#${mask})`} /></svg>
    <section className="tour-coach" style={{ left, top, width }}>
      <div className="tour-meta"><span>{step + 1} / {steps.length}</span><button className="icon-button" type="button" onClick={onClose} aria-label="Close tour">×</button></div>
      <h2 id={`${mask}-title`}>{steps[step][0]}</h2><p id={`${mask}-body`}>{steps[step][1]}</p>
      <div className="tour-actions"><button type="button" className="secondary-button" onClick={onClose}>Skip</button><button type="button" className="secondary-button" disabled={step === 0} title={step === 0 ? 'You are on the first step' : undefined} onClick={() => setStep(step - 1)}>Back</button><button type="button" className="primary-button" onClick={() => step === steps.length - 1 ? onClose() : setStep(step + 1)}>{step === steps.length - 1 ? 'Finish' : 'Next'}</button></div>
    </section>
  </div>;
}
