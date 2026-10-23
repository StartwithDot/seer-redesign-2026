import { EvidenceLink } from './EvidenceLink';
import { useModal } from '../hooks/useModal';
import { useEffect, useRef } from 'react';
import type { Market } from '../data/types';
import { ContractProvenancePanel } from './ContractProvenancePanel';
import { PermalinkActions } from './PermalinkActions';
import { TwapPanel } from './TwapPanel';

interface EvidenceDrawerProps {
  market: Market;
  open: boolean;
  section: 'twap' | 'resolution';
  onClose: () => void;
}

const statusFor = (market: Market, stage: 'answer' | 'report' | 'dispute') => {
  if (market.status === 'resolved') return 'Completed';
  if (market.status === 'awaiting') return stage === 'answer' ? 'Awaiting answer' : stage === 'report' ? 'Ready to report' : 'Available after report';
  return stage === 'answer' ? 'Question open' : stage === 'report' ? 'Not yet reportable' : 'Not yet disputable';
};

export function EvidenceDrawer({ market, open, section, onClose }: EvidenceDrawerProps) {
  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useModal(panelRef, open, onClose, closeRef);
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => panelRef.current?.querySelector(`[data-evidence-section="${section}"]`)?.scrollIntoView({ block: 'start' }));
    return () => cancelAnimationFrame(frame);
  }, [open, section]);

  if (!open) return null;

  return (
    <div className="evidence-layer" data-modal-layer>
      <button className="evidence-backdrop" type="button" data-modal-backdrop tabIndex={-1} aria-label="Close evidence" onClick={onClose} />
      <aside className="evidence-drawer" role="dialog" aria-modal="true" aria-labelledby="evidence-title" ref={panelRef} tabIndex={-1}>
        <header>
          <div><span className="eyebrow">EVIDENCE & RESOLUTION</span><h2 id="evidence-title">{market.proposal}</h2></div>
          <button className="evidence-close" type="button" onClick={onClose} ref={closeRef} aria-label="Close evidence">×</button>
        </header>

        <section className="evidence-question" data-evidence-section="resolution">
          <span>RESOLUTION QUESTION</span>
          <h3>{market.evidence.resolutionQuestion}</h3>
          <p>{market.evidence.resolutionCondition}</p>
        </section>

        <TwapPanel market={market} defaultOpen={section === 'twap'} />

        <nav className="evidence-links" aria-label="Resolution links">
          <EvidenceLink href={market.evidence.realityUrl} kind="reality">Resolve Question <span>↗</span></EvidenceLink>
          <EvidenceLink href={market.evidence.snapshotUrl} kind="snapshot">Snapshot Vote <span>↗</span></EvidenceLink>
          <EvidenceLink href={market.evidence.snapshotUrl} kind="snapshot">View final results <span>↗</span></EvidenceLink>
        </nav>

        <section className="resolution-flow" aria-labelledby="resolution-flow-title">
          <h3 id="resolution-flow-title">Resolution status</h3>
          <ol>
            <li><span>Answer</span><strong>{statusFor(market, 'answer')}</strong><EvidenceLink href={market.evidence.realityUrl} kind="reality">Reality.eth ↗</EvidenceLink></li>
            <li><span>Report</span><strong>{statusFor(market, 'report')}</strong><EvidenceLink href={market.evidence.realityUrl} kind="reality">Report ↗</EvidenceLink></li>
            <li><span>Dispute</span><strong>{statusFor(market, 'dispute')}</strong><EvidenceLink href={market.evidence.realityUrl} kind="reality">Dispute ↗</EvidenceLink></li>
            <li><span>Kleros resolution</span><strong>{market.status === 'resolved' ? 'Final' : 'Available if challenged'}</strong><a href={market.evidence.klerosUrl} target="_blank" rel="noreferrer">Kleros ↗</a></li>
          </ol>
        </section>

        <ContractProvenancePanel market={market} />

        <footer>
          <PermalinkActions market={market} evidenceState={section} />
          <span>MARKET CONTRACT</span>
          <a href={`https://gnosisscan.io/address/${market.marketAddress}`} target="_blank" rel="noreferrer">{market.marketAddress}</a>
          <p>Market signals are advisory. Voters and accountable people retain final authority.</p>
        </footer>
      </aside>
    </div>
  );
}
