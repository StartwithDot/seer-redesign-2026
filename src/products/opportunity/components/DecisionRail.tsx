import type { MarketRecord } from '../data/types';

interface DecisionRailProps {
  market: MarketRecord;
  onOpenReview: () => void;
}

export function DecisionRail({ market, onOpenReview }: DecisionRailProps) {
  const undecided = market.decisions.undecided;
  return (
    <aside className="decision-rail" aria-labelledby="decision-heading">
      <div className="decision-status">
        <div>
          <p className="section-kicker">Sponsor task</p>
          <h2 id="decision-heading">{undecided} undecided</h2>
          <p>{market.decidedCount} of {market.submissionCount} decided. Final choice: {market.sponsor}.</p>
        </div>
      </div>
      <div className="recommendation">
        <span>Review evidence</span>
        <strong title={market.recommendation}>{market.recommendation}</strong>
        <p>Odds guide the review queue.</p>
      </div>
      <details className="decision-rail-details">
      <summary>Decision details <span aria-hidden="true">+</span></summary>
      <dl>
        <div><dt>Decision deadline</dt><dd>{market.decisionDeadline ?? 'No deadline recorded'}</dd></div>
        <div><dt>Prize rule</dt><dd>{market.prizeLabel ?? 'No prize recorded'}</dd></div>
        <div><dt>Next sponsor action</dt><dd>{market.nextAction}</dd></div>
        <div><dt>Final authority</dt><dd>{market.sponsor} sponsor</dd></div>
      </dl>
      </details>
      <button className="authority-action" type="button" onClick={onOpenReview}>
        Prepare review cut <span aria-hidden="true">↗</span>
      </button>
    </aside>
  );
}
