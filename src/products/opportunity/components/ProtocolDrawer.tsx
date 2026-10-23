import { protocolStages } from '../data/markets';
import { OverlayDialog } from './OverlayDialog';

export function ProtocolDrawer({ onClose }: { onClose: () => void }) {
  return (
    <OverlayDialog
      title="Protocol roadmap"
      description="The pilot is operated today. The long-term roadmap is permissionless market creation."
      variant="drawer"
      onClose={onClose}
    >
      <ol className="protocol-roadmap">
        {protocolStages.map((stage, index) => (
          <li key={stage.id}>
            <span className="protocol-index">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3>{stage.label}</h3>
              <p>{stage.description}</p>
              <small>{stage.evidence}</small>
            </div>
          </li>
        ))}
      </ol>
      <aside className="authority-note">
        <strong>Human authority stays explicit.</strong>
        <p>Market prices prioritize review attention. Sponsors and voters make the final decision.</p>
      </aside>
      <dl className="launch-roadmap">
        <div><dt>TODAY</dt><dd>Seer One operates it</dd></div>
        <div><dt>NEXT</dt><dd>Anyone launches</dd></div>
        <div><dt>ANY DECISION</dt><dd>One shared layer</dd></div>
      </dl>
      <a className="secondary-action" href="https://app.seer.pm" target="_blank" rel="noreferrer">Open Seer to launch a market ↗</a>
    </OverlayDialog>
  );
}
