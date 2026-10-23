import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 20 20',
  fill: 'none',
  'aria-hidden': true,
} as const;

export const SearchIcon = (props: IconProps) => (
  <svg {...base} {...props}><circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.7" /><path d="m13 13 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
);
export const WalletIcon = (props: IconProps) => (
  <svg {...base} {...props}><path d="M3 5.5h12.5A1.5 1.5 0 0 1 17 7v8a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 2 15V5a1.5 1.5 0 0 1 1.5-1.5H14" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M13.5 9h4v4h-4a2 2 0 1 1 0-4Z" stroke="currentColor" strokeWidth="1.6" /></svg>
);
export const SunIcon = (props: IconProps) => (
  <svg {...base} {...props}><circle cx="10" cy="10" r="3.25" stroke="currentColor" strokeWidth="1.6" /><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.3 4.3l1.4 1.4M14.3 14.3l1.4 1.4M15.7 4.3l-1.4 1.4M5.7 14.3l-1.4 1.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
);
export const MoonIcon = (props: IconProps) => (
  <svg {...base} {...props}><path d="M16.5 13.2A7 7 0 0 1 6.8 3.5a7 7 0 1 0 9.7 9.7Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>
);
export const BackIcon = (props: IconProps) => (
  <svg {...base} {...props}><path d="M17 10H4M9 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
export const HelpIcon = (props: IconProps) => (
  <svg {...base} {...props}><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.6" /><path d="M8.3 7.8a1.8 1.8 0 1 1 2.5 1.7c-.7.3-.8.8-.8 1.5M10 14h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
);
