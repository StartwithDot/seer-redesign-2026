import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis, scrollToPosition } from '../../lib/useLenis';
import './ProductLanding.css';

gsap.registerPlugin(ScrollTrigger);

const products = [
  { name: 'Seer App', image: 'explorer', asker: 'Anyone asks', address: 'app.seer.pm', url: 'https://app.seer.pm/', asked: 'People, communities and AI agents.', prices: 'The outcomes of questions across the Seer ecosystem.', use: 'Explore markets, read the signal, or take a position.' },
  { name: 'Deep', image: 'deep', asker: 'An AI agent asks', address: 'Seer / Deep', url: 'https://app.seer.pm/', asked: 'Teams and AI agents evaluating a large field.', prices: 'How human evaluators will judge many possible outcomes.', use: 'Compare the field before committing attention or resources.' },
  { name: 'Futarchy', image: 'futarchy', asker: 'A DAO asks', address: 'Seer / Futarchy', url: 'https://app.seer.pm/', asked: 'DAOs weighing a proposal.', prices: 'Expected value if a proposal passes versus if it fails.', use: 'Bring the comparison to a vote. The DAO still decides.' },
  { name: 'Opportunity Markets', image: 'opportunity', asker: 'A sponsor asks', address: 'opportunity.seer.pm', url: 'https://opportunity.seer.pm/', asked: 'Sponsors choosing among submissions.', prices: 'Which submissions a sponsor is likely to select.', use: 'Discover promising work. Reviewers keep the final say.' },
  { name: 'Risk Pricing', image: 'risk', asker: 'A protocol asks', address: 'Seer / Risk Pricing', url: 'https://app.seer.pm/', asked: 'Protocols and people assessing exposure.', prices: 'Market estimates of protocol risk.', use: 'Compare risk side by side to inform your own decisions.' },
];
type Product = typeof products[number];

