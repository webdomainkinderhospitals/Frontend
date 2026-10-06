'use client';

import { useMemo, useState } from 'react';
import { thumbOf, isVideo, placeOf } from '@/lib/gallery.mjs';
import GalleryViewer from './GalleryViewer';
import styles from './Gallery.module.css';

// The Gallery page: every published photo and video, filterable, each opening
// in the viewer. The first video leads as a wide tile.
const FILTERS = [['all', 'All'], ['photos', 'Photos'], ['videos', 'Videos']];

export default function GalleryGrid({ items = [] }) {
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(null);
  const shown = useMemo(() => items.filter((g) => filter === 'all' || (filter === 'videos' ? isVideo(g) : !isVideo(g))), [items, filter]);
  const counts = { all: items.length, photos: items.filter((g) => !isVideo(g)).length, videos: items.filter(isVideo).length };

  return (
    <>
      <div className={styles.filters} role="tablist" aria-label="Show">
        {FILTERS.map(([key, label]) => counts[key] > 0 && (
          <button key={key} type="button" role="tab" aria-selected={filter === key}
            className={`${styles.filter}${filter === key ? ` ${styles.filterOn}` : ''}`} onClick={() => setFilter(key)}>
            {label} <span>{counts[key]}</span>
          </button>
        ))}
      </div>
      <ul className={styles.grid}>
        {shown.map((item, i) => (
          <li key={item.id} className={i === 0 && isVideo(item) ? styles.wide : undefined}>
            <button type="button" className={styles.tile} onClick={() => setOpen(i)} aria-label={`${isVideo(item) ? 'Play' : 'View'}: ${item.title}`}>
              {thumbOf(item)
                ? <img src={thumbOf(item)} alt="" loading="lazy" />
                : <video src={`${item.mediaUrl}#t=1`} muted playsInline preload="metadata" aria-hidden="true" />}
              {isVideo(item) && <span className={styles.tilePlay} aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.6-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /></svg></span>}
              <span className={styles.tileText}><small>{placeOf(item)}</small><strong>{item.title}</strong>{item.caption && <em>{item.caption}</em>}</span>
            </button>
          </li>
        ))}
      </ul>
      {open !== null && <GalleryViewer items={shown} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </>
  );
}
