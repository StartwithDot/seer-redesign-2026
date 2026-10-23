import type { Repository } from '../data/types';

export function OutcomeAvatar({ repository, size = 'md' }: { repository: Repository; size?: 'sm' | 'md' | 'lg' }) {
  const initials = repository.owner.slice(0, 2).toUpperCase();
  return (
    <span className={`deep-v4-avatar is-${size}`} aria-hidden="true">
      <span>{initials}</span>
      <img
        key={repository.owner}
        src={`https://github.com/${repository.owner}.png?size=96`}
        alt=""
        loading="lazy"
        onError={(event) => { event.currentTarget.style.display = 'none'; }}
      />
    </span>
  );
}
