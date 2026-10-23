import { useEffect, useRef, useState } from 'react';

interface CopyButtonProps { value: string; label: string }

export function CopyButton({ value, label }: CopyButtonProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const timer = useRef<number | undefined>(undefined);
  const request = useRef(0);
  useEffect(() => {
    request.current += 1;
    setStatus('idle');
    return () => { request.current += 1; window.clearTimeout(timer.current); };
  }, [value]);
  const feedback = status === 'copied' ? 'Copied' : status === 'error' ? 'Copy failed. Select and copy the value manually.' : label;
  return <>
    <button className="copy-button" type="button" data-tooltip={feedback} aria-label={feedback}
      onClick={async () => {
        const current = ++request.current;
        window.clearTimeout(timer.current);
        try {
          if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
          await navigator.clipboard.writeText(value);
          if (current !== request.current) return;
          setStatus('copied');
        } catch {
          if (current !== request.current) return;
          setStatus('error');
        }
        timer.current = window.setTimeout(() => setStatus('idle'), 3000);
      }}><span aria-hidden="true">{status === 'copied' ? '✓' : status === 'error' ? '!' : '□'}</span></button>
    <span className="sr-only" role="status">{status === 'idle' ? '' : feedback}</span>
  </>;
}
