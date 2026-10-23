import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type RefObject,
} from 'react';

interface OverlayDialogProps {
  title: string;
  description?: string;
  variant?: 'modal' | 'drawer';
  initialFocusRef?: RefObject<HTMLElement | null>;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  nonBlocking?: boolean;
}

let scrollLocks = 0;
let originalOverflow = '';

export function OverlayDialog({
  title,
  description,
  variant = 'modal',
  initialFocusRef,
  onClose,
  children,
  footer,
  nonBlocking = false,
}: OverlayDialogProps) {
  const [desktop, setDesktop] = useState(() => matchMedia('(min-width: 1600px)').matches);
  const modal = !(nonBlocking && desktop);
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const query = matchMedia('(min-width: 1600px)');
    const change = () => setDesktop(query.matches);
    query.addEventListener('change', change);
    return () => query.removeEventListener('change', change);
  }, []);

  useEffect(() => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const frame = window.requestAnimationFrame(() => {
      (initialFocusRef?.current ?? dialogRef.current)?.focus();
    });
    if (modal) {
      if (scrollLocks++ === 0) originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    const containFocus = (event: FocusEvent) => {
      const dialogs = document.querySelectorAll('[role="dialog"]');
      if (modal && dialogs[dialogs.length - 1] === dialogRef.current && !dialogRef.current?.contains(event.target as Node)) {
        dialogRef.current?.focus();
      }
    };
    document.addEventListener('focusin', containFocus);
    return () => {
      window.cancelAnimationFrame(frame);
      if (modal && --scrollLocks === 0) document.body.style.overflow = originalOverflow;
      document.removeEventListener('focusin', containFocus);
      if (returnFocusRef.current?.isConnected) returnFocusRef.current.focus();
    };
  }, [initialFocusRef, modal]);

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      const dialogs = document.querySelectorAll('[role="dialog"]');
      if (dialogs[dialogs.length - 1] !== dialogRef.current) return;
      event.preventDefault();
      event.stopPropagation();
      onClose();
      return;
    }
    if (!modal || event.key !== 'Tab' || !dialogRef.current) return;
    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter(element => element.getClientRects().length > 0);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      className={`overlay-backdrop overlay-backdrop--${variant}${!modal ? ' overlay-backdrop--nonblocking' : ''}`}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className={`overlay-dialog overlay-dialog--${variant}`}
        role="dialog"
        aria-modal={modal ? true : undefined}
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        onKeyDown={onKeyDown}
      >
        <div className="overlay-header">
          <div>
            <p className="overlay-kicker">Opportunity Markets</p>
            <h2 id={titleId}>{title}</h2>
            {description && <p id={descriptionId}>{description}</p>}
          </div>
          <button className="overlay-close" type="button" onClick={onClose}>
            <span aria-hidden="true">×</span>
            <span className="sr-only">Close</span>
          </button>
        </div>
        <div className="overlay-body">{children}</div>
        {footer && <div className="overlay-footer">{footer}</div>}
      </div>
    </div>
  );
}
