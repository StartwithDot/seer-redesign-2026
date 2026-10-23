import { externalLinks } from '../data/navigation';

interface NotFoundPageProps {
  routePath: string;
  navigate: (hash: string) => void;
  kind?: 'not-found' | 'not-in-sample';
}

export function NotFoundPage({ routePath, navigate, kind }: NotFoundPageProps) {
  const state = kind ?? (routePath.startsWith('/markets/') ? 'not-in-sample' : 'not-found');
  const isSampleGap = state === 'not-in-sample';
  return (
    <section className="not-found-page" data-align="container">
      <div className={`error-plate is-${state}`}>
        <p className="eyebrow">{isSampleGap ? 'Not in sample' : 'Route not found'}</p>
        <h1>{isSampleGap ? 'This Explorer route has no sample record.' : 'This Explorer route does not exist.'}</h1>
        <code>{routePath}</code>
        <p>{isSampleGap ? 'The route is valid browser history, but it is outside this deterministic market sample.' : 'Check the address or return to the market index.'}</p>
        <div>
          <button className="primary-button" type="button" onClick={() => navigate('#/markets')}>Return to Markets</button>
          <a className="secondary-button" href={externalLinks.liveApp} target="_blank" rel="noreferrer">Open in Seer app ↗</a>
        </div>
      </div>
    </section>
  );
}
