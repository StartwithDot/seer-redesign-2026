import React, { useState } from 'react';
import {
  INFO_FINANCE_STATS,
  MARKET_PRIMITIVES,
  PROTOCOL_STACK_LAYERS,
  SEER_SURFACES,
  SeerSurface,
} from '../design-system/seerData';
import { ReversedEfFanMotif, SurfaceGlyph } from '../design-system/components/BrandMarks';

interface ConceptAProps {
  onOpenSurfaceModal: (surface: SeerSurface) => void;
}

export const ConceptA: React.FC<ConceptAProps> = ({ onOpenSurfaceModal }) => {
  const [selectedSurfaceIdx, setSelectedSurfaceIdx] = useState<number>(3); // Default to Futarchy (EIP-8363)
  const [readerRole, setReaderRole] = useState<'asker' | 'trader'>('asker');

  const activeSurface = SEER_SURFACES[selectedSurfaceIdx] || SEER_SURFACES[3];

  return (
    <main>
      {/* ====================================================================
          HERO: ARCHITECTURAL SPLIT + FIG 0.1 REVERSED FAN-OUT BLUEPRINT
          ==================================================================== */}
      <section className="concept-a-hero" data-align="container">
        <div className="ef-container concept-a-hero-grid">
          {/* Left Column: Institutional Proposition & Reader Perspective Switch */}
          <div className="concept-a-left">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span className="ef-badge ef-badge-violet">CONCEPT A · PROTOCOL LEDGER</span>
                <span className="ef-mono" style={{ fontSize: '12px', color: 'var(--ef-text-muted)' }}>
                  GNOSIS CHAIN + OPTIMISM
                </span>
              </div>

              <h1 className="ef-display">
                The protocol that turns questions into priced decision signals.
              </h1>

              <p className="ef-lead">
                Seer is Information Finance infrastructure for the agentic economy. One shared settlement stack
                (Conditional Tokens, Reality.eth, and Kleros) powers six connected interfaces designed as much for the
                organization asking the question as for the human or AI agent pricing the answer.
              </p>
            </div>

            {/* Dual-Reader Perspective Switch (Asker vs Forecaster) */}
            <div className="ef-nested" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}
              >
                <span className="ef-eyebrow">SELECT YOUR LENS ON THE PROTOCOL</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    className={`ef-btn ${readerRole === 'asker' ? 'ef-btn-primary' : 'ef-btn-ghost'}`}
                    onClick={() => setReaderRole('asker')}
                  >
                    1. Question Asker / Reader
                  </button>
                  <button
                    type="button"
                    className={`ef-btn ${readerRole === 'trader' ? 'ef-btn-primary' : 'ef-btn-ghost'}`}
                    onClick={() => setReaderRole('trader')}
                  >
                    2. Forecaster / AI Agent
                  </button>
                </div>
              </div>

              <div style={{ fontSize: '14px', color: 'var(--ef-text-secondary)' }}>
                {readerRole === 'asker' ? (
                  <>
                    <strong>For Decision Makers:</strong> Pose a governance, grant allocation, selection, or risk
                    question. Read the market-implied signal directly without needing to become a trader, while your DAO,
                    review panel, or sponsor team retains final authority.
                  </>
                ) : (
                  <>
                    <strong>For Human &amp; AI Forecasters:</strong> Back underpriced outcomes using yield-bearing
                    collateral (<code>sDAI</code> on Gnosis, <code>sUSDS</code> on Optimism) or upload batch CSV weights
                    via a Trade Wallet on Deep. Winning ERC20 shares redeem 1:1 after Reality.eth / Kleros resolution.
                  </>
                )}
              </div>
            </div>

            {/* Primary & Secondary CTAs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <a href="#concept-a-ecosystem" className="ef-btn ef-btn-lg ef-btn-primary">
                Explore the 6 Connected Interfaces ↓
              </a>
              <button
                type="button"
                className="ef-btn ef-btn-lg ef-btn-secondary"
                onClick={() => onOpenSurfaceModal(SEER_SURFACES[1])}
              >
                Inspect Seer App Explorer ↗
              </button>
              <a
                href="https://docs.seer.pm"
                target="_blank"
                rel="noopener noreferrer"
                className="ef-btn ef-btn-lg ef-btn-ghost"
              >
                Read Protocol Docs ↗
              </a>
            </div>
          </div>

          {/* Right Column: FIG 0.1 Interactive Reversed Fan-Out Blueprint */}
          <div className="concept-a-blueprint">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                flexWrap: 'wrap',
                borderBottom: '1px solid var(--ef-hairline)',
                paddingBottom: '12px',
              }}
            >
              <span className="ef-eyebrow">FIG 0.1 · REVERSED EF SIGNAL TOPOLOGY (1 QUESTION -&gt; N OUTCOMES)</span>
              <span className="ef-mono" style={{ fontSize: '11px', color: 'var(--ef-text-muted)' }}>
                CLICK SURFACE TO INSPECT SIGNAL
              </span>
            </div>

            {/* Surface Selector Tabs inside Blueprint */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {SEER_SURFACES.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  className={`ef-lab-pill`}
                  data-active={selectedSurfaceIdx === idx}
                  onClick={() => setSelectedSurfaceIdx(idx)}
                  style={{ minHeight: '36px' }}
                >
                  <SurfaceGlyph id={s.id} />
                  <span>
                    {s.index}. {s.shortName}
                  </span>
                </button>
              ))}
            </div>

            {/* Reversed EF Fan-Out Line Diagram */}
            <div className="ef-nested">
              <ReversedEfFanMotif
                activeIndex={selectedSurfaceIdx}
                height={132}
                labels={activeSurface.auditedExample.outcomes.map((o) => o.label)}
                onSelectBranch={(idx) => {
                  if (idx < SEER_SURFACES.length) setSelectedSurfaceIdx(idx);
                }}
              />
            </div>

            {/* Live Audited Question & Signal Breakdown */}
            <div className="ef-nested" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}
              >
                <span className="ef-badge ef-badge-violet">{activeSurface.name}</span>
                <span className="ef-mono" style={{ fontSize: '12px', color: 'var(--ef-text-muted)' }}>
                  {activeSurface.auditedExample.contextLabel}
                </span>
              </div>

              <div style={{ fontWeight: 600, fontSize: '16px' }}>{activeSurface.auditedExample.question}</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activeSurface.auditedExample.outcomes.slice(0, 3).map((outcome, i) => (
                  <div key={i} className="ef-prob-row" style={{ backgroundColor: 'var(--ef-bg-card)' }}>
                    <div className="ef-prob-top">
                      <span>{outcome.label}</span>
                      <strong className="ef-tabular">{outcome.probabilityOrPrice}</strong>
                    </div>
                    <div className="ef-prob-track">
                      <div
                        className="ef-prob-fill"
                        style={{
                          width: `${outcome.barPercent}%`,
                          backgroundColor:
                            outcome.variant === 'positive'
                              ? 'var(--ef-sem-positive)'
                              : outcome.variant === 'warning'
                                ? 'var(--ef-sem-warning)'
                                : outcome.variant === 'danger'
                                  ? 'var(--ef-sem-danger)'
                                  : outcome.variant === 'agent'
                                    ? 'var(--ef-sem-agent)'
                                    : 'var(--ef-primary)',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '8px',
                  paddingTop: '8px',
                  borderTop: '1px solid var(--ef-hairline)',
                  fontSize: '12px',
                }}
              >
                <div>
                  <div className="ef-mono" style={{ color: 'var(--ef-text-muted)', fontSize: '11px' }}>
                    WHO ASKS
                  </div>
                  <div>{activeSurface.whoAsks}</div>
                </div>
                <div>
                  <div className="ef-mono" style={{ color: 'var(--ef-text-muted)', fontSize: '11px' }}>
                    DECISION AUTHORITY
                  </div>
                  <div>{activeSurface.whoDecides}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 2: FIG 0.2 THE INFORMATION DEFICIT (EMPIRICAL PROOF)
          ==================================================================== */}
      <section className="ef-section" data-align="container">
        <div className="ef-container">
          <div className="ef-section-header">
            <div className="ef-section-title-group">
              <span className="ef-eyebrow">FIG 0.2 · WHY INFORMATION FINANCE EXISTS</span>
              <h2 className="ef-h2">
                Prediction markets proved they work at scale. Less than 2% produce decision-useful information.
              </h2>
              <p className="ef-lead">
                Between January and September 2026, $331B was traded across major prediction markets. Yet 77% of
                September volume was sports and parlays. Seer starts from the opposite direction: start with a fact an
                organization needs to know, then construct a market to elicit that information.
              </p>
            </div>
            <span className="ef-badge ef-badge-violet">Source: The Block (6 Oct 2026)</span>
          </div>

          <div className="ef-grid-2">
            {/* Left: The 3 Headline Empirical Numbers from Seer's Oct 17 X Post */}
            <div className="ef-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="ef-eyebrow">EMPIRICAL INDUSTRY BASELINE (JAN TO SEP 2026)</div>
              <div className="ef-grid-3">
                <div className="ef-nested">
                  <div
                    className="ef-tabular"
                    style={{ fontSize: '32px', fontWeight: 700, color: 'var(--ef-sem-agent)' }}
                  >
                    {INFO_FINANCE_STATS.totalVolumeJanSep2026}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--ef-text-secondary)', marginTop: '4px' }}>
                    Traded Jan to Sep 2026 ($72B in Sep 2026 alone)
                  </div>
                </div>

                <div className="ef-nested">
                  <div
                    className="ef-tabular"
                    style={{ fontSize: '32px', fontWeight: 700, color: 'var(--ef-sem-warning)' }}
                  >
                    {INFO_FINANCE_STATS.sportsAndParlaysShare}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--ef-text-secondary)', marginTop: '4px' }}>
                    Sports and parlays share of September 2026 volume
                  </div>
                </div>

                <div className="ef-nested">
                  <div
                    className="ef-tabular"
                    style={{ fontSize: '32px', fontWeight: 700, color: 'var(--ef-secondary-text)' }}
                  >
                    {INFO_FINANCE_STATS.informationShare}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--ef-text-secondary)', marginTop: '4px' }}>
                    Markets producing actionable organizational information
                  </div>
                </div>
              </div>

              {/* Stacked Bar Chart of 2024-2026 Volume Growth */}
              <div className="ef-nested" style={{ padding: '16px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                    fontSize: '12px',
                  }}
                >
                  <span className="ef-mono" style={{ color: 'var(--ef-text-secondary)' }}>
                    MONTHLY TAKER NOTIONAL VOLUME TRAJECTORY (2024 TO SEP 2026)
                  </span>
                  <span className="ef-mono" style={{ color: 'var(--ef-secondary-text)' }}>
                    Peak: $72B in Sep 2026
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(8, minmax(0, 1fr))',
                    gap: '8px',
                    alignItems: 'end',
                    height: '110px',
                    paddingTop: '12px',
                  }}
                >
                  {INFO_FINANCE_STATS.quarterlyVolumeBars.map((bar, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        height: '100%',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <div
                        style={{
                          width: '100%',
                          height: `${bar.kalshi + bar.polymarket}%`,
                          backgroundColor: i === 7 ? 'var(--ef-primary)' : 'var(--ef-secondary-bg)',
                          borderRadius: '4px 4px 0 0',
                          borderTop: '2px solid var(--ef-secondary-text)',
                        }}
                        title={`${bar.period}: ${bar.totalLabel}`}
                      />
                      <span className="ef-mono" style={{ fontSize: '10px', color: 'var(--ef-text-muted)' }}>
                        {bar.period.replace('20', "'")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Correct-by-Construction Three-Sided Info Finance Architecture */}
            <div className="ef-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <div className="ef-eyebrow" style={{ marginBottom: '6px' }}>
                  CORRECT-BY-CONSTRUCTION MARKET DESIGN
                </div>
                <h3 className="ef-h3" style={{ marginBottom: '10px' }}>
                  A three-sided market where the output is a public signal for decision-makers.
                </h3>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--ef-text-secondary)' }}>
                  Following Vitalik Buterin&apos;s Information Finance thesis and Clément Lesaege&apos;s ETH Taipei
                  framework, Seer separates the three roles so someone can extract high-precision intelligence without
                  becoming a speculator:
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="ef-nested" style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
                  <div>
                    <div className="ef-mono" style={{ fontSize: '11px', color: 'var(--ef-secondary-text)' }}>
                      SIDE 01 · QUESTION ORIGINATOR (ASKER)
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>
                      DAOs, Grant Committees, Sponsors, Risk Teams
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--ef-text-secondary)' }}>
                      Defines the decision metric, candidate set, or default horizon and seeds initial liquidity.
                    </div>
                  </div>
                  <span className="ef-badge ef-badge-violet">Asks Question</span>
                </div>

                <div className="ef-nested" style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
                  <div>
                    <div className="ef-mono" style={{ fontSize: '11px', color: 'var(--ef-sem-agent)' }}>
                      SIDE 02 · FORECASTERS (HUMANS &amp; AI AGENTS)
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>
                      Domain Traders &amp; Autonomous AI Forecasting Agents
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--ef-text-secondary)' }}>
                      AI agents make micro-markets viable at low volume by pricing 98+ outcomes in batch transactions.
                    </div>
                  </div>
                  <span className="ef-badge ef-badge-agent">Prices Signal</span>
                </div>

                <div className="ef-nested" style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
                  <div>
                    <div className="ef-mono" style={{ fontSize: '11px', color: 'var(--ef-sem-positive)' }}>
                      SIDE 03 · SIGNAL READER &amp; DECISION AUTHORITY
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>
                      Voters, Evaluators, Portfolio Managers, Public Readers
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--ef-text-secondary)' }}>
                      Uses the market signal (TWAP impact, originality weights, triage rank, PD band) to make an informed human choice.
                    </div>
                  </div>
                  <span className="ef-badge ef-badge-positive">Decides</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 3: FIG 0.3 THE SIX CONNECTED INTERFACES LEDGER
          ==================================================================== */}
      <section id="concept-a-ecosystem" className="ef-section" data-align="container">
        <div className="ef-container">
          <div className="ef-section-header">
            <div className="ef-section-title-group">
              <span className="ef-eyebrow">FIG 0.3 · ECOSYSTEM ARCHITECTURE LEDGER</span>
              <h2 className="ef-h2">One protocol. Six specialized interfaces.</h2>
              <p className="ef-lead">
                Every Seer application shares the same Conditional Tokens and Reality.eth + Kleros resolution spine,
                while adapting its interface to the exact shape of the question being asked.
              </p>
            </div>
            <span className="ef-mono" style={{ fontSize: '12px', color: 'var(--ef-text-muted)' }}>
              SELECT ANY ROW TO OPEN SURFACE SPECIFICATION
            </span>
          </div>

          <div className="ef-card" style={{ padding: '0', overflow: 'hidden' }}>
            <table className="concept-a-ledger-table" aria-label="Six Connected Seer Interfaces">
              <thead>
                <tr>
                  <th>Surface</th>
                  <th>Who Asks the Question</th>
                  <th>What Is Priced</th>
                  <th>How Signal Is Used &amp; Who Decides</th>
                  <th>Chain &amp; Action</th>
                </tr>
              </thead>
              <tbody>
                {SEER_SURFACES.map((surface, idx) => (
                  <tr
                    key={surface.id}
                    className="concept-a-ledger-row"
                    data-selected={selectedSurfaceIdx === idx}
                    onClick={() => {
                      setSelectedSurfaceIdx(idx);
                      if (surface.id !== 'home') onOpenSurfaceModal(surface);
                    }}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className="ef-badge ef-badge-violet">
                          <SurfaceGlyph id={surface.id} />
                          {surface.index}
                        </span>
                        <strong style={{ fontSize: '15px' }}>{surface.name}</strong>
                      </div>
                      <div className="ef-mono" style={{ fontSize: '11px', color: 'var(--ef-secondary-text)' }}>
                        {surface.roleTag} · {surface.liveUrl.replace('https://', '')}
                      </div>
                    </td>
                    <td style={{ color: 'var(--ef-text-secondary)' }}>{surface.whoAsks}</td>
                    <td style={{ color: 'var(--ef-text-secondary)' }}>{surface.whatIsPriced}</td>
                    <td>
                      <div style={{ color: 'var(--ef-text-primary)', marginBottom: '4px' }}>
                        {surface.howSignalIsUsed}
                      </div>
                      <div className="ef-mono" style={{ fontSize: '11px', color: 'var(--ef-sem-positive)' }}>
                        Authority: {surface.whoDecides}
                      </div>
                    </td>
                    <td>
                      <div className="ef-mono" style={{ fontSize: '11px', color: 'var(--ef-text-muted)', marginBottom: '8px' }}>
                        {surface.chain} ({surface.collateral})
                      </div>
                      <button
                        type="button"
                        className="ef-btn ef-btn-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (surface.id === 'home') {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          } else {
                            onOpenSurfaceModal(surface);
                          }
                        }}
                      >
                        {surface.id === 'home' ? 'Active Surface' : `Inspect ${surface.shortName} →`}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 4: FIG 0.4 MARKET PRIMITIVES & PROTOCOL SETTLEMENT STACK
          ==================================================================== */}
      <section className="ef-section" data-align="container">
        <div className="ef-container">
          <div className="ef-section-header">
            <div className="ef-section-title-group">
              <span className="ef-eyebrow">FIG 0.4 · PROTOCOL PRIMITIVES &amp; SETTLEMENT STACK</span>
              <h2 className="ef-h2">Five market structures on three verifiable settlement layers.</h2>
              <p className="ef-lead">
                Unlike binary-only platforms, Seer supports Categorical, Multi Categorical, Scalar, Multi Scalar, and
                Conditional markets, each wrapped into composable ERC20 tokens.
              </p>
            </div>
          </div>

          {/* 3 Settlement Layers */}
          <div className="ef-grid-3" style={{ marginBottom: '32px' }}>
            {PROTOCOL_STACK_LAYERS.map((layer) => (
              <div key={layer.step} className="ef-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="ef-badge ef-badge-violet">{layer.step}</span>
                  <a
                    href={layer.verifiedSource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ef-mono"
                    style={{ fontSize: '11px', color: 'var(--ef-secondary-text)', textDecoration: 'none' }}
                  >
                    Verified Spec ↗
                  </a>
                </div>
                <h3 className="ef-h3">{layer.title}</h3>
                <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--ef-secondary-text)' }}>
                  {layer.mechanism}
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ef-text-secondary)' }}>{layer.detail}</p>
              </div>
            ))}
          </div>

          {/* 5 Market Primitives (Fixing the duplicate Scalar/Multi-Scalar bug on live seer.pm) */}
          <div className="ef-card">
            <div className="ef-eyebrow" style={{ marginBottom: '16px' }}>
              MARKET TAXONOMY SPECIFICATION (CATEGORICAL · MULTI CATEGORICAL · SCALAR · MULTI SCALAR · CONDITIONAL)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              {MARKET_PRIMITIVES.map((prim) => (
                <div key={prim.code} className="ef-nested" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{prim.type}</strong>
                    <span className="ef-mono" style={{ fontSize: '11px', color: 'var(--ef-secondary-text)' }}>
                      {prim.code}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--ef-text-primary)' }}>{prim.definition}</div>
                  <div style={{ fontSize: '12px', color: 'var(--ef-text-secondary)' }}>
                    <strong>Settlement:</strong> {prim.payoutMechanic}
                  </div>
                  <div
                    className="ef-mono"
                    style={{
                      fontSize: '11px',
                      color: 'var(--ef-text-muted)',
                      marginTop: 'auto',
                      paddingTop: '8px',
                      borderTop: '1px solid var(--ef-hairline)',
                    }}
                  >
                    Surfaces: {prim.usedInSurfaces.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 5: FIG 0.5 2026 AGENTIC HORIZON & ROLE LAUNCHPAD
          ==================================================================== */}
      <section className="ef-section" data-align="container">
        <div className="ef-container">
          <div className="ef-section-header">
            <div className="ef-section-title-group">
              <span className="ef-eyebrow">FIG 0.5 · SEER 2026 AND BEYOND</span>
              <h2 className="ef-h2">Built for human governance today and the agentic economy ahead.</h2>
              <p className="ef-lead">
                We distinguish strictly between live mainnet capabilities, active 2026 cohorts, and announced protocol
                evolutions.
              </p>
            </div>
          </div>

          <div className="ef-grid-3">
            <div className="ef-card">
              <span className="ef-badge ef-badge-positive" style={{ marginBottom: '12px' }}>
                LIVE TODAY (MAINNET)
              </span>
              <h3 className="ef-h3" style={{ marginBottom: '8px' }}>
                2,947 Markets &amp; 5 Specialized Decision Apps
              </h3>
              <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--ef-text-secondary)' }}>
                Trade and inspect markets on Seer App, batch-forecast 98 Ethereum repositories on Deep (Optimism
                sUSDS), evaluate DAO proposals on Futarchy, triage 235 submissions on Opportunity Markets, and compare
                33 DeFi default probabilities on Risk Pricing.
              </p>
              <button
                type="button"
                className="ef-btn ef-btn-primary"
                onClick={() => onOpenSurfaceModal(SEER_SURFACES[1])}
              >
                Open Seer App Explorer →
              </button>
            </div>

            <div className="ef-card">
              <span className="ef-badge ef-badge-agent" style={{ marginBottom: '12px' }}>
                ACTIVE 2026 INITIATIVES
              </span>
              <h3 className="ef-h3" style={{ marginBottom: '8px' }}>
                AI Agent Batch Forecasting &amp; Triage Pilots
              </h3>
              <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--ef-text-secondary)' }}>
                On Deep, smart contract Trade Wallets allow AI agents and quant models to upload CSV weight vectors and
                rebalance across 98 repositories in one run. Opportunity Markets is actively running the Seer AI Job
                Board naming pilot (`0x8b3c...a5e8`).
              </p>
              <button
                type="button"
                className="ef-btn ef-btn-secondary"
                onClick={() => onOpenSurfaceModal(SEER_SURFACES[2])}
              >
                Inspect Deep Agent Workflow →
              </button>
            </div>

            <div className="ef-card">
              <span className="ef-badge ef-badge-warning" style={{ marginBottom: '12px' }}>
                ANNOUNCED NEXT STEPS
              </span>
              <h3 className="ef-h3" style={{ marginBottom: '8px' }}>
                Permissionless Opportunity Launch &amp; Q4 Risk Cohort
              </h3>
              <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--ef-text-secondary)' }}>
                Opportunity Markets transitions from Seer One closed-beta operation to permissionless launch so any
                sponsor can spin up a triage market. Risk Pricing prepares the Q4 2026 DeFi credit cohort alongside
                continued research into distilled human judgment.
              </p>
              <button
                type="button"
                className="ef-btn ef-btn-ghost"
                onClick={() => onOpenSurfaceModal(SEER_SURFACES[4])}
              >
                Inspect Opportunity Markets →
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
