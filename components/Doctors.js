'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

function initials(name) {
  return (name || '')
    .replace(/^(Brigadier|Brig\.?|Dr\.?|\(Dr\.\))\s*/gi, '')
    .replace(/[()]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .filter((c) => /[A-Za-z]/.test(c))
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function Doctors({ doctors = [] }) {
  const trackRef = useRef(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);
  const touchStartX = useRef(0);

  const getCardsPerView = () => {
    const w = window.innerWidth;
    if (w < 720) return 1;
    if (w <= 1024) return 2;
    return 4;
  };

  useEffect(() => {
    const onResize = () => setCardsPerView(getCardsPerView());
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const totalPages = Math.max(1, doctors.length - cardsPerView + 1);
  const maxIndex = totalPages - 1;
  const index = Math.min(pageIndex, maxIndex);

  const applyTransform = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector('.slider-card');
    if (!card) return;
    const cardWidth = card.getBoundingClientRect().width;
    const gap = 24;
    track.style.transform = `translateX(-${index * (cardWidth + gap)}px)`;
  }, [index]);

  useEffect(() => {
    applyTransform();
    window.addEventListener('resize', applyTransform);
    return () => window.removeEventListener('resize', applyTransform);
  }, [applyTransform]);

  const goNext = () => setPageIndex((i) => Math.min(i + 1, maxIndex));
  const goPrev = () => setPageIndex((i) => Math.max(i - 1, 0));

  const onTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) (dx < 0 ? goNext : goPrev)();
  };

  const dotCount = Math.min(totalPages, 2);
  const activeDot =
    Math.round((index / Math.max(1, maxIndex)) * (dotCount - 1)) || 0;

  return (
    <section className="doctors" id="doctors">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="section-eyebrow">Featured Specialists · Kochi</span>
            <h2 className="section-title">
              Meet our <em>senior consultants</em>
            </h2>
            <p className="section-intro">
              Skilled specialists at Kinder Hospital Kochi — bringing decades of expertise in
              medicine, surgery, and women&apos;s health under one roof.
            </p>
          </div>
          <a href="https://www.kinderkochi.com/doctors" className="view-all">
            View All Doctors →
          </a>
        </div>

        <div className="doctor-slider" aria-label="Featured Kinder specialists">
          <button
            className="slider-arrow slider-prev"
            aria-label="Previous doctor"
            onClick={goPrev}
            disabled={index === 0}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>

          <div className="slider-viewport">
            <div
              className="slider-track"
              ref={trackRef}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {doctors.map((doc, i) => (
                <article className="doctor-card slider-card" key={doc.id ?? i}>
                  <div className="doctor-img">
                    <span className="doctor-branch">{doc.location}</span>
                    {doc.imageUrl ? (
                      <img
                        src={doc.imageUrl}
                        alt={doc.name}
                        className="doctor-photo"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : null}
                    <svg
                      className="doctor-watermark"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="xMidYMid slice"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <defs>
                        <pattern id={`dgrid-${i}`} x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
                          <circle cx="7" cy="7" r="1" fill="currentColor" />
                        </pattern>
                      </defs>
                      <rect width="100" height="100" fill={`url(#dgrid-${i})`} />
                      <path
                        d="M50 78 C 30 62, 22 50, 30 38 C 36 30, 46 32, 50 40 C 54 32, 64 30, 70 38 C 78 50, 70 62, 50 78 Z"
                        fill="currentColor"
                        opacity="0.5"
                      />
                    </svg>
                    <div className="doctor-initials">
                      <span className="ini">{initials(doc.name)}</span>
                      <span className="role-mini">{(doc.speciality || '').toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="doctor-info">
                    <h4>{doc.name}</h4>
                    <p>{doc.designation}</p>
                    <span className="doctor-creds">{doc.bio}</span>
                  </div>
                  <div className="doctor-cta">
                    <button>Book</button>
                    <button>Profile</button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <button
            className="slider-arrow slider-next"
            aria-label="Next doctor"
            onClick={goNext}
            disabled={index >= maxIndex}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>

        {dotCount > 1 && (
          <div className="slider-dots">
            {Array.from({ length: dotCount }).map((_, i) => (
              <button
                key={i}
                className={`slider-dot${i === activeDot ? ' active' : ''}`}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() =>
                  setPageIndex(Math.round((i / Math.max(1, dotCount - 1)) * maxIndex))
                }
              ></button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
