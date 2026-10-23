import { canvasStyle, COLORS, label, roundedRect, STAGE, useVisualCanvas, type VisualDraw, type VisualProps } from './shared';

type Market = { question: string; type: 'Binary' | 'Scalar' | 'Multi' | 'Futarchy'; price: number; state: 'Open' | 'Resolved'; asker: string; priced: string; read: string };
// Owner's seerScene vocabulary, with type-appropriate signals rather than % on scalar prices.
const markets: readonly Market[] = [
  { question: 'Will ETH flip BTC?', type: 'Binary', price: 12, state: 'Open', asker: 'A market creator', priced: 'Chance of Yes', read: 'Read the chance' },
  { question: 'ETH price at year end?', type: 'Scalar', price: 5420, state: 'Open', asker: 'A market creator', priced: 'ETH in USD', read: 'Read the estimate' },
  { question: 'Which chain leads TVL?', type: 'Multi', price: 38, state: 'Open', asker: 'A market creator', priced: 'Ethereum leads', read: 'Compare outcomes' },
  { question: 'Enable the fee switch?', type: 'Futarchy', price: 53, state: 'Open', asker: 'A DAO', priced: 'Token price if pass', read: 'Compare pass / fail' },
  { question: 'BTC above $100K?', type: 'Binary', price: 62, state: 'Open', asker: 'A market creator', priced: 'Chance of Yes', read: 'Read the chance' },
  { question: 'Did ETH move to PoS?', type: 'Binary', price: 100, state: 'Resolved', asker: 'A market creator', priced: 'Resolved Yes', read: 'Read the result' },
  { question: 'Who wins the AI contest?', type: 'Multi', price: 36, state: 'Open', asker: 'Contest organizers', priced: 'Agent wins', read: 'Compare outcomes' },
  { question: 'Fed cuts in December?', type: 'Binary', price: 62, state: 'Open', asker: 'A market creator', priced: 'Chance of Yes', read: 'Read the chance' },
  { question: 'L2 fees below 1 cent?', type: 'Binary', price: 69, state: 'Open', asker: 'A market creator', priced: 'Chance of Yes', read: 'Read the chance' },
  { question: 'Treasury diversifies?', type: 'Futarchy', price: 46, state: 'Open', asker: 'A DAO', priced: 'Token price if pass', read: 'Compare pass / fail' },
  { question: 'Which grant track wins?', type: 'Multi', price: 71, state: 'Open', asker: 'Grant reviewers', priced: 'AI agents track', read: 'Compare outcomes' },
  { question: 'ETH above $6K in June?', type: 'Binary', price: 41, state: 'Open', asker: 'A market creator', priced: 'Chance of Yes', read: 'Read the chance' },
];
// Complete rows keep each question and its signal readable throughout the animation.
const visibleMarkets = [markets[0], markets[1], markets[2], markets[3]];
const draw: VisualDraw = (ctx, frame) => {
  const selected = frame.reducedMotion ? 0 : Math.floor(frame.time / 6) % visibleMarkets.length;
  label(ctx, 'Explore every market type', 24, 32, { size: 20, weight: 600, color: COLORS.ink });
  visibleMarkets.forEach((market, index) => {
    const y = 68 + index * 66;
    const focused = index === selected;
    if (focused) {
      roundedRect(ctx, 16, y - 4, 448, 60);
      ctx.fillStyle = '#EFE9FC'; ctx.fill();
    }
    const price = market.type === 'Scalar' ? '$5,420' : market.type === 'Futarchy' ? '$0.53' : `${market.price}%`;
    label(ctx, market.question, 28, y + 12, { size: 17, weight: 550, color: COLORS.ink, halo: focused ? '#EFE9FC' : COLORS.white });
    label(ctx, price, 452, y + 12, { size: 20, weight: 600, color: COLORS.violet, align: 'right', halo: focused ? '#EFE9FC' : COLORS.white, tabular: true });
    label(ctx, market.type, 28, y + 36, { size: 16, halo: focused ? '#EFE9FC' : COLORS.white });
    label(ctx, market.priced, 452, y + 36, { size: 16, align: 'right', halo: focused ? '#EFE9FC' : COLORS.white });
  });
  const market = visibleMarkets[selected];
  label(ctx, `Asked by ${market.asker.toLowerCase()}`, 28, 366, { size: 16, color: COLORS.ink });
  label(ctx, market.read, 28, 394, { size: 17, color: COLORS.violet, weight: 600 });
};

export function SeerAppVisual({ active }: VisualProps) {
  const canvas = useVisualCanvas(active, draw);
  return <canvas ref={canvas} width={STAGE.width} height={STAGE.height} style={canvasStyle} role="img"
    aria-label="Seer App explores Binary, Scalar, Multi and Futarchy markets. Complete question rows show type-appropriate prices. The highlighted row explains who asks and how to read the signal.">
    Explore all market types and read the market signal without trading.
  </canvas>;
}
export default SeerAppVisual;
