type Props = { className?: string };

export const CopyIcon = ({ className }: Props) => (
  <svg className={className} width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="7" y="7" width="9" height="9" rx="2" stroke="currentColor" /><path d="M13 7V5.5A1.5 1.5 0 0 0 11.5 4h-6A1.5 1.5 0 0 0 4 5.5v6A1.5 1.5 0 0 0 5.5 13H7" stroke="currentColor" /></svg>
);
export const RefreshIcon = ({ className }: Props) => (
  <svg className={className} width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M15.8 7A6.5 6.5 0 1 0 16 12.4M16 4v4h-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
export const WalletIcon = ({ className }: Props) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 5.5h12.5A1.5 1.5 0 0 1 17 7v8a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 2 15V5a1.5 1.5 0 0 1 1.5-1.5H14" stroke="currentColor" strokeLinejoin="round" /><path d="M13.5 9h4v4h-4a2 2 0 1 1 0-4Z" stroke="currentColor" /></svg>
);
