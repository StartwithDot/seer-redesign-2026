interface BetaStripProps {
  visible: boolean;
  onDismiss: () => void;
}

export function BetaStrip({ visible, onDismiss }: BetaStripProps) {
  if (!visible) return null;
  return (
    <aside className="beta-strip" aria-label="Beta notice">
      <div>
        <strong>Explorer beta</strong>
        <span>Captured and illustrative markets. Check the live app before trading.</span>
      </div>
      <button type="button" onClick={onDismiss} aria-label="Dismiss beta notice">×</button>
    </aside>
  );
}
