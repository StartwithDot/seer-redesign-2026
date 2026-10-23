import {
  includedForCut,
  removeShortlist,
  togglePinned,
  upsertShortlist,
  type ReviewWorkspaceState,
} from '../data/reviewCut';
import type { MarketRecord, SubmissionDossier } from '../data/types';
import { ReviewCutControls } from './ReviewCutControls';
import { ReviewCutRecommendation } from './ReviewCutRecommendation';
import { ReviewCutSummary } from './ReviewCutSummary';
import { ValueState } from './ValueState';

interface ReviewCutViewProps {
  market: MarketRecord;
  dossiers: SubmissionDossier[];
  selectedId: string;
  workspace: ReviewWorkspaceState;
  onWorkspaceChange: (patch: Partial<ReviewWorkspaceState>) => void;
  onSelect: (submissionId: string) => void;
  onOpenDossier: (submissionId: string) => void;
  onOpenShortlist: () => void;
  onOpenCompare: () => void;
  onOpenDecision: () => void;
}

export function ReviewCutView({
  market,
  dossiers,
  selectedId,
  workspace,
  onWorkspaceChange,
  onSelect,
  onOpenDossier,
  onOpenShortlist,
  onOpenCompare,
  onOpenDecision,
}: ReviewCutViewProps) {
  const cutSize = Math.min(workspace.cutSize, Math.max(1, dossiers.length));
  const included = includedForCut(dossiers, cutSize, workspace.cutStrategy, workspace.shortlist);
  const shortlistIds = new Set(workspace.shortlist.map((entry) => entry.submissionId));

  const toggleShortlist = (submissionId: string) => {
    onWorkspaceChange({
      shortlist: shortlistIds.has(submissionId)
        ? removeShortlist(workspace.shortlist, submissionId)
        : upsertShortlist(workspace.shortlist, submissionId),
    });
  };

  const togglePin = (submissionId: string) => {
    onWorkspaceChange({ shortlist: togglePinned(workspace.shortlist, submissionId) });
  };

  return (
    <section className="review-cut-view" aria-labelledby="review-cut-title">
      <header className="review-cut-header">
        <div>
          <p className="section-kicker">Review Cut</p>
          <h2 id="review-cut-title">Narrow the field.</h2>
        </div>
        <p>{market.sponsor} makes the final selection after reviewing the candidate evidence.</p>
      </header>
      <ReviewCutControls
        cutSize={cutSize}
        strategy={workspace.cutStrategy}
        totalCount={dossiers.length}
        shortlistCount={workspace.shortlist.length}
        onCutSizeChange={(size) => onWorkspaceChange({ cutSize: size })}
        onStrategyChange={(cutStrategy) => onWorkspaceChange({ cutStrategy })}
        onOpenShortlist={onOpenShortlist}
        onOpenCompare={onOpenCompare}
      />
      <ReviewCutSummary dossiers={dossiers} included={included} strategy={workspace.cutStrategy} />
      <ReviewCutRecommendation market={market} dossiers={dossiers} onOpenDecision={onOpenDecision} />
      <div className="review-cut-queue" aria-labelledby="review-cut-queue-title">
        <div>
          <p className="section-kicker">Included candidates</p>
          <h3 id="review-cut-queue-title">First-pass review queue</h3>
        </div>
        <ol>
          {included.map((dossier) => {
            const submission = dossier.submission;
            const shortlisted = shortlistIds.has(submission.id);
            const entry = workspace.shortlist.find((item) => item.submissionId === submission.id);
            return (
              <li key={submission.id} className={submission.id === selectedId ? 'is-selected' : ''}>
                <button type="button" className="review-cut-candidate" onClick={() => onSelect(submission.id)}>
                  <span>#{submission.rank}</span>
                  <strong>{submission.name}</strong>
                  <small>{submission.creator}</small>
                  <output>{submission.oddsPercent === null ? <ValueState state="unpriced" /> : `${submission.oddsPercent}%`}</output>
                </button>
                <div>
                  <button type="button" onClick={() => toggleShortlist(submission.id)}>
                    {shortlisted ? 'Remove' : 'Add'}
                  </button>
                  <button type="button" disabled={!shortlisted} title="Add this candidate to the shortlist before pinning." aria-pressed={entry?.pinned ?? false} onClick={() => togglePin(submission.id)}>
                    {entry?.pinned ? 'Unpin' : 'Pin'}
                  </button>
                  <button type="button" onClick={() => onOpenDossier(submission.id)}>Dossier</button>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
