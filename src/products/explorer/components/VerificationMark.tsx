import type { VerificationStatus } from '../types';

import { verificationDescriptions as labels } from '../data/semantics';

export function VerificationMark({
  status,
  compact = false,
}: {
  status: VerificationStatus;
  compact?: boolean;
}) {
  return (
    <span
      className={`verification-mark is-${status} ${compact ? 'is-compact' : ''}`}
      tabIndex={0}
      role="img"
      aria-label={labels[status]}
      data-tooltip={labels[status]}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {status === 'verified' && (
          <>
            <circle cx="12" cy="12" r="8.5" />
            <path d="m8 12 2.6 2.7L16.5 9" />
          </>
        )}
        {status === 'verifying' && (
          <>
            <path d="m12 3 7.5 4.3v8.6L12 20.3l-7.5-4.4V7.3Z" />
            <path d="M12 7.5v5l3.2 1.8" />
          </>
        )}
        {status === 'challenged' && (
          <>
            <path d="m12 3 8 9-8 9-8-9Z" />
            <path d="M12 7.5v6" />
            <path d="M12 16.5h.01" />
          </>
        )}
        {status === 'not-verified' && (
          <>
            <circle cx="12" cy="12" r="8.5" />
            <path d="m8 16 8-8" />
          </>
        )}
      </svg>
    </span>
  );
}
