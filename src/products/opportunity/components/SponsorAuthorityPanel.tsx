import type { SponsorAuthorityRecord } from '../data/decisionFlow';

const sponsorLogo = new URL('../../../../assets/brand/logo.svg', import.meta.url).href;

interface SponsorAuthorityPanelProps {
  authority: SponsorAuthorityRecord;
}

export function SponsorAuthorityPanel({ authority }: SponsorAuthorityPanelProps) {
  return (
    <section className="sponsor-authority-panel" aria-labelledby="sponsor-authority-title">
      <header>
        <span className="sponsor-avatar" aria-hidden="true">
          <img src={sponsorLogo} alt="" />
        </span>
        <div>
          <p className="section-kicker">Human authority</p>
          <h3 id="sponsor-authority-title">{authority.sponsor}</h3>
          <span>{authority.scope}</span>
        </div>
      </header>
      <dl>
        <div><dt>Deadline</dt><dd>{authority.deadline}</dd></div>
        <div><dt>Quorum</dt><dd>{authority.quorum}</dd></div>
        <div><dt>Rules</dt><dd>{authority.rules}</dd></div>
      </dl>
      <div className="decision-history">
        <span>Decision history</span>
        <ul>
          {authority.history.map((entry) => <li key={entry}>{entry}</li>)}
        </ul>
      </div>
    </section>
  );
}
