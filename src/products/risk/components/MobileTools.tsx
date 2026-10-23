import { useState } from 'react';
import { Modal } from './Modal';
import { HelpMenu } from './HelpMenu';

interface Props { onGuide: () => void; onEmail: () => void; onSearch: () => void; onConnect: () => void; onTheme: () => void; theme: 'light' | 'dark'; connected: boolean; }
export function MobileTools({ onGuide, onEmail, onSearch, onConnect, onTheme, theme, connected }: Props) {
  const [open, setOpen] = useState(false);
  const activate = (action: () => void) => { setOpen(false); window.setTimeout(action, 0); };
  return <div className="risk-mobile-tools">
    <button className="risk-secondary-button" type="button" aria-haspopup="dialog" onClick={() => setOpen(true)}>Tools</button>
    <Modal open={open} onClose={() => setOpen(false)} label="Risk tools" className="risk-mobile-tools-panel">
      <p className="risk-kicker">Seer Risk</p><h2>Tools and account</h2>
      <button className="risk-secondary-button" type="button" onClick={() => activate(onSearch)}>Search assets</button>
      <button className="risk-secondary-button" type="button" onClick={() => activate(onGuide)}>Guide</button>
      <HelpMenu />
      <button className="risk-secondary-button" type="button" onClick={() => activate(onEmail)}>Email notifications</button>
      <button className="risk-secondary-button" type="button" onClick={onTheme}>Use {theme === 'light' ? 'dark' : 'light'} theme</button>
      <button className="risk-primary-button" type="button" onClick={() => activate(onConnect)}>{connected ? 'Account details' : 'Connect wallet'}</button>
    </Modal>
  </div>;
}
