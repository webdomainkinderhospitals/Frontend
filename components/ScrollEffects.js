'use client';

import { useEffect } from 'react';

/**
 * Ports the original design's reveal-on-scroll behavior:
 * curated blocks are tagged with [data-reveal], staggered within grids,
 * and revealed via IntersectionObserver, with safety sweeps so content
 * is never left hidden. Respects prefers-reduced-motion.
 */
export default function ScrollEffects() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return;

    const sel = [
      '.section-head', '.overview-img', '.overview-text',
      '.coe-card', '.procedure-card', '.care-card', '.support-card',
      '.spec-card', '.testi-card', '.blog-card', '.loc-card',
      '.hospital-card', '.stats-row', '.accred-strip', '.cta-strip',
    ].join(',');

    document.querySelectorAll(sel).forEach((el) => {
      if (el.closest('.hero')) return; // hero has its own entrance
      el.setAttribute('data-reveal', '');
    });

    // stagger siblings within the same grid for a graceful cascade
    document
      .querySelectorAll('.coe-grid, .procedure-grid, .care-grid, .support-grid, .spec-grid, .loc-grid, .blog-grid, .hospital-grid')
      .forEach((grid) => {
        Array.prototype.slice.call(grid.children).forEach((child, i) => {
          if (child.hasAttribute('data-reveal')) {
            child.style.setProperty('--reveal-d', Math.min(i, 6) * 70 + 'ms');
          }
        });
      });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting || e.boundingClientRect.top < window.innerHeight) {
            e.target.classList.add('reveal-in');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );

    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));

    const sweep = () => {
      const vh = window.innerHeight;
      document.querySelectorAll('[data-reveal]:not(.reveal-in)').forEach((el) => {
        const top = el.getBoundingClientRect().top;
        if (top < vh) {
          if (top < 0) el.classList.add('reveal-now'); // snap, no transition
          el.classList.add('reveal-in');
          io.unobserve(el);
        }
      });
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        sweep();
        ticking = false;
      });
    };
    const onHash = () => setTimeout(sweep, 60);

    window.addEventListener('load', sweep);
    window.addEventListener('hashchange', onHash);
    window.addEventListener('scroll', onScroll, { passive: true });
    sweep();

    // final guarantee: never leave content hidden
    const finalTimer = setTimeout(() => {
      document.querySelectorAll('[data-reveal]:not(.reveal-in)').forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add('reveal-in');
        }
      });
    }, 2000);

    return () => {
      io.disconnect();
      clearTimeout(finalTimer);
      window.removeEventListener('load', sweep);
      window.removeEventListener('hashchange', onHash);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return null;
}
