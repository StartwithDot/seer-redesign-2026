import type { ReactNode } from 'react';

export type ListLayout = 'rows' | 'cards' | 'table' | 'signal';
export function ListLoading({ label, layout = 'rows', rows = 3 }: { label: string; layout?: ListLayout; rows?: number }) {
  return <div className={`list-loading is-${layout}`} role="status" aria-busy="true" aria-label={`Loading ${label}`}>
    <span className="sr-only">Loading {label}.</span>
    {Array.from({ length: rows }, (_, index) => <div className="list-skeleton-row" key={index} aria-hidden="true"><span className="list-skeleton-mark" /><div><span className="list-skeleton-line" /><span className="list-skeleton-line is-short" /></div><span className="list-skeleton-value" /></div>)}
  </div>;
}

export function ListNotice({ title, description, action, actionLabel = 'Retry', error = false }: {
  title: string; description?: string; action?: () => void; actionLabel?: string; error?: boolean;
}) {
  return <div className={`list-notice${error ? ' is-error' : ''}`} role={error ? 'alert' : 'status'}>
    <strong>{title}</strong>{description && <p>{description}</p>}
    {action && <button type="button" className="quiet-button" onClick={action}>{actionLabel}</button>}
  </div>;
}

export function ListRegion({ label, children, state, offline }: { label: string; children: ReactNode; state: string; offline: boolean }) {
  return <div className="data-list" role="region" aria-label={label} aria-busy={state === 'loading'} data-list-state={state} data-connectivity={offline ? 'offline' : 'online'} aria-describedby={offline ? 'futarchy-connection-status' : undefined}>{children}</div>;
}
