import {
  moveShortlist,
  orderedShortlist,
  removeShortlist,
  togglePinned,
  type ReviewWorkspaceState,
} from '../data/reviewCut';
import type { SubmissionDossier } from '../data/types';
import { OverlayDialog } from './OverlayDialog';

interface ShortlistDrawerProps {
  dossiers: SubmissionDossier[];
  workspace: ReviewWorkspaceState;
  onWorkspaceChange: (patch: Partial<ReviewWorkspaceState>) => void;
  onOpenDossier: (submissionId: string) => void;
  onClose: () => void;
}

export function ShortlistDrawer({
  dossiers,
  workspace,
  onWorkspaceChange,
  onOpenDossier,
  onClose,
}: ShortlistDrawerProps) {
  const entries = orderedShortlist(workspace.shortlist);
  const dossierById = new Map(dossiers.map((dossier) => [dossier.submission.id, dossier]));

  return (
    <OverlayDialog
      title={`Shortlist · ${entries.length}`}
      description="Pinned candidates stay first. Reordering changes sponsor-preference cuts."
      variant="drawer"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="secondary-action" disabled={!entries.length} title="The shortlist is empty." onClick={() => onWorkspaceChange({ shortlist: [] })}>
            Clear shortlist
          </button>
          <button type="button" className="primary-action" onClick={onClose}>Done</button>
        </>
      }
    >
      <div className="shortlist-stack">
        {entries.map((entry, index) => {
          const dossier = dossierById.get(entry.submissionId);
          if (!dossier) return null;
          const submission = dossier.submission;
          return (
            <article className="shortlist-card" key={entry.submissionId}>
              <div>
                <span>#{submission.rank}</span>
                <strong>{submission.name}</strong>
                <small>{submission.oddsPercent === null ? 'Unpriced' : `${submission.oddsPercent}% odds`}</small>
              </div>
              <div className="shortlist-card__actions">
                <button type="button" aria-pressed={entry.pinned} onClick={() => onWorkspaceChange({ shortlist: togglePinned(workspace.shortlist, entry.submissionId) })}>
                  {entry.pinned ? 'Unpin' : 'Pin'}
                </button>
                <button type="button" disabled={index === 0 || entries[index - 1]?.pinned !== entry.pinned} title="Move within the pinned or unpinned group. Unpin to change groups." onClick={() => onWorkspaceChange({ shortlist: moveShortlist(workspace.shortlist, entry.submissionId, -1) })}>Up</button>
                <button type="button" disabled={index === entries.length - 1 || entries[index + 1]?.pinned !== entry.pinned} title="Move within the pinned or unpinned group. Pin to change groups." onClick={() => onWorkspaceChange({ shortlist: moveShortlist(workspace.shortlist, entry.submissionId, 1) })}>Down</button>
                <button type="button" onClick={() => onOpenDossier(entry.submissionId)}>Dossier</button>
                <button type="button" onClick={() => onWorkspaceChange({ shortlist: removeShortlist(workspace.shortlist, entry.submissionId) })}>Remove</button>
              </div>
            </article>
          );
        })}
        {!entries.length && (
          <div className="review-empty-state">
            <strong>No candidates shortlisted.</strong>
            <p>Add candidates from the list or review-cut queue.</p>
          </div>
        )}
      </div>
    </OverlayDialog>
  );
}
