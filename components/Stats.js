'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Animated count-up for stat values like "13,000+", "6L+", "98%".
 * Parses the leading number, animates it in, and keeps prefix/suffix intact.
 * Falls back to static text when reduced motion is requested.
 */
function StatValue({ value }) {
  const ref = useRef(null);
  const [text, setText] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const match = String(value).match(/^([^\d]*)([\d,.]+)(.*)$/);
    if (!match) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return;

    const [, prefix, numStr, suffix] = match;
    const hasCommas = numStr.includes(',');
    const target = parseFloat(numStr.replace(/,/g, ''));
    if (!isFinite(target)) return;

    const fmt = (n) => {
      const v = Math.round(n);
      return prefix + (hasCommas ? v.toLocaleString('en-IN') : String(v)) + suffix;
    };

    setText(fmt(0));

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const dur = 1400;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setText(fmt(target * eased));
          if (p < 1) requestAnimationFrame(tick);
          else setText(value);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return <strong ref={ref}>{text}</strong>;
}

export default function Stats({ settings }) {
  const stats = settings.stats || [];

  return (
    <section className="overview" id="about">
      <div className="container">
        <div className="overview-grid">
          <div className="overview-img">
            <img
              src="https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?auto=format&fit=crop&w=1000&q=80"
              alt="Mother and baby at Kinder Hospital"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="overview-text">
            <span className="section-eyebrow">Welcome to Kinder Medical Group</span>
            <h2 className="section-title">
              A network built on <em>kindness, trust &amp; expertise</em>.
            </h2>
            <p>
              Kinder Medical Group — a unit of <strong>Kindorama Healthcare Pvt Ltd</strong> — has
              grown from one of Singapore&apos;s largest paediatric groups into a regional
              healthcare network focused on women&apos;s and children&apos;s health. We operate
              across India and Singapore, with a clear vision: world-class care, close to home.
            </p>
            <p>
              In India, our centres in <strong>Cherthala (2011)</strong>,{' '}
              <strong>Kochi (2018)</strong>, <strong>Bengaluru (2022)</strong>, and{' '}
              <strong>Alappuzha (2023)</strong> uphold international standards — providing
              comprehensive, personalised maternity, IVF, neonatology, and paediatric care at
              affordable cost, to all strata of society.
            </p>
            <div className="stats-row">
              {stats.map((stat, i) => (
                <div className="stat" key={i}>
                  <StatValue value={stat.value} />
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
