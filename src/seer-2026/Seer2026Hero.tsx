import { useRef } from 'react';
import { useReveal } from './lib/useReveal';
import { useMagnetic } from './lib/magnetic';
import { useHeroMotion } from './lib/useHeroMotion';
import { MarketStage } from './hero/MarketStage';
import { PrismStage } from './hero/PrismStage';

const variant = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('hero') : null;

const logo = new URL('../../assets/brand/logo.svg', import.meta.url).href;
const Arrow = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;

export function Seer2026Hero() {
  const root = useRef<HTMLElement>(null);
  const nav = useRef<HTMLElement>(null);
  // Retain the header choreography without applying the old artwork's 3D tilt.
  const headerOnly = useRef<HTMLDivElement>(null);
  const primary = useRef<HTMLAnchorElement>(null);
  useReveal(root);
  useMagnetic(primary);
  useHeroMotion(nav, headerOnly);
  return <section ref={root} className={`s26-hero ${variant === 'market' ? 's26-hero--signal' : 's26-hero--prism'}`} aria-labelledby="s26-title">
    <header ref={nav} className="s26-header">
      <a className="s26-brand" href="#seer-top" aria-label="Seer home"><img src={logo} alt="Seer" width="138" height="64" /></a>
      <nav aria-label="Primary navigation">
        <a className="s26-text-link" href="https://app.seer.pm/">Apps</a>
        <a className="s26-wallet" href="https://app.seer.pm/">Connect Wallet <Arrow /></a>
      </nav>
    </header>
    <div className="s26-hero-layout">
      <div className="s26-hero-copy">
        <h1 id="s26-title" data-reveal-lines><span data-line>Where</span>{' '}<span data-line>information</span>{' '}<span data-line>becomes</span>{' '}<span data-line className="s26-accent">a market.</span></h1>
        <p data-reveal>Information Finance infrastructure for people, agents, and applications. Turn many perspectives into a clearer market signal.</p>
        <div className="s26-actions" data-reveal>
          <a ref={primary} className="s26-primary" href="https://app.seer.pm/"><span data-magnetic-surface>Explore Markets <Arrow /></span></a>
          <a className="s26-learn s26-text-link" href="#information-finance">Learn More <Arrow /></a>
        </div>
      </div>
      {variant === 'market' ? <MarketStage /> : <PrismStage />}
    </div>
  </section>;
}
