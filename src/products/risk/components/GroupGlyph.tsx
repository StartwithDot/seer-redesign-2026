import type { RiskGroup } from '../data/types';

interface GroupGlyphProps {
  group: RiskGroup;
  size?: number;
}

export function GroupGlyph({ group, size = 22 }: GroupGlyphProps) {
  const shape = {
    'ETH Based': 'diamond',
    'USD Based': 'circle',
    'BTC Based': 'square',
    'Funds Based': 'hex',
  }[group];

  return <svg className={`risk-group-glyph is-${shape}`} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    {shape === 'diamond' && <><path d="M12 2.5 21.5 12 12 21.5 2.5 12 12 2.5Z" /><path d="M12 7v10M8.5 12h7" /></>}
    {shape === 'circle' && <><circle cx="12" cy="12" r="9" /><path d="M7.5 12h9M12 7.5v9" /></>}
    {shape === 'square' && <><rect x="3.5" y="3.5" width="17" height="17" rx="2" /><path d="M9 8v8M15 8v8" /></>}
    {shape === 'hex' && <><path d="m12 2.8 8 4.6v9.2l-8 4.6-8-4.6V7.4l8-4.6Z" /><circle cx="12" cy="12" r="2.3" /></>}
  </svg>;
}
