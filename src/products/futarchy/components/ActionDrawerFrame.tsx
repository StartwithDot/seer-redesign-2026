import { useModal } from '../hooks/useModal';
import { useId, useRef, type ReactNode } from 'react';

interface ActionDrawerFrameProps {
  eyebrow: string;
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
}

export function ActionDrawerFrame({ eyebrow, title, children, onClose, footer }: ActionDrawerFrameProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useModal(panelRef, true, onClose, closeRef);

  return (
    <div className="action-drawer-layer" data-modal-layer>
      <button className="action-drawer-backdrop" type="button" data-modal-backdrop tabIndex={-1} aria-label="Close market actions" onClick={onClose} />
      <aside className="action-drawer" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={panelRef} tabIndex={-1}>
        <header>
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h2 id={titleId}>{title}</h2>
          </div>
          <button className="action-drawer-close" type="button" ref={closeRef} onClick={onClose} aria-label="Close market actions">×</button>
        </header>
        <div className="action-drawer-body">{children}</div>
        {footer && <footer>{footer}</footer>}
      </aside>
    </div>
  );
}
