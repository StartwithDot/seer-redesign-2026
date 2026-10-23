import { useState } from 'react';
import { CopyButton } from './CopyButton';

export function ShareMarket() {
  const [open, setOpen] = useState(false);
  return <div className="share-market"><button className="secondary-button" type="button" aria-expanded={open} onClick={() => setOpen(!open)}>Share market</button>{open && <div role="region" aria-label="Share this market"><input aria-label="Market link" readOnly value={window.location.href} onFocus={(event) => event.target.select()} /><CopyButton value={window.location.href} label="Copy market link" /></div>}</div>;
}
