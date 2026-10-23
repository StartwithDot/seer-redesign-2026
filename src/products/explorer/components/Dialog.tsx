import { useId, useRef, type ReactNode } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface DialogProps {
  open: boolean;
  suspended?: boolean;
  title: string;
  description?: string;
  className?: string;
  onClose: () => void;
  children: ReactNode;
}

export function Dialog({ open, suspended = false, title, description, className = '', onClose, children }: DialogProps) {
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open && !suspended, dialogRef, onClose);

  if (!open) return null;

  return (
    <div className="explorer-dialog-layer" role="presentation" style={suspended ? { display: 'none' } : undefined} inert={suspended}>
      <button className="explorer-dialog-backdrop" type="button" aria-label="Close dialog" onClick={onClose} />
      <div
        ref={dialogRef}
        className={`explorer-dialog ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
      >
        <div className="explorer-dialog-heading">
          <div>
            <p className="eyebrow">Seer Explorer</p>
            <h2 id={titleId}>{title}</h2>
            {description && <p id={descriptionId}>{description}</p>}
          </div>
          <button className="icon-button" type="button" onClick={onClose} data-tooltip="Close">
            <span aria-hidden="true">×</span>
            <span className="sr-only">Close</span>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
