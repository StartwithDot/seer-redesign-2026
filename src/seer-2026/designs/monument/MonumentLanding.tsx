import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { Clouds } from './Clouds';
import './monument.css';

gsap.registerPlugin(ScrollTrigger);

/* The Monument. One architectural object stands for the protocol; the page is a walk through it, day to dusk to night,
   under a sky that keeps moving. Type = Instrument Serif (display) + Inter Tight (UI), the same everywhere. */

const logo = new URL('../../../../assets/brand/logo.svg', import.meta.url).href;
const IMG = { day: '/img/monument/hero-day.webp', dusk: '/img/monument/hero-dusk.webp', macro: '/img/monument/macro.webp', object: '/img/monument/object.webp', kleros: '/img/kleros-logo.png', klerosPic: '/img/monument/kleros.webp' };
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const SEER = 'https://app.seer.pm/';
const SKY_DAY = { shade: [0.5, 0.58, 0.8] as [number, number, number], lit: [1, 1, 1] as [number, number, number] };
const SKY_DUSK = { shade: [0.27, 0.22, 0.42] as [number, number, number], lit: [1, 0.72, 0.64] as [number, number, number] };
const SKY_NIGHT = { shade: [0.1, 0.09, 0.17] as [number, number, number], lit: [0.46, 0.4, 0.72] as [number, number, number] };

type App = { name: string; ask: string; prices: string; use: string; href: string; pic: string; z: { cx: number; cy: number; s: number } };
const APPS: App[] = [
  { name: 'Seer App', ask: 'Anyone: a person, a DAO, an agent.', prices: 'Every outcome, across every market type.', use: 'Find a market, read the odds, trade if you want to.', href: SEER, pic: '/img/monument/p-seer.webp', z: { cx: 0.5, cy: 0.5, s: 1 } },
  { name: 'Deep', ask: 'A funder with a large field to judge.', prices: 'How reviewers will judge each candidate, outcome by outcome.', use: 'Rank the field. People and agents read the same prices.', href: SEER, pic: '/img/monument/p-deep.webp', z: { cx: 0.59, cy: 0.38, s: 1.7 } },
  { name: 'Futarchy', ask: 'A DAO deciding on a proposal.', prices: 'The token if the proposal passes, against the token if it fails.', use: 'Read the gap before you vote. The DAO still decides.', href: SEER, pic: '/img/monument/p-futarchy.webp', z: { cx: 0.37, cy: 0.56, s: 1.55 } },
  { name: 'Opportunity Markets', ask: 'A sponsor with many submissions.', prices: 'Which submissions will be selected.', use: 'Shortlist by odds. Reviewers keep the final say.', href: 'https://opportunity.seer.pm/', pic: '/img/monument/p-opportunity.webp', z: { cx: 0.57, cy: 0.86, s: 1.9 } },
  { name: 'Risk Pricing', ask: 'A treasury moving collateral.', prices: 'The risk of several protocols, side by side.', use: 'Compare them before you move anything.', href: SEER, pic: '/img/monument/p-risk.webp', z: { cx: 0.8, cy: 0.7, s: 1.65 } },
];
const STEPS = [
  { w: 'Ask', t: 'Someone needs an answer: a person, a DAO, a treasury, an agent. They write the question.' },
  { w: 'Price', t: 'Traders put capital behind every outcome. The price is the crowd’s best estimate.' },
  { w: 'Read', t: 'The signal is open to everyone. Use it to decide; trading is optional.' },
];

/* smooth, watery scroll */
function useSmooth() {
  useEffect(() => {
    if (reduced()) return;
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9, touchMultiplier: 1.15, anchors: true });
    gsap.ticker.lagSmoothing(0);
    const tick = (t: number) => lenis.raf(t * 1000);
    lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); };
  }, []);
}

function useMagnetic(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current; if (!el || reduced() || window.matchMedia('(hover: none)').matches) return;
    const qx = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' }), qy = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
    const mv = (e: PointerEvent) => { const r = el.getBoundingClientRect(); qx((e.clientX - (r.left + r.width / 2)) * 0.28); qy((e.clientY - (r.top + r.height / 2)) * 0.34); };
    const out = () => { qx(0); qy(0); };
    el.addEventListener('pointermove', mv); el.addEventListener('pointerleave', out);
    return () => { el.removeEventListener('pointermove', mv); el.removeEventListener('pointerleave', out); };
  }, [ref]);
}

