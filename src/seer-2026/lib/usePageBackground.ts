import { useLayoutEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
export function usePageBackground(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        const sections = Array.from(ref.current!.querySelectorAll<HTMLElement>('[data-section-bg]'));
        let previous = '#FDFDFD';
        sections.forEach(section => {
          const color = section.dataset.sectionBg!;
          // Keep the dark chapter local so pinned light copy never fades into charcoal.
          if (['#0e0e12', '#0c0c0f'].includes(color.toLowerCase())) return;
          // Empty stubs have no scroll story yet. Their future content activates the transition.
          if (section.offsetHeight > 1) gsap.fromTo(ref.current, { backgroundColor: previous }, { backgroundColor: color, ease: 'none', immediateRender: false, scrollTrigger: { trigger: section, start: 'top 90%', end: 'top 25%', scrub: true } });
          previous = color;
        });
      }, ref);
      return () => context.revert();
    });
    return () => media.revert();
  }, [ref]);
}
