import React, { useEffect, useRef } from 'react';

interface PointData {
  n: number;
  aspect: number;
  pivot: [number, number];
  pts: number[];
}

let cachedLogo: PointData | null = null;
let cachedBird: PointData | null = null;
let fetchPromise: Promise<[PointData, PointData]> | null = null;

function loadPointDatasets(): Promise<[PointData, PointData]> {
  if (cachedLogo && cachedBird) {
    return Promise.resolve([cachedLogo, cachedBird]);
  }
  if (!fetchPromise) {
    fetchPromise = Promise.all([
      fetch('/data/points_logo.json').then((r) => r.json()),
      fetch('/data/points_bird.json').then((r) => r.json()),
    ]).then(([logo, bird]) => {
      cachedLogo = logo;
      cachedBird = bird;
      return [logo, bird];
    });
  }
  return fetchPromise;
}

function hashSeed(n: number): number {
  let x = Math.imul(n ^ 61 ^ (n >>> 16), 9);
  x ^= x >>> 4;
  x = Math.imul(x, 0x27d4eb2d);
  return ((x ^ (x >>> 15)) >>> 0) / 4294967296;
}

export interface ParticleRavenProps {
  size?: number;
  morph?: number; // 0 = Raven-in-Circle + Star Logo, 1 = Flying Raven
  theme?: 'dark' | 'light';
  accentMode?: 'white-violet' | 'pure-white' | 'electric-violet';
  interactive?: boolean;
  className?: string;
}

