import { useEffect, type RefObject } from 'react';
import { gsap } from 'gsap';

export function useHeroMotion(nav: RefObject<HTMLElement | null>, lens: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const header = nav.current;
    if (!header) return;
    let previous = window.scrollY;
    let frame = 0;
    const update = () => {
      const current = window.scrollY;
      header.classList.toggle('is-condensed', current > 80);
      if (current < 100 || header.contains(document.activeElement)) header.classList.remove('is-hidden');
      else if (Math.abs(current - previous) > (current > previous ? 12 : 8)) {
        header.classList.toggle('is-hidden', current > previous);
        previous = current;
      }
      if (current < 100) previous = current;
      frame = 0;
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const focus = () => header.classList.remove('is-hidden');
    window.addEventListener('scroll', scroll, { passive: true });
    header.addEventListener('focusin', focus);
    update();
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference) and (pointer: fine)', () => {
      const art = lens.current;
      if (!art) return;
      gsap.set(art, { transformPerspective: 1000 });
      const x = gsap.quickTo(art, 'rotationX', { duration: 0.8, ease: 'power3.out' });
      const y = gsap.quickTo(art, 'rotationY', { duration: 0.8, ease: 'power3.out' });
      const move = (event: PointerEvent) => {
        const rect = art.getBoundingClientRect();
        x(gsap.utils.clamp(-6, 6, -(event.clientY - rect.top - rect.height / 2) / rect.height * 12));
        y(gsap.utils.clamp(-6, 6, (event.clientX - rect.left - rect.width / 2) / rect.width * 12));
      };
      const title = header.parentElement?.querySelector<HTMLElement>('h1');
      const illuminate = (event: PointerEvent) => {
        if (!title) return;
        const rect = title.getBoundingClientRect();
        title.style.setProperty('--light-x', `${event.clientX - rect.left}px`);
        title.style.setProperty('--light-y', `${event.clientY - rect.top}px`);
      };
      title?.addEventListener('pointermove', illuminate);
      const reset = () => { x(0); y(0); };
      art.addEventListener('pointermove', move);
      art.addEventListener('pointerleave', reset);
      return () => { title?.removeEventListener('pointermove', illuminate); art.removeEventListener('pointermove', move); art.removeEventListener('pointerleave', reset); gsap.killTweensOf(art); gsap.set(art, { clearProps: 'transform' }); };
    });
    return () => { window.removeEventListener('scroll', scroll); header.removeEventListener('focusin', focus); cancelAnimationFrame(frame); media.revert(); };
  }, [nav, lens]);
}
