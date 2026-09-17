'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './HomeHero.module.css';

const appointment = 'https://api.whatsapp.com/send?phone=919446654500&text=' +
  encodeURIComponent('Hello Kinder Hospitals, I would like to book an appointment.');

// How long each slide holds before the next one takes over.
const SLIDE_MS = 6000;

function Headline({ text }) {
  return String(text).split(/(<em>.*?<\/em>)/gis).map((part, i) =>
    /^<em>/i.test(part) ? <em key={i}>{part.slice(4, -5)}</em> : part);
}

export default function HomeHero({ settings = {}, locations = [] }) {
  const [current, setCurrent] = useState(0);
  const [motionOk, setMotionOk] = useState(false);
  const [paused, setPaused] = useState(false); // the visitor pressed pause
  const [hold, setHold] = useState(false);     // pointer or keyboard focus is on the hero
  const [hidden, setHidden] = useState(false); // the tab is in the background
  const touchStart = useRef(null);
  const names = locations.map((l) => l.name).filter(Boolean);
  const seeded = /spanning 5 hospitals across Cherthala/.test(settings.heroSubtitle || '');
  const slides = [
    {
      label: 'Welcome to Kinder Medical Group',
      title: settings.heroTitle || 'Kindness at the heart of <em>every tiny heartbeat</em>',
      text: settings.heroSubtitle && !seeded ? settings.heroSubtitle : `Personalised care for women, children and families${names.length ? ` across ${names.join(', ')}` : ''}. From your first consultation to every milestone that follows.`,
      image: settings.heroImageUrl || 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?auto=format&fit=crop&w=1920&q=85',
      cta: 'Find your nearest hospital', href: '#hospitals',
    },
    {
      label: 'Group-wide expertise',
      title: 'Expert care, <em>one trusted brand</em>',
      text: 'Meet our specialists in maternity, fertility and children’s health. Find the right doctor and explore care at your nearest Kinder hospital.',
      image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1920&q=85',
      cta: 'Meet our doctors', href: '#doctors',
    },
    {
      label: 'Your journey, our care',
      title: 'Here for every <em>new beginning</em>',
      text: 'Explore maternity and health packages, and speak with our care team about the next step for you and your family.',
      image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=1920&q=85',
      cta: 'Explore our packages', href: '/packages',
    },
  ];
  const count = slides.length;

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setMotionOk(!query.matches);
    update(); query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  // A slideshow nobody can see is a slideshow nobody should pay for.
  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    onVisibility();
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const running = motionOk && !paused && !hold && !hidden;
  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => setCurrent((n) => (n + 1) % count), SLIDE_MS);
    return () => clearTimeout(timer);
  }, [running, current, count]);

  const select = useCallback((index) => setCurrent((index + count) % count), [count]);

  function onKeyDown(event) {
    if (event.key === 'ArrowRight') { select(current + 1); event.preventDefault(); }
    if (event.key === 'ArrowLeft') { select(current - 1); event.preventDefault(); }
  }
  function onTouchStart(event) { touchStart.current = event.changedTouches[0].clientX; }
  function onTouchEnd(event) {
    if (touchStart.current === null) return;
    const dx = event.changedTouches[0].clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(dx) > 50) select(current + (dx < 0 ? 1 : -1));
  }

  return <section id="home" className={styles.hero} aria-label="Kinder Hospitals highlights" aria-roledescription="carousel"
    onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}
    onFocusCapture={() => setHold(true)} onBlurCapture={() => setHold(false)}
    onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
    onKeyDown={onKeyDown} tabIndex={-1}
  >
    {slides.map((slide, i) => <div key={slide.label} className={`${styles.slide} ${i === current ? styles.active : ''}`}
      aria-hidden={i !== current} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${slides.length}`}>
      <img className={styles.image} src={slide.image} alt="" fetchPriority={i === 0 ? 'high' : 'low'} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
      <div className={styles.shade} />
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>{slide.label}</span>
          {i === 0 ? <h1><Headline text={slide.title} /></h1> : <h2><Headline text={slide.title} /></h2>}
          <p>{slide.text}</p>
          <div className={styles.actions}>
            <a href={slide.href} className="btn btn-primary" tabIndex={i === current ? 0 : -1}>{slide.cta} <span aria-hidden="true">→</span></a>
            {i === 0 && <a href={appointment} className={styles.book} tabIndex={i === current ? 0 : -1} target="_blank" rel="noopener noreferrer">Book an appointment</a>}
          </div>
        </div>
      </div>
    </div>)}
    <div className={styles.controls}>
      <button type="button" onClick={() => select(current - 1)} aria-label="Previous highlight">←</button>
      <div className={styles.dots} role="group" aria-label="Choose a highlight">
        {slides.map((slide, i) => <button type="button" key={slide.label} aria-label={`Show ${slide.label}`} aria-pressed={current === i} onClick={() => select(i)}><span /></button>)}
      </div>
      <button type="button" onClick={() => select(current + 1)} aria-label="Next highlight">→</button>
      {motionOk && <button type="button" className={styles.playPause} onClick={() => setPaused((p) => !p)}
        aria-label={paused ? 'Play the highlights' : 'Pause the highlights'}>
        {paused
          ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
          : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5h3v14H8zm5 0h3v14h-3z" /></svg>}
      </button>}
      <span className={styles.counter} aria-hidden="true">
        <strong>{String(current + 1).padStart(2, '0')}</strong> / {String(count).padStart(2, '0')}
      </span>
    </div>
    {motionOk && <div className={styles.progress} aria-hidden="true">
      <span key={current} style={{ animationDuration: `${SLIDE_MS}ms`, animationPlayState: running ? 'running' : 'paused' }} />
    </div>}
  </section>;
}
