import { useModal } from '../hooks/useModal';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { writeStorage } from '../data/browserStorage';

const steps = [
  { target: 'brand', title: 'Return to the Signal Board', copy: 'The Futarchy mark always returns to the live decision surface.' },
  { target: 'theme', title: 'Choose your working theme', copy: 'Light and dark themes are designed separately and remembered on this device.' },
  { target: 'wallet', title: 'Connect only when needed', copy: 'Futarchy sends a real browser-wallet request and never simulates signing.' },
  { target: 'search', title: 'Search the decision graph', copy: 'Press / or Cmd/Ctrl + K to find markets, organizations and actions.' },
  { target: 'milestones', title: 'Jump to active milestones', copy: 'Move directly to proposals with open conditional markets.' },
  { target: 'organizations', title: 'Inspect the asking organizations', copy: 'Organizations frame who asked the question and which token is priced.' },
  { target: 'question', title: 'Read the actual question', copy: 'Every signal states what is being priced in plain language.' },
  { target: 'spine', title: 'Follow the Decision Spine', copy: 'One shared history enters the NOW gate and branches into pass and fail worlds.' },
  { target: 'create', title: 'Create a governance signal', copy: 'Use the focused create route when a new proposal needs a market.' },
  { target: 'footer', title: 'Move across Seer', copy: 'Product and community links remain available at the end of every view.' },
] as const;

interface GuidedTourProps {
  open: boolean;
  onClose: () => void;
}

export function GuidedTour({ open, onClose }: GuidedTourProps) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const current = steps[step];
  const finish = () => { writeStorage('futarchy-tour-complete', 'true'); onClose(); };

  useLayoutEffect(() => {
    if (!open) return;
    let frame = 0;
    const targetForStep = () => {
      const target = document.querySelector<HTMLElement>(`[data-tour="${current.target}"]`);
      if (target && target.getClientRects().length) return target;
      return document.querySelector<HTMLElement>('[data-tour="mobile-navigation"]');
    };
    const update = () => {
      const target = targetForStep();
      setRect(target?.getBoundingClientRect() ?? null);
    };
    targetForStep()?.scrollIntoView({ block: 'center', behavior: 'instant' });
    frame = window.requestAnimationFrame(update);
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update);
    };
  }, [current.target, open]);

  useModal(panelRef, open, finish);

  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  if (!open) return null;

  return (
    <div className="tour-layer" data-modal-layer role="presentation">
      {rect && (
        <div
          className="tour-spotlight"
          style={{ left: rect.left - 7, top: rect.top - 7, width: rect.width + 14, height: rect.height + 14 }}
        />
      )}
      <section
        ref={panelRef}
        className="tour-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
        aria-describedby="tour-copy"
        tabIndex={-1}
      >
        <div className="tour-progress" aria-label={`Step ${step + 1} of ${steps.length}`}>
          {steps.map((item, index) => <span key={item.target} className={index <= step ? 'is-complete' : ''} />)}
        </div>
        <span className="eyebrow">STEP {step + 1} OF {steps.length}</span>
        <h2 id="tour-title">{current.title}</h2>
        <p id="tour-copy" aria-live="polite">{current.copy}</p>
        <div className="tour-actions">
          <button className="quiet-button" type="button" onClick={finish}>Close</button>
          <div>
            <button className="quiet-button" type="button" disabled={step === 0} title={step === 0 ? 'This is the first step' : 'Return to the previous step'} onClick={() => setStep((value) => value - 1)}>Back</button>
            <button
              className="primary-button"
              type="button"
              onClick={() => step === steps.length - 1 ? finish() : setStep((value) => value + 1)}
            >
              {step === steps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