function Nav({ dark }: { dark: boolean }) {
  const el = useRef<HTMLElement>(null);
  useEffect(() => {
    const on = () => el.current?.classList.toggle('is-solid', window.scrollY > 48);
    on(); window.addEventListener('scroll', on, { passive: true }); return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <header className={`mn-nav ${dark ? 'is-dark' : ''}`} ref={el}>
      <span className="mn-nav-bg" aria-hidden="true" /><span className="mn-nav-bg mn-nav-bg--dark" aria-hidden="true" />
      <a href="#mn-top" aria-label="Seer home"><img src={logo} alt="Seer" width="112" height="52" /></a>
      <nav aria-label="Primary"><a href="#surfaces">Apps</a><a className="mn-wallet" href={SEER}>Connect Wallet</a></nav>
    </header>
  );
}

/* headline that breathes in the wind and bends away from the pointer */
function WindText({ lines }: { lines: { t: string; em?: boolean }[] }) {
  const root = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (reduced()) return;
    const chars = Array.from(root.current?.querySelectorAll<HTMLElement>('.wc') ?? []);
    let gust = 0, mx = -1e4, my = -1e4, lx = 0, ly = 0, raf = 0, pos: [number, number][] = [];
    const measure = () => { pos = chars.map((c) => { const r = c.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }); };
    const mv = (e: PointerEvent) => { gust = Math.min(1, gust + Math.hypot(e.clientX - lx, e.clientY - ly) / 140); lx = e.clientX; ly = e.clientY; mx = e.clientX; my = e.clientY; };
    window.addEventListener('pointermove', mv, { passive: true }); window.addEventListener('resize', measure);
    const t0 = window.setTimeout(measure, 1900), iv = window.setInterval(measure, 2500);
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop); const s = t / 1000; gust *= 0.962;
      for (let i = 0; i < chars.length; i++) {
        const p = pos[i]; if (!p) continue; const ph = p[0] * 0.011 + p[1] * 0.007;
        const y = Math.sin(s * 0.85 + ph) * 1.3 + Math.sin(s * 2.2 + ph * 1.8) * gust * 2.6;
        const sk = Math.sin(s * 0.7 + ph + 1.3) * 0.5 + gust * Math.sin(s * 3 + ph) * 1.3;
        const dx = p[0] - mx, dy = p[1] - my, d = Math.hypot(dx, dy) || 1, push = Math.max(0, 1 - d / 240);
        chars[i].style.transform = `translate3d(${((dx / d) * push * 8).toFixed(2)}px,${(y + (dy / d) * push * 5).toFixed(2)}px,0) skewX(${(sk + push * (dx > 0 ? 2.4 : -2.4)).toFixed(2)}deg)`;
      }
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); clearTimeout(t0); clearInterval(iv); window.removeEventListener('pointermove', mv); window.removeEventListener('resize', measure); };
  }, []);
  return (
    <h1 id="mn-title" className="mn-h1" ref={root} aria-label={lines.map((l) => l.t).join(' ')}>
      {lines.map((l) => (
        <span className="mask" key={l.t} aria-hidden="true"><span className="ln">{l.em ? <em>{l.t.split('').map((c, i) => <span className="wc" key={i}>{c === ' ' ? ' ' : c}</span>)}</em> : l.t.split('').map((c, i) => <span className="wc" key={i}>{c}</span>)}</span></span>
      ))}
    </h1>
  );
}

