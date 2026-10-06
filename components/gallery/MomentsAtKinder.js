'use client';

import { useState } from 'react';
import { homeGallery, thumbOf, embedOf, isVideo, placeOf } from '@/lib/gallery.mjs';
import GalleryViewer from './GalleryViewer';
import styles from './Gallery.module.css';

// "Moments at Kinder" on the home page: the featured film plays large where it
// sits — its cover first, then the video with its controls — and the other
// items chosen for the home page open in the viewer. All from the admin's
// Gallery; the section is left out when there is nothing to show.
export default function MomentsAtKinder({ gallery = [] }) {
  const { featured, others } = homeGallery(gallery, 4);
  const [playing, setPlaying] = useState(false);
  const [open, setOpen] = useState(null);
  if (!featured && !others.length) return null;

  return (
    <section id="moments" className={styles.moments} aria-labelledby="moments-title">
      <div className="container">
        <div className={styles.head}>
          <span className={styles.eyebrow}>Moments at Kinder</span>
          <h2 id="moments-title" className={styles.title}>See Kinder, <em>in motion</em></h2>
          <p className={styles.lead}>Step inside our hospitals — the spaces, the people and the celebrations that make every arrival special.</p>
        </div>

        {featured && (
          <div className={`${styles.film}${playing ? ` ${styles.filmOn}` : ''}`}>
            {playing ? (
              featured.kind === 'youtube'
                ? <iframe className={styles.filmMedia} src={embedOf(featured)} title={featured.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
                : <video className={styles.filmMedia} src={featured.mediaUrl} poster={featured.posterUrl || undefined} controls autoPlay playsInline />
            ) : (
              <button type="button" className={styles.filmCover} onClick={() => setPlaying(true)} aria-label={`Play: ${featured.title}`}>
                {thumbOf(featured)
                  ? <img src={thumbOf(featured)} alt="" loading="lazy" />
                  : <video src={`${featured.mediaUrl}#t=1`} muted playsInline preload="metadata" aria-hidden="true" />}
                <span className={styles.filmShade} aria-hidden="true" />
                <span className={styles.play} aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.6-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /></svg>
                </span>
                <span className={styles.filmText}>
                  <small>{placeOf(featured)} · Film</small>
                  <strong>{featured.title}</strong>
                  {featured.caption && <span>{featured.caption}</span>}
                </span>
              </button>
            )}
          </div>
        )}

        {others.length > 0 && (
          <ul className={styles.strip} style={{ '--n': others.length }}>
            {others.map((item, i) => (
              <li key={item.id}>
                <button type="button" className={styles.tile} onClick={() => setOpen(i)} aria-label={`${isVideo(item) ? 'Play' : 'View'}: ${item.title}`}>
                  {thumbOf(item)
                    ? <img src={thumbOf(item)} alt="" loading="lazy" />
                    : <video src={`${item.mediaUrl}#t=1`} muted playsInline preload="metadata" aria-hidden="true" />}
                  {isVideo(item) && <span className={styles.tilePlay} aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.6-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /></svg></span>}
                  <span className={styles.tileText}><small>{placeOf(item)}</small><strong>{item.title}</strong></span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className={styles.more}>
          <a href="/gallery" className={styles.moreLink}>Open the Gallery <span aria-hidden="true">→</span></a>
        </div>
      </div>
      {open !== null && <GalleryViewer items={others} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </section>
  );
}
