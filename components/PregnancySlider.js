'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './PregnancySlider.module.css';

// The Celebrate Pregnancy showcase: one experience at a time, each opening its
// own page. Slides fade with a slow zoom and advance on their own; hovering,
// focusing or touching pauses them. A slide without a photo (Water Birth until
// one is added in the admin) is drawn as a calm water-toned panel instead.
//
//   slides  [{ key, href, title, short, location, excerpt, image }]
const INTERVAL = 6000;

export default function PregnancySlider({ slides = [] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [still, setStill] = useState(false);
  const touch = useRef(null);
  const count = slides.length;

  const go = useCallback((i) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    setStill(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (count < 2 || paused || still) return undefined;
    const t = setTimeout(() => go(index + 1), INTERVAL);
    return () => clearTimeout(t);
  }, [index, paused, still, count, go]);

  if (!count) return null;

  const onKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
  };
  const onTouchStart = (e) => { touch.current = e.touches[0].clientX; setPaused(true); };
  const onTouchEnd = (e) => {
    const start = touch.current;
    touch.current = null;
    setPaused(false);
    if (start == null) return;
    const dx = e.changedTouches[0].clientX - start;
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
  };

  return (
    <div
      className={styles.slider}
      role="region"
      aria-roledescription="carousel"
      aria-label="Celebrate Pregnancy highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={onKey}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className={styles.frame}>
        {slides.map((s, i) => {
          const on = i === index;
          return (
            <a
              key={s.key}
              href={s.href}
              className={`${styles.slide}${on ? ` ${styles.active}` : ''}${s.image ? '' : ` ${styles.water}`}`}
              aria-hidden={!on}
              tabIndex={on ? 0 : -1}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${s.title}`}
            >
              {s.image ? (
                <img className={styles.image} src={s.image} alt={s.title} loading={i === 0 ? 'eager' : 'lazy'} />
              ) : (
                <span className={styles.waterArt} aria-hidden="true">
                  <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">
                    <defs>
                      <radialGradient id="psGlow" cx="70%" cy="20%" r="70%">
                        <stop offset="0" stopColor="#9FE3F0" stopOpacity=".55" />
                        <stop offset="1" stopColor="#9FE3F0" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    <rect width="600" height="400" fill="url(#psGlow)" />
                    {[0, 1, 2, 3].map((n) => (
                      <path key={n} className={styles.wave} style={{ '--n': n }}
                        d={`M0 ${250 + n * 34} C 100 ${226 + n * 34}, 200 ${274 + n * 34}, 300 ${250 + n * 34} S 500 ${226 + n * 34}, 600 ${250 + n * 34} V 400 H 0 Z`} />
                    ))}
                    <g className={styles.drop} transform="translate(300 128)">
                      <circle r="64" fill="rgba(255,255,255,.12)" />
                      <path d="M0 -42 C 16 -20, 30 -2, 30 14 A 30 30 0 0 1 -30 14 C -30 -2, -16 -20, 0 -42 Z" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinejoin="round" />
                      <path d="M-14 16 a 14 14 0 0 0 14 12" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".8" />
                    </g>
                  </svg>
                </span>
              )}
              <span className={styles.shade} aria-hidden="true" />
              <span className={styles.caption}>
                <small>{s.location ? `Kinder ${s.location}` : 'Kinder Hospitals'}</small>
                <strong>{s.title}</strong>
                {s.excerpt && <span className={styles.excerpt}>{s.excerpt}</span>}
                <em>Explore <span aria-hidden="true">→</span></em>
              </span>
            </a>
          );
        })}

        {count > 1 && (
          <>
            <span className={styles.counter} aria-hidden="true">
              <b>{String(index + 1).padStart(2, '0')}</b> / {String(count).padStart(2, '0')}
            </span>
            <button type="button" className={`${styles.arrow} ${styles.prev}`} onClick={() => go(index - 1)} aria-label="Previous highlight">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <button type="button" className={`${styles.arrow} ${styles.next}`} onClick={() => go(index + 1)} aria-label="Next highlight">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className={styles.tabs} role="tablist" aria-label="Choose a highlight">
          {slides.map((s, i) => (
            <button
              key={s.key}
              type="button"
              role="tab"
              aria-selected={i === index}
              className={`${styles.tab}${i === index ? ` ${styles.tabOn}` : ''}`}
              onClick={() => go(i)}
            >
              <span className={styles.tabLabel}>{s.short || s.title}</span>
              <span className={styles.bar} aria-hidden="true">
                {i === index && !still && !paused && (
                  <span key={index} className={styles.fill} style={{ animationDuration: `${INTERVAL}ms` }} />
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
