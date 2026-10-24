import { useEffect, useMemo, useRef, useState } from 'react';
import './HeroBoard.css';

/* Concept 1: the departures board. Real questions about tomorrow, each with a price, on a split-flap board.
   Flaps rattle as odds move and questions rotate. Colour: EF near-black board, violet digits, white page. */

const logo = new URL('../../../assets/brand/logo.svg', import.meta.url).href;
const SET = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-+%▲▼';

type Q = { q: string; who: string; p: number; read: string };
const POOL: Q[] = [
  { q: 'FED CUTS IN DECEMBER', who: 'TREASURY', p: 62, read: 'A treasury asks. The price is the chance the Fed cuts. Read it before moving collateral; trading is optional.' },
  { q: 'AI REGULATION BILL PASSES', who: 'DAO', p: 71, read: 'A DAO asks. The price is the chance the bill passes. Policy teams can plan around it.' },
  { q: 'ETH ETF INFLOWS POSITIVE', who: 'AI AGENT', p: 58, read: 'An AI agent asks. The price is the chance flows stay positive next month. Agents and people read the same number.' },
  { q: 'GRANTS ROUND GETS FUNDED', who: 'DAO', p: 64, read: 'A DAO asks. The price is the chance the round is funded. The DAO still votes.' },
  { q: 'GPT-6 RELEASES IN 2026', who: 'FUNDER', p: 64, read: 'A funder asks. The price is the chance of release this year. Use it to time the next call for proposals.' },
  { q: 'STABLECOIN LOSES ITS PEG', who: 'TREASURY', p: 9, read: 'A treasury asks. The price is the chance of a depeg this year. Compare it side by side across assets.' },
  { q: 'REPO RANKS MOST ORIGINAL', who: 'AI AGENT', p: 24, read: 'An AI agent asks. The price is the chance a repository is ranked most original. Reviewers start from the top few.' },
  { q: 'PROPOSAL PASSES SNAPSHOT', who: 'DAO', p: 77, read: 'A DAO asks. The price is the chance the vote passes. Members read it, then vote.' },
  { q: 'US TARIFFS ON CHINA RISE', who: 'PERSON', p: 37, read: 'A person asks. The price is the chance tariffs rise. Read it; no trade needed.' },
  { q: 'PROTOCOL SURVIVES 12 MONTHS', who: 'TREASURY', p: 91, read: 'A treasury asks. The price is the chance the protocol is still solvent in a year.' },
];
const ROWS = 5, QW = 27, WW = 8;

function Flap({ ch, delay = 0 }: { ch: string; delay?: number }) {
  const [cur, setCur] = useState(' '); const [prev, setPrev] = useState(' '); const [tick, setTick] = useState(0);
  const target = useRef(ch); target.current = ch; const busy = useRef(false);
  useEffect(() => {
    if (busy.current) return; busy.current = true;
    let alive = true; let i = Math.max(0, SET.indexOf(cur)); let c = cur;
    const run = () => {
      if (!alive) return;
      const t = target.current;
      if (c === t) { busy.current = false; return; }
      i = (i + 1) % SET.length; const n = SET[i]; setPrev(c); setCur(n); setTick((x) => x + 1); c = n;
      window.setTimeout(run, 58);
    };
    const id = window.setTimeout(run, delay); return () => { alive = false; clearTimeout(id); busy.current = false; };
  }, [ch]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <span className="fl" aria-hidden="true">
      <span className="fl-h fl-t"><i>{cur}</i></span>
      <span className="fl-h fl-b"><i>{tick ? prev : cur}</i></span>
      {tick > 0 && <span key={`t${tick}`} className="fl-h fl-t fl-tf"><i>{prev}</i></span>}
      {tick > 0 && <span key={`b${tick}`} className="fl-h fl-b fl-bf"><i>{cur}</i></span>}
    </span>
  );
}

const pad = (s: string, n: number) => (s + ' '.repeat(n)).slice(0, n).split('');

export function HeroBoard() {
  const [rows, setRows] = useState<{ q: Q; d: number }[]>(() => POOL.slice(0, ROWS).map((q) => ({ q, d: 0 })));
  const [caption, setCaption] = useState(POOL[0].read);
  const hold = useRef(false); const n = useRef(ROWS);
  const reduce = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduce) return;
    let a = window.setInterval(() => {
      setRows((rs) => { const k = Math.floor(Math.random() * rs.length); const dlt = (Math.random() < 0.55 ? 1 : -1) * (1 + Math.floor(Math.random() * 6));
        return rs.map((r, i) => i === k ? { q: { ...r.q, p: Math.max(4, Math.min(95, r.q.p + dlt)) }, d: dlt } : r); });
    }, 3300);
    let b = window.setInterval(() => {
      setRows((rs) => { const k = Math.floor(Math.random() * rs.length); const nxt = POOL[n.current++ % POOL.length];
        if (rs.some((r) => r.q.q === nxt.q)) return rs; return rs.map((r, i) => i === k ? { q: nxt, d: 0 } : r); });
    }, 9500);
    return () => { clearInterval(a); clearInterval(b); };
  }, [reduce]);

  return (
    <section className="hb" ref={root} aria-labelledby="hb-title">
      <header className="hb-nav">
        <a href="#seer-top" aria-label="Seer home"><img src={logo} alt="Seer" width="112" height="52" /></a>
        <nav aria-label="Primary"><a href="https://app.seer.pm/">Apps</a><a className="hb-wallet" href="https://app.seer.pm/">Connect Wallet</a></nav>
      </header>
      <div className="hb-head">
        <h1 id="hb-title">Tomorrow, <em>priced</em> today.</h1>
        <p>Seer is Information Finance. People, DAOs and AI agents ask real questions, and traders price every answer.</p>
        <div className="hb-cta"><a className="hb-primary" href="https://app.seer.pm/">Explore Markets</a><a className="hb-link" href="#information-finance">How it works</a></div>
      </div>
      <div className="hb-board" role="table" aria-label="Live questions and their prices">
        <div className="hb-frame">
          <div className="hb-cols" aria-hidden="true"><span>QUESTION</span><span>ASKED BY</span><span>PRICE</span><span>CHANGE</span></div>
          {rows.map(({ q, d }, ri) => (
            <div className="hb-row" role="row" tabIndex={0} key={ri} onMouseEnter={() => { hold.current = true; setCaption(q.read); }} onFocus={() => setCaption(q.read)} onMouseLeave={() => { hold.current = false; }}>
              <span className="hb-grp hb-q">{pad(q.q, QW).map((c, i) => <Flap key={i} ch={c} delay={ri * 120 + i * 14} />)}</span>
              <span className="hb-grp hb-w">{pad(q.who, WW).map((c, i) => <Flap key={i} ch={c} delay={ri * 120 + 200 + i * 16} />)}</span>
              <span className="hb-grp hb-p">{pad(String(q.p), 2).map((c, i) => <Flap key={i} ch={c} delay={ri * 120 + 500 + i * 60} />)}<span className="hb-sym"><Flap ch="%" delay={ri * 120 + 600} /></span></span>
              <span className="hb-grp hb-c">{pad(d === 0 ? '' : `${d > 0 ? '▲' : '▼'}${Math.abs(d)}`, 3).map((c, i) => <Flap key={i} ch={c} delay={ri * 120 + 700 + i * 50} />)}</span>
            </div>
          ))}
        </div>
        <div className="hb-stand" aria-hidden="true" />
      </div>
      <p className="hb-caption" aria-live="polite">{caption}</p>
    </section>
  );
}
