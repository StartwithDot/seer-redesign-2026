import { useEffect, useState } from 'react';
import { currentMarket } from '../data/markets';
import { OverlayDialog } from './OverlayDialog';

export const marketSteps = [
  'Call for entries become submissions',
  'Traders set the odds of selection',
  'Price becomes a triage tool',
  'Sponsor makes final decision',
  'Traders earn P&L based on final decision',
];
const details = [
  '235 submissions enter the pilot.',
  'Traders back the submission they expect the sponsor to select.',
  'Top 27 capture 60.4% of recorded odds.',
  'Seer retains final authority. Review evidence before selecting.',
  'After resolution, payout follows the contract’s numerator / denominator for each outcome. An invalid result can refund shares according to the market rules; a normal losing outcome pays zero.',
];

export function MarketExplainer({ onClose, onGuide }: { onClose: () => void; onGuide: () => void }) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReduced(media.matches);
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    if (reduced || !playing) return;
    const timer = window.setTimeout(() => setStep(value => (value + 1) % 5), 5000);
    return () => window.clearTimeout(timer);
  }, [playing, reduced, step]);
  return <OverlayDialog title="How markets work" onClose={onClose} footer={<button className="primary-action" type="button" onClick={onGuide}>Guide me in the app</button>}>
    <div className="market-explainer">
      <nav aria-label="Market process">{marketSteps.map((label, index) => <button type="button" key={label} aria-pressed={step === index} onClick={() => { setStep(index); setPlaying(false); }}>{label}</button>)}</nav>
      <section className={step === 3 ? 'explainer-authority' : ''} aria-live="polite">
        <p>{currentMarket.title}</p><h3>{marketSteps[step]}</h3><p>{details[step]}</p>
        <div className="explainer-signal" aria-hidden="true">{[5.9, 4.1, 3.6, 3.5, 3.3].map((odds, index) => <span key={index} style={{ height: `${step === 0 ? 60 : step === 4 ? index === 0 ? 100 : 8 : odds * 14}%`, opacity: step === 2 && index > 2 ? .3 : 1 }} />)}</div>
        <p>{step === 4 ? 'Payout depends on the sponsor’s final choice.' : 'Odds are review evidence.'}</p>
      </section>
      <div className="explainer-controls"><button type="button" onClick={() => { setStep(value => (value + 4) % 5); setPlaying(false); }}>Back</button><button type="button" disabled={reduced} title={reduced ? 'Autoplay is off for reduced motion.' : undefined} onClick={() => setPlaying(value => !value)}>{playing && !reduced ? 'Pause' : 'Play'}</button><button type="button" onClick={() => { setStep(value => (value + 1) % 5); setPlaying(false); }}>Next</button></div>
    </div>
  </OverlayDialog>;
}
