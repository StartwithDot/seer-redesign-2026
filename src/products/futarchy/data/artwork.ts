import type { MarketArtworkId } from './types';

const assets = {
  lens: new URL('../../../../public/video/lens.jpg', import.meta.url).href,
  architecture: new URL('../../../../public/assets/seer-2026/architecture-hero.webp', import.meta.url).href,
  fanout: new URL('../../../../public/assets/x_post/c.png', import.meta.url).href,
  cloud: new URL('../../../../public/assets/seer-2026/cloud-near.webp', import.meta.url).href,
  prism: new URL('../../../../assets/reference-prism.webp', import.meta.url).href,
} satisfies Record<MarketArtworkId, string>;

export const marketArtwork: Record<MarketArtworkId, { src: string; alt: string }> = {
  lens: { src: assets.lens, alt: 'Seer lens artwork' },
  architecture: { src: assets.architecture, alt: 'Seer architecture artwork' },
  fanout: { src: assets.fanout, alt: 'Seer branching line artwork' },
  cloud: { src: assets.cloud, alt: 'Seer cloud study artwork' },
  prism: { src: assets.prism, alt: 'Seer prism artwork' },
};
