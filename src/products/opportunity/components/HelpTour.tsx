import { useUrlDialog } from '../hooks/useUrlDialog';
import type { PanelId } from '../hooks/useUrlPanel';
import { OverlayDialog } from './OverlayDialog';
import { currentMarket } from '../data/markets';
import { MarketExplainer } from './MarketExplainer';

export function HelpTour({ onClose, onNavigate, onOpenPanel, onStartTour }: {
  onClose: () => void; onNavigate: (href: string) => void;
  onOpenPanel: (panel: PanelId) => void; onStartTour: () => void;
}) {
  const [explaining, setExplaining] = useUrlDialog('explainer');
  if (explaining === 'open') return <MarketExplainer onClose={() => setExplaining(null)} onGuide={onStartTour} />;
  return <OverlayDialog title="How Opportunity works" description="Market signals guide review. Sponsors retain final authority." onClose={onClose} footer={<button className="primary-action" type="button" onClick={onStartTour}>Start guided tour</button>}>
    <div className="help-grid">
      <button type="button" onClick={onStartTour}><strong>Product tour</strong><span>Eight steps highlighting the actual controls.</span></button>
      <button type="button" onClick={() => onNavigate(`/opportunity/review/${currentMarket.id}`)}><strong>Open the live pilot</strong><span>Inspect the 235-submission review workspace.</span></button>
      <button type="button" onClick={() => setExplaining('open')}><strong>How markets work</strong><span>Explore the five steps from entries to payout.</span></button>
      <button type="button" onClick={() => onOpenPanel('protocol')}><strong>Protocol roadmap</strong><span>See discovery, pricing, decision, and resolution.</span></button>
    </div>
  </OverlayDialog>;
}
