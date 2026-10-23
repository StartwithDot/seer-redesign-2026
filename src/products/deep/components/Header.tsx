import { useDeepState } from '../state/DeepState';
import { CommandSearch } from './CommandSearch';
import { Icon } from './Icons';
import { WalletControl } from './WalletControl';

export type DeepRouteKind = 'markets' | 'leaderboard' | 'contests' | 'contest' | 'repository';

const products = [
  ['Markets', '/explorer'],
  ['Deep', '/deep'],
  ['Futarchy', '/futarchy'],
  ['Opportunities', '/opportunity'],
  ['Risk', '/risk'],
];

export function Header({ onGuide }: { routeKind: DeepRouteKind; onGuide: () => void }) {
  const { theme, toggleTheme } = useDeepState();
  return (
    <header className="deep-v4-nav">
      <div className="deep-v4-nav__inner">
        <a className="deep-v4-logo" href="/" aria-label="Seer home"><span aria-hidden="true" /><b>seer</b></a>
        <nav className="deep-v4-product-links" aria-label="Seer products">
          {products.map(([label, href]) => <a key={label} href={href} aria-current={label === 'Deep' ? 'page' : undefined}>{label}</a>)}
          <a href="https://docs.seer.pm" target="_blank" rel="noreferrer">Docs</a>
        </nav>
        <details className="deep-v4-mobile-menu">
          <summary aria-label="Open product navigation">Menu</summary>
          <nav aria-label="Mobile Seer products">
            {products.map(([label, href]) => <a key={label} href={href} aria-current={label === 'Deep' ? 'page' : undefined}>{label}</a>)}
            <a href="/deep/contests">Contests</a>
            <a href="/deep/leaderboard">Leaderboard</a>
          </nav>
        </details>
        <div className="deep-v4-nav__actions">
          <CommandSearch />
          <button className="deep-v4-icon-button" type="button" onClick={onGuide} aria-label="Open Deep guide"><Icon name="book" /></button>
          <button className="deep-v4-icon-button" type="button" onClick={toggleTheme} aria-label={`Use ${theme === 'dark' ? 'light' : 'dark'} theme`}>
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
          </button>
          <WalletControl />
        </div>
      </div>
    </header>
  );
}
