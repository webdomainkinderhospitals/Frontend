'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './PromoBanner.module.css';

const INTERVAL = 6000;

// Ready-made campaign artwork (text and branding baked into the image),
// managed from the admin portal. Every slide is shown at its natural
// 1920 × 720 proportion so nothing in the design is ever cropped. Two or more
// slides change on their own every few seconds, always — visitors who have
// asked for reduced motion get an instant switch instead of the fade. Hovering
// holds the current poster only while the pointer rests on it, and a click on
// a dot or arrow simply restarts the timer.
export default function PromoBanner({ slides = [], label = 'Announcements' }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const touch = useRef(null);

  const go = useCallback((i) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    if (count < 2 || paused) return undefined;
    const timer = setTimeout(() => go(index + 1), INTERVAL);
    return () => clearTimeout(timer);
  }, [count, index, paused, go]);

  if (!count) return null;
  const multi = count > 1;

  return (
    <aside
      className={styles.promo}
      aria-label={label}
      aria-roledescription={multi ? 'carousel' : undefined}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') setPaused(true); }}
      onPointerLeave={() => setPaused(false)}
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
                    {i === index && !paused && <span key={index} className={styles.progress} style={{ animationDuration: `${INTERVAL}ms` }} />}
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
