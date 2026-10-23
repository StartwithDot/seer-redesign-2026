import { buildCoverageCheckpoints, buildCutSummary, type ReviewCutStrategy } from '../data/reviewCut';
import type { SubmissionDossier } from '../data/types';

interface ReviewCutSummaryProps {
  dossiers: SubmissionDossier[];
  included: SubmissionDossier[];
  strategy: ReviewCutStrategy;
}

export function ReviewCutSummary({ dossiers, included, strategy }: ReviewCutSummaryProps) {
  const summary = buildCutSummary(dossiers, included, strategy);
  const checkpoints = buildCoverageCheckpoints(dossiers);
  return (
    <section className="review-cut-summary" aria-labelledby="review-cut-summary-title">
      <div>
        <p className="section-kicker">Live cut</p>
        <h2 id="review-cut-summary-title">{summary.includedCount} included</h2>
      </div>
      <dl>
        <div><dt>Excluded</dt><dd>{summary.excludedCount}</dd></div>
        <div><dt>Odds captured</dt><dd>{summary.includedOdds.toFixed(1)}%</dd></div>
        <div><dt>Coverage</dt><dd>{summary.coveragePercent.toFixed(1)}%</dd></div>
        <div><dt>Gain vs top 3</dt><dd>
          {summary.coverageGainVsTop3Percent >= 0 ? '+' : '−'}{Math.abs(summary.coverageGainVsTop3Percent).toFixed(1)}%
        </dd></div>
      </dl>
      <div className="coverage-checkpoints" aria-label="Top candidate coverage checkpoints">
        {checkpoints.map((checkpoint) => (
          <div key={checkpoint.count} className={included.length >= checkpoint.count ? 'is-covered' : ''}>
            <span>Top {checkpoint.count}</span>
            <strong>{checkpoint.oddsPercent.toFixed(1)}%</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
