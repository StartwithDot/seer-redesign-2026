import { copyText, submissionUrl } from '../data/sharing';
import { useEffect } from 'react';
import type { TradeMode } from '../data/trade';
import type { SubmissionDossier } from '../data/types';
import { OverlayDialog } from './OverlayDialog';
import { ReviewSubmissionDossier } from './ReviewSubmissionDossier';
import { SubmissionActionBar } from './SubmissionActionBar';

interface SubmissionDossierDrawerProps {
  dossier: SubmissionDossier;
  marketImageUrl: string | null;
  shortlisted: boolean;
  onToggleShortlist: () => void;
  onCompare: () => void;
  onOpenTrade: (mode: TradeMode) => void;
  onOpenDecision: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onNavigate: (href: string) => void;
  onClose: () => void;
}

async function copySubmissionLink(dossier: SubmissionDossier) {
  await copyText(submissionUrl(dossier.market.id, dossier.submission.id));
}

export function SubmissionDossierDrawer({
  dossier,
  marketImageUrl,
  shortlisted,
  onToggleShortlist,
  onCompare,
  onOpenTrade,
  onOpenDecision,
  onPrevious,
  onNext,
  onNavigate,
  onClose,
}: SubmissionDossierDrawerProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const dialogs = document.querySelectorAll('[role="dialog"]');
      if (target?.closest('[role="dialog"]') !== dialogs[dialogs.length - 1] || target?.closest('input, textarea, select,[role="tablist"]')) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onPrevious();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        onNext();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onNext, onPrevious]);

  const share = async () => {
    const url = submissionUrl(dossier.market.id, dossier.submission.id);
    if (navigator.share) {
      await navigator.share({ title: dossier.submission.name, url });
      return;
    }
    await copySubmissionLink(dossier);
  };

  return (
    <OverlayDialog
      title={`Submission dossier · ${dossier.submission.name}`}
      description="Candidate record, market signal, evidence, and sponsor notes."
      variant="drawer"
      nonBlocking
      onClose={onClose}
      footer={
        <div className="dossier-navigation">
          <button type="button" className="secondary-action" onClick={onPrevious}>
            <span aria-hidden="true">←</span> Previous
          </button>
          <button type="button" className="secondary-action" onClick={onNext}>
            Next <span aria-hidden="true">→</span>
          </button>
        </div>
      }
    >
      <div className="submission-dossier-drawer-content">
        <ReviewSubmissionDossier
          key={dossier.submission.id}
          dossier={dossier}
          marketImageUrl={marketImageUrl}
          onNavigate={onNavigate}
          actionBar={
            <SubmissionActionBar
              submissionId={dossier.submission.id}
              shortlisted={shortlisted}
              onCopyLink={() => copySubmissionLink(dossier)}
              onShare={share}
              onToggleShortlist={onToggleShortlist}
              onCompare={onCompare}
              onOpenTrade={onOpenTrade}
              onOpenDecision={onOpenDecision}
            />
          }
        />
      </div>
    </OverlayDialog>
  );
}
