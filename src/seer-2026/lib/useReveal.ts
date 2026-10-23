import { useLayoutEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitLines } from './splitLines';

gsap.registerPlugin(ScrollTrigger);
export function useReveal(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    if (!ref.current) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const splits = Array.from(ref.current!.querySelectorAll<HTMLElement>('[data-reveal-lines]')).map(splitLines);
      const context = gsap.context(() => {
        const entrance = ref.current?.classList.contains('s26-hero') ? undefined : { trigger: ref.current, start: 'top 85%', once: true };
        splits.forEach(split => gsap.from(split.lines, { yPercent: 110, duration: 0.9, stagger: 0.08, ease: 'power4.out', scrollTrigger: entrance }));
        gsap.from('[data-reveal]', { y: 20, opacity: 0, duration: 0.9, stagger: 0.08, delay: 0.25, ease: 'power4.out', scrollTrigger: entrance });
      }, ref);
      return () => { context.revert(); splits.forEach(split => split.revert()); };
    });
    return () => media.revert();
  }, [ref]);
}
