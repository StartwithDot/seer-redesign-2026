import { useEffect, useState, type ReactNode } from 'react';
import type { ShellNavItem } from '../../shared/Shell';
import { useMobileNavigation } from '../hooks/useMobileNavigation';

const logo = new URL('../../../../assets/brand/logo.svg', import.meta.url).href;

interface AppShellProps {
  navItems: ShellNavItem[];
  headerControls: ReactNode;
  children: ReactNode;
}

export function AppShell({ navItems, headerControls, children }: AppShellProps) {
  const { open: mobileOpen, setOpen: setMobileOpen, menuRef, toggleRef, onToggleKeyDown } = useMobileNavigation();
  const [scrolled, setScrolled] = useState(() => window.scrollY > 18);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    const onResize = () => {
      if (window.innerWidth > 1000) setMobileOpen(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const activate = (item: ShellNavItem) => {
    if (mobileOpen) toggleRef.current?.focus();
    setMobileOpen(false);
    item.onClick?.();
  };

  return (
    <div className="futarchy-shell">
      <a
        className="futarchy-skip"
        href="#futarchy-main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('futarchy-main')?.focus();
        }}
      >
        Skip to content
      </a>
      <header className={`futarchy-header${scrolled ? ' is-scrolled' : ''}`}>
        <a className="futarchy-brand" href="#/" aria-label="Futarchy home" data-tour="brand" onClick={() => setMobileOpen(false)}>
          <img src={logo} alt="" width="138" height="64" />
          <span>Futarchy</span>
        </a>
        <nav className="futarchy-nav" aria-label="Futarchy destinations">
          {navItems.map((item) => (
            <button key={item.id} type="button" data-tour={item.id} onClick={() => activate(item)}>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="futarchy-header-actions" data-tour="utilities">{headerControls}</div>
        <button
          className="futarchy-menu-button"
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="futarchy-mobile-menu"
          data-tour="mobile-navigation"
          ref={toggleRef}
          onKeyDown={onToggleKeyDown}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span aria-hidden="true">{mobileOpen ? '×' : '☰'}</span>
          <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
        </button>
        {mobileOpen && (
          <nav id="futarchy-mobile-menu" className="futarchy-mobile-menu" ref={menuRef} aria-label="Mobile Futarchy destinations">
            {navItems.map((item) => (
              <button key={item.id} type="button" onClick={() => activate(item)}>{item.label}</button>
            ))}
          </nav>
        )}
      </header>
      <main id="futarchy-main" tabIndex={-1}>{children}</main>
    </div>
  );
}
