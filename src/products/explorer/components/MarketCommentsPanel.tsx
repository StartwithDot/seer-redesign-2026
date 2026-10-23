import { useState } from 'react';
import { externalLinks } from '../data/externalLinks';
import { getMarketComments } from '../data/marketEvidence';
import type { WalletController } from '../hooks/useWallet';
import type { Market } from '../types';

interface MarketCommentsPanelProps {
  market: Market;
  wallet: WalletController;
  onOpenWallet: () => void;
}

type CommentFlow = 'idle' | 'signature-required' | 'rejected';

export function MarketCommentsPanel({ market, wallet, onOpenWallet }: MarketCommentsPanelProps) {
  const comments = getMarketComments(market);
  const [draft, setDraft] = useState('');
  const [flow, setFlow] = useState<CommentFlow>('idle');

  return (
    <div className="comments-panel">
      <div className="comment-intro">
        <div>
          <h3>Comments</h3>
          <p>{comments.length ? 'Reasoning attached to this market record.' : 'No takes yet. Start the evidence-backed discussion.'}</p>
        </div>
        <span>{comments.length} published</span>
      </div>

      {comments.length > 0 && (
        <ol className="comment-rows">
          {comments.map((comment) => (
            <li key={comment.id}>
              <div>
                <strong>{comment.author}</strong>
                <time dateTime={comment.timestamp}>{comment.timestamp.slice(0, 10)}</time>
              </div>
              <p>{comment.body}</p>
            </li>
          ))}
        </ol>
      )}

      {!wallet.account ? (
        <div className="comment-gate">
          <strong>Connect to join the market discussion.</strong>
          <p>Explorer keeps wallet connection separate from signing. No comment signature is requested in this preview.</p>
          <button className="primary-button" type="button" onClick={onOpenWallet}>Connect wallet</button>
        </div>
      ) : (
        <div className="comment-composer">
          <label>
            <span>Share your take</span>
            <textarea
              rows={4}
              value={draft}
              placeholder="What evidence changes your view?"
              onChange={(event) => {
                setDraft(event.target.value);
                setFlow('idle');
              }}
            />
          </label>
          <button
            className="primary-button"
            type="button"
            disabled={!draft.trim()}
            onClick={() => setFlow('signature-required')}
          >
            Share your take
          </button>
          {flow === 'signature-required' && (
            <div className="notice pending-notice" role="status">
              <strong>Ready for wallet signature</strong>
              <p>Explorer does not request signatures in this preview. Open Seer to post with the connected account.</p>
              <div className="dialog-actions">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => {
                    wallet.rejectSigning();
                    setFlow('rejected');
                  }}
                >
                  Preview rejected request
                </button>
                <a className="primary-button" href={externalLinks.liveApp} target="_blank" rel="noreferrer">Open live Seer ↗</a>
              </div>
            </div>
          )}
          {(flow === 'rejected' || wallet.signatureStatus === 'rejected') && (
            <div className="notice error-notice" role="status">
              <strong>Request rejected</strong>
              <p>No signature was requested or created. Your draft remains in this form only.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
