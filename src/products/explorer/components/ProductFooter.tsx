import { useState } from 'react';
import { BetaStrip } from './BetaStrip';
import { DataClock } from './DataClock';
import { externalLinks, productNavigation } from '../data/navigation';

interface ProductFooterProps {
  navigate: (hash: string) => void;
}

export function ProductFooter({ navigate }: ProductFooterProps) {
  const [betaVisible, setBetaVisible] = useState(() => { try { return sessionStorage.getItem('explorer-beta-dismissed') !== 'true'; } catch { return true; } });
  return (
    <footer className="product-footer" data-align="container">
      <div className="footer-statement">
        <img src={new URL('../../../../assets/brand/logo.svg', import.meta.url).href} alt="" width="138" height="64" />
        <p>Information, in the open.</p>
        <span className="sample-chip">Captured + illustrative data</span>
        <DataClock />
        <BetaStrip visible={betaVisible} onDismiss={() => { try { sessionStorage.setItem('explorer-beta-dismissed', 'true'); } catch { /* Session-only state. */ } setBetaVisible(false); }} />
      </div>
      <details className="footer-resources"><summary>Seer ecosystem & resources <span aria-hidden="true">↗</span></summary><div className="footer-links">
        <div>
          <p className="menu-label">Products</p>
          {productNavigation.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(event) => {
                if (!item.href.startsWith('#')) return;
                event.preventDefault();
                navigate(item.href);
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
        <div>
          <p className="menu-label">Protocol</p>
          <a href={externalLinks.reality} target="_blank" rel="noreferrer">Reality.eth</a>
          <a href={externalLinks.kleros} target="_blank" rel="noreferrer">Kleros</a>
          <a href={externalLinks.gnosis} target="_blank" rel="noreferrer">Gnosisscan</a>
        </div>
        <div>
          <p className="menu-label">Market resources</p>
          <a href={externalLinks.swapr} target="_blank" rel="noreferrer">Swapr</a>
          <a href={externalLinks.bridge} target="_blank" rel="noreferrer">Gnosis bridge</a>
          <a href={externalLinks.farming} target="_blank" rel="noreferrer">Farming</a>
        </div>
        <div>
          <p className="menu-label">Seer</p>
          <a href={externalLinks.liveApp} target="_blank" rel="noreferrer">Open live app</a>
          <a href={externalLinks.docs} target="_blank" rel="noreferrer">Documentation</a>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>Back to top ↑</button>
        </div>
      </div></details>
    </footer>
  );
}
