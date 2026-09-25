'use client';

import { useEffect, useState } from 'react';
import UiIcon from '@/components/UiIcon';
import NavIcon from '@/components/NavIcon';
import { kochiFeaturePages } from '@/lib/kochi-features.mjs';

const WHATSAPP_BOOK =
  'https://api.whatsapp.com/send?phone=919446654500&text=' +
  encodeURIComponent('Hello Kinder Hospitals, I would like to book an appointment.');

// Header for a hospital's own sub-website: its Home is its own page, its menu
// scrolls within its page, and the only way "out" is the clearly-labelled
// corporate-site link. Other hospitals are never shown here.
export default function SubSiteHeader({ loc, settings, slug, sections = {}, pages = [] }) {
  const [open, setOpen] = useState(false);
  // This centre's own booking link when it has one, the group WhatsApp otherwise.
  const book = String(loc.bookingUrl || '').trim() || WHATSAPP_BOOK;

  useEffect(() => {
    const header = document.querySelector('.subsite-header');
    const onScroll = () => header && header.classList.toggle('is-stuck', window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const home = `/hospitals/${slug}`;
  const features = kochiFeaturePages(pages, loc.name);
  const celebration = features.filter((link) => link.group === 'Celebrate Pregnancy');
  const premium = features.find((link) => link.group === 'Premium Birthing Centre');
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
                  <NavIcon name={item.icon} />{item.label}
                </a>
              ))}
            </nav>

            <div className="subsite-actions">
              <a href={book} target="_blank" rel="noopener" className="nav-cta subsite-cta">
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
      {features.length > 0 && <nav className="kochi-feature-menu" aria-label="Kochi pregnancy and birthing menu">
        <div className="container kochi-feature-menu-inner">
          {celebration.length > 0 && <a className="kochi-feature-lead" href={`${home}/celebrate-pregnancy`} onClick={() => setOpen(false)}>Celebrate Pregnancy <span aria-hidden="true">→</span></a>}
          {celebration.map((link) => <a key={link.slug} href={link.href} onClick={() => setOpen(false)}>{link.label}</a>)}
          {premium && <a className="kochi-feature-premium" href={premium.href} onClick={() => setOpen(false)}>✦ Premium Birthing Centre <span aria-hidden="true">→</span></a>}
        </div>
      </nav>}
    </>
  );
}
