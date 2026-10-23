import React, { useState } from 'react';
import {
  INFO_FINANCE_STATS,
  MARKET_PRIMITIVES,
  SEER_SURFACES,
  SeerSurface,
} from '../design-system/seerData';
import { ReversedEfFanMotif, SurfaceGlyph } from '../design-system/components/BrandMarks';

interface ConceptCProps {
  onOpenSurfaceModal: (surface: SeerSurface) => void;
}

export const ConceptC: React.FC<ConceptCProps> = ({ onOpenSurfaceModal }) => {
  // Interactive Workbench State
  const [activeSurfaceIdx, setActiveSurfaceIdx] = useState<number>(1); // Default to Explorer (Clarity Act H.R.3633)
  const [readerMode, setReaderMode] = useState<'decision' | 'trader' | 'agent'>('decision');
  const [ticketOutcome, setTicketOutcome] = useState<'yes' | 'no'>('yes');
  const [ticketAmount, setTicketAmount] = useState<number>(100);
  const [simConfirmed, setSimConfirmed] = useState<boolean>(false);

  const activeSurface = SEER_SURFACES[activeSurfaceIdx] || SEER_SURFACES[1];

  const yesPriceCents = 69;
  const noPriceCents = 31;
  const selectedPrice = ticketOutcome === 'yes' ? yesPriceCents / 100 : noPriceCents / 100;
  const estimatedShares = (ticketAmount / selectedPrice).toFixed(2);

  return (
    <main>
      {/* ====================================================================
          HERO: PRODUCT-LED WORKBENCH + AUTHENTIC EF TRADE TICKET & READER SWITCH
          ==================================================================== */}
      <section className="concept-c-hero" data-align="container">
        <div className="ef-container">
          <div className="concept-c-ticket-grid" style={{ alignItems: 'start' }}>
            {/* Left Column: Product-Led Proposition & 3-Mode Reader Switch */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span className="ef-badge ef-badge-violet">CONCEPT C · INTELLIGENCE WORKBENCH</span>
                <span className="ef-badge ef-badge-agent">HUMAN + AI AGENT READERS</span>
              </div>

              <h1 className="ef-display">
                Ask a question. Read the market signal. Keep the decision.
              </h1>

              <p className="ef-lead">
                Seer is Information Finance infrastructure for the agentic economy. Whether you are a DAO evaluating a
                proposal, a funding panel reviewing 98 repositories, a sponsor triaging 235 submissions, or a treasury
                pricing DeFi default risk, Seer turns market conviction into an immediately readable signal.
              </p>

              {/* 3-Mode Reader Switch (Decision Maker / Trader / AI Agent JSON) */}
              <div className="ef-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <span className="ef-eyebrow">INSPECT THE PROTOCOL BY READER MODE</span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className={`ef-btn ${readerMode === 'decision' ? 'ef-btn-primary' : 'ef-btn-ghost'}`}
                      onClick={() => setReaderMode('decision')}
                    >
                      1. Decision Maker
                    </button>
                    <button
                      type="button"
                      className={`ef-btn ${readerMode === 'trader' ? 'ef-btn-primary' : 'ef-btn-ghost'}`}
                      onClick={() => setReaderMode('trader')}
                    >
                      2. Market Trader
                    </button>
                    <button
                      type="button"
                      className={`ef-btn ${readerMode === 'agent' ? 'ef-btn-primary' : 'ef-btn-ghost'}`}
                      onClick={() => setReaderMode('agent')}
                    >
                      3. AI Agent Schema
                    </button>
                  </div>
                </div>

                {readerMode === 'decision' && (
                  <div className="ef-nested" style={{ fontSize: '13px', color: 'var(--ef-text-secondary)' }}>
                    <strong style={{ color: 'var(--ef-text-primary)' }}>Decision-Maker Readout:</strong> You do not need
                    to trade to use Seer. Inspect who asked the question, read the market-implied probability or TWAP
                    impact, and apply the signal to your governance vote, grant review, or risk allocation.
                  </div>
                )}

                {readerMode === 'trader' && (
                  <div className="ef-nested" style={{ fontSize: '13px', color: 'var(--ef-text-secondary)' }}>
                    <strong style={{ color: 'var(--ef-text-primary)' }}>Trader &amp; LP Readout:</strong> Deposit{' '}
                    <code>sDAI</code> on Gnosis Chain or <code>sUSDS</code> on Optimism (earning native Sky savings
                    yield) to buy underpriced ERC20 outcome shares or provide concentrated liquidity.
                  </div>
                )}

                {readerMode === 'agent' && (
                  <pre
                    className="ef-nested ef-mono"
                    style={{
                      margin: 0,
                      fontSize: '11px',
                      overflowX: 'auto',
                      color: 'var(--ef-secondary-text)',
                    }}
                  >
                    {JSON.stringify(activeSurface.auditedExample.agentSchemaSnippet, null, 2)}
                  </pre>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a href="#concept-c-suite" className="ef-btn ef-btn-lg ef-btn-primary">
                  Compare All 6 Interfaces ↓
                </a>
                <button
                  type="button"
                  className="ef-btn ef-btn-lg ef-btn-secondary"
                  onClick={() => onOpenSurfaceModal(activeSurface)}
                >
                  Open {activeSurface.shortName} Details ↗
                </button>
              </div>
            </div>

            {/* Right Column: Live Interactive Multi-Surface Workbench & Authentic EF Trade Ticket */}
            <div className="concept-c-workbench">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <span className="ef-eyebrow">LIVE INTERACTIVE SIGNAL &amp; TICKET WORKBENCH</span>
                <span className="ef-mono" style={{ fontSize: '11px', color: 'var(--ef-text-muted)' }}>
                  SWITCH LENS ACROSS THE 6 INTERFACES
                </span>
              </div>

              {/* 6-Surface Selector Strip */}
              <div className="concept-c-tabs" role="tablist" aria-label="Workbench Surface Lens">
                {SEER_SURFACES.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={activeSurfaceIdx === idx}
                    className="ef-lab-pill"
                    data-active={activeSurfaceIdx === idx}
                    onClick={() => {
                      setActiveSurfaceIdx(idx);
                      setSimConfirmed(false);
                    }}
                    style={{ minHeight: '36px' }}
                  >
                    <SurfaceGlyph id={s.id} />
                    <span>{s.shortName}</span>
                  </button>
                ))}
              </div>

              {/* Left + Right Two-Card EF Kit Trade Ticket & Signal Inspector (matching trade-ticket.png) */}
              <div className="ef-grid-2" style={{ gap: '12px' }}>
                {/* Card 1: Question, Volume, Outcomes */}
                <div className="ef-trade-ticket">
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '12px',
                        color: 'var(--ef-text-muted)',
                        marginBottom: '8px',
                      }}
                    >
                      <span className="ef-tabular" style={{ color: 'var(--ef-secondary-text)', fontWeight: 600 }}>
                        ● {activeSurface.auditedExample.secondaryMetricValue}
                      </span>
                      <span className="ef-mono">{activeSurface.chain.split(',')[0]}</span>
                    </div>

                    <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '12px', lineHeight: 1.35 }}>
                      {activeSurface.auditedExample.question}
                    </div>
                  </div>

                  {/* Authentic EF Yes / No Tiles + Outcome Bars */}
                  {activeSurface.id === 'explorer' ? (
                    <div className="ef-ticket-outcomes">
                      <button
                        type="button"
                        className="ef-ticket-tile-yes"
                        data-selected={ticketOutcome === 'yes'}
                        onClick={() => {
                          setTicketOutcome('yes');
                          setSimConfirmed(false);
                        }}
                      >
                        <div style={{ fontSize: '12px', opacity: 0.85 }}>Yes</div>
                        <div className="ef-tabular" style={{ fontSize: '20px', fontWeight: 700 }}>
                          {yesPriceCents}c
                        </div>
                      </button>

                      <button
                        type="button"
                        className="ef-ticket-tile-no"
                        data-selected={ticketOutcome === 'no'}
                        onClick={() => {
                          setTicketOutcome('no');
                          setSimConfirmed(false);
                        }}
                      >
                        <div style={{ fontSize: '12px', opacity: 0.85 }}>No</div>
                        <div className="ef-tabular" style={{ fontSize: '20px', fontWeight: 700 }}>
                          {noPriceCents}c
                        </div>
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {activeSurface.auditedExample.outcomes.slice(0, 3).map((o, i) => (
                        <div key={i} className="ef-prob-row" style={{ backgroundColor: 'var(--ef-bg-card)' }}>
                          <div className="ef-prob-top">
                            <span style={{ fontSize: '12px' }}>{o.label}</span>
                            <strong className="ef-tabular" style={{ fontSize: '12px' }}>
                              {o.probabilityOrPrice}
                            </strong>
                          </div>
                          <div className="ef-prob-track">
                            <div
                              className="ef-prob-fill"
                              style={{
                                width: `${o.barPercent}%`,
                                backgroundColor: 'var(--ef-primary)',
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ fontSize: '11px', color: 'var(--ef-text-muted)', paddingTop: '6px', borderTop: '1px solid var(--ef-hairline)' }}>
                    <strong>Decision Authority:</strong> {activeSurface.whoDecides}
                  </div>
                </div>

                {/* Card 2: EF Kit Amount & Simulation / Decision Action Card */}
                <div className="ef-trade-ticket">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>Amount ({activeSurface.collateral.split('/')[0].trim()})</span>
                    <span className="ef-tabular" style={{ fontSize: '28px', fontWeight: 700, color: 'var(--ef-text-secondary)' }}>
                      ${ticketAmount.toFixed(2)}
                    </span>
                  </div>

                  {/* Quick-Add Chips (+$1, +$5, +$20, +$100 from EF trade-ticket.png) */}
                  <div className="ef-chip-row">
                    {[1, 5, 20, 100].map((inc) => (
                      <button
                        key={inc}
                        type="button"
                        className="ef-amount-chip"
                        data-active={ticketAmount === inc}
                        onClick={() => {
                          setTicketAmount((prev) => prev + inc);
                          setSimConfirmed(false);
                        }}
                      >
                        +${inc}
                      </button>
                    ))}
                  </div>

                  <div
                    className="ef-nested"
                    style={{
                      backgroundColor: 'var(--ef-bg-card)',
                      padding: '10px 12px',
                      fontSize: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ color: 'var(--ef-text-secondary)' }}>
                      Est. {ticketOutcome.toUpperCase()} Outcome Shares:
                    </span>
                    <strong className="ef-tabular">{estimatedShares} ERC20</strong>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      className="ef-btn ef-btn-primary"
                      style={{ flex: 1 }}
                      onClick={() => setSimConfirmed(true)}
                    >
                      {simConfirmed ? 'Simulated in Sandbox ✓' : 'Confirm Simulation'}
                    </button>
                    <button
                      type="button"
                      className="ef-btn ef-btn-secondary"
                      aria-label="Reset simulated amount"
                      onClick={() => {
                        setTicketAmount(100);
                        setSimConfirmed(false);
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>

              {/* Reversed EF Fan-Out Footer inside Workbench */}
              <div className="ef-nested" style={{ padding: '12px 16px' }}>
                <ReversedEfFanMotif activeIndex={activeSurfaceIdx} height={64} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 2: INTERACTIVE 6-INTERFACE PRODUCT SUITE MATRIX
          ==================================================================== */}
      <section id="concept-c-suite" className="ef-section" data-align="container">
        <div className="ef-container">
          <div className="ef-section-header">
            <div className="ef-section-title-group">
              <span className="ef-eyebrow">THE SIX SEER INTERFACES</span>
              <h2 className="ef-h2">Every surface answers a distinct organizational question.</h2>
              <p className="ef-lead">
                Compare what each interface prices, who asks the question, and how human decision-makers use the signal.
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
                  border: activeSurfaceIdx === idx ? '1px solid var(--ef-primary)' : '1px solid var(--ef-hairline)',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="ef-badge ef-badge-violet">
                      <SurfaceGlyph id={surface.id} />
                      {surface.index} · {surface.shortName}
                    </span>
                    <span className="ef-badge ef-badge-positive">{surface.roleTag}</span>
                  </div>

                  <h3 className="ef-h3">{surface.name}</h3>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--ef-text-secondary)' }}>
                    {surface.oneLineRole}
                  </p>

                  {/* Audited Metric Pair */}
                  <div className="ef-grid-2" style={{ gap: '8px' }}>
                    <div className="ef-nested" style={{ padding: '10px' }}>
                      <div className="ef-mono" style={{ fontSize: '10px', color: 'var(--ef-text-muted)' }}>
                        {surface.auditedExample.primaryMetricLabel}
                      </div>
                      <div className="ef-tabular" style={{ fontWeight: 700, fontSize: '15px', color: 'var(--ef-secondary-text)' }}>
                        {surface.auditedExample.primaryMetricValue}
                      </div>
                    </div>
                    <div className="ef-nested" style={{ padding: '10px' }}>
                      <div className="ef-mono" style={{ fontSize: '10px', color: 'var(--ef-text-muted)' }}>
                        {surface.auditedExample.secondaryMetricLabel}
                      </div>
                      <div className="ef-tabular" style={{ fontWeight: 700, fontSize: '15px' }}>
                        {surface.auditedExample.secondaryMetricValue}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--ef-text-secondary)' }}>
                    <strong>How Signal Is Used:</strong> {surface.howSignalIsUsed}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="ef-btn ef-btn-secondary"
                    style={{ flex: 1 }}
                    onClick={() => {
                      setActiveSurfaceIdx(idx);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Load in Workbench ↑
                  </button>
                  <button
                    type="button"
                    className="ef-btn ef-btn-primary"
                    onClick={() => onOpenSurfaceModal(surface)}
                  >
                    Specs →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 3: EMPIRICAL EVIDENCE & MARKET PRIMITIVES
          ==================================================================== */}
      <section className="ef-section" data-align="container">
        <div className="ef-container">
          <div className="ef-grid-2">
            <div className="ef-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span className="ef-eyebrow">WHY SEER MOVED TO INFORMATION FINANCE</span>
              <h2 className="ef-h2" style={{ fontSize: '26px' }}>
                From {INFO_FINANCE_STATS.sportsAndParlaysShare} sports volume to 100% decision utility.
              </h2>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--ef-text-secondary)' }}>
                While {INFO_FINANCE_STATS.totalVolumeJanSep2026} was traded across prediction markets from January to
                September 2026, {INFO_FINANCE_STATS.informationShare} produced actionable information. Seer combines
                wrapped Conditional Tokens with AI agent batching so organizations can price complex questions on demand.
              </p>

              <div className="ef-grid-3">
                <div className="ef-nested">
                  <div className="ef-tabular" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--ef-primary)' }}>
                    2,947
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ef-text-secondary)' }}>Markets in Seer Explorer</div>
                </div>
                <div className="ef-nested">
                  <div className="ef-tabular" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--ef-sem-agent)' }}>
                    98 Repos
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ef-text-secondary)' }}>Scored in Deep Round 3</div>
                </div>
                <div className="ef-nested">
                  <div className="ef-tabular" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--ef-sem-positive)' }}>
                    33 Assets
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ef-text-secondary)' }}>Priced on Risk Pricing</div>
                </div>
              </div>
            </div>

            <div className="ef-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span className="ef-eyebrow">FIVE MARKET PRIMITIVES ON ONE PROTOCOL</span>
              {MARKET_PRIMITIVES.map((m) => (
                <div
                  key={m.code}
                  className="ef-nested"
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}
                >
                  <div>
                    <strong>{m.type}</strong>
                    <div style={{ fontSize: '12px', color: 'var(--ef-text-secondary)' }}>{m.definition}</div>
                  </div>
                  <span className="ef-badge ef-badge-violet">{m.code}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
