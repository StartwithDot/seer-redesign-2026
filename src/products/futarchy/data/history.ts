import type { MarketPoint } from './types';

export const createHistory = (seed: number, yes: number, impact: number): MarketPoint[] =>
  Array.from({ length: 12 }, (_, index) => {
    const wave = Math.sin((index + seed) * 1.17) * Math.max(0.002, Math.abs(yes) * 0.0018);
    const value = yes + wave + (index - 6) * impact * Math.max(0.001, Math.abs(yes) * 0.00008);
    return {
      at: `2026-10-${String(12 + index).padStart(2, '0')}T12:00:00Z`,
      yes: Number(value.toFixed(4)),
      no: Number((yes * 2 - value).toFixed(4)),
    };
  });
