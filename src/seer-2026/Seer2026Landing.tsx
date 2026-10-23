import { useEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Seer2026Hero } from './Seer2026Hero';
import { InformationFinance } from './sections/InformationFinance';
import { Applications } from './sections/Applications';
import { HowItWorks } from './sections/HowItWorks';
import { Kleros } from './sections/Kleros';
import { FinalInvitation } from './sections/FinalInvitation';
import { useLenis } from './lib/useLenis';
import { usePageBackground } from './lib/usePageBackground';
import './seer2026.css';

export function Seer2026Landing() {
  const root = useRef<HTMLElement>(null);
  useLenis();
  usePageBackground(root);
  useEffect(() => {
    const previous = document.title;
    document.title = 'Seer | Where information becomes a market';
    let mounted = true;
    void document.fonts.ready.then(() => { if (mounted) ScrollTrigger.refresh(); });
    return () => { mounted = false; document.title = previous; };
  }, []);
  return <main ref={root} id="seer-top" className="s26-page" data-theme="light">
    <Seer2026Hero />
    <InformationFinance />
    <Applications />
    <HowItWorks />
    <Kleros />
    <FinalInvitation />
  </main>;
}
