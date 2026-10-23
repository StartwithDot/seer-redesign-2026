import { useState } from 'react';
import type { Market } from '../data/types';

type EvidenceState = 'twap' | 'resolution' | null;

export function PermalinkActions({ market, evidenceState }: { market: Market; evidenceState: EvidenceState }) {
  const [status, setStatus] = useState('');

  const permalink = () => {
    const [path, existingQuery = ''] = window.location.hash.split('?');
    const query = new URLSearchParams(existingQuery);
    if (evidenceState) query.set('evidence', evidenceState);
    else query.delete('evidence');
    query.delete('n');
    const suffix = query.toString();
    return `${window.location.origin}${window.location.pathname}${path || `#/m/${market.id}`}${suffix ? `?${suffix}` : ''}`;
  };

  const copy = async () => {
    const url = permalink();
    try {
      await navigator.clipboard.writeText(url);
      setStatus('Link copied');
    } catch {
      setStatus('Copy failed');
    }
    window.setTimeout(() => setStatus(''), 1800);
  };

  const share = async () => {
    const url = permalink();
    if (navigator.share) {
      try {
        await navigator.share({ title: `${market.proposal} · Seer Futarchy`, text: market.question, url });
        setStatus('Share opened');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') setStatus('Share unavailable');
      }
    } else {
      await copy();
      return;
    }
    window.setTimeout(() => setStatus(''), 1800);
  };

  return (
    <div className="permalink-actions">
      <button className="quiet-button" type="button" onClick={copy}>Copy link</button>
      <button className="quiet-button" type="button" onClick={share}>Share</button>
      <span role="status">{status}</span>
    </div>
  );
}
