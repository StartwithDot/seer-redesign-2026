import { useId, useState } from 'react';
import { guideSteps, guideTabs, glossary } from '../data/guide';
import { navigateDeep } from '../state/router';
import { Dialog } from './Dialog';
export function GuideDrawer({ open, onClose }: {
    open: boolean;
    onClose: () => void;
}) {
    const [active, setActive] = useState(0);
    const id = useId();
    return <Dialog open={open} title="Deep guide" description="Read the signal and prepare your trading desk." onClose={onClose} className="deep-guide">
    <div className="deep-guide__tabs" role="tablist" aria-label="Guide sections">{guideTabs.map((title, i) => <button id={`${id}-tab-${i}`} aria-controls={`${id}-panel`} tabIndex={active === i ? 0 : -1} key={title} role="tab" aria-selected={active === i} onClick={() => setActive(i)} onKeyDown={e => { let next = i; if (e.key === 'ArrowRight')
        next = (i + 1) % 4;
    else if (e.key === 'ArrowLeft')
        next = (i + 3) % 4;
    else if (e.key === 'Home')
        next = 0;
    else if (e.key === 'End')
        next = 3;
    else
        return; e.preventDefault(); setActive(next); document.getElementById(`${id}-tab-${next}`)?.focus(); }}>{title}</button>)}</div>
    <div className="deep-guide__content" id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} tabIndex={0}>
      {active === 0 && <><p>Decision makers use the field to focus human review. Traders put capital behind their estimates. Market prices inform decisions; allocating teams retain authority.</p>{guideSteps.map(step => <article key={step.title}><h3>{step.title}</h3><p>{step.body}</p><button className="deep-button" onClick={() => { onClose(); navigateDeep(`/deep?dialog=${step.target === 'deep-predictions' ? 'forecasts' : step.target === 'deep-strategy' ? 'trade-preview' : 'funds'}`); }}>Do it now: {step.title}</button></article>)}</>}
      {active === 1 && glossary.slice(0, 4).map(([term, body]) => <article key={term}><h3>{term}</h3><p>{body}</p></article>)}
      {active === 2 && <><h3>From prediction to order</h3><p>Load your CSV through Agent forecasts to compare predictions with market prices. Select an outcome and enter a positive amount in Trade preview to inspect indicative shares or proceeds. Review does not sign or submit an order.</p><p>Wallet connection alone does not establish a trade wallet or funding. This checkout cannot deploy, deposit, convert, withdraw, sell or execute without verified transaction adapters.</p>{glossary.slice(4).map(([term, body]) => <article key={term}><h3>{term}</h3><p>{body}</p></article>)}</>}
      {active === 3 && <dl>{glossary.map(([term, body]) => <div key={term}><dt><strong>{term}</strong></dt><dd>{body}</dd></div>)}</dl>}
    </div>
    <a className="deep-button" href="https://deep-pm.gitbook.io/seer-docs" target="_blank" rel="noreferrer">Full Deep documentation ↗</a>
  </Dialog>;
}
