import React from 'react';
import { SurfaceId } from '../seerData';

/* Official Electric Foundation Lightning-S Hexagonal Mark + lowercase 'seer' wordmark
   Verified against poidh2/assets/ef_kit/dark-mode-board.webp & light-mode-board.webp */
export const SeerEfLogo: React.FC<{ showRavenBadge?: boolean }> = ({ showRavenBadge = false }) => {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Hexagonal-diamond EF mark with lightning-S negative space */}
        <path
          d="M16 2L28 9V23L16 30L4 23V9L16 2Z"
          fill="var(--ef-primary)"
        />
        <path
          d="M18.5 7.5L10.5 16.5H16.2L13.5 24.5L21.5 15.5H15.8L18.5 7.5Z"
          fill="#FFFFFF"
        />
      </svg>
      <span className="ef-brand-wordmark">seer</span>
      {showRavenBadge && (
        <span
          title="Seer Heritage Raven-Star Emblem"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '22px',
            height: '22px',
            borderRadius: '999px',
            backgroundColor: 'var(--ef-bg-nested)',
            border: '1px solid var(--ef-hairline)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="var(--ef-secondary-text)" strokeWidth="1.6" strokeDasharray="42 10" />
            <path d="M16.5 4.5L17.5 6.8L19.8 7.8L17.5 8.8L16.5 11.1L15.5 8.8L13.2 7.8L15.5 6.8L16.5 4.5Z" fill="var(--ef-primary)" />
            <path d="M8.5 15.5C8.5 11.5 11 9.5 14 9.5C12.5 11.5 13 14.5 15.5 16.5C12.5 16.5 10 16 8.5 15.5Z" fill="var(--ef-text-primary)" />
          </svg>
        </span>
      )}
    </span>
  );
};

/* Reversed Electric Foundation Line Motif (from poidh2/assets/x_post/c.png):
   ONE horizontal violet line enters from the LEFT and FANS OUT into 7 parallel lines to the RIGHT */
export const ReversedEfFanMotif: React.FC<{
  activeIndex?: number;
  height?: number;
  labels?: string[];
  onSelectBranch?: (idx: number) => void;
}> = ({ activeIndex = 2, height = 168, labels, onSelectBranch }) => {
  const branches = [
    { yEnd: 18, opacity: 0.42, stroke: 'var(--ef-line-outer)' },
    { yEnd: 42, opacity: 0.62, stroke: 'var(--ef-line-mid)' },
    { yEnd: 66, opacity: 0.84, stroke: 'var(--ef-line-core)' },
    { yEnd: 90, opacity: 1.0, stroke: 'var(--ef-primary)' },
    { yEnd: 114, opacity: 0.84, stroke: 'var(--ef-line-core)' },
    { yEnd: 138, opacity: 0.62, stroke: 'var(--ef-line-mid)' },
    { yEnd: 162, opacity: 0.42, stroke: 'var(--ef-line-outer)' },
  ];

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        width="100%"
        height={height}
        viewBox="0 0 800 180"
        preserveAspectRatio="none"
        role="img"
        aria-label="Reversed Electric Foundation line motif: one question entering from the left fans out into multiple parallel outcome signals on the right"
        style={{ display: 'block', overflow: 'visible' }}
      >
        {/* Single origin line entering from the left (y = 90) */}
        <path
          d="M 0 90 L 240 90"
          stroke="var(--ef-primary)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Origin node */}
        <circle cx="236" cy="90" r="6" fill="var(--ef-text-primary)" stroke="var(--ef-primary)" strokeWidth="3" />

        {/* Fanning out branches from x=236 to x=800 */}
        {branches.map((b, idx) => {
          const isSelected = activeIndex === idx;
          return (
            <g
              key={idx}
              onClick={() => onSelectBranch && onSelectBranch(idx)}
              style={{ cursor: onSelectBranch ? 'pointer' : 'default' }}
            >
              <path
                d={`M 236 90 C 340 90, 390 ${b.yEnd}, 500 ${b.yEnd} L 800 ${b.yEnd}`}
                fill="none"
                stroke={isSelected ? 'var(--ef-text-primary)' : b.stroke}
                strokeWidth={isSelected ? 4.2 : 3}
                strokeOpacity={isSelected ? 1 : b.opacity}
              />
              <circle
                cx="788"
                cy={b.yEnd}
                r={isSelected ? 5 : 3.5}
                fill={isSelected ? 'var(--ef-text-primary)' : 'var(--ef-primary)'}
              />
            </g>
          );
        })}
      </svg>

      {labels && labels.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            marginTop: '8px',
            justifyContent: 'space-between',
          }}
        >
          <span className="ef-mono" style={{ fontSize: '11px', color: 'var(--ef-text-muted)' }}>
            INPUT: 1 STRUCTURED QUESTION
          </span>
          <span className="ef-mono" style={{ fontSize: '11px', color: 'var(--ef-secondary-text)' }}>
            OUTPUT: {labels.length} PRICED OUTCOME SIGNALS →
          </span>
        </div>
      )}
    </div>
  );
};

export const SurfaceGlyph: React.FC<{ id: SurfaceId }> = ({ id }) => {
  switch (id) {
    case 'home':
      return (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M2 10H7L12 4H18M7 10H18M7 10L12 16H18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'explorer':
      return (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M13.5 13.5L17.5 17.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'deep':
      return (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <rect x="2.5" y="3.5" width="4" height="13" rx="1" stroke="currentColor" strokeWidth="1.6" />
          <rect x="8" y="6.5" width="4" height="10" rx="1" stroke="currentColor" strokeWidth="1.6" />
          <rect x="13.5" y="2.5" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case 'futarchy':
      return (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M2.5 10H8.5L14 4.5H17.5M8.5 10L14 15.5H17.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'opportunity':
      return (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M3 5H17M5.5 10H14.5M8 15H12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'risk':
      return (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M10 2.5L16.5 5.5V10.5C16.5 14.2 13.7 16.9 10 18C6.3 16.9 3.5 14.2 3.5 10.5V5.5L10 2.5Z" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );
  }
};
