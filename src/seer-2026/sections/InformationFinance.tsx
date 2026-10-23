import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './InformationFinance.css';

gsap.registerPlugin(ScrollTrigger);
const statement = 'Markets turn what people know into prices anyone can read.';
const statementLines = ['Markets turn what', 'people know into prices', 'anyone can read.'];
export function InformationFinance() {
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        const timeline = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'bottom 55%', scrub: 0.8 } });
        timeline.fromTo('.if-word', { opacity: 0.72 }, { opacity: 1, stagger: 0.13, duration: 0.45, ease: 'none' }, 0);

      }, root);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);
  return <section ref={root} id="information-finance" className="if-section" data-section-bg="#F0F0F3" aria-labelledby="if-heading">
    <div className="if-inner">
      <h2 id="if-heading" className="if-statement" aria-label={statement}>
        {statementLines.map(line => <span className="if-statement-line" key={line} aria-hidden="true">{line.split(' ').map(word => <span key={word} className="if-word">{word}{' '}</span>)}</span>)}
      </h2>

    </div>
  </section>;
}
export default InformationFinance;
