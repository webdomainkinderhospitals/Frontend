'use client';

import { useEffect, useState } from 'react';

const WHATSAPP_BOOK =
  'https://api.whatsapp.com/send?phone=919446654500&text=' +
  encodeURIComponent('Hello Kinder Hospitals, I would like to book an appointment.');

// Header for a hospital's own sub-website: its Home is its own page, its menu
// scrolls within its page, and the only way "out" is the clearly-labelled
// corporate-site link. Other hospitals are never shown here.
export default function SubSiteHeader({ loc, settings, slug, sections = {} }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const header = document.querySelector('.subsite-header');
    const onScroll = () => header && header.classList.toggle('is-stuck', window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const home = `/hospitals/${slug}`;
  const items = [
    { label: 'Home', href: home },
    { label: 'About', href: `${home}#about` },
    sections.doctors && { label: 'Doctors', href: `${home}#doctors` },
    sections.procedures && { label: 'Treatments', href: `${home}#procedures` },
    sections.testimonials && { label: 'Patient Stories', href: `${home}#testimonials` },
    sections.news && { label: 'News & Events', href: `${home}#news` },
    { label: 'Contact', href: `${home}#contact` },
  ].filter(Boolean);

  return (
    <>
      <div className="subsite-topbar">
        <div className="container">
          <div className="subsite-topbar-in">
            <div className="subsite-topbar-contact">
              {loc.phone && <a href={`tel:${loc.phone.replace(/\s/g, '')}`}>☎ {loc.phone}</a>}
              {loc.email && <a href={`mailto:${loc.email}`}>✉ {loc.email}</a>}
            </div>
            <a className="corporate-link" href="/">
              Part of Kinder Medical Group · Corporate Website →
            </a>
          </div>
        </div>
      </div>

      <header className="subsite-header">
        <div className="container">
          <div className="subsite-header-in">
            <a href={home} className="subsite-brand" aria-label={`Kinder ${loc.name} — Home`}>
              <img src={settings.logoUrl || '/logo.png'} alt="Kinder" className="subsite-logo" />
              <span className="subsite-brand-text">
                <strong>Kinder {loc.name}</strong>
                <small>{loc.since || `${loc.city} · ${loc.country}`}</small>
              </span>
            </a>

            <nav className={`subsite-nav${open ? ' open' : ''}`} aria-label={`Kinder ${loc.name} menu`}>
              {items.map((item) => (
                <a key={item.label} href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="subsite-actions">
              <a href={WHATSAPP_BOOK} target="_blank" rel="noopener" className="nav-cta subsite-cta">
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
