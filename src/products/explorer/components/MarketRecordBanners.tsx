import { externalLinks } from '../data/externalLinks';
import type { Market } from '../types';

export function MarketRecordBanners({ market, navigate }: { market: Market; navigate: (hash: string) => void }) {
  return (
    <div className="record-banners">
      {market.parent && (
        <section className="record-banner conditional-banner" aria-labelledby="conditional-banner-title">
          <div>
            <span className="eyebrow">Conditional market</span>
            <h2 id="conditional-banner-title">This market only matters if its parent resolves first.</h2>
          </div>
          <div>
            <p>
              Parent: <button type="button" onClick={() => navigate(`#/markets/${market.parent?.chainId ?? market.chainId}/${market.parent?.slug}`)}>{market.parent.question}</button>
            </p>
            <p><strong>Worthless-token warning:</strong> if <strong>{market.parent.outcome}</strong> does not resolve true, these conditional tokens redeem at zero.</p>
          </div>
        </section>
      )}
      {market.verification !== 'verified' && (
        <section className="record-banner warning-banner" aria-labelledby="verification-banner-title">
          <div>
            <span className="eyebrow">Verification caution</span>
            <h2 id="verification-banner-title">
              {market.verification === 'not-verified' ? 'This market has not completed verification.' : 'This market has an open verification question.'}
            </h2>
          </div>
          <div>
            <p>Review the written resolution rule and creator record before committing capital.</p>
            <a className="secondary-button" href={externalLinks.klerosCuration} target="_blank" rel="noreferrer">Verify it ↗</a>
          </div>
        </section>
      )}
    </div>
  );
}
