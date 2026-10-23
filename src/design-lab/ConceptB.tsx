import React, { useEffect, useRef, useState } from 'react';
import {
  INFO_FINANCE_STATS,
  SEER_SURFACES,
  SeerSurface,
} from '../design-system/seerData';
import { SurfaceGlyph } from '../design-system/components/BrandMarks';

interface ConceptBProps {
  onOpenSurfaceModal: (surface: SeerSurface) => void;
  theme: 'dark' | 'light';
}

const LIFECYCLE_STEPS = [
  {
    step: '01',
    title: 'Question Origination (Information Seeker)',
    actor: 'DAO / Grant Committee / Sponsor / Risk Officer',
    summary:
      'An organization defines a decision question, target metric, or candidate pool and seeds yield-bearing collateral (sDAI on Gnosis or sUSDS on Optimism).',
    artifact: 'Condition prepared on Gnosis Conditional Tokens (ERC1155 -> ERC20)',
  },
  {
    step: '02',
    title: 'Multi-Outcome Pricing (Humans & AI Agents)',
    actor: 'Domain Traders & Autonomous Forecasting Agents',
    summary:
      'Traders and AI agents price every branch simultaneously. On Deep, agents upload CSV weight vectors and batch-trade across 98 repositories via a Trade Wallet.',
    artifact: 'Continuous implied probabilities, TWAP trajectories, and originality weights',
  },
  {
    step: '03',
    title: 'Signal Distillation & Triage Readout',
    actor: 'Signal Reader (No Trading Required)',
    summary:
      'Visitors and decision-makers read the distilled signal directly: +-1% TWAP impact on Futarchy, ranked submission odds on Opportunity Markets, or PD risk bands on Risk Pricing.',
    artifact: 'Actionable decision intelligence separated from speculative noise',
  },
  {
    step: '04',
    title: 'Human Decision & Kleros Finality',
    actor: 'Human Authority + Reality.eth + Kleros Arbitrators',
    summary:
      'DAOs vote on Snapshot, sponsors select winning submissions, and Reality.eth reports outcomes with Kleros arbitration resolving disputes. Winning shares redeem 1:1.',
    artifact: 'Auditable on-chain finality with human authority preserved',
  },
];

