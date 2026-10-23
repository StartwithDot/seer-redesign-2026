import { useId, useState, type ReactNode } from 'react';
import type { SubmissionDossier } from '../data/types';
import { SponsorReviewPanel } from './SponsorReviewPanel';
import { SubmissionCommunityPanel } from './SubmissionCommunityPanel';
import { SubmissionEvidencePanel } from './SubmissionEvidencePanel';
import { SubmissionExternalLinks } from './SubmissionExternalLinks';
import { SubmissionPriceChart } from './SubmissionPriceChart';
import { SubmissionTimelinePanel } from './SubmissionTimelinePanel';
import { ValueState } from './ValueState';

interface ReviewSubmissionDossierProps {
  dossier: SubmissionDossier;
  marketImageUrl?: string | null;
  actionBar?: ReactNode;
  onNavigate: (href: string) => void;
}

type DossierTab = 'record' | 'signal' | 'community' | 'history';

function money(value: number) {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function ReviewSubmissionDossier({
  dossier,
  marketImageUrl,
  actionBar,
  onNavigate,
}: ReviewSubmissionDossierProps) {
  const uniqueId = useId();
  const [tab, setTab] = useState<DossierTab>('record');
  const { submission, market, position, evidence } = dossier;
  return (
    <aside className="review-submission-dossier" aria-labelledby={`${uniqueId}-title`}>
      <header className="review-dossier-header">
        {evidence.thumbnail.src ? <img className="submission-thumbnail__image submission-thumbnail__image--small" src={evidence.thumbnail.src} alt={evidence.thumbnail.alt} /> : <div
          className="submission-thumbnail__image submission-thumbnail__image--small submission-thumbnail__image--placeholder"
          aria-hidden="true"
        >
          {evidence.thumbnail.initials}
        </div>}
        <div>
          <p className="section-kicker">Submission rank #{submission.rank}</p>
          <h2 id={`${uniqueId}-title`}>{submission.name}</h2>
          <p>{submission.creator} · {submission.id}</p>
        </div>
        <div className="review-record-badges">
          <span className={submission.source === 'sample' ? 'sample-badge' : 'verified-badge'}>
            {submission.source === 'sample' ? 'Deterministic sample' : 'Verified record'}
          </span>
          <span className={`status-chip status-chip--${submission.decision}`}>{submission.decision}</span>
        </div>
      </header>

      <p className="dossier-description">{evidence.proposalText ?? market.description}</p>

      {marketImageUrl && (
        <details className="dossier-source-capture"><summary>Source market capture</summary><figure className="dossier-market-evidence">
          <img src={marketImageUrl} alt={`Market evidence for ${market.title}`} />
          <figcaption>Verified market evidence for {market.title}</figcaption>
        </figure></details>
      )}

      <dl className="selected-signal">
        <div><dt>Rank</dt><dd>#{submission.rank}</dd></div>
        <div>
          <dt>Odds</dt>
          <dd>{submission.oddsPercent === null ? <ValueState state="unpriced" /> : `${submission.oddsPercent}%`}</dd>
        </div>
        <div>
          <dt>Price</dt>
          <dd>{submission.priceUsd === null ? <ValueState state="no-pool" /> : `$${submission.priceUsd.toFixed(3)}`}</dd>
        </div>
        <div>
          <dt>24h delta</dt>
          <dd className={submission.delta24h === null ? '' : submission.delta24h >= 0 ? 'delta-positive' : 'delta-negative'}>
            {submission.delta24h === null ? <ValueState state="unavailable" /> : `${submission.delta24h > 0 ? '+' : ''}${submission.delta24h}%`}
          </dd>
        </div>
        <div><dt>Tier</dt><dd>{submission.tier.replace('-', ' ')}</dd></div>
        <div>
          <dt>Position</dt>
          <dd>{position ? `${position.outcomeCount} shares` : <ValueState state="unavailable" />}</dd>
        </div>
        <div><dt>Volume</dt><dd>{money(market.volumeUsd)}</dd></div>
        <div><dt>Market depth</dt><dd>{money(market.liquidityUsd)}</dd></div>
      </dl>

      <div className="review-dossier-tabs" role="tablist" aria-label="Submission dossier views" onKeyDown={event => {
        const tabs: DossierTab[] = ['record', 'signal', 'community', 'history'];
        const index = tabs.indexOf(tab);
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? 3 : event.key === 'ArrowRight' ? (index + 1) % 4 : event.key === 'ArrowLeft' ? (index + 3) % 4 : -1;
        if (next < 0) return;
        event.preventDefault();
        event.stopPropagation();
        setTab(tabs[next]);
        document.getElementById(`${uniqueId}-tab-${tabs[next]}`)?.focus();
      }}>
        {([
          ['record', 'Record'],
          ['signal', 'Signal'],
          ['community', `Community ${dossier.community.commentCount}`],
          ['history', 'History'],
        ] as Array<[DossierTab, string]>).map(([id, label]) => (
          <button
            key={id}
            id={`${uniqueId}-tab-${id}`}
            type="button"
            role="tab"
            tabIndex={tab === id ? 0 : -1}
            aria-selected={tab === id}
            aria-controls={`${uniqueId}-panel-${tab}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div
        id={`${uniqueId}-panel-${tab}`}
        className="review-dossier-panel"
        role="tabpanel"
        aria-labelledby={`${uniqueId}-tab-${tab}`}
      >
        {tab === 'record' && (
          <>
            <SubmissionEvidencePanel evidence={evidence} submissionName={submission.name} />
            <SubmissionExternalLinks links={dossier.externalLinks} onNavigate={onNavigate} />
            <SponsorReviewPanel review={dossier.sponsorReview} />
          </>
        )}
        {tab === 'signal' && <SubmissionPriceChart submission={submission} />}
        {tab === 'community' && <SubmissionCommunityPanel key={submission.id} community={dossier.community} submissionId={`${market.id}:${submission.id}`} />}
        {tab === 'history' && <SubmissionTimelinePanel key={submission.id} timeline={dossier.timeline} />}
      </div>

      {actionBar}

      <footer className="review-authority-note">
        <strong>{market.sponsor} retains final authority</strong>
        <p>Odds guide review. The sponsor chooses.</p>
      </footer>
    </aside>
  );
}
