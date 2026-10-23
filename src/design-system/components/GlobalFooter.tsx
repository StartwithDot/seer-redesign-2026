import React from 'react';
import { SEER_SURFACES, SeerSurface } from '../seerData';
import { ActiveRoute } from './GlobalNavbar';
import { ReversedEfFanMotif, SeerEfLogo } from './BrandMarks';

interface GlobalFooterProps {
  onNavigate: (route: ActiveRoute) => void;
  onOpenSurfaceModal: (surface: SeerSurface) => void;
}

export const GlobalFooter: React.FC<GlobalFooterProps> = ({ onNavigate, onOpenSurfaceModal }) => {
  return (
    <footer className="ef-footer" role="contentinfo">
      <div className="ef-container">
        {/* Reversed EF Fan-Out Motif Sign-Off */}
        <div
          className="ef-nested"
          style={{
            marginBottom: '40px',
            padding: '24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            alignItems: 'center',
          }}
        >
          <div>
            <div className="ef-eyebrow" style={{ marginBottom: '6px' }}>
              INFORMATION FINANCE INFRASTRUCTURE FOR THE AGENTIC ECONOMY
            </div>
            <div className="ef-h3" style={{ marginBottom: '8px' }}>
              One question enters. Six specialized surfaces distill the signal.
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--ef-text-secondary)' }}>
              Designed for both the person asking the question and the human or AI agent pricing the answer.
            </p>
          </div>
          <div>
            <ReversedEfFanMotif height={96} />
          </div>
        </div>

        <div className="ef-footer-grid">
          <div className="ef-footer-col">
            <SeerEfLogo showRavenBadge={true} />
            <p style={{ margin: '8px 0 12px', fontSize: '13px', color: 'var(--ef-text-secondary)', maxWidth: '320px' }}>
              Permissionless Information Finance protocol built on Gnosis Conditional Tokens (ERC1155 wrapped as ERC20),
              Reality.eth optimistic oracle reporting, and Kleros decentralized arbitration.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="ef-badge ef-badge-violet">Gnosis Chain (sDAI)</span>
              <span className="ef-badge ef-badge-agent">Optimism (sUSDS)</span>
            </div>
          </div>

          <div className="ef-footer-col">
            <div className="ef-eyebrow">THE SIX INTERFACES</div>
            {SEER_SURFACES.map((surface) => (
              <button
                key={surface.id}
                type="button"
                className="ef-footer-link"
                onClick={() => {
                  if (surface.id === 'home') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    onOpenSurfaceModal(surface);
                  }
                }}
              >
                <span className="ef-mono" style={{ fontSize: '11px', color: 'var(--ef-secondary-text)' }}>
                  {surface.index}
                </span>
                <span>{surface.name}</span>
              </button>
            ))}
          </div>

          <div className="ef-footer-col">
            <div className="ef-eyebrow">PROTOCOL & DOCUMENTATION</div>
            <a href="https://docs.seer.pm" target="_blank" rel="noopener noreferrer" className="ef-footer-link">
              Seer Documentation (Mintlify) ↗
            </a>
            <a
              href="https://deep-pm.gitbook.io/seer-docs"
              target="_blank"
              rel="noopener noreferrer"
              className="ef-footer-link"
            >
              Deep AI Markets Docs (GitBook) ↗
            </a>
            <a href="https://github.com/seer-pm" target="_blank" rel="noopener noreferrer" className="ef-footer-link">
              GitHub (seer-pm) ↗
            </a>
            <a href="https://kleros.io" target="_blank" rel="noopener noreferrer" className="ef-footer-link">
              Kleros Arbitration Protocol ↗
            </a>
            <a
              href="https://vitalik.eth.limo/general/2024/11/09/infofinance.html"
              target="_blank"
              rel="noopener noreferrer"
              className="ef-footer-link"
            >
              Vitalik: From Prediction Markets to Info Finance ↗
            </a>
          </div>

          <div className="ef-footer-col">
            <div className="ef-eyebrow">COMMUNITY & DESIGN LAB</div>
            <a href="https://x.com/seer_pm" target="_blank" rel="noopener noreferrer" className="ef-footer-link">
              X / Twitter (@seer_pm) ↗
            </a>
            <a
              href="https://discord.com/invite/rBEB4MYQwV"
              target="_blank"
              rel="noopener noreferrer"
              className="ef-footer-link"
            >
              Seer Discord Community ↗
            </a>
            <a
              href="https://t.me/Seerpredictionmarket"
              target="_blank"
              rel="noopener noreferrer"
              className="ef-footer-link"
            >
              Telegram Channel ↗
            </a>
            <a href="https://seer-pm.medium.com/" target="_blank" rel="noopener noreferrer" className="ef-footer-link">
              Seer Medium Blog ↗
            </a>
            <button type="button" className="ef-footer-link" onClick={() => onNavigate('hub')}>
              Stage 1 Design Lab Comparison Hub →
            </button>
          </div>
        </div>

        <div
          style={{
            paddingTop: '20px',
            borderTop: '1px solid var(--ef-hairline)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
            fontSize: '12px',
            color: 'var(--ef-text-muted)',
          }}
        >
          <div>
            Seer Protocol · Electric Foundation Identity System · Contact:{' '}
            <a href="mailto:info@seer.pm" style={{ color: 'var(--ef-secondary-text)' }}>
              info@seer.pm
            </a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="ef-badge ef-badge-violet">Sample data from verified Oct 2026 audits</span>
            <span className="ef-mono">Read-only Stage 1 Prototype (No Wallet Signatures Requested)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
