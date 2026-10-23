import { type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { usePopover } from '../hooks/usePopover';

interface PopoverProps {
  id: string;
  label: string;
  icon?: ReactNode;
  className?: string;
  children: (close: () => void) => ReactNode;
}

export function Popover({ id, label, icon, className = '', children }: PopoverProps) {
  const menu = usePopover(id);
  const menuId = `${id}-popover`;

  return (
    <div className={`popover-root ${className}`} ref={menu.root} onKeyDown={menu.keydown}
      onPointerEnter={(event) => { if (event.pointerType !== 'touch') menu.hover(true); }}
      onPointerLeave={(event) => { if (event.pointerType !== 'touch') menu.hover(false); }}
      onBlurCapture={(event) => { if (!menu.root.current?.contains(event.relatedTarget) && !menu.panel.current?.contains(event.relatedTarget)) menu.close(); }}>
      <button
        className="popover-trigger"
        type="button"
        aria-expanded={menu.open}
        aria-controls={menu.open ? menuId : undefined}
        aria-haspopup="dialog"
        onClick={() => menu.open ? menu.close() : menu.show()}
      >
        {icon}
        <span>{label}</span>
        <span className="popover-caret" aria-hidden="true">⌄</span>
      </button>
      {menu.open && createPortal(<div ref={menu.panel} className={`popover-panel ${className}`} id={menuId} role="dialog" aria-label={label} data-overlay
        style={{ left: menu.position.left, top: menu.position.top, maxHeight: menu.position.maxHeight }}
        onPointerEnter={menu.cancel} onPointerLeave={() => menu.hover(false)} onKeyDown={menu.keydown}
        onBlurCapture={(event) => { if (!menu.panel.current?.contains(event.relatedTarget) && !menu.root.current?.contains(event.relatedTarget)) menu.close(); }}>
        {children(menu.close)}
      </div>, document.querySelector('.explorer-shell') ?? document.body)}
    </div>
  );
}
