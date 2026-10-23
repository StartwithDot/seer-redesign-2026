import { useEffect, useState } from 'react';
import type { RiskSection } from '../data/types';
import { MARKET_LINKS } from '../data/market';
import { ArrowUpRight, BookIcon } from './Icons';
import { Modal } from './Modal';
import { PaymentContext } from './PaymentContext';

const steps = [
  { label: 'Understand', title: 'Read the portfolio signal', copy: 'One shared-capital prediction covers the complete asset roster.' },
  { label: 'Compare', title: 'Move between views', copy: 'Keep the same selection while comparing risk, history, and estimates.' },
  { label: 'Participate', title: 'Prepare Gnosis funds', copy: 'Use xDAI, sDAI, or Seer Risk Credits when the next round opens.' },
];

const tour: Array<{ section: RiskSection; target: string; title: string; copy: string }> = [
  { section: 'overview', target: '.risk-overview', title: 'Read portfolio survival', copy: 'Use Show shares to reveal which assets drive risk.' },
  { section: 'assets', target: '.risk-explorer-toolbar', title: 'Compare assets', copy: 'Search, sort, select assets, then open their risk details.' },
  { section: 'history', target: '.risk-history-movers', title: 'Inspect market changes', copy: 'Compare movers, then inspect exact historical values in the chart.' },
  { section: 'participate', target: '.risk-aggregate-prediction', title: 'Save your estimates', copy: 'Edit estimates or import CSV. Export drafts while trading is closed.' },
];

export function QuickGuide({ onClose, onNavigate, open }: { onClose: () => void; onNavigate: (section: RiskSection) => void; open: boolean; }) {
  const [step, setStep] = useState(-1);
  useEffect(() => { if (!open) setStep(-1); }, [open]);
  useEffect(() => {
    if (!open || step < 0) return;
    let target: HTMLElement | null = null;
    const highlight = () => {
      const next = document.querySelector<HTMLElement>(tour[step].target);
      if (!next || next === target) return;
      target?.removeAttribute('data-risk-tour');
      target = next;
      target.setAttribute('data-risk-tour', 'true');
      target.scrollIntoView({ block: 'center', behavior: 'instant' });
    };
    highlight();
    const observer = new MutationObserver(highlight);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => { observer.disconnect(); target?.removeAttribute('data-risk-tour'); };
  }, [open, step]);
  const visit = (next: number) => { onNavigate(tour[next].section); setStep(next); };
  if (step >= 0) return <Modal className="risk-guide risk-tour" label="Risk guided tour" onClose={onClose} open={open}>
    <p className="risk-kicker">Guide · {step + 1} of {tour.length}</p>
    <h2>{tour[step].title}</h2><p role="status">{tour[step].copy}</p>
    <div className="risk-tour-actions">
      <button type="button" className="risk-secondary-button" disabled={step === 0} title={step === 0 ? 'First step' : 'Previous step'} onClick={() => visit(step - 1)}>Previous</button>
      <button type="button" className="risk-primary-button" onClick={() => step === tour.length - 1 ? onClose() : visit(step + 1)}>{step === tour.length - 1 ? 'Finish guide' : 'Next'}</button>
    </div>
  </Modal>;
  return <Modal className="risk-guide" label="Quick Guide" onClose={onClose} open={open}>
    <header className="risk-guide-header">
      <span className="risk-guide-title"><BookIcon /> Quick Guide</span>
    </header>
    <div className="risk-guide-stage">
      <div className="risk-guide-intro">
        <p className="risk-kicker">Kleros Foresight</p>
        <h2>Compare risk without losing the portfolio.</h2>
        <p>Move from the market-wide survival signal to individual assets, then save your own estimates.</p>
      </div>
      <ol className="risk-guide-steps">
        {steps.map((step) => <li key={step.title}>
          <span className="risk-step-index">{step.label}</span>
          <span className="risk-guide-step-copy"><strong>{step.title}</strong><span>{step.copy}</span></span>
        </li>)}
      </ol>
    </div>
    <div className="risk-guide-actions">
      <button className="risk-primary-button" type="button" onClick={() => visit(0)}>Start guided tour</button>
      <div className="risk-guide-links">
        <a href={MARKET_LINKS.beginnerGuide} target="_blank" rel="noreferrer">Beginner guide <ArrowUpRight /></a>
        <a href={MARKET_LINKS.advancedGuide} target="_blank" rel="noreferrer">Advanced guide <ArrowUpRight /></a>
        <a href={MARKET_LINKS.acquireXdai} target="_blank" rel="noreferrer">Acquire xDAI <ArrowUpRight /></a>
      </div>
    </div>
    <PaymentContext compact />
    <p className="risk-guide-note">The exact default trigger is governed by the published market terms. Read those terms before participating.</p>
  </Modal>;
}
