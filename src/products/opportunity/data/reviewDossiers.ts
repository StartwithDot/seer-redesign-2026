import type { ReviewWorkspaceState } from './reviewCut';
import type { SubmissionDossier } from './types';

export function withPrivateReviews(dossiers: SubmissionDossier[], workspace: ReviewWorkspaceState): SubmissionDossier[] {
  return dossiers.map(dossier => {
    const decision = workspace.decisions[dossier.submission.id];
    const shortlisted = workspace.shortlist.some(entry => entry.submissionId === dossier.submission.id);
    const signed = decision?.status === 'confirmed';
    return {
      ...dossier,
      submission: { ...dossier.submission, decision: shortlisted && dossier.submission.decision === 'undecided' ? 'shortlisted' : dossier.submission.decision },
      sponsorReview: signed ? { ...dossier.sponsorReview, notes: [...dossier.sponsorReview.notes, `Private review (${decision.action}): ${decision.rationale || 'No additional note.'}`] } : dossier.sponsorReview,
      timeline: signed ? { ...dossier.timeline, decisionHistory: [...dossier.timeline.decisionHistory, {
        id: decision.id, type: 'decision', date: decision.signedAt, title: `Signed private review: ${decision.action}`,
        detail: decision.rationale || 'No additional rationale. Source settlement is unchanged.', state: 'recorded',
      }] } : dossier.timeline,
    };
  });
}
