import { useState } from 'react';
import type { SubmissionDossier } from '../data/types';
import { tierLabel } from '../data/reviewList';
import { OverlayDialog } from './OverlayDialog';

interface ReviewCompareDialogProps {
  dossiers: SubmissionDossier[];
  rationale: string;
  onRationaleChange: (rationale: string) => void;
  onClose: () => void;
}

export function ReviewCompareDialog({
  dossiers,
  rationale,
  onRationaleChange,
  onClose,
}: ReviewCompareDialogProps) {
  const [draft, setDraft] = useState(rationale);
  const [saved, setSaved] = useState(false);

  return (
    <OverlayDialog
      title={`Compare · ${dossiers.length}`}
      description="Compare market evidence and save your private review rationale."
      onClose={onClose}
      footer={
        <>
          <button type="button" className="secondary-action" onClick={onClose}>Close</button>
          <button
            type="button"
            className="authority-action"
            onClick={() => {
              onRationaleChange(draft);
              setSaved(true);
            }}
          >
            Save rationale
          </button>
        </>
      }
    >
      <div className="review-compare-scroll">
        <table className="review-compare-table">
          <thead>
            <tr>
              <th scope="col">Candidate</th>
              {dossiers.map((dossier) => <th scope="col" key={dossier.submission.id}>{dossier.submission.name}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr><th scope="row">Rank</th>{dossiers.map((dossier) => <td key={dossier.submission.id}>#{dossier.submission.rank}</td>)}</tr>
            <tr><th scope="row">Odds</th>{dossiers.map((dossier) => <td key={dossier.submission.id}>{dossier.submission.oddsPercent === null ? 'Unpriced' : `${dossier.submission.oddsPercent}%`}</td>)}</tr>
            <tr><th scope="row">Price</th>{dossiers.map((dossier) => <td key={dossier.submission.id}>{dossier.submission.priceUsd === null ? 'No pool' : `$${dossier.submission.priceUsd.toFixed(3)}`}</td>)}</tr>
            <tr><th scope="row">Tier</th>{dossiers.map((dossier) => <td key={dossier.submission.id}>{tierLabel(dossier.submission.tier)}</td>)}</tr>
            <tr><th scope="row">Decision</th>{dossiers.map((dossier) => <td key={dossier.submission.id}>{dossier.submission.decision}</td>)}</tr>
            <tr><th scope="row">Position</th>{dossiers.map((dossier) => <td key={dossier.submission.id}>{dossier.position ? `${dossier.position.outcomeCount} shares` : 'Unavailable'}</td>)}</tr>
          </tbody>
        </table>
      </div>
      <label className="review-rationale-field">
        <span>Private review rationale</span>
        <textarea
          value={draft}
          rows={6}
          placeholder="Record fit, rights, audience, and evidence trade-offs."
          onChange={(event) => {
            setDraft(event.target.value);
            setSaved(false);
          }}
        />
      </label>
      <p className="form-status" role="status">{saved ? 'Rationale saved to this market workspace.' : 'Rationale remains unsaved until selected.'}</p>
    </OverlayDialog>
  );
}
