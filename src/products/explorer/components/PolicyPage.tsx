import { externalLinks } from '../data/navigation';

interface PolicyPageProps {
  policy: 'verified' | 'rules';
  navigate: (hash: string) => void;
}

const policies = {
  verified: {
    label: 'Verified Market Policy',
    code: 'VP-01',
    summary: 'A verified market has a public resolution source, a reproducible resolution rule, and a named review state.',
    sections: [
      {
        title: 'Resolution source',
        body: 'The market record names the primary source and the exact observation window. A source must be reachable without a paid account.',
      },
      {
        title: 'Reproducible rule',
        body: 'The rule explains what is measured, which timestamps matter, and how ties or corrections are handled.',
      },
      {
        title: 'Review state',
        body: 'Verified means the record passed review. Verifying means review is active. Challenged means a dispute is open. Not Verified means the record has not completed review.',
      },
    ],
  },
  rules: {
    label: 'Market Rules Policy',
    code: 'MR-02',
    summary: 'Market rules must make the winning outcome knowable from the resolution source before trading begins.',
    sections: [
      {
        title: 'Objective wording',
        body: 'Questions use observable events, named dates, explicit units, and unambiguous entities. Undefined subjective language is not accepted.',
      },
      {
        title: 'Edge cases',
        body: 'The rules cover cancellations, corrections, delayed reports, partial events, and outcomes that occur after the deadline.',
      },
      {
        title: 'Invalid outcome',
        body: 'When the source cannot produce an answer under the written rule, the Invalid outcome resolves instead of forcing a judgment.',
      },
    ],
  },
} as const;

export function PolicyPage({ policy, navigate }: PolicyPageProps) {
  const record = policies[policy];
  return (
    <section className="policy-page" data-align="container">
      <div className="record-breadcrumb">
        <button type="button" onClick={() => navigate('#/markets')}>Markets</button>
        <span aria-hidden="true">/</span>
        <span>Policies</span>
        <span aria-hidden="true">/</span>
        <strong>{record.code}</strong>
      </div>

      <div className="policy-record">
        <div className="policy-title">
          <div>
            <p className="eyebrow">Policy record · {record.code}</p>
            <h1>{record.label}</h1>
            <p>{record.summary}</p>
          </div>
          <div className="policy-actions">
            <a className="primary-button" href={externalLinks.liveApp} target="_blank" rel="noreferrer">Open in Seer app <span aria-hidden="true">↗</span></a>
            <button className="secondary-button" type="button" onClick={() => navigate('#/markets')}>Return to Markets</button>
          </div>
        </div>

        <div className="policy-sections">
          {record.sections.map((section, index) => (
            <article key={section.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </article>
          ))}
        </div>

        <div className="policy-record-footer">
          <div>
            <span className="field-label">Policy status</span>
            <strong className="status-pill">Published</strong>
          </div>
          <div>
            <span className="field-label">Applies to</span>
            <strong>All Seer markets</strong>
          </div>
          <div>
            <span className="field-label">Authority</span>
            <strong>Market Rules Council</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
