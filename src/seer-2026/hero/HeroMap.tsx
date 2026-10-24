import { useEffect, useRef, useState } from 'react';
import './HeroMap.css';

/* Concept 3: the weather map of the future. Every forecast is a pressure system on a living contour map:
   the higher the price, the taller the peak. Hover or tab to read who asked, what is priced, how to use it. */

const logo = new URL('../../../assets/brand/logo.svg', import.meta.url).href;

type Peak = { id: string; label: string; v: number; x: number; y: number; sx: number; sy: number; who: string; prices: string; read: string; vol: string; d: number };
const PEAKS0: Peak[] = [
  { id: 'ai', label: 'AI regulation', v: 71, x: 0.5, y: 0.25, sx: 0.12, sy: 0.17, who: 'A DAO asks', prices: 'the chance of meaningful U.S. federal AI regulation in 2026', read: 'Policy teams plan around it. No trade needed.', vol: '$412K', d: 4 },
  { id: 'rate', label: 'Rate cut', v: 62, x: 0.8, y: 0.3, sx: 0.12, sy: 0.17, who: 'A treasury asks', prices: 'the chance the Fed cuts rates in December', read: 'Compare it with other risks before moving collateral.', vol: '$1.2M', d: -2 },
  { id: 'eth', label: 'ETH above $5k', v: 39, x: 0.6, y: 0.78, sx: 0.12, sy: 0.16, who: 'A person asks', prices: 'the chance ETH trades above $5,000 this year', read: 'Read the odds. Trading is optional.', vol: '$880K', d: 3 },
  { id: 'elec', label: 'Election shift', v: 54, x: 0.88, y: 0.64, sx: 0.1, sy: 0.15, who: 'An AI agent asks', prices: 'the chance control of the chamber changes hands', read: 'People and agents read the same price.', vol: '$2.4M', d: 1 },
];
const MODES = ['Chance', 'Change', 'Capital'] as const;

