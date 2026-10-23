import type { SubmissionEvidence } from '../data/types';
import { OptionalValue, ValueState } from './ValueState';

interface SubmissionEvidencePanelProps {
  evidence: SubmissionEvidence;
  submissionName: string;
}

export function SubmissionEvidencePanel({ evidence, submissionName }: SubmissionEvidencePanelProps) {
  return (
    <section className="review-evidence" aria-labelledby="submission-evidence-title">
      <div className="review-section-heading">
        <div>
          <p className="section-kicker">Candidate evidence</p>
          <h3 id="submission-evidence-title">Proposal and creator record</h3>
        </div>
        <span className="review-source-chip">Record fields</span>
      </div>
      <div className="evidence-layout">
        <figure className="submission-thumbnail">
          <div
            className={`submission-thumbnail__image ${evidence.thumbnail.kind === 'placeholder' ? 'submission-thumbnail__image--placeholder' : ''}`}
            role={evidence.thumbnail.src ? undefined : 'img'}
            aria-label={evidence.thumbnail.src ? undefined : evidence.thumbnail.alt}
          >
            {evidence.thumbnail.src ? (
              <img src={evidence.thumbnail.src} alt={evidence.thumbnail.alt} />
            ) : (
              <span aria-hidden="true">{evidence.thumbnail.initials}</span>
            )}
          </div>
          <figcaption>
            <strong>{submissionName}</strong>
            <span>{evidence.thumbnail.kind === 'asset' ? 'Submission image' : 'Tonal candidate placeholder'}</span>
          </figcaption>
        </figure>
        <div className="evidence-copy">
          <div>
            <span className="field-label">Proposal text</span>
            <p><OptionalValue value={evidence.proposalText} state={evidence.proposalState} /></p>
          </div>
          <div>
            <span className="field-label">Portfolio / Behance</span>
            {evidence.portfolioUrl ? (
              <a className="record-external-link" href={evidence.portfolioUrl} target="_blank" rel="noreferrer">
                {evidence.portfolioLabel}<span aria-hidden="true">↗</span>
              </a>
            ) : (
              <ValueState state={evidence.portfolioState} label={evidence.portfolioLabel} />
            )}
          </div>
          <ul className="creator-link-list" aria-label="External creator links">
            {evidence.creatorLinks.map((link) => (
              <li key={link.id}>
                {link.url ? (
                  <a href={link.url} target="_blank" rel="noreferrer">
                    <span>{link.label}</span><span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <span><span>{link.label}</span><ValueState state={link.state} /></span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