export const ParticleRavenCanvas: React.FC<ParticleRavenProps> = ({
  size = 420,
  morph = 0,
  theme = 'dark',
  accentMode = 'white-violet',
  interactive = true,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let disposed = false;
    let animId = 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Precompute deterministic fallback points while JSON loads
    let count = 6500;
    let logoPts = new Float32Array(count * 3);
    let birdPts = new Float32Array(count * 3);
    let seeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const s1 = hashSeed(i + 1);
      const s2 = hashSeed(i * 7 + 3);
      seeds[i] = s1;
      const angle = s1 * Math.PI * 2;
      const rad = i < count * 0.35 ? 0.88 + (s2 - 0.5) * 0.04 : s2 * 0.68;
      logoPts[i * 3] = Math.cos(angle) * rad;
      logoPts[i * 3 + 1] = Math.sin(angle) * rad;
      logoPts[i * 3 + 2] = i < count * 0.35 ? 1 : 0;
      birdPts[i * 3] = Math.cos(angle) * rad * 0.8;
      birdPts[i * 3 + 1] = Math.sin(angle) * rad * 0.6;
      birdPts[i * 3 + 2] = s2;
    }

    loadPointDatasets()
      .then(([logo, bird]) => {
        if (disposed) return;
        const maxPts = Math.min(8500, logo.n, bird.n);
        count = maxPts;
        logoPts = new Float32Array(count * 3);
        birdPts = new Float32Array(count * 3);
        seeds = new Float32Array(count);
        for (let i = 0; i < count; i++) {
          logoPts[i * 3] = logo.pts[i * 3];
          logoPts[i * 3 + 1] = logo.pts[i * 3 + 1];
          logoPts[i * 3 + 2] = logo.pts[i * 3 + 2];
          birdPts[i * 3] = bird.pts[i * 3];
          birdPts[i * 3 + 1] = bird.pts[i * 3 + 1];
          birdPts[i * 3 + 2] = bird.pts[i * 3 + 2];
          seeds[i] = hashSeed(i + 11);
        }
      })
      .catch(() => {});

    const render = (now: number) => {
      if (disposed) return;
      const t = now * 0.001;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth || size;
      const h = canvas.clientHeight || size;

      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.5;
      const radius = Math.min(w, h) * 0.45;
      const m = Math.max(0, Math.min(1, morph));
      const flap = reducedMotion ? 0 : Math.sin(t * 5.2) * 0.22 * m;

      const isLight = theme === 'light';
      const ringCol =
        accentMode === 'pure-white'
          ? isLight
            ? '#17171C'
            : '#FFFFFF'
          : isLight
            ? '#6C2BD9'
            : '#B8A4FF';
      const bodyCol =
        accentMode === 'electric-violet'
          ? '#7A3CFF'
          : isLight
            ? '#17171C'
            : '#FFFFFF';
      const deepCol = isLight ? '#7A3CFF' : '#7B3FF2';

      const ptr = pointerRef.current;

      // Batch points into 3 depth/color layers for blazing 60fps canvas rendering
      const layers: Array<{ color: string; alpha: number; dotSize: number; filter: (z: number, wgt: number) => boolean }> = [
        {
          color: deepCol,
          alpha: isLight ? 0.45 : 0.52,
          dotSize: Math.max(1.1, w / 340),
          filter: (z, wgt) => wgt > 0.5 && z < 0.38,
        },
        {
          color: ringCol,
          alpha: isLight ? 0.78 : 0.82,
          dotSize: Math.max(1.35, w / 280),
          filter: (z, wgt) => (wgt > 0.5 && z >= 0.38) || (wgt <= 0.5 && z < 0.45),
        },
        {
          color: bodyCol,
          alpha: 0.98,
          dotSize: Math.max(1.65, w / 230),
          filter: (z, wgt) => wgt <= 0.5 && z >= 0.45,
        },
      ];

      for (let l = 0; l < layers.length; l++) {
        const layer = layers[l];
        ctx.fillStyle = layer.color;
        ctx.globalAlpha = layer.alpha;
        ctx.beginPath();
        const rDot = layer.dotSize;

        for (let i = 0; i < count; i++) {
          const sd = seeds[i];
          const wgt = logoPts[i * 3 + 2];
          if (!layer.filter(sd, wgt)) continue;

          const lx = logoPts[i * 3];
          const ly = logoPts[i * 3 + 1];

          let bx = birdPts[i * 3];
          let by = birdPts[i * 3 + 1];
          const bw = birdPts[i * 3 + 2];

          if (m > 0.001 && flap !== 0) {
            const side = bx < 0.02 ? 1 : -1;
            const ang = flap * bw * side;
            const cosA = Math.cos(ang);
            const sinA = Math.sin(ang);
            const dx = bx - 0.02;
            const dy = by + 0.08;
            bx = 0.02 + dx * cosA - dy * sinA;
            by = -0.08 + dx * sinA + dy * cosA;
          }

          const nx = lx + (bx - lx) * m;
          const ny = ly + (by - ly) * m;

          // Coherent 3D depth wave + subtle curl breathing
          const depthZ = 0.5 + 0.5 * Math.sin(nx * 2.4 + ny * 1.6);
          const driftX = reducedMotion
            ? 0
            : Math.sin(t * (0.55 + sd * 0.4) + sd * 6.28 + ny * 3.2) * (1.2 + depthZ * 1.8);
          const driftY = reducedMotion
            ? 0
            : Math.cos(t * (0.48 + sd * 0.35) + sd * 6.28 + nx * 3.2) * (1.2 + depthZ * 1.8);

          let px = cx + nx * radius + driftX;
          let py = cy - ny * radius + driftY;

          // Interactive cursor repulsion wake
          if (interactive && ptr.active) {
            const ddx = px - ptr.x;
            const ddy = py - ptr.y;
            const distSq = ddx * ddx + ddy * ddy;
            const repelR = 76;
            if (distSq < repelR * repelR && distSq > 0.1) {
              const dist = Math.sqrt(distSq);
              const push = ((repelR - dist) / repelR) * 16;
              px += (ddx / dist) * push;
              py += (ddy / dist) * push;
            }
          }

          ctx.rect(px - rDot * 0.5, py - rDot * 0.5, rDot, rDot);
        }
        ctx.fill();
      }

      ctx.restore();

      if (!reducedMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    render(0);
    if (!reducedMotion) {
      animId = requestAnimationFrame(render);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(animId);
    };
  }, [size, morph, theme, accentMode, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        maxWidth: '100%',
        display: 'block',
        cursor: interactive ? 'crosshair' : 'default',
      }}
      onPointerMove={(e) => {
        if (!interactive) return;
        const rect = e.currentTarget.getBoundingClientRect();
        pointerRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          active: true,
        };
      }}
      onPointerLeave={() => {
        pointerRef.current.active = false;
      }}
      role="img"
      aria-label="Seer Raven-in-Circle and four-point star emblem rendered in 15,000 depth-layered particles"
    />
  );
};
