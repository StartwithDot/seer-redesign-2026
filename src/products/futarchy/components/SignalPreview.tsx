import type { Market } from '../data/types';
import { compactMoney, signedPercent } from '../data/format';
import { DecisionSpine } from './DecisionSpine';
import { MarketAvatar } from './MarketAvatar';
import { SignalLegend } from './SignalLegend';

interface SignalPreviewProps {
  market: Market;
  organizationName: string;
  onOpen: (id: string) => void;
}

const verdictLabel = { include: 'Include', neutral: 'Neutral', exclude: 'Exclude' } as const;

export function SignalPreview({ market, organizationName, onOpen }: SignalPreviewProps) {
  return (
    <section className="signal-preview" aria-labelledby={`preview-${market.id}`}>
      <header className="preview-header">
        <MarketAvatar market={market} large />
        <div>
          <span className="eyebrow">{organizationName} · {market.token} · {market.chain}</span>
          <h2 id={`preview-${market.id}`}>{market.proposal}</h2>
          <p>{market.condition}</p>
        </div>
        <div className="preview-actions">
          <span className={`verdict verdict-${market.verdict}`}>{verdictLabel[market.verdict]}</span>
          <button className="primary-button" type="button" onClick={() => onOpen(market.id)}>Open market <span aria-hidden="true">→</span></button>
        </div>
      </header>
      <div className="preview-body">
        <DecisionSpine market={market} compact />
        <div className="signal-metrics">
          <article><span>YES PRICE</span><strong>${market.yesPrice.toFixed(market.yesPrice < 1 ? 4 : 2)}</strong><small>if it passes</small></article>
          <article><span>NO PRICE</span><strong>${market.noPrice.toFixed(market.noPrice < 1 ? 4 : 2)}</strong><small>if it fails</small></article>
          <article><span>IMPACT</span><strong className={market.impact >= 0 ? 'positive' : 'negative'}>{signedPercent(market.impact)}</strong><small>{compactMoney(market.volume)} traded</small></article>
        </div>
      </div>
      <SignalLegend />
    </section>
  );
}
