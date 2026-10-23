import { useState } from 'react';
import type { GalleryImage } from '../data/gallery';

export function ArchiveImage({ image, title, thumbnail = false }: { image: GalleryImage; title: string; thumbnail?: boolean }) {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  return <div className={`archive-image archive-image--${state}${thumbnail ? ' archive-image--thumbnail' : ''}`} aria-busy={state === 'loading'}>
    {state !== 'error' && <img key={attempt} src={image.url} alt={thumbnail ? '' : `${title}: ${image.name}`}
      loading={thumbnail ? 'lazy' : 'eager'} decoding="async" onLoad={() => setState('ready')} onError={() => setState('error')} />}
    {!thumbnail && state === 'loading' && <span className="archive-image-message" role="status">Loading submission image…</span>}
    {state === 'error' && (thumbnail ? <span aria-hidden="true">Image unavailable</span> : <div className="archive-image-message" role="status">
      <strong>Image could not load</strong>
      <button type="button" className="secondary-action" onClick={() => { setState('loading'); setAttempt(a => a + 1); }}>Retry image</button>
      <a href={image.url} target="_blank" rel="noreferrer">Open original image ↗</a>
    </div>)}
  </div>;
}
