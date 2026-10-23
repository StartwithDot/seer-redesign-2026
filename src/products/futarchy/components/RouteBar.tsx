import { BackIcon } from './Icons';

interface RouteBarProps {
  label: string;
  parentLabel: string;
  fallback: () => void;
}

export function RouteBar({ label, parentLabel, fallback }: RouteBarProps) {
  return (
    <nav className="route-bar" aria-label="Breadcrumb">
      <button
        type="button"
        title="Return to the previous view"
        onClick={() => window.history.length > 1 ? window.history.back() : fallback()}
      >
        <BackIcon />Back
      </button>
      <a href="#/">Futarchy</a><span>/</span>
      <a href={`#/?section=${parentLabel.toLowerCase()}`}>{parentLabel}</a><span>/</span>
      <strong aria-current="page">{label}</strong>
    </nav>
  );
}
