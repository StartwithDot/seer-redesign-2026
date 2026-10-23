import { useEffect, useRef, useState } from 'react';
import { deepShareUrl, useDeepPath } from '../state/router';
import { useDeepState } from '../state/DeepState';

export function ShareView() {
  useDeepPath();
  const { copyText, copyState } = useDeepState();
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => { if (!panel.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); } };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', escape); };
  }, [open]);
  const url = deepShareUrl();
  return <div className="deep-share" ref={panel}>
    <button ref={trigger} className="deep-button" type="button" aria-expanded={open} onClick={() => setOpen(value => !value)}>Share view</button>
    {open && <div className="deep-share__panel">
      <label>Link to this view<input readOnly value={url} onFocus={event => event.target.select()} /></label>
      <button className="deep-button" type="button" onClick={() => void copyText(url, 'View link')}>Copy link</button>
      <output role="status">{copyState ?? 'Includes the current filters and open chart or guide.'}</output>
    </div>}
  </div>;
}
