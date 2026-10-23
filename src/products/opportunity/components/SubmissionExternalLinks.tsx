import type { SubmissionExternalLink } from '../data/types';
import { ValueState } from './ValueState';

interface SubmissionExternalLinksProps {
  links: SubmissionExternalLink[];
  onNavigate: (href: string) => void;
}

export function SubmissionExternalLinks({ links, onNavigate }: SubmissionExternalLinksProps) {
  return (
    <section className="submission-external-links" aria-labelledby="submission-external-links-title">
      <div className="review-section-heading">
        <div>
          <p className="section-kicker">Linked records</p>
          <h3 id="submission-external-links-title">Proposal, creator, and chain evidence</h3>
        </div>
      </div>
      <ul>
        {links.map((link) => (
          <li key={link.id} data-link-kind={link.kind}>
            <span>{link.label}</span>
            {link.url ? (
              <a
                href={link.url}
                target={link.url.startsWith('/') ? undefined : '_blank'}
                rel={link.url.startsWith('/') ? undefined : 'noreferrer'}
                onClick={(event) => {
                  if (!link.url?.startsWith('/')) return;
                  event.preventDefault();
                  onNavigate(link.url);
                }}
              >
                Open <span aria-hidden="true">{link.url.startsWith('/') ? '→' : '↗'}</span>
              </a>
            ) : (
              <ValueState state={link.state} />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
