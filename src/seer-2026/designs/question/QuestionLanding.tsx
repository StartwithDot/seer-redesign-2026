import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from '../../lib/useLenis';
import './question.css';

gsap.registerPlugin(ScrollTrigger);
const APP = 'https://app.seer.pm/';
const question = 'Will the DAO fund the Q4 grants round?';
const stories = [
  { who: 'A DAO asks.', name: 'Futarchy', question, copy: 'Compare the expected treasury value if a proposal passes or fails. Read the signal. The DAO still votes.', link: 'Explore Futarchy', url: APP },
  { who: 'A treasury asks.', name: 'Risk Pricing', question: 'Where should our treasury put its trust?', copy: 'Compare market estimates of protocol risk side by side. Let the price inform your exposure.', link: 'Explore Risk Pricing', url: APP },
  { who: 'An AI agent asks.', name: 'Deep', question: 'Which ideas will human evaluators choose?', copy: 'Many outcomes. One readable ranking. Agents can forecast how people will judge a field of proposals.', link: 'Explore Deep', url: APP },
  { who: 'A sponsor asks.', name: 'Opportunity Markets', question: 'Who will build the best public good?', copy: 'Traders forecast which submissions a sponsor will select. The market informs the decision.', link: 'Explore Opportunity Markets', url: 'https://opportunity.seer.pm/' },
  { who: 'Anyone asks.', name: 'Seer App', question: 'What do you want to know?', copy: 'Explore every kind of market in one place. Ask a question, trade an outcome, or simply read the signal.', link: 'Open Seer App', url: APP },
];
function MaskedWords({ text }: { text: string }) { return <>{text.split(' ').map((word, i) => <span className="q-mask q-word-mask" key={i}><span>{word}</span></span>)}</>; }
function Arrow() { return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" /></svg>; }
function TextLink({ href, children }: { href: string; children: React.ReactNode }) { return <a className="q-link" href={href}>{children}<Arrow /></a>; }
function Market({ index }: { index: number }) {
  if (index === 0) return <div className="q-comparison"><div><strong>$1.24</strong><span>Treasury value if pass</span></div><div><strong>$1.08</strong><span>Treasury value if fail</span></div></div>;
  if (index === 1) return <div className="q-comparison q-three">{['2.1', '3.8', '6.4'].map((n, i) => <div key={n}><strong>{n}<small>%</small></strong><span>{['Protocol A', 'Protocol B', 'Protocol C'][i]}</span></div>)}</div>;
  if (index === 2) return <div className="q-ranking">{['Open research', 'Local energy', 'Public data', 'Better ballots', 'Shared compute', 'Clean water', 'Open maps', 'New commons'].map((name, i) => <div key={name}><span>{name}</span><b>{[28, 21, 16, 12, 9, 6, 5, 3][i]}%</b></div>)}</div>;
  if (index === 3) return <><div className="q-comparison q-three">{['48', '34', '18'].map((n, i) => <div key={n}><strong>{n}<small>%</small></strong><span>{['Open-source toolkit', 'Community archive', 'Research library'][i]}</span></div>)}</div><p className="q-verdict">Reviewers decide.</p></>;
  return <div className="q-ticker">{[['Will the next upgrade pass?', '73%'], ['Will the grant be funded?', '62%'], ['Will the target be met?', '41%']].map(([q, n]) => <div key={q}><span>{q}</span><strong>{n}</strong></div>)}</div>;
}
export function QuestionLanding() {
  const root = useRef<HTMLElement>(null);
  const [typed, setTyped] = useState(question);
  const [price, setPrice] = useState(62);
  const [typing, setTyping] = useState(false);
  const [condensed, setCondensed] = useState(false);
  useLenis();
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    setTyped('');
    setTyping(true);
    let n = 0;
    const type = window.setInterval(() => { n++; setTyped(question.slice(0, n)); if (n >= question.length) { clearInterval(type); setTyping(false); } }, 48);
    let p = 0;
    const wander = window.setInterval(() => { p++; setPrice([62, 65, 61, 63][p % 4]); }, 5200);
    return () => { clearInterval(type); clearInterval(wander); };
  }, []);
  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 64);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    const previous = document.title;
    document.title = 'Seer | One question. A world of information.';
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.q-hero-price', { y: 24, duration: 1.1, delay: 1.8, ease: 'power4.out' });
        gsap.from('.q-signal-line', { scaleX: 0, transformOrigin: 'left', duration: 1, delay: 2.4, ease: 'power4.out' });
        gsap.utils.toArray<HTMLElement>('.q-statement .q-word').forEach(word => gsap.fromTo(word, { opacity: .18 }, { opacity: 1, scrollTrigger: { trigger: word, start: 'top 78%', end: 'top 48%', scrub: true } }));
        gsap.utils.toArray<HTMLElement>('.q-step h3').forEach(word => gsap.fromTo(word, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', scrollTrigger: { trigger: word, start: 'top 85%', end: 'top 45%', scrub: true } }));
        gsap.from('.q-jury i', { x: i => (4 - i) * 18, y: i => (i % 3 - 1) * 58, scrollTrigger: { trigger: '.q-jury', start: 'top 85%', end: 'top 45%', scrub: true }, stagger: .04 });
      });
      mm.add('(min-width: 801px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)', () => {
        const panels = gsap.utils.toArray<HTMLElement>('.q-scene');
        root.current?.classList.add('q-pinned');
        // A complete market stays visible during every handoff. Only incoming words slide.
        let activePanel = -1;
        const showPanel = (index: number) => {
          if (activePanel === index) return;
          activePanel = index;
          const words = panels[index].querySelectorAll('.q-scene-heading h2 > span, .q-word-mask > span');
          gsap.fromTo(words, { yPercent: 105 }, { yPercent: 0, duration: .8, stagger: .025, ease: 'power4.out', overwrite: true });
          panels.forEach((panel, i) => {
            gsap.set(panel, { autoAlpha: i === index ? 1 : 0 });
            panel.inert = i !== index;
          });
        };
        showPanel(0);
        ScrollTrigger.create({
          trigger: '.q-story', start: 'top top',
          end: () => `+=${window.innerHeight * 4}`,
          pin: '.q-stage', invalidateOnRefresh: true,
          onUpdate: self => showPanel(Math.min(4, Math.floor(self.progress * 5))),
        });
        return () => {
          root.current?.classList.remove('q-pinned');
          panels.forEach(panel => { panel.inert = false; });
        };
      });
    }, root);
    let active = true;
    void document.fonts.ready.then(() => { if (active) ScrollTrigger.refresh(); });
    return () => { active = false; ctx.revert(); window.removeEventListener('scroll', onScroll); document.title = previous; };
  }, []);
  return <main className="q-page" ref={root} id="question-top">
    <a className="q-skip" href="#q-statement">Skip to introduction</a>
    <section className="q-hero">
      <header className={`q-nav${condensed ? ' q-nav-condensed' : ''}`}><a href="#question-top" aria-label="Seer home"><img src="/assets/brand/logo.svg" alt="Seer" /></a><nav aria-label="Main navigation"><a href="#q-story">Apps</a><a href={APP}>Connect Wallet <Arrow /></a></nav></header>
      <div className="q-hero-center"><h1 aria-label={question}><span className="q-question-reserve" aria-hidden="true">{question}</span><span className="q-question-typed" aria-hidden="true">{typed}{typing && <i className="q-cursor" />}</span></h1><div className="q-price-row"><span className="q-signal-line" /><div className="q-hero-price">{price}<span>%</span></div></div></div>
      <div className="q-hero-bottom"><div><p>Ask a question. Traders price the outcomes.<br />Anyone can read the signal.</p><div className="q-actions"><TextLink href={APP}>Explore Seer</TextLink><TextLink href="#q-story">Follow the question</TextLink></div></div><span className="q-note">Illustrative market<br />Scroll to change hands</span></div>
    </section>
    <section className="q-story" id="q-story" aria-label="One question changes hands"><div className="q-stage"><div className="q-story-top"><a href="#q-statement">Skip app stories <Arrow /></a><span>Illustrative markets</span></div>{stories.map((story, i) => <article className={`q-scene q-scene-${i}`} id={`q-app-${i}`} key={story.name}>
      <div className="q-scene-heading"><h2 className="q-mask"><span>{story.who}</span></h2><span className="q-mask q-surface"><span>{story.name}</span></span></div>
      <div className="q-scene-question"><MaskedWords text={story.question} /></div>
      <div className="q-market"><Market index={i} /></div>
      <div className="q-scene-bottom"><div><p>{story.copy}</p><TextLink href={story.url}>{story.link}</TextLink></div></div>
    </article>)}</div></section>
    <section className="q-statement" id="q-statement"><h2>{'Markets turn what people know into prices anyone can read.'.split(' ').map((word, i) => <span className="q-word" key={i}>{word} </span>)}</h2><p>Seer is an Information Finance protocol on Gnosis and Optimism. A place for people, organisations and AI agents to ask better questions. And for traders to put their knowledge on the line.</p><TextLink href="https://docs.seer.pm">Understand Information Finance</TextLink></section>
    <section className="q-how" aria-label="How Seer works">{[['Ask', 'Start with what you need to know.', 'Set a question and its possible outcomes. Give useful information a market.'], ['Price', 'Knowledge meets conviction.', 'Traders buy and sell outcomes. Their information becomes a price everyone can see.'], ['Read', 'A signal you can use.', 'Compare the possibilities. Make your own decision. Trading is always optional.']].map(([word, title, copy]) => <div className="q-step" key={word}><div className="q-ink-word"><span aria-hidden="true">{word}</span><h3>{word}</h3></div><div><h4>{title}</h4><p>{copy}</p></div></div>)}</section>
    <section className="q-kleros"><h2>Disputed?<br /><em>Jurors decide.</em></h2><div className="q-jury" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</div><div className="q-kleros-bottom"><p>Markets need answers they can trust.<br />Conditional Tokens structure the outcomes. Reality.eth reports the result. Kleros arbitrates disputes.</p><TextLink href="https://docs.seer.pm">How resolution works</TextLink></div></section>
    <section className="q-final"><h2>A new foundation<br />for information<br /><em>markets.</em></h2><div className="q-actions"><TextLink href={APP}>Explore Seer</TextLink><TextLink href={APP}>Connect Wallet</TextLink></div></section>
    <footer className="q-footer"><div className="q-footer-links"><a href={APP}>Seer App</a><a href="https://opportunity.seer.pm/">Opportunity Markets</a><a href="https://docs.seer.pm">Documentation</a><a href="https://docs.seer.pm">Join the ecosystem</a><a href="https://x.com/seer_pm">X / Twitter</a><a href="#question-top">Back to top</a></div><img className="q-wordmark" src="/assets/brand/logo.svg" alt="Seer" /><div className="q-footer-end"><span>Information becomes a market.</span><span>One question at a time.</span></div></footer>
  </main>;
}
