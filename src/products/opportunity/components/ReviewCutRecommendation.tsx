import { marketImageFor } from '../data/marketAssets';
import type { MarketRecord, SubmissionDossier } from '../data/types';

interface ReviewCutRecommendationProps {
  market: MarketRecord;
  dossiers: SubmissionDossier[];
  onOpenDecision: () => void;
}

export function ReviewCutRecommendation({ market, dossiers, onOpenDecision }: ReviewCutRecommendationProps) {
  const leaders = [...dossiers]
    .sort((left, right) => left.submission.rank - right.submission.rank)
    .slice(0, 3);
  const image = marketImageFor(market);
  return (
    <section className="review-cut-recommendation" aria-labelledby="review-recommendation-title">
      <div className="recommendation-media">
        {image ? (
          <img src={image} alt={`Market record for ${market.title}`} />
        ) : (
          <div className="recommendation-placeholder" role="img" aria-label={`Tonal market placeholder for ${market.title}`}>
            {market.title.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>
      <div>
        <p className="section-kicker">Triage evidence</p>
        <h2 id="review-recommendation-title">Odds order attention.</h2>
        <p>Start with the priced leaders, then apply sponsor judgment. This recommendation does not select a winner.</p>
        <ol>
          {leaders.map((dossier) => (
            <li key={dossier.submission.id}>
              <span>#{dossier.submission.rank}</span>
              <strong>{dossier.submission.name}</strong>
              <output>{dossier.submission.oddsPercent === null ? 'Unpriced' : `${dossier.submission.oddsPercent}%`}</output>
            </li>
          ))}
        </ol>
        <button className="authority-action" type="button" onClick={onOpenDecision}>
          Record sponsor decision <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
