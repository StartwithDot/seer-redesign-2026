import rebrand from './gallery/seer-rebrand.json';
import merch from './gallery/seer-devcon-2026-merch.json';
import { archiveEvidenceFor } from './archive';

interface AssetFile { name: string; localPath: string; ipfsPath: string }
export interface GallerySubmission {
  id: string; title: string; creator: string | null; portfolio: string | null;
  proposal: string | null; outcomeIndex: number; winner: boolean; images: GalleryImage[];
}
export interface GalleryImage { id: string; name: string; url: string; submissionId: string }

// Exact outcome-to-folder mapping from seer-pm/opportunity-markets/src/config/market.ts.
const rebrandFolders = [
  '@hypedsgn-Electric Foundation', '@abiyebee-Convergent', '@syntropicregen-Constellation Oracle',
  'Mohammad-Prism', '@brodaviktor-Civic Signal', '@Kaysolo58-Your only base layer for decision infrastructure',
  '@posifer001-Geometric + Initial', '@ajitu871287-Signal Dark', '@2reb_fl-Datum', 'Elijah- Resolution Mark',
  '@sue2432-Crow Minimal', 'asa_wagmi-Converge', '@Ergamjee-Sleek for Seer', 'MrFroggert -Signal Convergence',
  'Schofield-Purple Horizon', 'Melissa-The Composable Identity',
];
const merchFolders = [
  'Purple Seer Apparel Set (Tshirt+hat)_', 'Proof of Belonging Tshirt', 'See What The Market Believes T shirt',
  'Seer Apparel Purple Set (Hoodie+hat)_', 'Seer Polo _  _Predict Everything. See Tomorrow._', 'Seer Falcon Hoodie_',
  'Seer merch full set_ Tshirt, stickers and bottles', 'Seer prediction chart Tshirt', 'The Future, In Sight Seer Tshirt',
  'Minimal purple-on-lavender eye graphic Seer Merch set_ tote bag +tshirt_', 'White and Cyan Seer mersh set_ Hoodie +tshirt',
  'Minimalist Seer Mersh set_ Hoodies+ tote bag+ cap', 'Minimalist purple Seer hoodie', 'Seer prediction Journal_',
  'Minimalist black Seer hoodie', 'Seer Compass Shirt', 'The Seer eye Oversized T shirt',
];
const creators = ['@hypedsgn', '@abiyebee', '@syntropicregen', 'Mohammad', '@brodaviktor', '@Kaysolo58',
  '@posifer001', '@ajitu871287', '@2reb_fl', 'Elijah', '@sue2432', 'asa_wagmi', '@Ergamjee', 'MrFroggert', 'Schofield', 'Melissa'];
const portfolios: Record<number, string> = {
  0: 'https://www.behance.net/gallery/252825507/Seer-Brand-Identity-App-Redesign',
  4: 'https://seercivicsignal.netlify.app',
  5: 'https://www.behance.net/gallery/253579443/Seer-Rebrand',
  6: 'https://www.behance.net/gallery/253587035/_',
  7: 'https://seer-app--chiomashura400.replit.app',
  12: 'https://www.behance.net/gallery/253606531/Seer-Brand-Identity',
};

export function galleryFor(marketId: string): GallerySubmission[] {
  const evidence = archiveEvidenceFor(marketId);
  if (!evidence) return [];
  const isRebrand = marketId === 'seer-rebrand-contest';
  const manifest: Record<string, AssetFile[]> = isRebrand ? rebrand : merch;
  return (isRebrand ? rebrandFolders : merchFolders).map((id, index) => {
    const files = manifest[id] ?? [];
    return {
      id, title: evidence.outcomes[index].trim(), creator: isRebrand ? creators[index] : null,
      portfolio: isRebrand ? portfolios[index] ?? null : null,
      proposal: files.find(file => /\.pdf$/i.test(file.name))?.ipfsPath ?? null,
      outcomeIndex: index, winner: BigInt(evidence.payoutNumerators[index]) > 0n,
      images: files.filter(file => /\.(png|jpe?g|gif|webp|svg)$/i.test(file.name)).map(file => ({
        id: file.localPath, name: file.name, url: `https://cdn.kleros.link${file.ipfsPath}`, submissionId: id,
      })),
    };
  });
}

export function galleryKey(event: { key: string; target: EventTarget | null }, index: number, count: number): number | null {
  if (count < 1) return null;
  if (event.target instanceof HTMLElement && event.target.matches('input, select, textarea, button, a')) return null;
  if (event.key === 'Home') return 0;
  if (event.key === 'End') return count - 1;
  if (event.key === 'ArrowLeft') return (index + count - 1) % count;
  if (event.key === 'ArrowRight') return (index + 1) % count;
  return null;
}
