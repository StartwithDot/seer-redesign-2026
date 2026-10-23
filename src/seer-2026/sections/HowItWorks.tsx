import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReveal } from '../lib/useReveal';
import './HowItWorks.css';

gsap.registerPlugin(ScrollTrigger);
const steps = [
  { title: 'Forecast', copy: 'Bring what you know. Take a position on what happens next.' },
  { title: 'Trade', copy: 'Buy and sell as the picture changes. Every trade helps shape the price.' },
  { title: 'Resolve', copy: 'The outcome is verified. Winning shares can be redeemed.' },
];

export function HowItWorks() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 769px) and (min-height: 700px)' }, match => {
      if (!match.conditions?.motion) return;
      const context = gsap.context(() => {
        const section = root.current!;
        const panels = gsap.utils.toArray<HTMLElement>('.hiw-step', section);
        const pin = Boolean(match.conditions?.desktop);
        const timeline = gsap.timeline({ scrollTrigger: {
          trigger: section, start: pin ? 'top top' : 'top 65%',
          end: pin ? '+=1800' : 'bottom 65%', pin, scrub: 0.8, invalidateOnRefresh: true,
        } });
        gsap.set(panels, { opacity: 0.9, borderColor: 'rgba(108, 71, 255, 0)' });
        gsap.set(panels[0], { opacity: 1, borderColor: '#6c47ff' });
        gsap.set('.hiw-question-line, .hiw-forecast-line, .hiw-price-line, .hiw-seal', { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.set('.hiw-price', { opacity: 0.72 });
        timeline.to('.hiw-question-line', { strokeDashoffset: 0, duration: 0.45 }, 0)
          .to('.hiw-forecast-line', { strokeDashoffset: 0, duration: 0.85, stagger: 0.1 }, 0.25)
          .to('.hiw-price-line', { strokeDashoffset: 0, duration: 0.5 }, 1)
          .to('.hiw-price', { opacity: 1, duration: 0.5 }, 1);
        timeline.to(panels[0], { opacity: 0.9, borderColor: 'rgba(108, 71, 255, 0)', duration: 0.4 }, 0.8)
          .to(panels[1], { opacity: 1, borderColor: '#6c47ff', duration: 0.4 }, 0.8)
          .to('.hiw-seal', { strokeDashoffset: 0, duration: 0.8 }, 2.1)
          .to(panels[1], { opacity: 0.9, borderColor: 'rgba(108, 71, 255, 0)', duration: 0.4 }, 2.2)
          .to(panels[2], { opacity: 1, borderColor: '#6c47ff', duration: 0.4 }, 2.2)
          .to({}, { duration: 0.4 });
      }, root);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);
  return <section ref={root} id="how-it-works" className="hiw-section" data-section-bg="#FFFFFF" aria-labelledby="hiw-heading">
    <div className="hiw-inner">
      <h2 id="hiw-heading" data-reveal-lines><span data-line>From a possibility.</span><span data-line>To a clearer picture.</span></h2>
      <div className="hiw-layout">
        <div className="hiw-art">
          <svg viewBox="0 0 600 420" width="100%" height="100%" role="img" aria-label="A question enters from the left. Three forecasts converge into a market price. A verified outcome seals the resolution.">
            <g fill="none" stroke="#D8D5E2" strokeWidth="2">
              <path d="M24 210H110" />
              {[110,210,310].map(y => <path key={y} d={`M110 210C155 210 150 ${y} 200 ${y}S300 210 350 210`} />)}
              <path d="M350 210H455" />
            </g>
            <g fill="none" stroke="#6C47FF" strokeWidth="2.5">
              <path className="hiw-question-line" pathLength="1" d="M24 210H110" />
              {[110,210,310].map(y => <path className="hiw-forecast-line" pathLength="1" key={y} d={`M110 210C155 210 150 ${y} 200 ${y}S300 210 350 210`} />)}
              <path className="hiw-price-line" pathLength="1" d="M350 210H455" />
              <circle className="hiw-seal" pathLength="1" cx="496" cy="210" r="40" />
              <path className="hiw-seal" pathLength="1" d="M478 210l12 12 25-27" />
            </g>
            <g fill="currentColor" fontFamily="inherit" fontSize="18">
              <text x="24" y="252">Question</text>
              <text x="200" y="62" textAnchor="middle">Forecasts</text>
              <text x="200" y="100" textAnchor="middle">Yes</text>
              <text x="200" y="200" textAnchor="middle">No</text>
              <text x="200" y="344" textAnchor="middle">Other</text>
              <g className="hiw-price"><text x="370" y="176" fontSize="32" fontWeight="600">64¢</text><text x="370" y="252">Price of Yes</text></g>
              <text x="496" y="302" textAnchor="middle">Verified</text>
            </g>
          </svg>
        </div>
        <ol className="hiw-steps">{steps.map(step => <li className="hiw-step" key={step.title}><h3>{step.title}</h3><p>{step.copy}</p></li>)}</ol>
      </div>
    </div>
  </section>;
}
export default HowItWorks;
