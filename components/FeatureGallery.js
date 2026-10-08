'use client';

import { useState } from 'react';
import GalleryViewer from './gallery/GalleryViewer';
import styles from './FeatureGallery.module.css';

// An experience's photo highlights: one large photo with three beside it,
// each opening full size in the viewer.
// `embedded` sets it inside another section (the home page's Celebrate
// Pregnancy), with a link through to the experience's own page.
export default function FeatureGallery({ gallery, embedded = false, href = '', linkLabel = '' }) {
  const [open, setOpen] = useState(null);
  if (!gallery?.photos?.length) return null;
  const items = gallery.photos.map((p, i) => ({ id: i, kind: 'image', mediaUrl: p.src, title: p.title, caption: p.caption }));
  const Wrap = embedded ? 'div' : 'section';
  const titleId = `feature-gallery-title${embedded ? '-home' : ''}`;
  return (
    <Wrap className={embedded ? styles.embedded : styles.section} aria-labelledby={titleId}>
      <div className={embedded ? undefined : 'container'}>
        <div className={styles.head}>
          <span className={styles.eyebrow}>{gallery.eyebrow}</span>
          {embedded ? <h3 id={titleId}>{gallery.title}</h3> : <h2 id={titleId}>{gallery.title}</h2>}
          {gallery.intro && <p>{gallery.intro}</p>}
          {href && <a className={styles.more} href={href}>{linkLabel || 'Explore'} <span aria-hidden="true">→</span></a>}
        </div>
        <ul className={styles.grid} data-n={Math.min(items.length, 5)}>
          {items.map((item, i) => (
            <li key={item.id} className={i === 0 ? styles.lead : undefined}>
              <button type="button" className={styles.tile} onClick={() => setOpen(i)} aria-label={`View photo: ${item.title}`}>
                <img src={item.mediaUrl} alt={item.title} loading="lazy" />
                <span className={styles.caption}>
                  <strong>{item.title}</strong>
                  {i === 0 && <em>{item.caption}</em>}
                </span>
                <span className={styles.zoom} aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {open !== null && <GalleryViewer items={items} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </Wrap>
  );
}
