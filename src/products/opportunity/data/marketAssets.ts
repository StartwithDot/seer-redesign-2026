import type { MarketRecord } from './types';
import { galleryFor } from './gallery';

const liveScreenshot = new URL(
  '../../../../assets/original_live_screenshots/opportunity_d0.png',
  import.meta.url,
).href;

export function marketImageFor(market: MarketRecord): string | null {
  if (market.id === 'seer-ai-job-board-name') return liveScreenshot;
  if (market.id === 'seer-rebrand-contest' || market.id === 'seer-merch-devcon-mumbai') return galleryFor(market.id)[0]?.images[0]?.url ?? null;
  return null;
}
