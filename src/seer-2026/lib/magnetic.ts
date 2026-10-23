import { useEffect, type RefObject } from 'react';
import { gsap } from 'gsap';

/** Animate an inner surface so the link's hit area stays stationary. */
export function useMagnetic(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference) and (pointer: fine)', () => {
      const surface = element.querySelector<HTMLElement>('[data-magnetic-surface]');
      if (!surface) return;
      const x = gsap.quickTo(surface, 'x', { duration: 0.6, ease: 'power3.out' });
      const y = gsap.quickTo(surface, 'y', { duration: 0.6, ease: 'power3.out' });
      const move = (event: PointerEvent) => {
        const rect = element.getBoundingClientRect();
        x((event.clientX - rect.left - rect.width / 2) * 0.14);
        y((event.clientY - rect.top - rect.height / 2) * 0.14);
      };
      const reset = () => { x(0); y(0); };
      element.addEventListener('pointermove', move);
      element.addEventListener('pointerleave', reset);
      return () => { element.removeEventListener('pointermove', move); element.removeEventListener('pointerleave', reset); gsap.killTweensOf(surface); gsap.set(surface, { clearProps: 'transform' }); };
    });
    return () => media.revert();
  }, [ref]);
}
