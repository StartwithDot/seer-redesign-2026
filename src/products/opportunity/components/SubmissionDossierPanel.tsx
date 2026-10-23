import type { SubmissionDossier } from '../data/types';
import { RecordActions } from './RecordActions';
import { SubmissionEvidencePanel } from './SubmissionEvidencePanel';
import { ValueState } from './ValueState';
import { archiveEvidenceFor } from '../data/archive';

interface SubmissionDossierPanelProps {
  dossier: SubmissionDossier;
  recordKind: 'submission' | 'outcome';
  onOpenRecord: (recordId: string) => void;
}

function currency(value: number | null) {
  return value === null ? 'Unavailable' : `${value < 0 ? '−' : ''}$${Math.abs(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function SubmissionDossierPanel({
  dossier,
  recordKind,
  onOpenRecord,
}: SubmissionDossierPanelProps) {
  const { submission, market, position } = dossier;
  return (
    <article className="record-dossier submission-dossier">
      <header className="submission-identity">
        <span className="candidate-avatar candidate-avatar--large" aria-hidden="true">{dossier.avatarInitials}</span>
        <div>
          <p className="section-kicker">{recordKind === 'outcome' ? 'Outcome record' : 'Submission record'}</p>
          <h3>{submission.name}</h3>
          <p>{submission.creator} · rank {submission.rank} · {submission.id}</p>
          <div className="submission-badges">
            <span className={submission.source === 'sample' ? 'sample-badge' : 'verified-badge'}>
              {submission.source === 'sample' ? 'Deterministic sample' : 'Verified record'}
            </span>
            <span className={`status-chip status-chip--${submission.decision}`}>{submission.decision}</span>
            {dossier.winner && <span className="winner-badge">Winner</span>}
          </div>
        </div>
        <button type="button" className="secondary-action" onClick={() => onOpenRecord(`market-${market.id}`)}>
          Open market
        </button>
      </header>

      <section aria-labelledby="submission-price-title">
        <p className="section-kicker">Market signal</p>
        <h3 id="submission-price-title">Price, odds, and rank movement</h3>
        <dl>
          <div><dt>Rank</dt><dd>#{submission.rank}</dd></div>
          <div><dt>Market odds</dt><dd>{submission.oddsPercent === null ? <ValueState state="unpriced" /> : `${submission.oddsPercent}%`}</dd></div>
          <div><dt>Price</dt><dd>{submission.priceUsd === null ? <ValueState state="no-pool" /> : `$${submission.priceUsd.toFixed(3)}`}</dd></div>
          <div><dt>24 hour change</dt><dd>{submission.delta24h === null ? <ValueState state="unavailable" /> : `${submission.delta24h > 0 ? '+' : submission.delta24h < 0 ? '−' : ''}${Math.abs(submission.delta24h)}%`}</dd></div>
          <div><dt>Tier</dt><dd>{submission.tier}</dd></div>
          <div><dt>Rank movement</dt><dd>{submission.rankMovement === null || submission.rankMovement === undefined ? 'Not recorded' : dossier.rankMovement > 0 ? `+${dossier.rankMovement}` : dossier.rankMovement < 0 ? `−${Math.abs(dossier.rankMovement)}` : 'No change'}</dd></div>
          <div><dt>Market depth</dt><dd>{currency(market.liquidityUsd)}</dd></div>
        </dl>
        <p className="record-note">Depth is the market’s aggregate recorded liquidity. Review a live quote for outcome-specific price impact.</p>
      </section>

      <section aria-labelledby="submission-position-title">
        <p className="section-kicker">Wallet position</p>
        <h3 id="submission-position-title">{position ? 'Current sample position' : 'No position in current evidence'}</h3>
        <dl>
          <div><dt>Position</dt><dd>{position ? `${position.outcomeCount} outcome shares` : <ValueState state="unavailable" />}</dd></div>
          <div><dt>Average entry</dt><dd>{position ? `$${position.averageEntryUsd.toFixed(3)}` : <ValueState state="unavailable" />}</dd></div>
          <div><dt>Current value</dt><dd>{position ? currency(position.currentValueUsd) : <ValueState state="unavailable" />}</dd></div>
          <div><dt>Profit / loss</dt><dd className={position && position.profitLossUsd >= 0 ? 'delta-positive' : 'delta-negative'}>{position ? currency(position.profitLossUsd) : <ValueState state="unavailable" />}</dd></div>
          <div><dt>Redeemable amount</dt><dd>{position ? currency(position.redeemableUsd) : <ValueState state="unavailable" />}</dd></div>
        </dl>
        {!position && <p className="record-note">The trade ticket reads wallet share balances. Entry cost and profit/loss are not captured in this source record.</p>}
        {position?.source === 'sample' && <p className="record-note">Position values are deterministic sample data and are labelled in the source record.</p>}
      </section>

      {dossier.winner && (
        <section className="winner-resolution" aria-labelledby="winner-resolution-title">
          <p className="section-kicker">Final decision</p>
          <h3 id="winner-resolution-title">Winner and redemption record</h3>
          <dl>
            <div><dt>Winner flag</dt><dd>Selected</dd></div>
            <div><dt>Payout</dt><dd>{archiveEvidenceFor(market.id)?.payout ?? (market.source === 'sample' ? `Sample: 1.00 ${market.collateral} per winning share` : 'Not recorded')}{market.prizeLabel ? ` · ${market.prizeLabel}` : ''}</dd></div>
            <div><dt>Redeem status</dt><dd>{dossier.redeemStatus}</dd></div>
            <div><dt>Resolution evidence</dt><dd>{dossier.resolutionEvidence ?? 'Unavailable'}</dd></div>
          </dl>
        </section>
      )}

      <SubmissionEvidencePanel evidence={dossier.evidence} submissionName={submission.name} />
      <a className="primary-action" href={`/opportunity/review/${encodeURIComponent(market.id)}?submission=${encodeURIComponent(submission.id)}&drawer=submission`}>Open submission and trade</a>

      <RecordActions
        recordId={`${recordKind}-${submission.id}`}
        values={[
          { label: 'Stable submission ID', value: submission.id },
          { label: 'Market ID', value: market.id },
          { label: 'Creator', value: submission.creator },
        ]}
      />
    </article>
  );
}
