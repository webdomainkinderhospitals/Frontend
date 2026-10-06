'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { embedOf, placeOf } from '@/lib/gallery.mjs';
import styles from './Gallery.module.css';

// Opens one gallery item over the page: a photo, a video playing with its
// controls, or a YouTube film. Arrows, swipe and the keyboard move between
// items; Esc, the close button or a click outside closes it. Rendered into
// <body> so no transformed ancestor can offset it.
export default function GalleryViewer({ items, index, onIndex, onClose }) {
  const closeRef = useRef(null);
  const touch = useRef(null);
  const item = items[index];
  const count = items.length;

  useEffect(() => {
    const prevFocus = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      prevFocus?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (count > 1 && e.key === 'ArrowRight') onIndex((index + 1) % count);
      if (count > 1 && e.key === 'ArrowLeft') onIndex((index - 1 + count) % count);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [index, count, onIndex, onClose]);

  if (!item) return null;

  const media = item.kind === 'youtube'
    ? <iframe className={styles.vFrame} src={embedOf(item)} title={item.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
    : item.kind === 'video'
      ? <video key={item.id} className={styles.vVideo} src={item.mediaUrl} poster={item.posterUrl || undefined} controls autoPlay playsInline />
      : <img key={item.id} className={styles.vImage} src={item.mediaUrl} alt={item.title} />;

  return createPortal(
    <div
      className={styles.viewer}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        const start = touch.current;
        touch.current = null;
        if (start == null || count < 2) return;
        const dx = e.changedTouches[0].clientX - start;
        if (Math.abs(dx) > 50) onIndex((index + (dx < 0 ? 1 : -1) + count) % count);
      }}
    >
      <button ref={closeRef} type="button" className={styles.vClose} onClick={onClose} aria-label="Close">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
      </button>
      <figure className={styles.vStage}>
        <div className={styles.vMedia}>{media}</div>
        <figcaption className={styles.vCaption}>
          <small>{placeOf(item)}{count > 1 ? ` · ${index + 1} of ${count}` : ''}</small>
          <strong>{item.title}</strong>
          {item.caption && <span>{item.caption}</span>}
        </figcaption>
      </figure>
      {count > 1 && (
        <>
          <button type="button" className={`${styles.vArrow} ${styles.vPrev}`} onClick={() => onIndex((index - 1 + count) % count)} aria-label="Previous">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <button type="button" className={`${styles.vArrow} ${styles.vNext}`} onClick={() => onIndex((index + 1) % count)} aria-label="Next">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
          </button>
        </>
      )}
    </div>,
    document.body,
  );
}
