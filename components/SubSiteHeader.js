'use client';

import { useEffect, useRef, useState } from 'react';
import UiIcon from '@/components/UiIcon';
import NavIcon from '@/components/NavIcon';
import { centreName, clinicsOf, homeHospitalOf, isClinic, slugOfLocation } from '@/lib/locations';

// A hospital's Clinics menu: the clinics that belong to it (Kinder Alappuzha
// under Cherthala), or a "coming soon" note while it has none yet.
function ClinicsMenu({ loc, clinics, onNavigate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const name = centreName(loc);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    const onPointer = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onPointer); };
  }, [open]);

  return (
    <div className={`subsite-clinics${open ? ' is-open' : ''}`} ref={ref}>
      <button type="button" className="subsite-nav-btn" aria-expanded={open} aria-controls="subsite-clinics-panel"
        onClick={() => setOpen((v) => !v)}>
        <NavIcon name="clinic" />Clinics <span className="caret" aria-hidden="true">▾</span>
      </button>
      <div className="subsite-clinics-panel" id="subsite-clinics-panel" role="region" aria-label={`${name} clinics`}>
        {clinics.length ? (
          <>
            <p className="subsite-clinics-head">Our clinics · care close to home</p>
            {clinics.map((c) => (
              <a key={c.id ?? c.name} className="subsite-clinic-card" href={`/hospitals/${slugOfLocation(c)}`}
                onClick={() => { setOpen(false); onNavigate(); }}>
                <span className="subsite-clinic-ico" aria-hidden="true"><NavIcon name="clinic" /></span>
                <span className="subsite-clinic-body">
                  <strong>{centreName(c)}</strong>
                  <small className="subsite-clinic-tag">{['Clinic', c.since || c.city].filter(Boolean).join(' · ')}</small>
                  {c.address && <small className="subsite-clinic-addr">{c.address}</small>}
                  <span className="subsite-clinic-go">Visit clinic →</span>
                </span>
              </a>
            ))}
          </>
        ) : (
          <div className="subsite-clinics-soon">
            <span className="subsite-clinic-ico" aria-hidden="true"><NavIcon name="clinic" /></span>
            <span className="subsite-soon-badge">Coming soon</span>
            <strong>{name} clinics</strong>
            <p>We are bringing Kinder care closer to home. Clinics linked to {name} will be listed here soon.</p>
            {loc.phone && (
              <a className="subsite-soon-call" href={`tel:${loc.phone.replace(/\s/g, '')}`}>
                <UiIcon name="phone" /> Call {loc.phone}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Header for a hospital's own sub-website: its Home is its own page, its menu
// scrolls within its page, and the only way "out" is the clearly-labelled
// corporate-site link. Other hospitals are never shown here.
export default function SubSiteHeader({ loc, settings, slug, sections = {}, locations = [] }) {
  const [open, setOpen] = useState(false);
  // This centre's own booking link when it has one, the group WhatsApp otherwise.
  // Its own booking page: only this centre's doctors, inside this site.
  const book = `/hospitals/${slug}/book`;

  useEffect(() => {
    const header = document.querySelector('.subsite-header');
    const onScroll = () => header && header.classList.toggle('is-stuck', window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const home = `/hospitals/${slug}`;
  // Hospitals carry a Clinics menu; a clinic links back to its hospital.
  const clinic = isClinic(loc);
  const clinics = clinic ? [] : clinicsOf(loc, locations);
  const homeHospital = clinic ? homeHospitalOf(loc, locations) : null;
  const name = centreName(loc);
  // The centre's own menu, in the order the group site tree lists it. The
  // full list lives in the footer; the bar carries what a visitor needs most.
  const items = [
    { label: 'Home', href: home, icon: 'home' },
    { label: 'About', href: `${home}#about`, icon: 'about' },
    sections.care && { label: 'Our Care', href: `${home}#care`, icon: 'care' },
    sections.specialities && { label: 'Specialities', href: `${home}#specialities`, icon: 'stethoscope' },
    sections.doctors && { label: 'Doctors', href: `${home}#doctors`, icon: 'doctor' },
    sections.facilities && { label: 'Facilities', href: `${home}#facilities`, icon: 'building' },
    { label: 'Patient Services', href: `${home}#patient-services`, icon: 'people' },
    { label: 'Contact', href: `${home}#contact`, icon: 'phone' },
  ].filter(Boolean);

  return (
    <>
      <div className="subsite-topbar">
        <div className="container">
          <div className="subsite-topbar-in">
            <div className="subsite-topbar-contact">
              {loc.phone && (
                <a href={`tel:${loc.phone.replace(/\s/g, '')}`}>
                  <UiIcon name="phone" /> 24/7 Emergency · {loc.phone}
                </a>
              )}
              {loc.email && (
                <a href={`mailto:${loc.email}`}>
                  <UiIcon name="mail" /> {loc.email}
                </a>
              )}
            </div>
            <div className="subsite-topbar-links">
              {homeHospital && (
                <a className="corporate-link subsite-home-link" href={`/hospitals/${slugOfLocation(homeHospital)}`}>
                  A clinic of {centreName(homeHospital)} →
                </a>
              )}
              <a className="corporate-link" href="/">
                Part of Kinder Medical Group · Corporate Website →
              </a>
            </div>
          </div>
        </div>
      </div>

      <header className="subsite-header">
        <div className="container">
          <div className="subsite-header-in">
            <a href={home} className="subsite-brand" aria-label={`${name} — Home`}>
              <img src={settings.logoUrl || '/logo.png'} alt="Kinder" className="subsite-logo" />
              <span className="subsite-brand-text">
                <strong>{name}</strong>
                {loc.accreditation || loc.accreditationLogoUrl ? (
                  <small className="subsite-accreditation">{loc.accreditation || 'Accredited'}</small>
                ) : (
                  <small>{loc.since || `${loc.city} · ${loc.country}`}</small>
                )}
              </span>
              {loc.accreditationLogoUrl && (
                <img
                  src={loc.accreditationLogoUrl}
                  alt={loc.accreditation || 'Accreditation emblem'}
                  className="subsite-emblem"
                  width="48"
                  height="48"
                />
              )}
            </a>

            <nav className={`subsite-nav${open ? ' open' : ''}`} aria-label={`${name} menu`}>
              {items.map((item) => (
                <a key={item.label} href={item.href} onClick={() => setOpen(false)}
                  className={item.href === home ? 'subsite-nav-home' : undefined}>
                  <NavIcon name={item.icon} />{item.label}
                </a>
              ))}
              {!clinic && <ClinicsMenu loc={loc} clinics={clinics} onNavigate={() => setOpen(false)} />}
            </nav>

            <div className="subsite-actions">
              <a href={book} className="nav-cta subsite-cta">
                Book Appointment →
              </a>
              <button
                className="subsite-toggle"
                aria-label="Toggle menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
              >
                <span></span><span></span><span></span>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