function Hero() {
  const root = useRef<HTMLElement>(null), art = useRef<HTMLDivElement>(null), stage = useRef<HTMLDivElement>(null), cta = useRef<HTMLAnchorElement>(null);
  useMagnetic(cta);
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (reduced()) return;
      gsap.from('.mn-h1 .ln', { yPercent: 112, duration: 1.3, ease: 'power4.out', stagger: 0.1, delay: 0.2 });
      gsap.from('.mn-hero-copy .fade', { y: 24, opacity: 0, filter: 'blur(6px)', duration: 1, ease: 'power3.out', stagger: 0.1, delay: 0.9 });
      gsap.fromTo(art.current, { scale: 1.14 }, { scale: 1, duration: 2.8, ease: 'power3.out' });
      gsap.to(stage.current, { yPercent: 9, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.8 } });
      const qx = gsap.quickTo(art.current, 'x', { duration: 1.4, ease: 'power3' }), qy = gsap.quickTo(art.current, 'y', { duration: 1.4, ease: 'power3' });
      const mv = (e: PointerEvent) => { qx((e.clientX / window.innerWidth - 0.5) * -22); qy((e.clientY / window.innerHeight - 0.5) * -14); };
      window.addEventListener('pointermove', mv, { passive: true }); return () => window.removeEventListener('pointermove', mv);
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section className="mn-hero" ref={root} id="mn-top" aria-labelledby="mn-title">
      <div className="mn-stage" ref={stage}>
        <div className="mn-art" ref={art}>
          <img src={IMG.day} alt="" fetchPriority="high" decoding="async" />
          <Clouds className="mn-clouds" {...SKY_DAY} cover={0.34} alpha={1} speed={1} />
          <i className="mn-shimmer" aria-hidden="true" /><i className="mn-floorlight" aria-hidden="true" /><i className="mn-cshadow" aria-hidden="true" />
        </div>
        <div className="mn-veil" aria-hidden="true" />
      </div>
      <div className="mn-hero-copy">
        <WindText lines={[{ t: 'Where' }, { t: 'information' }, { t: 'becomes' }, { t: 'a market.', em: true }]} />
        <p className="fade">Seer is Information Finance. People, DAOs and AI agents ask the questions that matter, and traders price every answer.</p>
        <div className="mn-cta fade"><a className="mn-primary" ref={cta} href={SEER}>Explore Markets</a><a className="mn-link" href="#statement">How it works</a></div>
      </div>
    </section>
  );
}