export function HeroMap() {
  const host = useRef<HTMLElement>(null), cv = useRef<HTMLCanvasElement>(null);
  const peaks = useRef<Peak[]>(PEAKS0.map((p) => ({ ...p })));
  const [active, setActive] = useState(0); const [mode, setMode] = useState<(typeof MODES)[number]>('Chance');
  const [, force] = useState(0); const hover = useRef(false);

  useEffect(() => {
    const el = host.current, canvas = cv.current; if (!el || !canvas) return;
    const ctx = canvas.getContext('2d')!; const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, raf = 0, visible = true; const t0 = performance.now() / 1000;
    const size = () => { W = el.clientWidth; H = el.clientHeight; canvas.width = W * dpr; canvas.height = H * dpr; canvas.style.width = `${W}px`; canvas.style.height = `${H}px`; };
    size(); const ro = new ResizeObserver(size); ro.observe(el);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(el);
    const GX = 130, GY = 82; const field = new Float32Array((GX + 1) * (GY + 1));
    const levels = Array.from({ length: 13 }, (_, i) => 0.08 + i * 0.065);
    const edgePt = (e: number, i: number, j: number, a: number, b: number, c: number, d: number, L: number): [number, number] => {
      if (e === 0) return [i + (L - a) / (b - a), j]; if (e === 1) return [i + 1, j + (L - b) / (c - b)];
      if (e === 2) return [i + (L - d) / (c - d), j + 1]; return [i, j + (L - a) / (d - a)];
    };
    const SEG: number[][] = [[], [3, 2], [1, 2], [3, 1], [0, 1], [0, 3, 1, 2], [0, 2], [0, 3], [0, 3], [0, 2], [0, 1, 2, 3], [0, 1], [3, 1], [1, 2], [3, 2], []];
    let tick = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame); if (!visible) return;
      const now = reduce ? 4 : performance.now() / 1000 - t0, aspect = W / H; tick++;
      const ps = peaks.current;
      for (let j = 0; j <= GY; j++) for (let i = 0; i <= GX; i++) {
        const x = i / GX, y = j / GY; let f = 0;
        ps.forEach((p, k) => {
          const px = p.x + Math.sin(now * 0.11 + k * 2) * 0.012, py = p.y + Math.cos(now * 0.09 + k) * 0.014;
          const dx = (x - px) * aspect, dy = y - py, a = (p.v / 100) * 1.05;
          f += a * Math.exp(-((dx * dx) / (2 * (p.sx * aspect * 0.7) ** 2) + (dy * dy) / (2 * p.sy ** 2)));
        });
        f += 0.05 * (Math.sin(x * 9 + now * 0.16) + Math.cos(y * 11 - now * 0.13)) + 0.03 * Math.sin((x + y) * 17 + now * 0.1);
        field[j * (GX + 1) + i] = f;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      ps.forEach((p) => { const r = W * 0.26, x = p.x * W, y = p.y * H; const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgba(123,63,242,${0.34 * (p.v / 100) + 0.08})`); g.addColorStop(0.45, 'rgba(75,59,255,.10)'); g.addColorStop(1, 'rgba(75,59,255,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); });
      ctx.globalCompositeOperation = 'source-over';
      const sx = W / GX, sy = H / GY;
      levels.forEach((L, li) => {
        ctx.beginPath();
        for (let j = 0; j < GY; j++) for (let i = 0; i < GX; i++) {
          const a = field[j * (GX + 1) + i], b = field[j * (GX + 1) + i + 1], c = field[(j + 1) * (GX + 1) + i + 1], d = field[(j + 1) * (GX + 1) + i];
          const cs = (a >= L ? 8 : 0) | (b >= L ? 4 : 0) | (c >= L ? 2 : 0) | (d >= L ? 1 : 0); const s = SEG[cs];
          for (let k = 0; k < s.length; k += 2) { const p1 = edgePt(s[k], i, j, a, b, c, d, L), p2 = edgePt(s[k + 1], i, j, a, b, c, d, L); ctx.moveTo(p1[0] * sx, p1[1] * sy); ctx.lineTo(p2[0] * sx, p2[1] * sy); }
        }
        ctx.strokeStyle = `rgba(196,182,255,${0.1 + li * 0.045})`; ctx.lineWidth = li % 3 === 0 ? 1.1 : 0.7; ctx.stroke();
      });
      if (tick % 150 === 0 && !reduce) { ps.forEach((p, k) => { const n = Math.round(Math.max(5, Math.min(95, p.v + (Math.random() - 0.5) * 4))); p.d = n - PEAKS0[k].v; p.v = n; }); force((x) => x + 1); }
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, []);

  useEffect(() => { if (hover.current) return; const id = window.setInterval(() => { if (!hover.current) setActive((a) => (a + 1) % PEAKS0.length); }, 5200); return () => clearInterval(id); }, []);
  const val = (p: Peak) => mode === 'Chance' ? `${p.v}%` : mode === 'Change' ? `${p.d >= 0 ? '+' : '−'}${Math.abs(p.d)} pts` : p.vol;
  const cur = peaks.current[active];

  return (
    <section className="hm" ref={host} aria-labelledby="hm-title">
      <canvas ref={cv} aria-hidden="true" />
      <header className="hm-nav">
        <a href="#seer-top" aria-label="Seer home"><img src={logo} alt="Seer" width="112" height="52" /></a>
        <nav aria-label="Primary"><a href="https://app.seer.pm/">Apps</a><a className="hm-wallet" href="https://app.seer.pm/">Connect Wallet</a></nav>
      </header>
      <div className="hm-copy">
        <h1 id="hm-title">The weather map of the <em>future.</em></h1>
        <p>Seer is Information Finance. People, DAOs and AI agents ask the questions that matter, and traders price every answer, live.</p>
        <div className="hm-cta"><a className="hm-primary" href="https://app.seer.pm/">Explore Markets</a><a className="hm-link" href="#information-finance">How it works</a></div>
      </div>
      {peaks.current.map((p, i) => (
        <button key={p.id} className={`hm-pin ${i === active ? 'is-on' : ''}`} style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
          onMouseEnter={() => { hover.current = true; setActive(i); }} onMouseLeave={() => { hover.current = false; }} onFocus={() => setActive(i)} aria-label={`${p.label}, ${p.v} percent`}>
          <i /><span><b>{p.label}</b><em>{val(p)}</em></span>
        </button>
      ))}
      <aside className="hm-card" key={cur.id} aria-live="polite">
        <div className="hm-card-top"><span>{cur.who}</span><b>{cur.v}%</b></div>
        <h2>{cur.label}</h2>
        <dl><dt>Prices</dt><dd>{cur.prices}</dd><dt>How to use it</dt><dd>{cur.read}</dd></dl>
        <a href="https://app.seer.pm/">Open market <span aria-hidden="true">→</span></a>
      </aside>
      <div className="hm-modes" role="tablist" aria-label="Map layer">{MODES.map((m) => <button key={m} role="tab" aria-selected={m === mode} className={m === mode ? 'is-on' : ''} onClick={() => setMode(m)}>{m}</button>)}</div>
    </section>
  );
}
