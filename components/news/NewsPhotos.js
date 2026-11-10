'use client';

import { useState } from 'react';
import GalleryViewer from '@/components/gallery/GalleryViewer';
import styles from './News.module.css';

// A story's photographs as a tidy grid; any photo opens the full-screen viewer,
// where the arrows, swipe and keyboard move through the set.
export default function NewsPhotos({ photos = [], title = '', location = '' }) {
  const [open, setOpen] = useState(null);
  if (!photos.length) return null;
  const items = photos.map((src, i) => ({ id: `${i}`, kind: 'image', mediaUrl: src, title, caption: `Photo ${i + 1} of ${photos.length}`, location }));
  return (
    <section className={styles.photos} aria-labelledby="story-photos">
      <div className={styles.photosHead}>
        <h2 id="story-photos">Photo gallery</h2>
        <span>{photos.length} photo{photos.length === 1 ? '' : 's'}</span>
      </div>
      <ul className={`${styles.photoGrid} ${photos.length < 3 ? styles.photoGridFew : ''}`}>
        {photos.map((src, i) => (
          <li key={src}>
            <button type="button" onClick={() => setOpen(i)} aria-label={`Open photo ${i + 1} of ${photos.length}`}>
              <img src={src} alt="" loading="lazy" decoding="async" />
            </button>
          </li>
        ))}
      </ul>
      {open !== null && <GalleryViewer items={items} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </section>
  );
}