function Statement() {
  const root = useRef<HTMLElement>(null);
  const words = 'Markets turn what people know into prices anyone can read.'.split(' ');
  const cap = 'A question, refracted into a price.'.split(' ');
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (reduced()) { gsap.set('.mn-w', { opacity: 1 }); return; }
      gsap.fromTo('.mn-w', { opacity: 0.12, filter: 'blur(5px)', yPercent: 12 }, { opacity: 1, filter: 'blur(0px)', yPercent: 0, ease: 'none', stagger: 0.12, scrollTrigger: { trigger: '.mn-statement-text', start: 'top 80%', end: 'bottom 52%', scrub: 0.7 } });
      gsap.fromTo('.mn-macro', { clipPath: 'inset(16% 12% 16% 12% round 36px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: { trigger: '.mn-macro', start: 'top 92%', end: 'top 12%', scrub: 0.7 } });
      gsap.fromTo('.mn-macro img', { scale: 1.3, yPercent: -4 }, { scale: 1, yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.mn-macro', start: 'top 92%', end: 'bottom 10%', scrub: 0.7 } });
      const tl = gsap.timeline({ scrollTrigger: { trigger: '.mn-macro', start: 'top 46%', end: 'top -8%', scrub: 0.7 } });
      tl.fromTo('.mn-capline', { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: 0.6 }, 0)
        .fromTo('.mn-capw', { yPercent: 118, opacity: 0, filter: 'blur(8px)' }, { yPercent: 0, opacity: 1, filter: 'blur(0px)', ease: 'none', stagger: 0.12, duration: 0.9 }, 0.15)
        .fromTo('.mn-macro figcaption', { yPercent: 40 }, { yPercent: -10, ease: 'none', duration: 1.2 }, 0);
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section className="mn-statement" id="statement" ref={root}>
      <Clouds className="mn-st-sky" {...SKY_DAY} cover={0.46} alpha={0.9} speed={0.7} />
      <p className="mn-statement-text">{words.map((w, i) => <span key={i} className="mn-w">{w} </span>)}</p>
      <p className="mn-sub">A person asks. Traders price every outcome. Anyone reads the signal, and nobody has to trade to use it.</p>
      <figure className="mn-macro">
        <img src={IMG.macro} alt="Light refracting through the violet glass blade onto plaster." loading="lazy" decoding="async" />
        <figcaption><i className="mn-capline" />{cap.map((w, i) => <span className="mask mn-capm" key={i}><span className="mn-capw">{w}&nbsp;</span></span>)}</figcaption>
      </figure>
    </section>
  );
}

function Surfaces() {
  const sec = useRef<HTMLElement>(null), detail = useRef<HTMLDivElement>(null), frame = useRef<HTMLDivElement>(null);
  const pics = useRef<(HTMLImageElement | null)[]>([]); const [i, setI] = useState(0); const trig = useRef<ScrollTrigger | null>(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px) and (min-height: 620px)', () => {
      const n = APPS.length, imgs = pics.current.filter(Boolean) as HTMLImageElement[];
      gsap.set(imgs, { clipPath: 'inset(0% 0% 0% 100%)', scale: 1.1, zIndex: (k: number) => k + 1 });
      gsap.set(imgs[0], { clipPath: 'inset(0% 0% 0% 0%)', scale: 1 });
      const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
        trigger: sec.current, start: 'top top', end: `+=${n * 75}%`, pin: true, scrub: 1,
        onUpdate: (self) => setI(Math.min(n - 1, Math.floor(self.progress * (n - 1) + 0.5))),
      } });
      tl.to({}, { duration: 0.35 });
      for (let k = 1; k < n; k++) {
        tl.to(imgs[k], { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1 }, '>')
          .to(imgs[k - 1], { scale: 0.94, duration: 1 }, '<')
          .to({}, { duration: 0.35 });
      }
      trig.current = tl.scrollTrigger ?? null;
      return () => { tl.scrollTrigger?.kill(); tl.kill(); trig.current = null; gsap.set(imgs, { clearProps: 'all' }); };
    });
    return () => mm.revert();
  }, []);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.mn-row-in', { yPercent: 115, opacity: 0, filter: 'blur(8px)' }, { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'power4.out', stagger: 0.1 });
      gsap.fromTo('.mn-detail .mn-open', { opacity: 0, y: 16, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out', delay: 0.38 });
    }, detail);
    return () => ctx.revert();
  }, [i]);
  const go = (k: number) => { const st = trig.current; if (!st) { setI(k); return; } const t = st.start + (k / (APPS.length - 1)) * (st.end - st.start); window.scrollTo({ top: t, behavior: 'smooth' }); };
  const a = APPS[i];
  return (
    <section className="mn-surfaces" id="surfaces" ref={sec} aria-label="The Seer surfaces">
      <div className="mn-surf-copy">
        <h2>Different questions. One foundation.</h2>
        <ul className="mn-menu" role="tablist" aria-label="Seer surfaces">
          {APPS.map((p, k) => <li key={p.name}><button role="tab" aria-selected={k === i} className={k === i ? 'is-on' : ''} onClick={() => go(k)}>{p.name}</button></li>)}
        </ul>
        <div className="mn-detail" ref={detail} aria-live="polite">
          <p className="mn-row"><span className="mn-row-in"><b>Asked by</b> {a.ask}</span></p>
          <p className="mn-row"><span className="mn-row-in"><b>Prices</b> {a.prices}</span></p>
          <p className="mn-row"><span className="mn-row-in"><b>How to use it</b> {a.use}</span></p>
          <a className="mn-open" href={a.href}>Open {a.name} <span aria-hidden="true">&rarr;</span></a>
        </div>
      </div>
      <div className="mn-surf-art">
        <div className="mn-frame" ref={frame}>
          {APPS.map((p, k) => <img key={p.name} ref={(el) => { pics.current[k] = el; }} className="mn-pic" src={p.pic} alt={`${p.name}: ${p.prices}`} decoding="async" />)}
        </div>
        <div className="mn-ticks" aria-hidden="true">{APPS.map((p, k) => <i key={p.name} className={k === i ? 'is-on' : k < i ? 'is-past' : ''} />)}</div>
      </div>
      <div className="mn-m-list">
        {APPS.map((p) => (
          <article key={p.name}><img src={p.pic} alt="" loading="lazy" decoding="async" /><h3>{p.name}</h3>
            <p><b>Asked by</b> {p.ask}</p><p><b>Prices</b> {p.prices}</p><p><b>How to use it</b> {p.use}</p>
            <a className="mn-open" href={p.href}>Open {p.name} <span aria-hidden="true">&rarr;</span></a></article>
        ))}
      </div>
    </section>
  );
}

