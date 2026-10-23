import type { ResolutionContextRecord } from '../data/decisionFlow';

interface ResolutionContextProps {
  context: ResolutionContextRecord;
}

export function ResolutionContext({ context }: ResolutionContextProps) {
  return (
    <details className="resolution-context">
      <summary>Resolution and dispute path</summary>
      <div>
        <p>{context.reality}</p>
        <p>{context.kleros}</p>
        <p>{context.sponsorAuthority}</p>
        <div className="resolution-links">
          <a href="https://reality.eth.limo" target="_blank" rel="noreferrer">Reality.eth <span aria-hidden="true">↗</span></a>
          <a href="https://kleros.io" target="_blank" rel="noreferrer">Kleros <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </details>
  );
}
