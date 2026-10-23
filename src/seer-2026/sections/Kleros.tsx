import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitLines } from '../lib/splitLines';
import './Kleros.css';
import { KlerosVerdict } from './apps/visuals/KlerosVerdict';

gsap.registerPlugin(ScrollTrigger);

export function Kleros() {
  const root = useRef<HTMLElement>(null);
  const resolve = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const node = resolve.current!;
      const final = 'Kleros.';
      const progress = { value: 0 };
      const split = splitLines(root.current!.querySelector<HTMLElement>('h2 > [data-line]')!);
      const context = gsap.context(() => {
        const timeline = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 58%', once: true } });
        timeline.from(split.lines, { yPercent: 110, duration: 0.9, stagger: 0.08, ease: 'power4.out' })
          .to(progress, { value: 1, duration: 0.75, ease: 'none', onUpdate: () => {
            // Resolve the whole word in one short burst; accessible copy stays stable.
            node.textContent = progress.value > 0.85 ? final : Array.from(final, (letter, index) => letter === '.' ? '.' : 'KXROES'[Math.floor(progress.value * 28 + index * 3) % 6]).join('');
          }, onComplete: () => { node.textContent = final; } }, 0.2);
        gsap.fromTo('.s26-kleros__render', { y: 18 }, { y: -18, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
      }, root);
      return () => { context.revert(); split.revert(); if (resolve.current) resolve.current.textContent = final; };
    });
    return () => media.revert();
  }, []);
  return <section ref={root} id="kleros" className="s26-kleros" data-section-bg="#0E0E12" aria-labelledby="s26-kleros-title">
    <div className="s26-kleros__inner">
      <div className="s26-kleros__copy">
        <h2 id="s26-kleros-title" aria-label="Secured by Kleros."><span data-line aria-hidden="true">Secured by</span><span data-line aria-hidden="true"><span ref={resolve}>Kleros.</span></span></h2>
        <p>Markets need answers they can stand behind.</p>
        <p className="s26-kleros__detail">Outcomes are reported through Reality.eth. When an answer is disputed, Kleros jurors review the evidence and arbitrate on-chain.</p>
        <a className="s26-kleros__link" href="https://kleros.io/">Explore Kleros <span aria-hidden="true">↗</span></a>
      </div>
      <div className="s26-kleros__render"><KlerosVerdict active /></div>
    </div>
  </section>;
}
export default Kleros;
