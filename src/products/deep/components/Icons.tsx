type IconName = 'arrow' | 'book' | 'chart' | 'check' | 'chevron' | 'close' | 'copy' | 'download' | 'expand' | 'external' | 'globe' | 'menu' | 'moon' | 'pin' | 'refresh' | 'search' | 'sun' | 'wallet';

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  if (name === 'arrow') return <svg {...common}><path d="M5 12h13M14 7l5 5-5 5" /></svg>;
  if (name === 'book') return <svg {...common}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5zM20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z" /></svg>;
  if (name === 'chart') return <svg {...common}><path d="M4 19V5M4 19h16M7 15l4-4 3 2 5-6" /></svg>;
  if (name === 'check') return <svg {...common}><path d="m5 12 4 4L19 6" /></svg>;
  if (name === 'chevron') return <svg {...common}><path d="m8 10 4 4 4-4" /></svg>;
  if (name === 'close') return <svg {...common}><path d="M6 6l12 12M18 6 6 18" /></svg>;
  if (name === 'copy') return <svg {...common}><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></svg>;
  if (name === 'download') return <svg {...common}><path d="M12 3v12m0 0 5-5m-5 5-5-5M5 20h14" /></svg>;
  if (name === 'expand') return <svg {...common}><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5M3 8l6-6M21 8l-6-6M3 16l6 6M21 16l-6 6" /></svg>;
  if (name === 'external') return <svg {...common}><path d="M14 5h5v5M19 5l-8 8" /><path d="M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>;
  if (name === 'globe') return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.2 2.5 3.3 5.5 3.3 9S14.2 18.5 12 21c-2.2-2.5-3.3-5.5-3.3-9S9.8 5.5 12 3z" /></svg>;
  if (name === 'menu') return <svg {...common}><path d="M5 7h14M5 12h14M5 17h14" /></svg>;
  if (name === 'moon') return <svg {...common}><path d="M20 15.3A8 8 0 0 1 8.7 4 8.4 8.4 0 1 0 20 15.3z" /></svg>;
  if (name === 'pin') return <svg {...common}><path d="m9 4 6 2-2 5 4 4-5 1-3 4-1-5-5-1 5-3z" /></svg>;
  if (name === 'refresh') return <svg {...common}><path d="M20 7v5h-5M4 17v-5h5" /><path d="M6.1 8A7 7 0 0 1 18.7 7M17.9 16A7 7 0 0 1 5.3 17" /></svg>;
  if (name === 'search') return <svg {...common}><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg>;
  if (name === 'sun') return <svg {...common}><circle cx="12" cy="12" r="3.5" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>;
  return <svg {...common}><path d="M4 7h15a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h12v3" /><path d="M16 12h5M16 12h.01" /></svg>;
}
