'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './PromoBanner.module.css';

const INTERVAL = 6000;

// Ready-made campaign artwork (text and branding baked into the image),
// managed from the admin portal. Every slide is shown at its natural
// 1920 × 720 proportion so nothing in the design is ever cropped. Two or more
// slides cross-fade on their own; the rotation pauses while a visitor hovers,
// focuses or has asked for reduced motion, and dots/arrows let them choose.
export default function PromoBanner({ slides = [], label = 'Announcements' }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [still, setStill] = useState(false);
  const count = slides.length;
  const touch = useRef(null);

  const go = useCallback((i) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setStill(media.matches);
    update();
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    if (count < 2 || paused || still) return undefined;
    const timer = setTimeout(() => go(index + 1), INTERVAL);
    return () => clearTimeout(timer);
  }, [count, index, paused, still, go]);

  if (!count) return null;
  const multi = count > 1;

  return (
    <aside
      className={styles.promo}
      aria-label={label}
      aria-roledescription={multi ? 'carousel' : undefined}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false); }}
      onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touch.current === null || !multi) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        touch.current = null;
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
      }}
    >
      <div className="container">
        <div className={styles.frame}>
          {slides.map((slide, i) => {
            const active = i === index;
            const external = /^https?:\/\//i.test(slide.link);
            const picture = (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className={styles.image}
                src={slide.image}
                alt={slide.alt || label}
                width={1920}
                height={720}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            );
            const common = {
              className: `${styles.slide}${active ? ` ${styles.active}` : ''}`,
              'aria-hidden': active ? undefined : true,
              ...(multi ? { role: 'group', 'aria-roledescription': 'slide', 'aria-label': `${i + 1} of ${count}` } : {}),
            };
            return slide.link ? (
              <a key={i} {...common} href={slide.link} tabIndex={active ? undefined : -1} {...(external ? { target: '_blank', rel: 'noopener' } : {})}>
                {picture}
              </a>
            ) : (
              <div key={i} {...common}>{picture}</div>
            );
          })}

          {multi && (
            <>
              <button type="button" className={`${styles.arrow} ${styles.prev}`} onClick={() => go(index - 1)} aria-label="Previous banner">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <button type="button" className={`${styles.arrow} ${styles.next}`} onClick={() => go(index + 1)} aria-label="Next banner">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
              </button>
              <div className={styles.dots}>
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`${styles.dot}${i === index ? ` ${styles.dotActive}` : ''}`}
                    onClick={() => go(i)}
                    aria-label={`Show banner ${i + 1} of ${count}`}
                    aria-current={i === index ? 'true' : undefined}
                  >
                    {i === index && !paused && !still && <span key={index} className={styles.progress} style={{ animationDuration: `${INTERVAL}ms` }} />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
