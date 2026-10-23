import { getLifecycleSteps } from '../data/lifecycle';
import type { Market } from '../data/types';
import { ActionDrawerFrame } from './ActionDrawerFrame';
import { DataList } from './DataList';

interface LifecycleDrawerProps {
  market: Market;
  onClose: () => void;
}

export function LifecycleDrawer({ market, onClose }: LifecycleDrawerProps) {
  const steps = getLifecycleSteps(market);
  return (
    <ActionDrawerFrame eyebrow="MARKET LIFECYCLE" title={`${market.proposal} lifecycle`} onClose={onClose} footer={<div className="trade-drawer-actions"><button className="primary-button" type="button" onClick={onClose}>Back to market</button></div>}>
      <section className="lifecycle-panel" aria-labelledby="lifecycle-title">
        <div className="trade-section-heading"><div><span className="eyebrow">OPENING, TIMEOUT AND BOND</span><h3 id="lifecycle-title">The market has a visible path from creation to resolution.</h3></div></div>
        <dl className="lifecycle-meta"><div><dt>Closing time</dt><dd>{new Date(market.closesAt).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</dd></div><div><dt>Example timeout</dt><dd>48 hours after close</dd></div><div><dt>Example minimum bond</dt><dd>250 sDAI</dd></div></dl>
        <DataList label="Market lifecycle" count={steps.length} emptyTitle="No lifecycle records available."><ol className="lifecycle-steps">
          {steps.map((step) => <li key={step.id} className={`is-${step.status}`}><span aria-hidden="true">{step.status === 'complete' ? '✓' : step.status === 'current' ? '•' : '○'}</span><div><strong>{step.label}</strong><p>{step.detail}</p><small>{step.time}</small></div></li>)}
        </ol></DataList>
      </section>
    </ActionDrawerFrame>
  );
}
