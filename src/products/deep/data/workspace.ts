export type MobileWorkspace = 'chart' | 'list' | 'desk';
export type DeskWorkspace = 'desk' | 'repository' | 'funds';
export function mobileWorkspace(value: string | null): MobileWorkspace {
  return value === 'list' || value === 'desk' ? value : 'chart';
}
export function deskWorkspace(value: string | null): DeskWorkspace {
  return value === 'repository' || value === 'funds' ? value : 'desk';
}
export function mobileWorkspaceHref(workspace: MobileWorkspace, currentPath: string, origin: string): string {
  const current = new URL(currentPath, origin);
  const target = current.pathname === '/deep' && !current.searchParams.has('round') ? current : new URL('/deep', origin);
  target.searchParams.set('workspace', workspace);
  target.searchParams.delete('jump');
  return `${target.pathname}${target.search}`;
}