function How({ onNight }: { onNight: (n: boolean) => void }) {
  const sec = useRef<HTMLElement>(null), dusk = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0); const [night, setNight] = useState(false);
  useEffect(() => { onNight(night); }, [night, onNight]);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px) and (min-height: 600px)', () => {
      const st = ScrollTrigger.create({
        trigger: sec.current, start: 'top top', end: '+=260%', pin: true, anticipatePin: 1,
        onUpdate: (s) => { const p = s.progress; gsap.set(dusk.current, { opacity: reduced() ? (p > 0.5 ? 1 : 0) : Math.min(1, Math.max(0, (p - 0.1) / 0.7)) }); setK(Math.min(2, Math.floor(p * 3))); setNight(p > 0.44); },
      });
      return () => { st.kill(); gsap.set(dusk.current, { clearProps: 'all' }); };
    });
    mm.add('(max-width: 899px), (max-height: 599px)', () => { gsap.set(dusk.current, { opacity: 1 }); setNight(true); });
    return () => mm.revert();
  }, []);
  return (
    <section className={`mn-how ${night ? 'is-night' : ''}`} id="how" ref={sec} aria-labelledby="mn-how-title">
      <div className="mn-how-art" aria-hidden="true">
        <div className="mn-how-layer"><img src={IMG.day} alt="" loading="lazy" decoding="async" /><Clouds className="mn-clouds" {...SKY_DAY} cover={0.34} alpha={1} speed={0.9} /></div>
        <div className="mn-how-layer mn-dusk" ref={dusk}><img src={IMG.dusk} alt="" loading="lazy" decoding="async" /><Clouds className="mn-clouds" {...SKY_DUSK} cover={0.42} alpha={0.95} speed={0.8} /></div>
      </div>
      <div className="mn-how-copy">
        <h2 id="mn-how-title">How a question becomes a signal.</h2>
        <ol className="mn-steps">{STEPS.map((s, n) => <li key={s.w} className={n === k ? 'is-on' : ''}><b>{s.w}</b><span>{s.t}</span></li>)}</ol>
      </div>
      <i className="mn-how-fade" aria-hidden="true" />
    </section>
  );
}

function Kleros() {
  const root = useRef<HTMLElement>(null), art = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (reduced()) return;
      gsap.fromTo(art.current, { scale: 1.16 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.7 } });
      gsap.from('.mn-k-copy > *', { y: 34, opacity: 0, filter: 'blur(8px)', duration: 1.2, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: root.current, start: 'top 62%' } });
      gsap.fromTo('.mn-k-bar', { scaleX: 0 }, { scaleX: 1, ease: 'none', stagger: 0.25, scrollTrigger: { trigger: '.mn-k-flow', start: 'top 98%', end: 'top 62%', scrub: 0.7 } });
      gsap.from('.mn-k-node', { y: 20, opacity: 0, stagger: 0.15, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.mn-k-flow', start: 'top 96%' } });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section className="mn-kleros" id="kleros" ref={root} aria-labelledby="mn-k-title">
      <div className="mn-k-bg" aria-hidden="true">
        <div className="mn-k-art" ref={art}><img src={IMG.klerosPic} alt="" loading="lazy" decoding="async" /><i className="mn-k-seam" /></div>
        <i className="mn-k-veil" />
      </div>
      <div className="mn-k-copy">
        <img className="mn-k-logo" src={IMG.kleros} alt="Kleros" width="184" height="48" />
        <h2 id="mn-k-title">Secured by Kleros.</h2>
        <p>Kleros takes its name from the voting tokens of ancient Greece. Outcomes are reported through Reality.eth; when one is disputed, Kleros jurors review the evidence and rule on-chain. The ruling is final.</p>
        <a className="mn-open mn-open--light" href="https://kleros.io">Explore Kleros <span aria-hidden="true">&rarr;</span></a>
      </div>
      <ol className="mn-k-flow">
        {['Reality.eth reports', 'Anyone can dispute', 'Kleros jurors rule', 'The result is final'].map((t) => <li key={t} className="mn-k-node"><i className="mn-k-bar" /><span>{t}</span></li>)}
      </ol>
    </section>
  );
}

