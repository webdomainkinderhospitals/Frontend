'use client';

import { useEffect, useState } from 'react';
import styles from './HomeHero.module.css';

const appointment = 'https://api.whatsapp.com/send?phone=919446654500&text=' +
  encodeURIComponent('Hello Kinder Hospitals, I would like to book an appointment.');

function Headline({ text }) {
  return String(text).split(/(<em>.*?<\/em>)/gis).map((part, i) =>
    /^<em>/i.test(part) ? <em key={i}>{part.slice(4, -5)}</em> : part);
}

export default function HomeHero({ settings = {}, locations = [] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
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
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update(); query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  const stopped = paused || hovered || focused || reducedMotion;
  useEffect(() => {
    if (stopped) return;
    const timer = setInterval(() => setCurrent((n) => (n + 1) % 3), 6500);
    return () => clearInterval(timer);
  }, [stopped, current]);
  function select(index) { setCurrent((index + slides.length) % slides.length); setPaused(true); }
  return <section id="home" className={styles.hero} aria-label="Kinder Hospitals highlights" aria-roledescription="carousel"
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)} onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); }}>
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
      {!reducedMotion && <button type="button" className={styles.pause} onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}>{paused ? 'Play' : 'Pause'}</button>}
    </div>
  </section>;
}
