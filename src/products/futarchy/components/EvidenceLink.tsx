import type { ReactNode } from 'react';

export function EvidenceLink({ href, kind, children, className }: { href: string; kind: 'reality' | 'snapshot'; children: ReactNode; className?: string }) {
  const valid = kind === 'reality'
    ? /^https:\/\/reality\.eth\.limo\/.*question\/0x[0-9a-f]{64}(?:[/?&#]|$)/i.test(href)
    : /^https:\/\/snapshot\.(?:box|org)\/.*proposal\/0x[0-9a-f]{64}(?:[/?&#]|$)/i.test(href);
  return valid
    ? <a className={className} href={href} target="_blank" rel="noreferrer">{children}</a>
    : <button className={className} type="button" disabled title="A complete canonical question or proposal ID is missing from this research snapshot.">{children} · source unavailable</button>;
}
