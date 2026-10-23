const products = [
  ['Explorer', '/explorer'],
  ['Deep', '/deep'],
  ['Futarchy', '/futarchy'],
  ['Opportunity', '/opportunity'],
  ['Risk Pricing', '/risk'],
];

const community = [
  ['Kleros', 'https://kleros.io'],
  ['Telegram', 'https://t.me/Seerpredictionmarket'],
  ['X', 'https://x.com/seer_pm'],
  ['GitHub', 'https://github.com/seer-pm'],
];

export function Footer() {
  return (
    <footer className="deep-footer">
      <a className="deep-footer__callout" href="https://app.seer.pm/?chains=10" target="_blank" rel="noreferrer">
        <span><small>Trading one market at a time?</small><strong>Browse every Seer market in the Explorer.</strong></span>
        <span>Browse on Seer <b aria-hidden="true">↗</b></span>
      </a>
      <div className="deep-footer__links">
        <nav aria-label="Seer products">
          <strong>Seer products</strong>
          {products.map(([label, href]) => <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}>{label}</a>)}
        </nav>
        <nav aria-label="Protocol and community">
          <strong>Protocol and community</strong>
          {community.map(([label, href]) => <a key={label} href={href} target="_blank" rel="noreferrer">{label}</a>)}
        </nav>
      </div>
    </footer>
  );
}