function Final() {
  const root = useRef<HTMLElement>(null), c1 = useRef<HTMLAnchorElement>(null), c2 = useRef<HTMLAnchorElement>(null), glow = useRef<HTMLElement>(null), obj = useRef<HTMLDivElement>(null);
  useMagnetic(c1); useMagnetic(c2);
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (reduced()) return;
      gsap.from('.mn-final-obj', { y: 90, opacity: 0, filter: 'blur(10px)', duration: 1.6, ease: 'power4.out', scrollTrigger: { trigger: root.current, start: 'top 70%' } });
      gsap.to('.mn-final-obj', { yPercent: -6, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.7 } });
      gsap.from('.mn-final h2 .ln', { yPercent: 115, duration: 1.2, ease: 'power4.out', stagger: 0.12, scrollTrigger: { trigger: '.mn-final h2', start: 'top 88%' } });
      gsap.from('.mn-final .mn-cta > *', { y: 24, opacity: 0, filter: 'blur(6px)', duration: 0.9, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: '.mn-final .mn-cta', start: 'top 92%' } });
      const gx = gsap.quickTo(glow.current, 'x', { duration: 0.9, ease: 'power3' }), gy = gsap.quickTo(glow.current, 'y', { duration: 0.9, ease: 'power3' });
      const mv = (e: PointerEvent) => { const r = obj.current?.getBoundingClientRect(); if (!r) return; gx(e.clientX - r.left); gy(e.clientY - r.top); };
      window.addEventListener('pointermove', mv, { passive: true }); return () => window.removeEventListener('pointermove', mv);
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <>
      <section className="mn-final" ref={root}>
        <Clouds className="mn-final-sky" {...SKY_DAY} cover={0.34} alpha={1} speed={0.8} />
        <div className="mn-final-obj" ref={obj}><img src={IMG.object} alt="" loading="lazy" decoding="async" /><i className="mn-shimmer mn-shimmer--obj" aria-hidden="true" /><i className="mn-spot" ref={glow as React.RefObject<HTMLElement>} aria-hidden="true" /></div>
        <h2><span className="mask"><span className="ln">A new foundation</span></span><span className="mask"><span className="ln">for <em>information</em> markets.</span></span></h2>
        <div className="mn-cta"><a className="mn-primary" ref={c1} href={SEER}>Explore Seer</a><a className="mn-link" ref={c2} href={SEER}>Connect Wallet</a></div>
      </section>
      <footer className="mn-footer">
        <div className="mn-foot-grid">
          <div><img src={logo} alt="Seer" width="104" height="48" /><p>Information Finance infrastructure for people, DAOs and agents.</p></div>
          <nav aria-label="Apps"><b>Apps</b><a href={SEER}>Seer App</a><a href={SEER}>Deep</a><a href={SEER}>Futarchy</a><a href="https://opportunity.seer.pm/">Opportunity Markets</a><a href={SEER}>Risk Pricing</a></nav>
          <nav aria-label="Protocol"><b>Protocol</b><a href="https://docs.seer.pm">Documentation</a><a href="https://seer.pm">seer.pm</a><a href="https://kleros.io">Kleros</a></nav>
        </div>
        <div className="mn-wordmark" aria-hidden="true">Seer</div>
      </footer>
    </>
  );
}

export function MonumentLanding() {
  useSmooth();
  const [howNight, setHowNight] = useState(false); const [howIn, setHowIn] = useState(false); const [klIn, setKlIn] = useState(false);
  useEffect(() => {
    document.title = 'Seer | Where information becomes a market';
    const l = document.createElement('link'); l.rel = 'preload'; l.as = 'image'; l.href = IMG.day; l.setAttribute('fetchpriority', 'high'); document.head.appendChild(l);
    void document.fonts.ready.then(() => ScrollTrigger.refresh());
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.target.id === 'how') setHowIn(e.isIntersecting); if (e.target.id === 'kleros') setKlIn(e.isIntersecting); }), { rootMargin: '0px 0px -92% 0px' });
    ['how', 'kleros'].forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => { io.disconnect(); l.remove(); };
  }, []);
  return <main className="mn"><Nav dark={(howIn && howNight) || klIn} /><Hero /><Statement /><Surfaces /><How onNight={setHowNight} /><Kleros /><Final /></main>;
}