function Arrow({ down = false }: { down?: boolean }) {
  return <svg className={down ? 'pl-arrow pl-arrow-down' : 'pl-arrow'} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" /></svg>;
}
function Logo() { return <img src="/assets/brand/logo.svg" width="104" height="36" alt="Seer" className="pl-logo" />; }
function BrowserBar({ product }: { product: Product }) {
  return <div className="pl-browser-bar" aria-hidden="true"><span className="pl-window-dots"><i /><i /><i /></span><span>{product.address}</span><svg viewBox="0 0 16 16" fill="none"><path d="M4 6V4a4 4 0 0 1 8 0v2M3 6h10v8H3z" stroke="currentColor" /></svg></div>;
}
function Description({ product }: { product: Product }) {
  return <div className="pl-description"><p><strong>Asked by</strong> {product.asked}</p><p><strong>Prices</strong> {product.prices}</p><p><strong>How to use it</strong> {product.use}</p><a className="pl-text-link" href={product.url}>Open {product.name}<Arrow /></a></div>;
}
function HeroStack() {
  const [front, setFront] = useState(0);
  const [paused, setPaused] = useState(false);
  const tilt = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => setFront(n => (n + 1) % products.length), 4000);
    return () => window.clearInterval(timer);
  }, [paused]);
  return <div className="pl-hero-visual">
    <div className="pl-stack-area" onPointerMove={event => {
      if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      gsap.to(tilt.current, { rotateY: ((event.clientX - bounds.left) / bounds.width - .5) * 10, rotateX: -((event.clientY - bounds.top) / bounds.height - .5) * 10, duration: .9, ease: 'power4.out' });
    }} onPointerLeave={() => gsap.to(tilt.current, { rotateY: 0, rotateX: 0, duration: 1, ease: 'power4.out' })}>
      <div className="pl-stack-tilt" ref={tilt}><div className="pl-stack">
        {products.map((product, i) => {
          const depth = (i - front + products.length) % products.length;
          return <div key={product.image} className="pl-hero-window" style={{ '--depth': depth, zIndex: 5 - depth } as CSSProperties}><BrowserBar product={product} /><img src={`/img/ui/${product.image}.png`} alt={`${product.name} interface`} width="1440" height="900" fetchPriority={i === 0 ? 'high' : 'auto'} /></div>;
        })}
      </div></div>
    </div>
    <div className="pl-stack-caption"><span key={front}>{products[front].asker}: <strong>{products[front].name}</strong></span><button type="button" onClick={() => setPaused(!paused)} aria-pressed={paused} aria-label={paused ? 'Play product preview' : 'Pause product preview'}>{paused ? <svg viewBox="0 0 16 16"><path d="m5 3 8 5-8 5z" fill="currentColor" /></svg> : <svg viewBox="0 0 16 16"><path d="M5 3v10M11 3v10" stroke="currentColor" strokeWidth="2" /></svg>}</button></div>
  </div>;
}
function ProductStory() {
  const section = useRef<HTMLElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      setPinned(true);
      const panels = section.current!.querySelectorAll('.pl-story-slide');
      const timeline = gsap.timeline({ onUpdate() { setActive(Math.min(4, Math.floor(this.time()))); }, scrollTrigger: { trigger: section.current, start: 'top top', end: () => `+=${window.innerHeight * 4}`, invalidateOnRefresh: true, pin: true, scrub: .7, anticipatePin: 1 } });
      trigger.current = timeline.scrollTrigger!;
      timeline.to({}, { duration: 5 }, 0);
      panels.forEach((panel, i) => {
        if (i > 0) timeline.fromTo(panel, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: .18, ease: 'none' }, i - .18);
      });
      return () => { setPinned(false); timeline.scrollTrigger?.kill(); timeline.kill(); trigger.current = null; };
    });
    return () => media.revert();
  }, []);
  const select = (index: number) => {
    if (trigger.current) scrollToPosition(trigger.current.start + (trigger.current.end - trigger.current.start) * ((index + .5) / 5));
    else document.getElementById(`pl-product-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return <section className="pl-story" ref={section} id="pl-apps" aria-label="Explore Seer products">
    <div className="pl-story-heading"><h2>One protocol.<br /><em>More ways to see.</em></h2><p>From an open question to a consequential decision.<br />Find the market that fits.</p></div>
    <div className="pl-story-layout">
      <nav className="pl-product-list" aria-label="Products">{products.map((p, i) => <button key={p.image} type="button" onClick={() => select(i)} className={active === i ? 'is-active' : ''} aria-current={active === i ? 'step' : undefined}><span>{p.name}</span><Arrow /></button>)}</nav>
      <div className="pl-story-stage">{products.map((p, i) => <article className={`pl-story-slide ${active === i ? 'is-active' : ''}`} key={p.image} id={`pl-product-${i}`} style={{ zIndex: i + 1 }} inert={pinned && active !== i}><h3>{p.name}</h3><a className="pl-browser" href={`/img/ui/${p.image}.png`} target="_blank" rel="noreferrer" aria-label={`Enlarge ${p.name} interface screenshot`}><BrowserBar product={p} /><span className="pl-enlarge">Enlarge interface<Arrow /></span><img src={`/img/ui/${p.image}.png`} alt={`${p.name} product interface screenshot`} width="1440" height="900" loading="eager" /></a><Description product={p} /></article>)}</div>
    </div>
  </section>;
}
function Jury() {
  return <svg className="pl-jury" viewBox="0 0 300 300" role="img" aria-label="Nine jurors aligning on a verdict"><path d="M60 60h180M60 150h180M60 240h180M60 60v180M150 60v180M240 60v180" stroke="currentColor" strokeOpacity=".18" />{Array.from({ length: 9 }, (_, i) => <circle key={i} cx={60 + i % 3 * 90} cy={60 + Math.floor(i / 3) * 90} r="12" fill="currentColor" className="pl-juror" />)}</svg>;
}
export function ProductLanding() {
  const root = useRef<HTMLElement>(null);
  const [condensed, setCondensed] = useState(false);
  useLenis();
  useEffect(() => {
    const previous = document.title;
    document.title = 'Seer | Where information becomes a market';
    const onScroll = () => setCondensed(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { document.title = previous; window.removeEventListener('scroll', onScroll); };
  }, []);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        gsap.from('.pl-hero-copy > *', { y: 28, opacity: 0, duration: 1, stagger: .12, ease: 'power4.out' });
        gsap.fromTo('.pl-statement-word', { color: '#626269' }, { color: '#0e0e12', stagger: .15, ease: 'none', scrollTrigger: { trigger: '.pl-statement', start: 'top 75%', end: 'center 60%', scrub: true } });
        gsap.from('.pl-step', { y: 24, duration: .9, stagger: .15, ease: 'power4.out', scrollTrigger: { trigger: '.pl-steps', start: 'top 85%' } });
        gsap.from('.pl-juror', { scale: .2, opacity: .2, transformOrigin: '50% 50%', duration: .9, stagger: { from: 'center', amount: .6 }, ease: 'power4.out', scrollTrigger: { trigger: '.pl-kleros', start: 'top 65%' } });
        gsap.from('.pl-footer-wordmark', { yPercent: 25, duration: 1.1, ease: 'power4.out', scrollTrigger: { trigger: '.pl-footer', start: 'top 90%' } });
      }, root);
      return () => context.revert();
    });
    let mounted = true;
    void document.fonts.ready.then(() => { if (mounted) ScrollTrigger.refresh(); });
    return () => { mounted = false; media.revert(); };
  }, []);
  const statement = 'A question is a starting point. A market is a way to see what comes next.';
  return <main className="pl-page" ref={root} id="pl-top">
    <a href="#pl-content" className="pl-skip">Skip to content</a>
    <header className={`pl-nav ${condensed ? 'is-condensed' : ''}`}><a href="#pl-top" aria-label="Seer home"><Logo /></a><nav aria-label="Main navigation"><a href="#pl-apps">Apps</a><a className="pl-nav-wallet" href="https://app.seer.pm/">Connect Wallet<Arrow /></a></nav></header>
    <section className="pl-hero" id="pl-content"><div className="pl-hero-copy"><h1><span>Where information</span><span>becomes a <em>market.</em></span></h1><p>Information Finance: people, DAOs and AI agents ask. Traders price every answer.</p><div className="pl-actions"><a className="pl-button" href="https://app.seer.pm/">Explore Markets<Arrow /></a><a className="pl-secondary" href="#pl-how">How it works<Arrow down /></a></div></div><HeroStack /><div className="pl-hero-bottom"><span>Better questions. Clearer decisions.</span><a href="#pl-apps">See the products<Arrow down /></a></div></section>
    <ProductStory />
    <section className="pl-statement"><h2>{statement.split(' ').map((word, i) => <span className="pl-statement-word" key={i}>{word} </span>)}</h2><div className="pl-statement-note"><span className="pl-small-line" /><p>That’s Information Finance. Askers bring the questions. Traders bring conviction. Everyone can read the signal. Trading is optional.</p></div></section>
    <section className="pl-how" id="pl-how"><div className="pl-section-heading"><h2>From a question<br />to a clearer view.</h2><a className="pl-text-link" href="https://docs.seer.pm">How Seer works<Arrow /></a></div><div className="pl-steps"><article className="pl-step"><div className="pl-step-title"><h3>Ask.</h3><Arrow /></div><p>Put a question to the market. Define the possible outcomes and what will settle the answer.</p><span>People, DAOs & AI agents</span></article><article className="pl-step"><div className="pl-step-title"><h3>Price.</h3><Arrow /></div><p>Traders take positions on outcomes. Their conviction becomes a price anyone can read.</p><span>Open participation</span></article><article className="pl-step"><div className="pl-step-title"><h3>Read.</h3><svg className="pl-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 5 5 9-10" stroke="currentColor" strokeWidth="1.5" /></svg></div><p>Use the signal to inform your next move. You keep the decision. The market adds perspective.</p><span>No trade required</span></article></div></section>
    <section className="pl-kleros"><div className="pl-kleros-copy"><h2>A market needs<br />an answer it can<br /><em>settle on.</em></h2><p>Questions resolve through Reality.eth. When an answer is disputed, Kleros brings it to a jury. A clear verdict lets the market settle.</p><a className="pl-text-link" href="https://docs.seer.pm">Understand resolution<Arrow /></a></div><div className="pl-kleros-visual"><Jury /><p>Secured by Kleros</p><span>Conditional Tokens · Reality.eth · Kleros</span></div></section>
    <section className="pl-final"><h2>A new foundation for<br /><em>information markets.</em></h2><div className="pl-actions"><a className="pl-button" href="https://app.seer.pm/">Explore Seer<Arrow /></a><a className="pl-secondary" href="https://app.seer.pm/">Connect Wallet<Arrow /></a></div></section>
    <footer className="pl-footer"><div className="pl-footer-top"><a href="#pl-top" aria-label="Seer home"><Logo /></a><p>Information Finance.<br />For a world with questions.</p><div>{products.map(product => <a key={product.image} href={product.url}>{product.name}</a>)}</div><div><a href="https://docs.seer.pm">Documentation<Arrow /></a><a href="https://x.com/seer_pm">Seer on X<Arrow /></a></div></div><div className="pl-footer-wordmark" aria-hidden="true">seer</div><div className="pl-footer-bottom"><span>Built on Gnosis & Optimism</span><a href="#pl-top">Back to top<Arrow down /></a></div></footer>
  </main>;
}
