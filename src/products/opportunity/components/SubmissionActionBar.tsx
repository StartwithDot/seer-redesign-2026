import { useState } from 'react';
import type { TradeMode } from '../data/trade';

interface SubmissionActionBarProps {
  submissionId: string;
  shortlisted: boolean;
  onCopyLink: () => Promise<void>;
  onShare: () => Promise<void>;
  onToggleShortlist: () => void;
  onCompare: () => void;
  onOpenTrade: (mode: TradeMode) => void;
  onOpenDecision: () => void;
}

export function SubmissionActionBar({
  submissionId,
  shortlisted,
  onCopyLink,
  onShare,
  onToggleShortlist,
  onCompare,
  onOpenTrade,
  onOpenDecision,
}: SubmissionActionBarProps) {
  const [status, setStatus] = useState('');

  const run = async (action: () => Promise<void>, message: string) => {
    try {
      await action();
      setStatus(message);
    } catch {
      setStatus('Action cancelled.');
    }
    window.setTimeout(() => setStatus(''), 2200);
  };

  return (
    <section className="submission-action-bar" aria-label={`Actions for ${submissionId}`}>
      <div>
        <button type="button" onClick={() => void run(onCopyLink, 'Submission link copied.')}>Copy link</button>
        <button type="button" onClick={() => void run(onShare, 'Share completed or link copied.')}>Share</button>
        <button type="button" aria-pressed={shortlisted} onClick={onToggleShortlist}>
          {shortlisted ? 'Remove shortlist' : 'Add shortlist'}
        </button>
        <button type="button" onClick={onCompare}>Compare</button>
      </div>
      <div>
        <button type="button" className="trade-action" onClick={() => onOpenTrade('buy')}>Buy</button>
        <button type="button" className="trade-action" onClick={() => onOpenTrade('sell')}>Sell</button>
        <button type="button" className="authority-action" onClick={onOpenDecision}>Private review</button>
      </div>
      <p role="status">{status}</p>
    </section>
  );
}
