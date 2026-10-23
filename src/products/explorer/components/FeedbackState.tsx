import type { ReactNode } from 'react';

interface FeedbackStateProps {
  kind: 'loading' | 'empty' | 'error';
  title: string;
  body: string;
  action?: ReactNode;
}

export function FeedbackState({ kind, title, body, action }: FeedbackStateProps) {
  return (
    <div className={`feedback-state is-${kind}`} role={kind === 'error' ? 'alert' : 'status'} aria-live="polite">
      {kind === 'loading' ? <span className="feedback-spinner" aria-hidden="true" /> : <span className="empty-glyph" aria-hidden="true">{kind === 'error' ? '!' : '⌕'}</span>}
      <div>
        <h2>{title}</h2>
        <p>{body}</p>
        {action}
      </div>
    </div>
  );
}
