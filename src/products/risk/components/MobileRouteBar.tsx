import type { RiskSection } from '../data/types';

const destinations: Array<[RiskSection, string]> = [['overview', 'Overview'], ['assets', 'Assets'], ['history', 'Over time'], ['participate', 'Participate']];
export function MobileRouteBar({ section, onNavigate }: { section: RiskSection; onNavigate: (section: RiskSection) => void }) {
  return <nav className="risk-mobile-route-bar" aria-label="Risk sections">
    {destinations.map(([id, label]) => <button key={id} type="button" aria-current={id === section ? 'page' : undefined} onClick={() => onNavigate(id)}>{label}</button>)}
  </nav>;
}
