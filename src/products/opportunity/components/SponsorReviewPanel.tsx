import type { SponsorReviewRecord } from '../data/types';
import { OptionalValue, ValueState } from './ValueState';

interface SponsorReviewPanelProps {
  review: SponsorReviewRecord;
}

function formatDate(value: string | null) {
  return value ? new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : null;
}

export function SponsorReviewPanel({ review }: SponsorReviewPanelProps) {
  return (
    <section className="sponsor-review-panel" aria-labelledby="sponsor-review-title">
      <div className="review-section-heading">
        <div>
          <p className="section-kicker">Sponsor authority</p>
          <h3 id="sponsor-review-title">Comments and decision record</h3>
        </div>
        <span className="authority-chip">Human decision</span>
      </div>
      <dl className="review-definition-list">
        <div>
          <dt>Sponsor comment</dt>
          <dd><OptionalValue value={review.comment} state={review.commentState} /></dd>
        </div>
        <div>
          <dt>Review notes</dt>
          <dd>
            {review.notes.length ? (
              <ul>{review.notes.map((note) => <li key={note}>{note}</li>)}</ul>
            ) : (
              <ValueState state="not-recorded" />
            )}
          </dd>
        </div>
        <div>
          <dt>Rejection reason</dt>
          <dd><OptionalValue value={review.rejectionReason} state={review.rejectionState} /></dd>
        </div>
        <div>
          <dt>Decision timestamp</dt>
          <dd><OptionalValue value={formatDate(review.decisionTimestamp)} state={review.decisionState} /></dd>
        </div>
      </dl>
    </section>
  );
}