export const ConceptB: React.FC<ConceptBProps> = ({ onOpenSurfaceModal, theme }) => {
  const [activeNodeIdx, setActiveNodeIdx] = useState<number>(2); // Default focus: Deep (AI Agent Markets)
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeSurface = SEER_SURFACES[activeNodeIdx] || SEER_SURFACES[2];

  /* Interactive 3D-Perspective Reversed EF Fan-Out Signal Field Canvas
     - Respects prefers-reduced-motion (renders crisp static frame if enabled)
     - Visualizes 1 question origin on the left branching in depth into 6 surface nodes on the right */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = mediaQuery.matches;

    let animId = 0;
    let t = 0;

    const drawFrame = (time: number) => {
      const parent = canvas.parentElement;
      const width = parent ? parent.clientWidth : 800;
      const height = parent ? parent.clientHeight : 360;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      const isLight = theme === 'light';
      const bgFill = isLight ? '#F1F1F4' : '#101013';
      const textMain = isLight ? '#17171C' : '#EDEDF2';
      const textMuted = isLight ? '#5C5C66' : '#A8A8B3';
      const violetPrimary = '#7A3CFF';
      const violetSecondary = isLight ? '#6C2BD9' : '#9C6FF2';

      ctx.fillStyle = bgFill;
      ctx.fillRect(0, 0, width, height);

      // Subtle perspective coordinate lines
      ctx.strokeStyle = isLight ? 'rgba(23, 23, 28, 0.06)' : 'rgba(237, 237, 242, 0.05)';
      ctx.lineWidth = 1;
      const cols = 8;
      for (let i = 1; i < cols; i++) {
        const x = (width / cols) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Origin point on left (1 Question entering from left, per c.png rule)
      const originX = Math.max(48, width * 0.16);
      const originY = height * 0.5;

      // Incoming single beam from x=0 to originX
      ctx.strokeStyle = violetPrimary;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, originY);
      ctx.lineTo(originX, originY);
      ctx.stroke();

      // Draw 6 branching streams fanning out to the right
      const rightX = width - Math.max(130, width * 0.22);
      const topPad = 38;
      const bottomPad = height - 38;

      SEER_SURFACES.forEach((surface, idx) => {
        const frac = idx / (SEER_SURFACES.length - 1);
        const targetY = topPad + frac * (bottomPad - topPad);
        const isSelected = idx === activeNodeIdx;

        const cp1X = originX + (rightX - originX) * 0.36;
        const cp1Y = originY;
        const cp2X = originX + (rightX - originX) * 0.54;
        const cp2Y = targetY;

        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, rightX, targetY);
        ctx.lineTo(width - 16, targetY);

        ctx.strokeStyle = isSelected
          ? violetPrimary
          : isLight
            ? 'rgba(108, 43, 217, 0.28)'
            : 'rgba(156, 111, 242, 0.28)';
        ctx.lineWidth = isSelected ? 4 : 2;
        ctx.stroke();

        // Deterministic signal packet flowing along each branch (when motion enabled)
        const packetProgress = reducedMotion ? 0.72 : (time * 0.00045 + idx * 0.17) % 1;
        const u = 1 - packetProgress;
        const px =
          u * u * u * originX +
          3 * u * u * packetProgress * cp1X +
          3 * u * packetProgress * packetProgress * cp2X +
          packetProgress * packetProgress * packetProgress * rightX;
        const py =
          u * u * u * originY +
          3 * u * u * packetProgress * cp1Y +
          3 * u * packetProgress * packetProgress * cp2Y +
          packetProgress * packetProgress * packetProgress * targetY;

        ctx.beginPath();
        ctx.arc(px, py, isSelected ? 5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? textMain : violetSecondary;
        ctx.fill();

        // Node terminal on right
        ctx.beginPath();
        ctx.arc(rightX, targetY, isSelected ? 6.5 : 4, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? violetPrimary : bgFill;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = isSelected ? textMain : violetSecondary;
        ctx.stroke();

        // Label next to node (with halo so zero collision)
        if (width >= 520) {
          ctx.font = `${isSelected ? '600' : '500'} 12px "Inter Tight", sans-serif`;
          ctx.fillStyle = isSelected ? textMain : textMuted;
          ctx.textBaseline = 'middle';
          ctx.fillText(`${surface.index} ${surface.shortName}`, rightX + 12, targetY);
        }
      });

      // Origin node pulsing ring
      ctx.beginPath();
      ctx.arc(originX, originY, 8, 0, Math.PI * 2);
      ctx.fillStyle = violetPrimary;
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = textMain;
      ctx.stroke();

      // Origin caption
      ctx.font = '600 11px "JetBrains Mono", monospace';
      ctx.fillStyle = textMain;
      ctx.fillText('1 QUESTION IN', 14, originY - 14);

      ctx.restore();
    };

    const loop = (now: number) => {
      t = now;
      drawFrame(t);
      if (!reducedMotion) {
        animId = requestAnimationFrame(loop);
      }
    };

    drawFrame(0);
    if (!reducedMotion) {
      animId = requestAnimationFrame(loop);
    }

    const handleResize = () => drawFrame(t);
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeNodeIdx, theme]);

  return (
    <main>
      {/* ====================================================================
          HERO: SPATIAL SIGNAL STAGE + 6-NODE CONSTELLATION SELECTOR
          ==================================================================== */}
      <section className="concept-b-hero" data-align="container">
        <div className="ef-container">
          <div style={{ maxWidth: '880px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <span className="ef-badge ef-badge-violet">CONCEPT B · SPATIAL SIGNAL EXPERIENCE</span>
              <span className="ef-mono" style={{ fontSize: '12px', color: 'var(--ef-text-muted)' }}>
                ONE QUESTION -&gt; SIX CONNECTED SIGNAL SURFACES
              </span>
            </div>

            <h1 className="ef-display" style={{ marginBottom: '14px' }}>
              Where uncertain questions branch into priced intelligence.
            </h1>

            <p className="ef-lead">
              Seer transforms prediction markets from isolated betting venues into an interconnected Information Finance
              network. One question enters the protocol, human and AI forecasters price the outcome space, and six
              specialized surfaces deliver clear signals to decision-makers.
            </p>
          </div>

          {/* Spatial Interactive Stage */}
          <div className="concept-b-stage">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <span className="ef-eyebrow">INTERACTIVE SIGNAL TOPOLOGY STAGE (REVERSED EF MOTIF)</span>
                <div style={{ fontSize: '13px', color: 'var(--ef-text-secondary)' }}>
                  Select any of the six Seer surface nodes below to focus the signal beam and inspect its live audited
                  market.
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="ef-btn ef-btn-primary"
                  onClick={() => onOpenSurfaceModal(activeSurface)}
                >
                  Inspect {activeSurface.name} Surface ↗
                </button>
                <a href="#concept-b-constellation" className="ef-btn ef-btn-secondary">
                  View All 6 Surfaces ↓
                </a>
              </div>
            </div>

            {/* Canvas Stage */}
            <div className="concept-b-canvas-wrap">
              <canvas
                ref={canvasRef}
                className="concept-b-canvas"
                aria-label="Interactive spatial signal field showing one question branching into six Seer surfaces"
              />
            </div>

            {/* 6-Surface Node Selector Bar */}
            <div className="concept-b-node-bar" role="tablist" aria-label="Select Seer Surface Node">
              {SEER_SURFACES.map((surface, idx) => (
                <button
                  key={surface.id}
                  type="button"
                  role="tab"
                  aria-selected={activeNodeIdx === idx}
                  className="concept-b-node-btn"
                  data-active={activeNodeIdx === idx}
                  onClick={() => setActiveNodeIdx(idx)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '13px' }}>
                    <SurfaceGlyph id={surface.id} />
                    <span>
                      {surface.index}. {surface.shortName}
                    </span>
                  </div>
                  <span className="ef-node-sub">{surface.roleTag}</span>
                </button>
              ))}
            </div>

            {/* Live Spatial Telemetry Readout for Selected Node */}
            <div className="ef-grid-2" style={{ gap: '16px' }}>
              <div className="ef-nested" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <span className="ef-eyebrow">ACTIVE NODE {activeSurface.index} · {activeSurface.name.toUpperCase()}</span>
                  <span className="ef-badge ef-badge-positive">{activeSurface.status}</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: '16px' }}>{activeSurface.auditedExample.question}</div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ef-text-secondary)' }}>
                  {activeSurface.oneLineRole}
                </p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: '8px',
                    marginTop: 'auto',
                    paddingTop: '8px',
                    borderTop: '1px solid var(--ef-hairline)',
                  }}
                >
                  <div>
                    <div className="ef-mono" style={{ fontSize: '11px', color: 'var(--ef-text-muted)' }}>
                      {activeSurface.auditedExample.primaryMetricLabel}
                    </div>
                    <div className="ef-tabular" style={{ fontWeight: 700, fontSize: '18px', color: 'var(--ef-secondary-text)' }}>
                      {activeSurface.auditedExample.primaryMetricValue}
                    </div>
                  </div>
                  <div>
                    <div className="ef-mono" style={{ fontSize: '11px', color: 'var(--ef-text-muted)' }}>
                      {activeSurface.auditedExample.secondaryMetricLabel}
                    </div>
                    <div className="ef-tabular" style={{ fontWeight: 700, fontSize: '18px' }}>
                      {activeSurface.auditedExample.secondaryMetricValue}
                    </div>
                  </div>
                </div>
              </div>

              <div className="ef-nested" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="ef-eyebrow">PRICED OUTCOME DISTRIBUTION &amp; DECISION RULE</div>
                {activeSurface.auditedExample.outcomes.map((o, idx) => (
                  <div key={idx} className="ef-prob-row" style={{ backgroundColor: 'var(--ef-bg-card)' }}>
                    <div className="ef-prob-top">
                      <span>{o.label}</span>
                      <strong className="ef-tabular">{o.probabilityOrPrice}</strong>
                    </div>
                    <div className="ef-prob-track">
                      <div
                        className="ef-prob-fill"
                        style={{
                          width: `${o.barPercent}%`,
                          backgroundColor:
                            o.variant === 'positive'
                              ? 'var(--ef-sem-positive)'
                              : o.variant === 'warning'
                                ? 'var(--ef-sem-warning)'
                                : o.variant === 'danger'
                                  ? 'var(--ef-sem-danger)'
                                  : o.variant === 'agent'
                                    ? 'var(--ef-sem-agent)'
                                    : 'var(--ef-primary)',
                        }}
                      />
                    </div>
                  </div>
                ))}
                <div className="ef-mono" style={{ fontSize: '11px', color: 'var(--ef-text-muted)', marginTop: '4px' }}>
                  Rule: {activeSurface.auditedExample.decisionRule}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 2: ELECTRIC VIOLET ARCHITECTURAL CHAPTER PANEL
          ==================================================================== */}
      <section className="ef-section" data-align="container">
        <div className="ef-container">
          <div className="concept-b-violet-chapter">
            <div className="ef-grid-2" style={{ alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <span
                  className="ef-mono"
                  style={{
                    fontSize: '12px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'rgba(255, 255, 255, 0.85)',
                  }}
                >
                  THE 2026 PARADIGM SHIFT · FROM SPECULATION TO INFORMATION FINANCE
                </span>
                <h2 className="ef-h2" style={{ color: '#FFFFFF' }}>
                  $331B traded in 2026. Yet 77% was sports and parlays, and under 2% generated information.
                </h2>
                <p style={{ margin: 0, fontSize: '15px', color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.55 }}>
                  Traditional prediction markets treat information as an accidental byproduct of entertainment betting.
                  Seer inverts the model: start from a question a DAO, grant committee, sponsor, or treasury needs
                  answered, then structure a market where human traders and autonomous AI agents get paid to surface the
                  truth.
                </p>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(16, 16, 19, 0.88)',
                  color: '#EDEDF2',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <div className="ef-mono" style={{ fontSize: '11px', color: '#9C6FF2' }}>
                  THE BLOCK MARKET EVIDENCE (JAN TO SEP 2026)
                </div>
                <div className="ef-grid-3">
                  <div>
                    <div className="ef-tabular" style={{ fontSize: '26px', fontWeight: 700, color: '#5B9DFF' }}>
                      {INFO_FINANCE_STATS.totalVolumeJanSep2026}
                    </div>
                    <div style={{ fontSize: '12px', color: '#A8A8B3' }}>Jan-Sep 2026 Volume</div>
                  </div>
                  <div>
                    <div className="ef-tabular" style={{ fontSize: '26px', fontWeight: 700, color: '#F5B84A' }}>
                      {INFO_FINANCE_STATS.sportsAndParlaysShare}
                    </div>
                    <div style={{ fontSize: '12px', color: '#A8A8B3' }}>Sports &amp; Parlays (Sep)</div>
                  </div>
                  <div>
                    <div className="ef-tabular" style={{ fontSize: '26px', fontWeight: 700, color: '#9C6FF2' }}>
                      {INFO_FINANCE_STATS.informationShare}
                    </div>
                    <div style={{ fontSize: '12px', color: '#A8A8B3' }}>Information Markets</div>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#A8A8B3', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
                  AI agents unlock the missing 98%: autonomous forecasters can evaluate micro-questions (98 GitHub
                  repositories on Deep or 235 naming candidates on Opportunity Markets) where human attention alone is
                  too costly.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 3: SIX-SURFACE CONSTELLATION DIRECTORY
          ==================================================================== */}
      <section id="concept-b-constellation" className="ef-section" data-align="container">
        <div className="ef-container">
          <div className="ef-section-header">
            <div className="ef-section-title-group">
              <span className="ef-eyebrow">THE SIX CONNECTED SURFACES</span>
              <h2 className="ef-h2">Six specialized instruments powered by one protocol spine.</h2>
              <p className="ef-lead">
                Each interface is purpose-built for a specific class of decision while sharing Conditional Tokens,
                Reality.eth, and Kleros beneath the surface.
              </p>
            </div>
          </div>

          <div className="ef-grid-3">
            {SEER_SURFACES.map((surface, idx) => (
              <div
                key={surface.id}
                className="ef-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                  border: activeNodeIdx === idx ? '1px solid var(--ef-primary)' : '1px solid var(--ef-hairline)',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="ef-badge ef-badge-violet">
                      <SurfaceGlyph id={surface.id} />
                      {surface.index} · {surface.shortName}
                    </span>
                    <span className="ef-mono" style={{ fontSize: '11px', color: 'var(--ef-text-muted)' }}>
                      {surface.liveUrl.replace('https://', '')}
                    </span>
                  </div>

                  <h3 className="ef-h3">{surface.name}</h3>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--ef-text-secondary)' }}>
                    {surface.oneLineRole}
                  </p>

                  <div className="ef-nested" style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div>
                      <strong style={{ color: 'var(--ef-secondary-text)' }}>Who Asks:</strong> {surface.whoAsks}
                    </div>
                    <div>
                      <strong style={{ color: 'var(--ef-secondary-text)' }}>What Is Priced:</strong> {surface.whatIsPriced}
                    </div>
                    <div>
                      <strong style={{ color: 'var(--ef-sem-positive)' }}>Final Authority:</strong> {surface.whoDecides}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="ef-btn ef-btn-primary"
                    style={{ width: '100%' }}
                    onClick={() => {
                      setActiveNodeIdx(idx);
                      if (surface.id === 'home') {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else {
                        onOpenSurfaceModal(surface);
                      }
                    }}
                  >
                    {surface.id === 'home' ? 'Focus in Signal Stage ↑' : `Inspect ${surface.shortName} Surface →`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 4: 4-STEP SIGNAL CHOREOGRAPHY
          ==================================================================== */}
      <section className="ef-section" data-align="container">
        <div className="ef-container">
          <div className="ef-section-header">
            <div className="ef-section-title-group">
              <span className="ef-eyebrow">SIGNAL LIFECYCLE CHOREOGRAPHY</span>
              <h2 className="ef-h2">How a question becomes a verified decision signal.</h2>
            </div>
          </div>

          <div className="ef-grid-4">
            {LIFECYCLE_STEPS.map((item, idx) => (
              <div
                key={item.step}
                className="ef-card"
                onClick={() => setActiveStepIdx(idx)}
                style={{
                  cursor: 'pointer',
                  border: activeStepIdx === idx ? '1px solid var(--ef-primary)' : '1px solid var(--ef-hairline)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span className="ef-badge ef-badge-violet">STEP {item.step}</span>
                    <span className="ef-mono" style={{ fontSize: '11px', color: 'var(--ef-text-muted)' }}>
                      {idx === 3 ? 'FINALITY' : 'FLOW →'}
                    </span>
                  </div>
                  <h3 className="ef-h3" style={{ fontSize: '17px', marginBottom: '6px' }}>
                    {item.title}
                  </h3>
                  <div className="ef-mono" style={{ fontSize: '11px', color: 'var(--ef-secondary-text)', marginBottom: '8px' }}>
                    {item.actor}
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--ef-text-secondary)' }}>{item.summary}</p>
                </div>

                <div className="ef-nested" style={{ fontSize: '11px', fontFamily: 'var(--ef-font-mono)' }}>
                  Output: {item.artifact}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};
