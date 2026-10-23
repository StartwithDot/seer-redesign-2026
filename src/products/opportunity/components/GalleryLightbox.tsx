import { useEffect, useRef, useState } from 'react';
import type { GalleryImage } from '../data/gallery';
import { galleryKey } from '../data/gallery';
import { OverlayDialog } from './OverlayDialog';
import { ArchiveImage } from './ArchiveImage';

export function GalleryLightbox({ images, titles, creators, initialIndex, onClose }: {
  images: GalleryImage[]; titles: string[]; creators: string[]; initialIndex: number; onClose: (index: number) => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const viewport = useRef<HTMLDivElement>(null);
  useEffect(() => { viewport.current?.scrollTo(0, 0); }, [index]);
  const select = (next: number) => { setIndex(next); setZoom(1); };
  const image = images[index];
  const title = titles[index];
  return <OverlayDialog title="Submission image" description={title} onClose={() => onClose(index)}>
    <section className="gallery-lightbox" tabIndex={0} aria-label="Image viewer. Use arrow keys to browse."
      onKeyDown={event => { const next = galleryKey(event, index, images.length); if (next !== null) { event.preventDefault(); select(next); } }}>
      <div className="gallery-controls" role="group" aria-label="Image controls">
        <button type="button" disabled={images.length < 2} title={images.length < 2 ? 'Only one image matches this filter.' : undefined} onClick={() => select((index + images.length - 1) % images.length)}>Previous</button>
        <span role="status">{index + 1} / {images.length}</span>
        <button type="button" disabled={images.length < 2} title={images.length < 2 ? 'Only one image matches this filter.' : undefined} onClick={() => select((index + 1) % images.length)}>Next</button>
        <button type="button" disabled={zoom <= 1} title="Minimum zoom is 100%" onClick={() => setZoom(z => z - .5)}>Zoom out</button>
        <button type="button" disabled={zoom >= 3} title="Maximum zoom is 300%" onClick={() => setZoom(z => z + .5)}>Zoom in</button>
        <button type="button" disabled={zoom === 1} title={zoom === 1 ? 'Image already fits the viewer.' : undefined} onClick={() => setZoom(1)}>Fit image</button>
      </div>
      <div ref={viewport} className="gallery-zoom-viewport" tabIndex={0} aria-label={`Image at ${zoom * 100}% zoom. Scroll to pan.`}>
        <div style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}><ArchiveImage key={image.id} image={image} title={title} /></div>
      </div>
      <p>{title} · {creators[index]} · {zoom * 100}%</p>
      <p>{image.name}</p>
      <a href={image.url} target="_blank" rel="noreferrer">Open original image ↗</a>
    </section>
  </OverlayDialog>;
}
