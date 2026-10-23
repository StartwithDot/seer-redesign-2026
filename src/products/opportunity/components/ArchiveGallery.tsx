import { useMemo, useRef, useState } from 'react';
import { galleryFor, galleryKey } from '../data/gallery';
import { ArchiveImage } from './ArchiveImage';
import { GalleryLightbox } from './GalleryLightbox';
import { useUrlDialog } from '../hooks/useUrlDialog';

export function ArchiveGallery({ marketId }: { marketId: string }) {
  const submissions = useMemo(() => galleryFor(marketId), [marketId]);
  const [submissionId, setSubmissionId] = useState('all');
  const [winnerOnly, setWinnerOnly] = useState(false);
  const [imageId, setImageId] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useUrlDialog('galleryImage');
  const zoomTrigger = useRef<HTMLButtonElement>(null);
  const items = submissions.filter(s => (submissionId === 'all' || s.id === submissionId) && (!winnerOnly || s.winner))
    .flatMap(submission => submission.images.map(image => ({ image, submission })));
  const index = Math.max(0, items.findIndex(item => item.image.id === (lightboxImage ?? imageId)));
  const current = items[index];
  const selectedSubmission = submissions.find(s => s.id === submissionId);
  const total = submissions.reduce((sum, s) => sum + s.images.length, 0);
  const select = (next: number) => setImageId(items[next]?.image.id ?? null);
  if (!submissions.length) return <p role="status">No submission images recorded for this market.</p>;
  return <section className="archive-gallery" aria-label="Submission gallery" tabIndex={0}
    onKeyDown={event => { const next = galleryKey(event, index, items.length); if (items.length && next !== null) { event.preventDefault(); select(next); } }}>
    <div className="gallery-filter">
      <label>Submission<select value={submissionId} onChange={e => { setSubmissionId(e.target.value); setImageId(null); }}>
        <option value="all">All {submissions.length} submissions</option>
        {submissions.map(s => <option key={s.id} value={s.id}>{s.title}{s.creator ? ` · ${s.creator}` : ''}</option>)}
      </select></label>
      <label><input type="checkbox" checked={winnerOnly} onChange={e => { setWinnerOnly(e.target.checked); setImageId(null); }} />Selected designs only</label>
    </div>
    <p className="gallery-count" role="status">{items.length} of {total} images · {current ? `${index + 1} / ${items.length}` : 'No matching images'}</p>
    {current ? <>
      <figure className="gallery-stage">
        <ArchiveImage key={current.image.id} image={current.image} title={current.submission.title} />
        <figcaption><strong>{current.submission.title}</strong><span>{current.submission.creator ?? 'Creator not recorded'}{current.submission.winner ? ' · Sponsor selected' : ''}</span></figcaption>
      </figure>
      <div className="gallery-controls" role="group" aria-label="Gallery controls">
        <button type="button" disabled={items.length < 2} title={items.length < 2 ? 'Only one image matches this filter.' : undefined} onClick={() => select((index + items.length - 1) % items.length)}>← Previous</button>
        <button ref={zoomTrigger} type="button" onClick={() => setLightboxImage(current.image.id)}>Zoom image</button>
        <button type="button" disabled={items.length < 2} title={items.length < 2 ? 'Only one image matches this filter.' : undefined} onClick={() => select((index + 1) % items.length)}>Next →</button>
      </div>
      <div className="gallery-thumbnails" role="group" aria-label="Image thumbnails">
        {items.slice(Math.max(0, index - 3), Math.max(0, index - 3) + 7).map(item => <button key={item.image.id} type="button"
          aria-pressed={current.image.id === item.image.id} aria-label={`View ${item.submission.title}: ${item.image.name}`}
          onClick={() => setImageId(item.image.id)}><ArchiveImage key={item.image.id} image={item.image} title={item.submission.title} thumbnail /></button>)}
      </div>
      <p className="gallery-file-name">{current.image.name}</p>
      <div className="gallery-links">
        <a href={current.image.url} target="_blank" rel="noreferrer">Original image ↗</a>
        {current.submission.portfolio && <a href={current.submission.portfolio} target="_blank" rel="noreferrer">Creator portfolio ↗</a>}
        {current.submission.proposal && <a href={`https://cdn.kleros.link${current.submission.proposal}`} target="_blank" rel="noreferrer">Proposal PDF ↗</a>}
      </div>
      {lightboxImage && <GalleryLightbox images={items.map(item => item.image)} titles={items.map(item => item.submission.title)}
        creators={items.map(item => item.submission.creator ?? 'Creator not recorded')} initialIndex={index}
        onClose={next => { select(next); setLightboxImage(null); requestAnimationFrame(() => zoomTrigger.current?.focus()); }} />}
    </> : <>
      <p>{selectedSubmission ? `${selectedSubmission.title} has no image files in the manifest.` : 'No images match this filter.'}</p>
      {selectedSubmission?.proposal && <a href={`https://cdn.kleros.link${selectedSubmission.proposal}`} target="_blank" rel="noreferrer">View submission proposal PDF ↗</a>}
      <button type="button" onClick={() => { setWinnerOnly(false); setSubmissionId('all'); }}>Show all images</button>
    </>}
  </section>;
}
