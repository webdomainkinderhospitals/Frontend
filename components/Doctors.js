'use client';

import { atLocation, locationsOf } from '@/lib/locations';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DoctorCard from './DoctorCard';

const norm = (s) => String(s || '').trim().toLowerCase();

export default function Doctors({ doctors: all = [], locations = [] }) {
  const trackRef = useRef(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [hospital, setHospital] = useState('');
  // Group-wide doctors ("" location) practise at every centre.
  const doctors = useMemo(
    () => all.filter((d) => !hospital || locationsOf(d).length === 0 || atLocation(d, hospital)),
    [all, hospital]
  );
  const pick = (name) => { setHospital(norm(name) === norm(hospital) ? '' : name); setPageIndex(0); };
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
            <span className="section-eyebrow">Featured Specialists</span>
            <h2 className="section-title">
              Meet our <em>senior consultants</em>
            </h2>
            <p className="section-intro">
              Skilled specialists from across the Kinder network — bringing decades of expertise
              in medicine, surgery, and women&apos;s and children&apos;s health under one roof.
            </p>
          </div>
          <a href="/doctors" className="view-all">
            View All Doctors →
          </a>
        </div>

        {locations.length > 1 && (
          <div className="doctor-filters" role="group" aria-label="Filter featured doctors by hospital">
            <button type="button" className={`doctor-filter${hospital === '' ? ' active' : ''}`} onClick={() => pick('')}>All hospitals</button>
            {locations.map((l) => (
              <button
                key={l.id ?? l.name}
                type="button"
                className={`doctor-filter${norm(hospital) === norm(l.name) ? ' active' : ''}`}
                onClick={() => pick(l.name)}
              >
                Kinder {l.name}
              </button>
            ))}
            <a className="doctor-filter" href={`/doctors${hospital ? `?hospital=${encodeURIComponent(hospital)}` : ''}`}>Filter by speciality →</a>
          </div>
        )}

        {doctors.length === 0 && (
          <p className="section-intro" style={{ marginBottom: 24 }}>No doctors listed for this hospital yet — see <a href="/doctors">all doctors</a>.</p>
        )}
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
                <div className="slider-card" key={doc.id ?? i}>
                  <DoctorCard doc={doc} compact />
                </div>
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
