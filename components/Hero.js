'use client';

import { useEffect, useRef, useState } from 'react';

const STATIC_SLIDES = [
  {
    eyebrow: 'Group-Wide Expertise',
    titleHtml: '60+ specialists, <em>one trusted brand</em>',
    text: 'Senior consultants across Obstetrics, IVF, Neonatology, Paediatric Surgery, and Reproductive Medicine — practicing under shared protocols, audit, and clinical governance across all Kinder hospitals.',
    ctas: [{ label: 'Meet Our Doctors →', className: 'btn btn-primary' }],
    imageUrl:
      'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1920&q=80',
  },
  {
    eyebrow: 'Kinder Jananimitra Package',
    titleHtml: "Let's celebrate your <em>pregnancy journey</em>",
    text: "Comprehensive maternity packages — from your first scan to your baby's first vaccines. Available across our Cherthala, Kochi, and Bengaluru hospitals.",
    ctas: [{ label: 'Explore Maternity Packages →', className: 'btn btn-primary' }],
    imageUrl:
      'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=1920&q=80',
  },
];

export default function Hero({ settings }) {
  const slides = [
    {
      eyebrow: 'Welcome to Kinder Medical Group',
      titleHtml:
        settings.heroTitle || 'Kindness at the heart of <em>every tiny heartbeat</em>',
      text:
        settings.heroSubtitle ||
        "A women's & children's healthcare network spanning 5 hospitals across Cherthala, Kochi, Bengaluru, Alappuzha and Singapore.",
      ctas: [
        { label: 'Find Your Nearest Hospital →', className: 'btn btn-primary' },
        { label: 'Book an Appointment', className: 'btn btn-outline' },
      ],
      imageUrl:
        settings.heroImageUrl ||
        'https://images.unsplash.com/photo-1519824145371-296894a0daa9?auto=format&fit=crop&w=1920&q=80',
    },
    ...STATIC_SLIDES,
  ];

  const [current, setCurrent] = useState(0);
  const [ready, setReady] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => setReady(true));
  }, []);

  useEffect(() => {
    timer.current = setInterval(
      () => setCurrent((c) => (c + 1) % slides.length),
      6000
    );
    return () => clearInterval(timer.current);
  }, [slides.length]);

  function goTo(i) {
    setCurrent(i);
    clearInterval(timer.current);
    timer.current = setInterval(
      () => setCurrent((c) => (c + 1) % slides.length),
      6000
    );
  }

  function onDotsKeyDown(e) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo((current + 1) % slides.length);
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo((current - 1 + slides.length) % slides.length);
    }
  }

  return (
    <section className={`hero${ready ? ' is-ready' : ''}`} style={{ padding: 0 }}>
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`hero-slide${i === current ? ' active' : ''}`}
          style={{
            backgroundImage: slide.imageUrl
              ? `url('${slide.imageUrl}'), var(--mesh-hero)`
              : 'var(--mesh-hero)',
          }}
        >
          <span className="hero-blob b1" aria-hidden="true"></span>
          <span className="hero-blob b2" aria-hidden="true"></span>
          <div className="container">
            <div className="hero-content">
              <span className="hero-eyebrow">{slide.eyebrow}</span>
              <h1
                className="hero-title"
                dangerouslySetInnerHTML={{ __html: slide.titleHtml }}
              />
              <p className="hero-text">{slide.text}</p>
              {slide.ctas.map((cta, j) => (
                <a key={j} href="#" className={cta.className}>
                  {cta.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      ))}

      <div className="hero-dots" role="tablist" onKeyDown={onDotsKeyDown}>
        {slides.map((_, i) => (
          <button
            key={i}
            className={i === current ? 'active' : ''}
            aria-label={`Show highlight ${i + 1} of ${slides.length}`}
            onClick={() => goTo(i)}
          ></button>
        ))}
      </div>
    </section>
  );
}
