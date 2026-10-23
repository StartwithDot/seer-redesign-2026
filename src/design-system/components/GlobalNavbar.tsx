import React, { useState } from 'react';
import { SEER_SURFACES, SeerSurface } from '../seerData';
import { SeerEfLogo, SurfaceGlyph } from './BrandMarks';

export type ActiveRoute = 'hub' | 'concept-a' | 'concept-b' | 'concept-c';

interface GlobalNavbarProps {
  activeRoute: ActiveRoute;
  onNavigate: (route: ActiveRoute) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenSurfaceModal: (surface: SeerSurface) => void;
  conceptLabel?: string;
}

export const GlobalNavbar: React.FC<GlobalNavbarProps> = ({
  activeRoute,
  onNavigate,
  theme,
  onToggleTheme,
  onOpenSurfaceModal,
  conceptLabel,
}) => {
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSurfaceSelect = (surface: SeerSurface) => {
    setMegaOpen(false);
    setMobileMenuOpen(false);
    if (surface.id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    onOpenSurfaceModal(surface);
  };

  return (
    <>
      {/* Stage 1 Design Lab Concept Switcher Bar */}
      <div className="ef-lab-ribbon" role="region" aria-label="Design Lab Concept Switcher">
        <div className="ef-container ef-lab-ribbon-inner">
          <div className="ef-lab-ribbon-left">
            <span className="ef-mono" style={{ fontWeight: 700, color: 'var(--ef-secondary-text)' }}>
              SEER EF DESIGN LAB
            </span>
            <a
              href="/design-lab"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('hub');
              }}
              className="ef-lab-pill"
              data-active={activeRoute === 'hub'}
            >
              Lab Overview & Rubric
            </a>
            <a
              href="/design-lab/concept-a"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('concept-a');
              }}
              className="ef-lab-pill"
              data-active={activeRoute === 'concept-a'}
            >
              Concept A: Protocol Ledger
            </a>
            <a
              href="/design-lab/concept-b"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('concept-b');
              }}
              className="ef-lab-pill"
              data-active={activeRoute === 'concept-b'}
            >
              Concept B: Signal Field
            </a>
            <a
              href="/design-lab/concept-c"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('concept-c');
              }}
              className="ef-lab-pill"
              data-active={activeRoute === 'concept-c'}
            >
              Concept C: Decision Workbench
            </a>
          </div>

          <div className="ef-lab-ribbon-right">
            {conceptLabel && (
              <span className="ef-mono" style={{ color: 'var(--ef-text-muted)' }}>
                {conceptLabel}
              </span>
            )}
            <button
              type="button"
              className="ef-lab-pill"
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              Theme: {theme === 'dark' ? 'Dark (#101013)' : 'Light (#F7F7F9)'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Seer Protocol Navigation Header */}
      <header className="ef-navbar">
        <div className="ef-container ef-navbar-inner" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <a
              href="/design-lab"
              className="ef-brand-link"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <SeerEfLogo showRavenBadge={true} />
              <span className="ef-brand-tag">INFO FINANCE</span>
            </a>

            {/* Primary Navigation Links */}
            <nav className="ef-nav-links" aria-label="Seer Ecosystem Navigation">
              <button
                type="button"
                className="ef-nav-item"
                aria-expanded={megaOpen}
                aria-haspopup="true"
                onClick={() => setMegaOpen((prev) => !prev)}
              >
                <span>Six Interfaces</span>
                <span aria-hidden="true" style={{ fontSize: '10px' }}>
                  {megaOpen ? '▲' : '▼'}
                </span>
              </button>

              {SEER_SURFACES.slice(1).map((surface) => (
                <button
                  key={surface.id}
                  type="button"
                  className="ef-nav-item"
                  onClick={() => handleSurfaceSelect(surface)}
                >
                  <span>{surface.shortName}</span>
                </button>
              ))}

              <a
                href="https://docs.seer.pm"
                target="_blank"
                rel="noopener noreferrer"
                className="ef-nav-item"
              >
                Docs ↗
              </a>
            </nav>
          </div>

          {/* Right Actions */}
          <div className="ef-nav-actions">
            <button
              type="button"
              className="ef-btn ef-btn-ghost ef-nav-desktop-only"
              onClick={() => setMegaOpen((prev) => !prev)}
            >
              Ecosystem Map (6)
            </button>

            <button
              type="button"
              className="ef-btn ef-btn-primary"
              onClick={() => handleSurfaceSelect(SEER_SURFACES[1])}
            >
              <span>Launch Seer App</span>
              <span aria-hidden="true">↗</span>
            </button>

            <button
              type="button"
              className="ef-btn ef-btn-ghost ef-mobile-toggle"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle mobile ecosystem menu"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen ? 'Close' : 'Menu (6)'}
            </button>
          </div>

          {/* Desktop 6-Interface Ecosystem Mega-Menu */}
          {megaOpen && (
            <>
              <div className="ef-megamenu-backdrop" onClick={() => setMegaOpen(false)} />
              <div className="ef-megamenu" role="menu" aria-label="Six Connected Seer Interfaces">
                <div className="ef-megamenu-header">
                  <div>
                    <div className="ef-eyebrow">ONE PROTOCOL · SIX CONNECTED SURFACES</div>
                    <div style={{ fontSize: '14px', color: 'var(--ef-text-secondary)' }}>
                      Built on Gnosis Conditional Tokens (ERC1155 wrapped as ERC20), Reality.eth, and Kleros arbitration.
                    </div>
                  </div>
                  <button
                    type="button"
                    className="ef-btn ef-btn-secondary"
                    onClick={() => setMegaOpen(false)}
                  >
                    Close Menu
                  </button>
                </div>

                <div className="ef-megamenu-grid">
                  {SEER_SURFACES.map((surface) => (
                    <button
                      key={surface.id}
                      type="button"
                      role="menuitem"
                      className="ef-megamenu-card"
                      onClick={() => handleSurfaceSelect(surface)}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '8px',
                          }}
                        >
                          <span className="ef-badge ef-badge-violet">
                            <SurfaceGlyph id={surface.id} />
                            {surface.index} · {surface.shortName}
                          </span>
                          <span className="ef-mono" style={{ fontSize: '11px', color: 'var(--ef-text-muted)' }}>
                            {surface.liveUrl.replace('https://', '')}
                          </span>
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '15px', marginTop: '2px' }}>
                          {surface.name}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--ef-text-secondary)', lineHeight: 1.45 }}>
                          {surface.oneLineRole}
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          paddingTop: '8px',
                          borderTop: '1px solid var(--ef-hairline)',
                          fontSize: '11px',
                        }}
                      >
                        <span className="ef-mono" style={{ color: 'var(--ef-secondary-text)' }}>
                          {surface.roleTag}
                        </span>
                        <span style={{ fontWeight: 600 }}>Inspect Surface →</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Responsive Mobile Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              backgroundColor: 'var(--ef-bg-card)',
              borderTop: '1px solid var(--ef-hairline)',
              padding: '16px var(--ef-page-gutter)',
            }}
          >
            <div className="ef-eyebrow" style={{ marginBottom: '10px' }}>
              SIX CONNECTED INTERFACES
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {SEER_SURFACES.map((surface) => (
                <button
                  key={surface.id}
                  type="button"
                  className="ef-megamenu-card"
                  onClick={() => handleSurfaceSelect(surface)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <strong>
                      {surface.index}. {surface.name}
                    </strong>
                    <span className="ef-mono" style={{ fontSize: '11px', color: 'var(--ef-secondary-text)' }}>
                      {surface.roleTag}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ef-text-secondary)' }}>
                    {surface.oneLineRole}
                  </div>
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button type="button" className="ef-btn ef-btn-secondary" onClick={onToggleTheme}>
                Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
              </button>
              <a
                href="https://docs.seer.pm"
                target="_blank"
                rel="noopener noreferrer"
                className="ef-btn ef-btn-ghost"
              >
                Protocol Docs ↗
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
