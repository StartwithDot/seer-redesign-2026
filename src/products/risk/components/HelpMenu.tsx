import { useEffect, useRef, useState } from 'react';
import { MARKET_LINKS } from '../data/market';
import { ArrowUpRight, HelpIcon } from './Icons';

const links = [
  ['Get Help', MARKET_LINKS.getHelp],
  ['Report a Bug', MARKET_LINKS.reportBug],
  ['Give Feedback', MARKET_LINKS.giveFeedback],
  ['App Guide', MARKET_LINKS.appGuide],
  ["Crypto Beginner's Guide", MARKET_LINKS.cryptoGuide],
  ['FAQ', MARKET_LINKS.faq],
] as const;

export function HelpMenu() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('pointerdown', outside); if (closeTimer.current) window.clearTimeout(closeTimer.current); };
  }, []);
  const closeTimer = useRef<number | null>(null);

  const openMenu = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeMenu = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  };

  return <div ref={root} className="risk-help" onMouseEnter={openMenu} onMouseLeave={closeMenu} onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setOpen(false)} onKeyDown={(event) => {
      if (event.key === 'Escape' && open) { event.preventDefault(); event.stopPropagation(); setOpen(false); root.current?.querySelector('button')?.focus(); return; }
      if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault(); setOpen(true);
      requestAnimationFrame(() => {
        const items = [...(root.current?.querySelectorAll<HTMLAnchorElement>('a') || [])];
        const index = items.indexOf(document.activeElement as HTMLAnchorElement);
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : event.key === 'ArrowDown' ? (index + 1) % items.length : index < 0 ? items.length - 1 : (index - 1 + items.length) % items.length;
        items[next]?.focus();
      });
    }}>
    <button className="risk-header-button" type="button" aria-label="Help" aria-expanded={open} aria-haspopup="menu" onFocus={event => event.currentTarget.matches(':focus-visible') && openMenu()} onClick={() => setOpen((current) => !current)}>
      <HelpIcon /><span>Help</span>
    </button>
    {open && <div className="risk-help-menu" role="menu">
      {links.map(([label, href]) => <a key={label} role="menuitem" href={href} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>{label}<ArrowUpRight /></a>)}
    </div>}
  </div>;
}
