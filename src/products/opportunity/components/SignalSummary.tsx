import { submissionsForMarket } from '../data/submissions';
import type { MarketRecord } from '../data/types';
import { BoardCoverage } from './BoardCoverage';
import { BoardSignalStrip } from './BoardSignalStrip';
import { galleryFor } from '../data/gallery';
import { SubmissionAvatar } from './SubmissionAvatar';

interface SignalSummaryProps {
  market: MarketRecord;
  onOpenSubmission: (id: string) => void;
}

export function SignalSummary({ market, onOpenSubmission }: SignalSummaryProps) {
  const submissions = [...submissionsForMarket(market.id)].sort((a, b) => (b.oddsPercent ?? -1) - (a.oddsPercent ?? -1) || a.rank - b.rank).slice(0, 3);
  return (
    <div className="signal-summary-wrap">
      <section className="signal-summary" aria-labelledby="signal-heading">
        <div className="signal-heading">
          <p className="section-kicker">Market signal</p>
          <h2 id="signal-heading">Where to look first.</h2>
        </div>
        <div className="signal-forecasters">
          <p>Leading submissions <span>Chance · 24h change</span></p>
          {submissions.map((submission) => (
            <button className="signal-candidate" type="button" key={submission.id} onClick={() => onOpenSubmission(submission.id)} aria-label={`Review ${submission.name}, ${submission.oddsPercent === null ? 'unpriced' : `${submission.oddsPercent}% chance of selection`}`}>
              <SubmissionAvatar name={submission.name} src={galleryFor(market.id).find(item => item.title.trim() === submission.name.trim())?.images[0]?.url} />
              <strong title={submission.name}>{submission.name}</strong>
              <span className="candidate-chance"><span>{submission.oddsPercent === null ? 'Unpriced' : `${submission.oddsPercent.toFixed(1)}%`}</span><progress value={submission.oddsPercent ?? 0} max={100} aria-label={`${submission.name} chance of selection`} /></span>
              <small className={submission.delta24h === null || submission.delta24h === 0 ? '' : submission.delta24h > 0 ? 'delta-positive' : 'delta-negative'}>
                {submission.delta24h === null ? 'No 24h data' : `${submission.delta24h > 0 ? '+' : ''}${submission.delta24h}%`}
              </small>
            </button>
          ))}
          {!submissions.length && <small>No visible submissions in this data slice.</small>}
        </div>
      </section>
      <BoardCoverage market={market} />
      <BoardSignalStrip market={market} />
    </div>
  );
}
