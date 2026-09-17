'use client';

import { useEffect, useState } from 'react';
import styles from './HomeInteractions.module.css';

/**
 * Page-level feedback for the long home page: how far down the visitor is,
 * and a one-tap way back to the top once they are past the fold.
 */
export default function HomeInteractions() {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0);
      setShowTop(window.scrollY > window.innerHeight * 0.9);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  function toTop() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }

  return (
    <>
      <div className={styles.progress} aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
      <button
        type="button"
        className={`${styles.toTop}${showTop ? ` ${styles.visible}` : ''}`}
        onClick={toTop}
        tabIndex={showTop ? 0 : -1}
        aria-hidden={!showTop}
        aria-label="Back to top"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </>
  );
}
