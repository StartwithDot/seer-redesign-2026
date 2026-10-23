const productLinks = [
  ['Explorer', '/explorer'],
  ['Deep', '/deep'],
  ['Futarchy', '/futarchy'],
  ['Opportunity', '/opportunity'],
  ['Risk', '/risk'],
];

export function ProductFooter() {
  return (
    <footer className="futarchy-footer" data-tour="footer">
      <div>
        <a className="futarchy-footer-title" href="#/">Futarchy</a>
        <p>Market-based evaluation of governance decisions and milestones.</p>
        <span className="data-chip">Market snapshot · 23 Oct 2026</span>
      </div>
      <nav aria-label="Seer products">
        {productLinks.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
      </nav>
      <nav aria-label="Futarchy community">
        <a href="https://x.com/seer_pm" target="_blank" rel="noreferrer">X ↗</a>
        <a href="https://github.com/seer-pm" target="_blank" rel="noreferrer">GitHub ↗</a>
      </nav>
    </footer>
  );
}
