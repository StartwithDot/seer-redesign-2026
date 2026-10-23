import { useState } from 'react';
import { copyText } from '../data/sharing';
import type { CanonicalValue } from '../data/types';

interface CopyButtonProps {
  value: string;
  label?: string;
}

export function CopyButton({ value, label = 'Copy' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  return (
    <button
      type="button"
      className="copy-button" aria-live="polite"
      onClick={async () => {
        try { await copyText(value); setError(''); setCopied(true); }
        catch { setError('Copy failed. Try again.'); }
        window.setTimeout(() => setCopied(false), 1600);
      }}
    >
      {error || (copied ? 'Copied' : label)}
    </button>
  );
}

interface RecordActionsProps {
  recordId: string;
  values: CanonicalValue[];
}

export function RecordActions({ recordId, values }: RecordActionsProps) {
  const [message, setMessage] = useState('');
  const url = new URL('/opportunity/explorer', location.origin);
  url.searchParams.set('record', recordId);
  const count = new URLSearchParams(location.search).get('n');
  if (count) url.searchParams.set('n', count);
  const shareUrl = url.toString();

  return (
    <section className="record-actions" aria-label="Record copy and share actions">
      <div>
        <button
          type="button"
          className="secondary-action"
          onClick={async () => {
            try { await copyText(recordId); setMessage('Record ID copied.'); }
            catch { setMessage('Copy failed. Select the displayed record ID to copy it.'); }
          }}
        >
          Copy record ID
        </button>
        <button
          type="button"
          className="secondary-action"
          onClick={async () => {
            try { await copyText(shareUrl); setMessage('Record link copied.'); }
            catch { setMessage('Copy failed. Copy the page address from your browser.'); }
          }}
        >
          Copy link
        </button>
        <button
          type="button"
          className="secondary-action"
          onClick={async () => {
            try {
            if (navigator.share) {
              await navigator.share({ title: `Seer record ${recordId}`, url: shareUrl });
              setMessage('Share sheet opened.');
              return;
            }
            await copyText(shareUrl);
            setMessage('Sharing is unavailable. Record link copied.');
            } catch (error) { setMessage((error as Error).name === 'AbortError' ? 'Sharing cancelled.' : 'Sharing failed. Copy the page address from your browser.'); }
          }}
        >
          Share record
        </button>
      </div>
      <p className="record-action-status" role="status">{message}</p>
      <dl className="canonical-values">
        {values.map((item) => (
          <div key={`${item.label}-${item.value}`}>
            <dt>{item.label}</dt>
            <dd>
              <span title={item.value}>{item.value}</span>
              {item.note && <small>{item.note}</small>}
              <CopyButton value={item.copyValue ?? item.value} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
