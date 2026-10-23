export function ExplorerNavigation({ current }: { current?: string }) {
  const links = [
    ['markets', 'Markets', '#/explorer'], ['leaderboard', 'Leaderboard', '#/explorer/leaderboard'],
    ['create', 'Create Market', '#/create'], ['policies', 'Policies', '#/explorer/policies'],
    ['app', 'App', '#/'], ['help', 'Help', '#/explorer/help'],
  ];
  return <nav className="explorer-navigation" aria-label="Explorer navigation">{links.map(([id, label, href]) => <a key={id} href={href} aria-current={current === id ? 'page' : undefined}>{label}</a>)}</nav>;
}
