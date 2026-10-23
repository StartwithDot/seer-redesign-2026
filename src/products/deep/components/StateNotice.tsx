import type { ReactNode } from 'react';

export function StateNotice({ tone, title, message, children }: {
  tone: 'loading' | 'empty' | 'error' | 'success' | 'unavailable';
  title: string;
  message?: string;
  children?: ReactNode;
}) {
  return <div className={`deep-state-notice is-${tone}`} role={tone === 'error' ? 'alert' : 'status'}
    aria-busy={tone === 'loading'}>
    <strong>{title}</strong>{message && <p>{message}</p>}{children}
  </div>;
}
