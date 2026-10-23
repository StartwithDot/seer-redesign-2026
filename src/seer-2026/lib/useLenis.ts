import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);
let activeLenis: Lenis | null = null;

/** Direct selection must update the smooth-scroll target as well as the viewport. */
export function scrollToPosition(top: number) {
  if (activeLenis) activeLenis.scrollTo(top, { immediate: true, force: true });
  else window.scrollTo({ top, behavior: 'instant' });
}

export function useLenis() {
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const lenis = new Lenis({ lerp: 0.09, anchors: true });
      activeLenis = lenis;
      const tick = (time: number) => lenis.raf(time * 1000);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        lenis.off('scroll', ScrollTrigger.update);
        lenis.destroy();
        if (activeLenis === lenis) activeLenis = null;
      };
    });
    return () => media.revert();
  }, []);
}
