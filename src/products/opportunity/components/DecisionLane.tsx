import {
  buildDecisionSteps,
  buildResolutionContext,
  buildSponsorAuthority,
} from '../data/decisionFlow';
import type { SponsorDecisionRecord } from '../data/reviewCut';
import type { MarketRecord, SubmissionDossier } from '../data/types';
import { DecisionStepper } from './DecisionStepper';
import { ResolutionContext } from './ResolutionContext';
import { SponsorAuthorityPanel } from './SponsorAuthorityPanel';

interface DecisionLaneProps {
  market: MarketRecord;
  winner: SubmissionDossier | null;
  winners?: SubmissionDossier[];
  decisions: Record<string, SponsorDecisionRecord>;
  onOpenDecision: () => void;
}

export function DecisionLane({ market, winner, winners = winner ? [winner] : [], decisions, onOpenDecision }: DecisionLaneProps) {
  const confirmed = Object.values(decisions).filter((decision) => decision.status === 'confirmed').length;
  const authority = buildSponsorAuthority(market, winner, confirmed);
  return (
    <aside className="decision-lane" aria-labelledby="decision-lane-title">
      <div className="decision-lane__signal">
        <span className="authority-mark" aria-hidden="true">◆</span>
        <div>
          <p className="section-kicker">Sponsor authority</p>
          <h2 id="decision-lane-title">The sponsor makes the final choice.</h2>
        </div>
      </div>
      <details className="decision-lane__details"><summary>Decision process and sponsor rules</summary><div>
      <DecisionStepper steps={buildDecisionSteps(market)} />
      <SponsorAuthorityPanel authority={authority} />
      </div></details>
      {winner && (
        <section className="decision-winner" aria-labelledby="decision-winner-title">
          <p className="section-kicker">Recorded decision</p>
          <h3 id="decision-winner-title">{winners.length > 1 ? `${winners.length} selected submissions` : winner.submission.name}</h3>
          {winners.length > 1 && <ul>{winners.map(item => <li key={item.submission.id}>{item.submission.name}</li>)}</ul>}
          <p>{winner.sponsorReview.comment ?? 'Sponsor rationale is not recorded.'}</p>
          <dl>
            <div><dt>Payout</dt><dd>{winner.payoutLabel ?? `1.00 ${market.collateral} per winning share`}</dd></div>
            <div><dt>Schedule</dt><dd>{market.status === 'redeemed' ? 'Paid and redeemed' : 'After final resolution'}</dd></div>
          </dl>
        </section>
      )}
      <ResolutionContext context={buildResolutionContext(market)} />
      <button className="authority-action" type="button" onClick={onOpenDecision}>
        Record a private review <span aria-hidden="true">→</span>
      </button>
    </aside>
  );
}
