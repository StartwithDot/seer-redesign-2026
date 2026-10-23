import { useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMagnetic } from '../lib/magnetic';
import { scrollToPosition } from '../lib/useLenis';
import { SeerAppVisual } from './apps/visuals/SeerAppVisual';
import { FutarchyVisual } from './apps/visuals/FutarchyVisual';
import { DeepVisual } from './apps/visuals/DeepVisual';
import { OpportunityVisual } from './apps/visuals/OpportunityVisual';
import { RiskVisual } from './apps/visuals/RiskVisual';
import './Applications.css';

gsap.registerPlugin(ScrollTrigger);
// Destinations verified in docs/research/seer-product-architecture.md.
const visuals = [SeerAppVisual, FutarchyVisual, DeepVisual, OpportunityVisual, RiskVisual];
const accents = ['#6C47FF', '#5840BD', '#7450C8', '#5B46A6', '#514974'];
const apps = [
  { name: 'Seer App', url: 'https://app.seer.pm/', copy: 'People, DAOs and agents ask. Explore every market type, read the price of each outcome, or trade on what you know.', idea: 'Read probabilities, price estimates, and conditional prices across all market types.' },
  { name: 'Futarchy', url: 'https://futarchy.seer.pm', copy: 'A DAO asks about a proposal. Traders price its token if the proposal passes and if it fails. Markets inform the vote. DAO members decide.', idea: 'Compare the token price if a proposal passes or fails. DAO members decide.' },
  { name: 'Deep', url: 'https://deep.seer.pm', copy: 'A funder asks how a large field of candidates will be judged. People and AI agents price each outcome, helping reviewers focus their attention.', idea: 'Compare candidate prices to focus reviewer attention.' },
  { name: 'Opportunity Markets', url: 'https://opportunity.seer.pm', copy: 'A sponsor asks which submissions deserve attention. Traders price the chance each submission will be selected. Market prices help prioritize review; the sponsor makes the final selection.', idea: 'Prices estimate selection chances. The sponsor makes the final selection.' },
  { name: 'Risk Pricing', url: 'https://risk.seer.pm', copy: 'A treasury asks where its exposure lies. Traders price default risk across DeFi assets. Compare the estimates side by side to assess exposure.', idea: 'Compare market estimates of default risk across DeFi assets.' },
];

function OpenAppLink({ app }: { app: typeof apps[number] }) {
  const link = useRef<HTMLAnchorElement>(null);
  useMagnetic(link);
  return <a ref={link} href={app.url}><span data-magnetic-surface>Open {app.name} <span aria-hidden="true">↗</span></span></a>;
}

export function Applications() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const seek = useRef<((index: number) => void) | null>(null);
  const [active, setActive] = useState(0);
  const [announcement, setAnnouncement] = useState('');

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add({ desktop: '(min-width: 901px) and (min-height: 700px)', motion: '(prefers-reduced-motion: no-preference)' }, context => {
      const { desktop, motion } = context.conditions!;
      const faces = gsap.utils.toArray<HTMLElement>('.s26-app-face', root.current!);
      gsap.set(faces, { autoAlpha: 0, rotationY: -18, transformPerspective: 1200 });
      gsap.set(faces[0], { autoAlpha: 1, rotationY: 0 });
      if (motion) gsap.fromTo('.s26-app-render', { yPercent: 1 }, { yPercent: -1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
      if (!motion) {
        gsap.set(faces, { rotationY: 0 });
        seek.current = index => {
          gsap.set(faces, { autoAlpha: 0 });
          gsap.set(faces[index], { autoAlpha: 1 });
          setActive(index);
        };
        return () => { seek.current = null; };
      }
      const timeline = gsap.timeline({ paused: true, onUpdate: () => setActive(Math.min(4, Math.floor(Math.max(0, timeline.time() - .36)))) });
      for (let i = 1; i < apps.length; i++) {
        timeline.to(faces[i-1], { rotationY: 18, autoAlpha: 0, duration: .72, ease: 'power3.inOut' }, i)
          .fromTo(faces[i], { rotationY: -18, autoAlpha: 0 }, { rotationY: 0, autoAlpha: 1, duration: .72, ease: 'power3.inOut', immediateRender: false }, i);
      }
      timeline.to({}, { duration: 5 - timeline.duration() });
      if (desktop) {
        trigger.current = ScrollTrigger.create({ trigger: root.current, pin: stage.current, start: 'top top', end: () => `+=${Math.max(2800, window.innerHeight * 3.1)}`, scrub: true, animation: timeline, invalidateOnRefresh: true });
        seek.current = index => {
          const st = trigger.current!;
          scrollToPosition(st.start + ((index + .8) / 5) * (st.end - st.start));
          ScrollTrigger.update();
        };
      } else {
        seek.current = index => {
          // Direct selection should never tour the intervening products.
          gsap.killTweensOf(faces);
          gsap.to(faces, { autoAlpha: 0, rotationY: 0, duration: .18, overwrite: true });
          gsap.to(faces[index], { autoAlpha: 1, rotationY: 0, duration: .28, overwrite: true });
          setActive(index);
        };
      }
      return () => { trigger.current = null; seek.current = null; gsap.killTweensOf(timeline); timeline.kill(); };
    }, root);
    return () => media.revert();
  }, []);

  const select = (index: number) => { seek.current?.(index); setAnnouncement(`${apps[index].name}. ${apps[index].copy}`); };
  const keyboard = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % 5;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index + 4) % 5;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = 4;
    else return;
    event.preventDefault(); select(next);
    root.current?.querySelector<HTMLButtonElement>(`#s26-app-tab-${next}`)?.focus({ preventScroll: true });
  };
  return <section ref={root} id="applications" className="s26-applications" aria-labelledby="s26-apps-title" data-section-bg="#F0F0F3" style={{ '--s26-app-accent': accents[active] } as CSSProperties}>
    <div ref={stage} className="s26-apps-stage">
      <h2 id="s26-apps-title">Different questions. <span>One foundation.</span></h2>
      <div className="s26-apps-layout">
        <div className="s26-apps-editorial">
          <div role="tablist" aria-label="Explore Seer applications" aria-orientation="vertical" className="s26-apps-tabs">
            {apps.map((app, i) => <button key={app.name} role="tab" id={`s26-app-tab-${i}`} aria-controls={`s26-app-panel-${i}`} aria-selected={active===i} tabIndex={active===i?0:-1} onClick={() => select(i)} onKeyDown={e => keyboard(e,i)}>{app.name}<span aria-hidden="true">↗</span></button>)}
          </div>
          {apps.map((app,i) => <div key={app.name} role="tabpanel" id={`s26-app-panel-${i}`} aria-labelledby={`s26-app-tab-${i}`} hidden={active!==i} tabIndex={0} className="s26-apps-copy">
            <p>{app.copy}</p><OpenAppLink app={app}/>
          </div>)}
        </div>
        <figure className="s26-apps-art" aria-label={`${apps[active].name}: ${apps[active].idea}`}>
          <div className="s26-apps-optics">{apps.map((app,i) => { const Visual = visuals[i]; return <div key={app.name} className="s26-app-face" aria-hidden={active !== i}><div className="s26-app-render"><Visual active={active === i} /></div></div>; })}</div>
          <figcaption>{apps[active].idea}</figcaption>
        </figure>
      </div>
    </div><p className="s26-apps-sr" role="status">{announcement}</p>
  </section>;
}
export default Applications;
