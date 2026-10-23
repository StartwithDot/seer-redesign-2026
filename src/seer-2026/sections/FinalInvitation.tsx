import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMagnetic } from '../lib/magnetic';
import './FinalInvitation.css';

gsap.registerPlugin(ScrollTrigger);
const groups = [
  { title: 'App', links: [['Explore markets', 'https://app.seer.pm/'], ['Create a market', 'https://app.seer.pm/create-market']] },
  { title: 'Ecosystem', links: [['Futarchy', 'https://futarchy.seer.pm'], ['Deep', 'https://deep.seer.pm'], ['Opportunity Markets', 'https://opportunity.seer.pm'], ['Risk Pricing', 'https://risk.seer.pm']] },
  { title: 'Resources', links: [['Documentation', 'https://docs.seer.pm/']] },
  { title: 'Community', links: [['Seer on X', 'https://x.com/seer_pm']] },
];
export function FinalInvitation() {
  const root = useRef<HTMLElement>(null);
  const primary = useRef<HTMLAnchorElement>(null);
  const secondary = useRef<HTMLAnchorElement>(null);
  useMagnetic(primary);
  useMagnetic(secondary);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        gsap.from('.s26-invitation__word > span', { yPercent: 115, duration: 0.95, stagger: 0.07, ease: 'power4.out', scrollTrigger: { trigger: '.s26-invitation__headline', start: 'top 85%', once: true } });
        gsap.from('.s26-footer__links, .s26-footer__wordmark', { y: 28, opacity: 0, duration: 1, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.s26-footer', start: 'top 90%', once: true } });
      }, root);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);
  return <section ref={root} id="final-invitation" className="s26-invitation" data-section-bg="#FFFFFF" aria-labelledby="s26-invitation-title">
    <div className="s26-invitation__content">
      <h2 id="s26-invitation-title" className="s26-invitation__headline" aria-label="A new foundation for information markets.">
        {['A new foundation for', 'information markets.'].map(line => <span className="s26-invitation__line" key={line} aria-hidden="true">{line.split(' ').map(word => <span className="s26-invitation__word" key={word}><span>{word}</span></span>)}</span>)}
      </h2>
      <div className="s26-invitation__actions">
        <a ref={primary} className="s26-invitation__button s26-invitation__button--primary" href="https://app.seer.pm/"><span data-magnetic-surface>Explore Seer <span aria-hidden="true">↗</span></span></a>
        <a ref={secondary} className="s26-invitation__button s26-invitation__button--secondary" href="https://app.seer.pm/"><span data-magnetic-surface>Connect Wallet <span aria-hidden="true">↗</span></span></a>
      </div>
    </div>
    <footer className="s26-footer">
      <div className="s26-footer__top"><p>Where information<br />becomes a market.</p><nav className="s26-footer__links" aria-label="Footer">{groups.map(group => <div key={group.title}><h3>{group.title}</h3>{group.links.map(([label,url]) => <a href={url} key={label}>{label}</a>)}</div>)}</nav></div>
      <a className="s26-footer__wordmark" href="#seer-top" aria-label="Seer, back to top"><img src="/assets/seer-2026/seer-logo.svg" width="138" height="64" alt="Seer" /></a>
      <div className="s26-footer__bottom"><span>Information. In the open.</span><a href="#seer-top">Back to top ↑</a></div>
    </footer>
  </section>;
}
export default FinalInvitation;
