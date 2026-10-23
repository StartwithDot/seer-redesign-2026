import type { MarketOutcome } from '../types';

interface OutcomeAvatarProps {
  outcome: MarketOutcome;
  compact?: boolean;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function OutcomeAvatar({ outcome, compact = false }: OutcomeAvatarProps) {
  return (
    <span className={`outcome-avatar tone-${outcome.color} ${compact ? 'is-compact' : ''}`} aria-hidden="true">
      {outcome.image ? <img src={outcome.image} alt="" /> : initials(outcome.name)}
    </span>
  );
}
