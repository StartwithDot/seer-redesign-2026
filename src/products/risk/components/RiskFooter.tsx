import { MARKET_LINKS } from '../data/market';
import { ArrowUpRight } from './Icons';

const products = [
  ['Explorer', MARKET_LINKS.explorer],
  ['Deep', MARKET_LINKS.deep],
  ['Futarchy', MARKET_LINKS.futarchy],
  ['Opportunity', MARKET_LINKS.opportunity],
  ['Risk', MARKET_LINKS.risk],
] as const;

export function RiskFooter() {
  return <footer className="risk-footer" data-align>
    <div className="risk-footer-brand">
      <strong>Seer. Information Finance.</strong>
      <p>Built by Seer. Markets are secured by Kleros.</p>
    </div>
    <details className="risk-footer-directory"><summary>Explore Seer <ArrowUpRight size={16} /></summary><div>
    <nav className="risk-footer-products" aria-label="Seer products">
      {products.map(([label, href]) => <a key={label} href={href}>{label}<ArrowUpRight /></a>)}
    </nav>
    <nav className="risk-footer-links" aria-label="Seer community">
      <a href={MARKET_LINKS.kleros}>Kleros</a>
      <a href={MARKET_LINKS.telegram}>Telegram</a>
      <a href={MARKET_LINKS.x}>X</a>
      <a href={MARKET_LINKS.github}>GitHub</a>
    </nav>
    </div></details>
  </footer>;
}
