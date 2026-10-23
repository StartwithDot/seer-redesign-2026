import { useRef, useState, type PointerEvent as ReactPointerEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { SignalFrame } from '../data/signalSeries';
import type { Market } from '../data/types';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface FieldPlotProps {
  market: Market;
  frame: SignalFrame;
  tick: number;
  pulse: number;
}

type PointerPoint = { x: number; y: number } | null;

const particles = Array.from({ length: 42 }, (_, index) => ({
  id: index,
  stream: index % 2 === 0 ? 'yes' : 'no',
  lane: index % 7,
  phase: (index * 0.618) % 1,
}));

export function FieldPlot({ market, frame, tick, pulse }: FieldPlotProps) {
  const reduced = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const [pointer, setPointer] = useState<PointerPoint>(null);

  const toSvgPoint = (event: ReactPointerEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: ((event.clientX - rect.left) / rect.width) * 920,
      y: ((event.clientY - rect.top) / rect.height) * 360,
    };
  };

  const onPointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (event.pointerType === 'mouse' || event.buttons > 0 || event.pressure > 0) setPointer(toSvgPoint(event));
  };

  const onPointerDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setPointer(toSvgPoint(event));
  };

  const releasePointer = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    setPointer(null);
  };

  const onKeyDown = (event: ReactKeyboardEvent<SVGSVGElement>) => {
    const movement = 18;
    const current = pointer ?? { x: 610, y: 180 };
    const updates: Record<string, PointerPoint> = {
      ArrowLeft: { x: current.x - movement, y: current.y },
      ArrowRight: { x: current.x + movement, y: current.y },
      ArrowUp: { x: current.x, y: current.y - movement },
      ArrowDown: { x: current.x, y: current.y + movement },
    };
    const next = updates[event.key];
    if (!next) return;
    event.preventDefault();
    setPointer({ x: Math.max(20, Math.min(900, next.x ?? current.x)), y: Math.max(20, Math.min(340, next.y ?? current.y)) });
  };

  return (
    <div className="field-plot">
      <svg
        ref={svgRef}
        viewBox="0 0 920 360"
        role="application"
        aria-label={`Interactive YES and NO probability field for ${market.proposal}. Move the pointer or use arrow keys to repel particles.`}
        tabIndex={0}
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        onPointerUp={releasePointer}
        onPointerCancel={releasePointer}
        onPointerLeave={releasePointer}
        onKeyDown={onKeyDown}
      >
        <defs>
          <linearGradient id={`field-yes-${market.id}`} x1="0" x2="1">
            <stop offset="0" stopColor="#6c47ff" stopOpacity=".08" />
            <stop offset="1" stopColor="#6c47ff" stopOpacity=".72" />
          </linearGradient>
          <linearGradient id={`field-no-${market.id}`} x1="0" x2="1">
            <stop offset="0" stopColor="#777783" stopOpacity=".06" />
            <stop offset="1" stopColor="#777783" stopOpacity=".58" />
          </linearGradient>
        </defs>

        <rect className="field-corridor" x="455" y="74" width="426" height="212" rx="18" />
        <line className="field-now" x1="455" y1="42" x2="455" y2="318" />
        <text className="field-label" x="438" y="31">NOW</text>
        <path className="field-thread is-yes" d="M30 180 C210 180 304 144 455 142 S702 110 878 104" fill="none" />
        <path className="field-thread is-no" d="M30 180 C210 180 304 216 455 218 S702 250 878 256" fill="none" />

        {(reduced ? [] : particles).map((particle) => {
          const t = (particle.phase + tick * 0.0022 + frame.index * 0.006) % 1;
          const x = 46 + t * 824;
          const fork = Math.max(0, (x - 455) / 423);
          const streamOffset = particle.stream === 'yes' ? -1 : 1;
          const laneOffset = (particle.lane - 3) * 5.5;
          const baseY = 180 + streamOffset * fork * (68 + Math.abs(frame.impact) * 9) + laneOffset;
          let dx = 0;
          let dy = 0;
          if (pointer) {
            const distanceX = x - pointer.x;
            const distanceY = baseY - pointer.y;
            const distance = Math.hypot(distanceX, distanceY);
            if (distance < 108 && distance > 0) {
              const force = (108 - distance) / 108;
              dx = (distanceX / distance) * force * 32;
              dy = (distanceY / distance) * force * 32;
            }
          }
          return (
            <circle
              key={particle.id}
              className={`field-particle is-${particle.stream}`}
              cx={x + dx}
              cy={baseY + dy}
              r={particle.id % 5 === 0 ? 4.2 : 2.8}
            />
          );
        })}

        <g className="field-gate">
          <rect x="690" y="52" width="178" height="58" rx="14" />
          <rect x="690" y="151" width="178" height="58" rx="14" />
          <rect x="690" y="250" width="178" height="58" rx="14" />
          <text x="714" y="87">INCLUDE</text>
          <text x="714" y="186">NEUTRAL</text>
          <text x="714" y="285">EXCLUDE</text>
        </g>

        {pointer && <circle className="field-repulsor" cx={pointer.x} cy={pointer.y} r="54" />}
        <circle key={pulse} className={`field-pulse${pulse ? ' is-pulsing' : ''}`} cx="455" cy="180" r="16" />
      </svg>
      <p>YES and NO streams remain within an uncertainty corridor before entering the Include, Neutral or Exclude gate.</p>
    </div>
  );
}
