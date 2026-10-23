import React, { useEffect } from 'react';
import { SeerSurface } from '../seerData';
import { SurfaceGlyph } from './BrandMarks';

interface SurfacePreviewModalProps {
  surface: SeerSurface | null;
  onClose: () => void;
}

export const SurfacePreviewModal: React.FC<SurfacePreviewModalProps> = ({ surface, onClose }) => {
  useEffect(() => {
    if (!surface) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [surface, onClose]);

  if (!surface) return null;

  return (
    <div
      className="ef-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="surface-modal-title"
      onClick={onClose}
    >
      <div className="ef-modal-card" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span className="ef-badge ef-badge-violet">
              <SurfaceGlyph id={surface.id} />
              SURFACE {surface.index}
            </span>
            <span className="ef-badge ef-badge-positive">{surface.status}</span>
            <span className="ef-mono" style={{ fontSize: '12px', color: 'var(--ef-text-muted)' }}>
              {surface.chain}
            </span>
          </div>
          <button
            type="button"
            className="ef-btn ef-btn-ghost"
            onClick={onClose}
            aria-label="Close surface preview dialog"
          >
            Close [Esc]
          </button>
        </div>

        <h2 id="surface-modal-title" className="ef-h2" style={{ marginBottom: '8px' }}>
          {surface.name}: {surface.roleTag}
        </h2>
        <p className="ef-lead" style={{ fontSize: '15px', marginBottom: '20px' }}>
          {surface.oneLineRole}
        </p>

        {/* Honest Stage 1 Notice */}
        <div
          className="ef-nested"
          style={{
            marginBottom: '20px',
            borderLeft: '3px solid var(--ef-primary)',
          }}
        >
          <div className="ef-eyebrow" style={{ marginBottom: '4px' }}>
            STAGE 1 APPROVAL GATE · HONEST ROUTE PLACEHOLDER
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--ef-text-secondary)' }}>
            Per Stage 1 rules, the five specialized application interfaces are scheduled for Phase 2 implementation
            after you select and approve one homepage direction. Below is the verified product architecture and live
            deployment link for <strong>{surface.name}</strong>.
          </p>
        </div>

        {/* Four Information Finance Pillars */}
        <div className="ef-grid-2" style={{ gap: '12px', marginBottom: '20px' }}>
          <div className="ef-nested">
            <div className="ef-eyebrow" style={{ marginBottom: '4px' }}>
              1. WHO ASKS THE QUESTION
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--ef-text-primary)' }}>{surface.whoAsks}</p>
          </div>
          <div className="ef-nested">
            <div className="ef-eyebrow" style={{ marginBottom: '4px' }}>
              2. WHAT THE MARKET PRICES
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--ef-text-primary)' }}>{surface.whatIsPriced}</p>
          </div>
          <div className="ef-nested">
            <div className="ef-eyebrow" style={{ marginBottom: '4px' }}>
              3. HOW THE SIGNAL IS USED
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--ef-text-primary)' }}>{surface.howSignalIsUsed}</p>
          </div>
          <div className="ef-nested">
            <div className="ef-eyebrow" style={{ marginBottom: '4px' }}>
              4. WHO RETAINS FINAL AUTHORITY
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--ef-text-primary)' }}>{surface.whoDecides}</p>
          </div>
        </div>

        {/* Audited Live Example */}
        <div className="ef-nested" style={{ marginBottom: '20px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap',
              marginBottom: '8px',
            }}
          >
            <span className="ef-eyebrow">AUDITED LIVE QUESTION ({surface.auditedExample.contextLabel})</span>
            <span className="ef-mono" style={{ fontSize: '12px', color: 'var(--ef-text-muted)' }}>
              Collateral: {surface.collateral}
            </span>
          </div>
          <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '12px' }}>
            {surface.auditedExample.question}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {surface.auditedExample.outcomes.map((o, idx) => (
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
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <a
            href={surface.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ef-btn ef-btn-primary"
          >
            Open Live Deployment ({surface.liveUrl.replace('https://', '')}) ↗
          </a>
          <button type="button" className="ef-btn ef-btn-secondary" onClick={onClose}>
            Return to Homepage Prototype
          </button>
        </div>
      </div>
    </div>
  );
};
