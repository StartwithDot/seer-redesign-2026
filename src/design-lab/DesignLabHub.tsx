import React from 'react';
import { ActiveRoute } from '../design-system/components/GlobalNavbar';
import { ReversedEfFanMotif } from '../design-system/components/BrandMarks';
import { SEER_SURFACES, SeerSurface } from '../design-system/seerData';

interface DesignLabHubProps {
  onNavigate: (route: ActiveRoute) => void;
  onOpenSurfaceModal: (surface: SeerSurface) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const DesignLabHub: React.FC<DesignLabHubProps> = ({
  onNavigate,
  onOpenSurfaceModal,
  theme,
  onToggleTheme,
}) => {
  const concepts = [
    {
      id: 'concept-a' as ActiveRoute,
      code: 'CONCEPT A',
      name: 'The Protocol Ledger (Protocol / Infrastructure)',
      route: '/design-lab/concept-a',
      score: '92 / 100',
      philosophy:
        'Architectural, editorial blueprint inspired by Linear (FIG 0.1 - 0.5) and Monad vector precision. Positions Seer as institutional Information Finance infrastructure beneath six specialized applications.',
      signatureElement:
        'Interactive FIG 0.1 Reversed EF Signal Blueprint + Dual-Reader Lens Switch (Question Asker vs Forecaster/AI Agent) + Full 6-Surface Architectural Ledger Table.',
      strengths: 'Highest institutional trust, fastest 5-second comprehension, crystal-clear taxonomy across all 6 surfaces.',
      tradeoff: 'Restrained editorial motion rather than a cinematic 3D hero.',
    },
    {
      id: 'concept-b' as ActiveRoute,
      code: 'CONCEPT B',
      name: 'The Signal Field (Signal / Spatial Experience)',
      route: '/design-lab/concept-b',
      score: '90 / 100',
      philosophy:
        'Cinematic spatial topology inspired by Injective and Hyperliquid. Uses a custom HTML5 Canvas 3D-perspective beam network where one question enters from the left and branches into six interactive surface nodes.',
      signatureElement:
        'Interactive Canvas Signal Field with deterministic signal packets, 6-Node Selector Bar, Live Spatial Telemetry HUD, and full-width Electric Violet (#7A3CFF) chapter blocking.',
      strengths: 'Most memorable visual impact and spatial storytelling of the reversed EF fan-out motif.',
      tradeoff: 'Higher visual density in the hero stage than a pure editorial layout.',
    },
    {
      id: 'concept-c' as ActiveRoute,
      code: 'CONCEPT C',
      name: 'The Decision Workbench (Intelligence / Product Experience)',
      route: '/design-lab/concept-c',
      score: '94 / 100 (Recommended)',
      philosophy:
        'Product-led, interactive instrument experience where visitors immediately test Seer markets, switch between Decision Maker, Trader, and AI Agent JSON modes, and interact with the authentic EF Trade Ticket.',
      signatureElement:
        'Live Multi-Surface Decision Workbench + 3-Mode Reader Switch (Decision Maker / Trader / AI Agent Schema) + Authentic EF Kit Two-Card Trade Ticket simulator.',
      strengths: 'Strongest demonstration of Information Finance utility, EF kit fidelity, and scalability across all 6 apps.',
      tradeoff: 'Requires disciplined progressive disclosure so newcomers are not overwhelmed by controls.',
    },
  ];

  const rubricRows = [
    { criterion: 'Electric Foundation brand fidelity', weight: 15, a: 14, b: 14, c: 15 },
    { criterion: 'Distinctiveness and artistic quality', weight: 15, a: 14, b: 15, c: 14 },
    { criterion: 'Seer product communication (Info Finance + 6 apps)', weight: 15, a: 14, b: 13, c: 15 },
    { criterion: 'Navigation and ecosystem discoverability', weight: 15, a: 14, b: 13, c: 14 },
    { criterion: 'Typography and visual hierarchy', weight: 10, a: 10, b: 9, c: 9 },
    { criterion: 'UX clarity and behavioral reasoning', weight: 10, a: 9, b: 8, c: 10 },
    { criterion: 'Interaction and motion quality', weight: 5, a: 4, b: 5, c: 5 },
    { criterion: 'Responsive execution (1440 / 1024 / 390)', weight: 5, a: 5, b: 5, c: 4 },
    { criterion: 'Accessibility and performance', weight: 5, a: 4, b: 4, c: 4 },
    { criterion: 'Scalability across six products', weight: 5, a: 4, b: 4, c: 4 },
  ];

  return (
    <main>
      <section className="ef-section" data-align="container">
        <div className="ef-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap', marginBottom: '32px' }}>
            <div style={{ maxWidth: '780px' }}>
              <span className="ef-badge ef-badge-violet" style={{ marginBottom: '12px' }}>
                PROJECT ELECTRIC FOUNDATION · STAGE 1 REVIEW HUB
              </span>
              <h1 className="ef-display" style={{ marginBottom: '12px' }}>
                Seer Design Lab: Three Landing-Page Skeletons
              </h1>
              <p className="ef-lead">
                Inspect and compare three distinct, high-fidelity landing-page implementations built on the official
                Electric Foundation token system and Seer&apos;s October 2026 Information Finance strategy. Select any
                concept below to launch its full interactive prototype.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button type="button" className="ef-btn ef-btn-secondary" onClick={onToggleTheme}>
                Toggle Theme ({theme === 'dark' ? 'Dark #101013' : 'Light #F7F7F9'})
              </button>
              <button type="button" className="ef-btn ef-btn-primary" onClick={() => onNavigate('concept-c')}>
                Open Recommended Concept C →
              </button>
            </div>
          </div>

          {/* Three Concept Cards */}
          <div className="ef-grid-3" style={{ marginBottom: '48px' }}>
            {concepts.map((c) => (
              <div
                key={c.id}
                className="ef-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                  border: c.id === 'concept-c' ? '1px solid var(--ef-primary)' : '1px solid var(--ef-hairline)',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="ef-badge ef-badge-violet">{c.code}</span>
                    <span className="ef-badge ef-badge-positive">{c.score}</span>
                  </div>

                  <h2 className="ef-h3" style={{ fontSize: '20px' }}>
                    {c.name}
                  </h2>

                  <div className="ef-mono" style={{ fontSize: '12px', color: 'var(--ef-secondary-text)' }}>
                    Route: {c.route}
                  </div>

                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--ef-text-secondary)' }}>{c.philosophy}</p>

                  <div className="ef-nested" style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div>
                      <strong style={{ color: 'var(--ef-secondary-text)' }}>Signature Element:</strong>{' '}
                      {c.signatureElement}
                    </div>
                    <div>
                      <strong style={{ color: 'var(--ef-sem-positive)' }}>Strength:</strong> {c.strengths}
                    </div>
                    <div>
                      <strong style={{ color: 'var(--ef-sem-warning)' }}>Tradeoff:</strong> {c.tradeoff}
                    </div>
                  </div>
                </div>

                <a
                  href={c.route}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(c.id);
                  }}
                  className="ef-btn ef-btn-lg ef-btn-primary"
                  style={{ width: '100%' }}
                >
                  Open {c.code} Prototype →
                </a>
              </div>
            ))}
          </div>

          {/* 100-Point Scoring Matrix */}
          <div className="ef-card" style={{ marginBottom: '48px', overflowX: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <div className="ef-eyebrow">STAGE 1 EVALUATION FRAMEWORK</div>
                <h2 className="ef-h3">100-Point Comparative Scoring Matrix</h2>
              </div>
              <span className="ef-mono" style={{ fontSize: '12px', color: 'var(--ef-text-muted)' }}>
                Audited across 1440px, 1024px, and 390px in Dark &amp; Light Modes
              </span>
            </div>

            <table className="concept-a-ledger-table">
              <thead>
                <tr>
                  <th>Criterion</th>
                  <th>Weight</th>
                  <th>Concept A (Protocol Ledger)</th>
                  <th>Concept B (Signal Field)</th>
                  <th>Concept C (Decision Workbench)</th>
                </tr>
              </thead>
              <tbody>
                {rubricRows.map((r) => (
                  <tr key={r.criterion}>
                    <td>
                      <strong>{r.criterion}</strong>
                    </td>
                    <td className="ef-tabular">{r.weight}</td>
                    <td className="ef-tabular">{r.a} / {r.weight}</td>
                    <td className="ef-tabular">{r.b} / {r.weight}</td>
                    <td className="ef-tabular">
                      <strong>{r.c} / {r.weight}</strong>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td>
                    <strong>TOTAL SCORE</strong>
                  </td>
                  <td className="ef-tabular">
                    <strong>100</strong>
                  </td>
                  <td className="ef-tabular">
                    <strong>92 / 100</strong>
                  </td>
                  <td className="ef-tabular">
                    <strong>90 / 100</strong>
                  </td>
                  <td className="ef-tabular" style={{ color: 'var(--ef-secondary-text)' }}>
                    <strong>94 / 100</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Verified Electric Foundation Brand System Swatches & Reversed Line Motif */}
          <div className="ef-grid-2">
            <div className="ef-card">
              <div className="ef-eyebrow" style={{ marginBottom: '8px' }}>
                ELECTRIC FOUNDATION TOKEN VERIFICATION
              </div>
              <h3 className="ef-h3" style={{ marginBottom: '12px' }}>
                Official Figma Palette &amp; Tonal Surface Hierarchy
              </h3>
              <div className="ef-grid-3" style={{ gap: '10px' }}>
                <div className="ef-nested" style={{ backgroundColor: '#101013', color: '#EDEDF2', border: '1px solid var(--ef-hairline)' }}>
                  <div className="ef-mono" style={{ fontSize: '11px' }}>Page Bg (Dark)</div>
                  <strong>#101013</strong>
                </div>
                <div className="ef-nested" style={{ backgroundColor: '#1A1A1E', color: '#EDEDF2', border: '1px solid var(--ef-hairline)' }}>
                  <div className="ef-mono" style={{ fontSize: '11px' }}>Card Base</div>
                  <strong>#1A1A1E</strong>
                </div>
                <div className="ef-nested" style={{ backgroundColor: '#1F1F24', color: '#EDEDF2', border: '1px solid var(--ef-hairline)' }}>
                  <div className="ef-mono" style={{ fontSize: '11px' }}>Nested Surface</div>
                  <strong>#1F1F24</strong>
                </div>
                <div className="ef-nested" style={{ backgroundColor: '#7A3CFF', color: '#FFFFFF' }}>
                  <div className="ef-mono" style={{ fontSize: '11px' }}>Primary Action</div>
                  <strong>#7A3CFF</strong>
                </div>
                <div className="ef-nested" style={{ backgroundColor: '#241E33', color: '#9C6FF2' }}>
                  <div className="ef-mono" style={{ fontSize: '11px' }}>Secondary Dark</div>
                  <strong>#241E33 / #9C6FF2</strong>
                </div>
                <div className="ef-nested" style={{ backgroundColor: '#EFE9FC', color: '#6C2BD9' }}>
                  <div className="ef-mono" style={{ fontSize: '11px' }}>Secondary Light</div>
                  <strong>#EFE9FC / #6C2BD9</strong>
                </div>
              </div>
            </div>

            <div className="ef-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="ef-eyebrow" style={{ marginBottom: '8px' }}>
                  MANDATORY REVERSED LINE MOTIF (17 OCT 2026 BRIEF)
                </div>
                <h3 className="ef-h3" style={{ marginBottom: '8px' }}>
                  One question enters on the left and fans out into many outcomes on the right.
                </h3>
              </div>
              <ReversedEfFanMotif height={100} />
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                {SEER_SURFACES.slice(1).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className="ef-lab-pill"
                    onClick={() => onOpenSurfaceModal(s)}
                  >
                    {s.index}. {s.shortName} Specs
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
