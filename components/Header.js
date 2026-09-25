'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { groupServices, slugify } from '@/lib/services';
import { siteTree } from '@/lib/site-tree';
import { centreName } from '@/lib/locations';
import { kochiFeaturePages } from '@/lib/kochi-features.mjs';

const HOSPITAL_TAGS = {
  Cherthala: 'Flagship · Since 2011',
  Kochi: 'Multispeciality · Since 2018',
  Bengaluru: "Women's & Fertility · Since 2022",
  Alappuzha: "Women's Clinic · Since 2023",
  Singapore: 'International · HQ',
};

const BOOK =
  'https://api.whatsapp.com/send?phone=919446654500&text=' +
  encodeURIComponent('Hello Kinder Hospitals, I would like to book an appointment.');

// One line under each pregnancy experience in the Celebrate Pregnancy menu.
const FEATURE_NOTES = {
  'kochi-tharattazhaku': 'Our pregnancy fashion show',
  'kochi-wow-mom': 'Pregnancy club for mothers-to-be',
  'kochi-water-birthing-suite': 'Kerala’s first water birthing suite',
  'kochi-premium-birthing-centre': 'LDRP suites & painless labour',
};

export default function Header({ settings, locations = [], specialities = [], pages = [] }) {
  // Kinder Kochi's pregnancy experiences, from the same published pages as the
  // Kochi menu bar: a highlighted strip under the menu and a dropdown on
  // Celebrate Pregnancy. Both disappear if the pages are unpublished.
  const features = kochiFeaturePages(pages, 'Kochi');
  const celebration = features.filter((f) => f.group === 'Celebrate Pregnancy');
  const premium = features.find((f) => f.group === 'Premium Birthing Centre');
  const serviceGroups = groupServices(specialities);
  // Menus are built from the agreed site tree, so the navigation cannot drift
  // away from the architecture.
  const tree = siteTree(locations);
  const node = (label) => tree.find((n) => n.label === label);
  const about = node('About Us');
  const patients = node('Patients Portal');
  const library = node('Health Library');
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const pathname = usePathname() || '/';

  // Which top-level menu item owns the current page.
  const sectionOf = (p) => {
    if (p.startsWith('/about') || p.startsWith('/careers') || p.startsWith('/media') || p.startsWith('/international-patients')) return 'about';
    if (p.startsWith('/celebrate-pregnancy')) return 'pregnancy';
    if (p.startsWith('/hospitals')) return 'locations';
    if (p.startsWith('/services')) return 'services';
    if (p.startsWith('/doctors')) return 'doctors';
    if (p.startsWith('/patients') || p.startsWith('/packages')) return 'patients';
    if (p.startsWith('/health-library') || p.startsWith('/news') || p.startsWith('/stories')) return 'library';
    if (p.startsWith('/find-care')) return 'find-care';
    if (p.startsWith('/contact')) return 'contact';
    return 'home';
  };
  const active = sectionOf(pathname);
  const act = (key) => (active === key ? ' is-active' : '');

  // Mirror the original: body.menu-open drives the off-canvas nav + backdrop.
  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  // Sticky header shadow + escape/resize handling.
  useEffect(() => {
    const header = document.querySelector('.header');
    const onScroll = () => header && header.classList.toggle('is-stuck', window.scrollY > 12);
    const onKey = (e) => {
      if (e.key === 'Escape') closeMenu();
    };
    const onResize = () => {
      if (!window.matchMedia('(max-width: 1024px)').matches) closeMenu();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  function closeMenu() {
    setMenuOpen(false);
    setOpenDropdown(null);
  }

  function toggleDropdown(e, key) {
    // On mobile, dropdowns are accordions toggled by tapping the parent link.
    if (window.matchMedia('(max-width: 1024px)').matches) {
      e.preventDefault();
      setOpenDropdown((cur) => (cur === key ? null : key));
    }
  }

  function onLeafClick() {
    if (window.matchMedia('(max-width: 1024px)').matches) {
      setTimeout(closeMenu, 150);
    }
  }

  const dd = (key) => `has-dropdown${openDropdown === key ? ' is-open' : ''}`;

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-main">
            <a href="/#home" className="brand" aria-label={`${settings.siteName} — Home`}>
              <img
                src={settings.logoUrl || '/logo.png'}
                alt={`${settings.siteName} — Kindles life`}
                className="brand-logo"
                width="540"
                height="276"
              />
            </a>
            <div className="header-actions">
              <button
                className="mobile-toggle"
                aria-label="Toggle menu"
                onClick={() => setMenuOpen((v) => !v)}
              >
                <span></span><span></span><span></span>
              </button>
              <div className="helpline">
                <span className="helpline-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <div className="helpline-text">
                  <strong>{settings.helplinePhone}</strong>
                  <span>24/7 Helpline · Emergency {settings.emergencyPhone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <nav className="nav" id="mainNav">
          <div className="container">
            <ul className="nav-list">
              <li className={act('home')}><a href="/" onClick={onLeafClick}>Home</a></li>

              <li className={dd('about') + act('about')}>
                <a href={about.href} onClick={(e) => toggleDropdown(e, 'about')}>
                  {about.label} <span className="caret">▾</span>
                </a>
                <div className="dropdown">
                  {about.children.map((child) => (
                    <a key={child.label} href={child.href} onClick={onLeafClick}><strong>{child.label}</strong></a>
                  ))}
                </div>
              </li>

              {features.length ? (
                <li className={dd('pregnancy') + ' nav-pregnancy' + act('pregnancy')}>
                  <a href="/celebrate-pregnancy" onClick={(e) => toggleDropdown(e, 'pregnancy')}>
                    <span className="nav-spark" aria-hidden="true">✦</span> Celebrate Pregnancy <span className="caret">▾</span>
                  </a>
                  <div className="dropdown dropdown-pregnancy">
                    <a href="/celebrate-pregnancy" onClick={onLeafClick}><strong>Your pregnancy journey</strong><small>Antenatal care to going home</small></a>
                    <a href="/hospitals/kochi/celebrate-pregnancy" onClick={onLeafClick}><strong>Celebrate Pregnancy at Kinder Kochi</strong><small>All experiences in one place</small></a>
                    {features.map((f) => (
                      <a key={f.slug} href={f.href} onClick={onLeafClick} className={f === premium ? 'is-premium' : undefined}>
                        <strong>{f === premium ? '✦ ' : ''}{f.label}</strong>
                        <small>{FEATURE_NOTES[f.slug] || f.group}</small>
                      </a>
                    ))}
                  </div>
                </li>
              ) : (
                <li className={act('pregnancy')}><a href="/celebrate-pregnancy" onClick={onLeafClick}>Celebrate Pregnancy</a></li>
              )}

              <li className={`${dd('locations')} has-mega` + act('locations')}>
                <a href="/hospitals" onClick={(e) => toggleDropdown(e, 'locations')}>
                  Our Locations <span className="caret">▾</span>
                </a>
                <div className="dropdown mega mega-hospitals">
                  {locations.map((loc) => (
                    <a
                      key={loc.id}
                      href={`/hospitals/${loc.slug || String(loc.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                      className={`hospital-card${loc.international ? ' hospital-international' : ''}`}
                      onClick={onLeafClick}
                    >
                      <div
                        className="hospital-img"
                        style={{
                          backgroundImage: loc.imageUrl
                            ? `url('${loc.imageUrl}'), var(--mesh-card)`
                            : 'var(--mesh-card)',
                        }}
                      ></div>
                      <div className="hospital-meta">
                        <span className={`hospital-since${loc.international ? ' hospital-since-intl' : ''}`}>
                          {loc.since || HOSPITAL_TAGS[loc.name] || `${loc.city} · ${loc.country}`}
                        </span>
                        <h6>{centreName(loc)}</h6>
                        <p>{loc.address}</p>
                        <span className="hospital-link">
                          {`Explore ${centreName(loc)} →`}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </li>

              <li className={`${dd('services')} has-mega` + act('services')}>
                <a href="/services" onClick={(e) => toggleDropdown(e, 'services')}>
                  Specialities <span className="caret">▾</span>
                </a>
                <div className="dropdown mega">
                  {serviceGroups.slice(0, 3).map((group) => (
                    <div className="mega-col" key={group.id}>
                      <h6>{group.title}</h6>
                      {group.items.slice(0, 8).map((item) => (
                        <a key={item.name} href={`/services/${slugify(item.name)}`} onClick={onLeafClick}>{item.name}</a>
                      ))}
                    </div>
                  ))}
                  <div className="mega-col mega-feature">
                    <h6>{serviceGroups[3].title}</h6>
                    {serviceGroups[3].items.slice(0, 9).map((item) => (
                      <a key={item.name} href={`/services/${slugify(item.name)}`} onClick={onLeafClick}>{item.name}</a>
                    ))}
                    <div className="mega-cta">
                      <strong>Need a specialist?</strong>
                      <p>Our care coordinators will guide you to the right Kinder doctor.</p>
                      <a href={BOOK} target="_blank" rel="noopener" className="mega-btn" onClick={onLeafClick}>Book Appointment →</a>
                    </div>
                  </div>
                </div>
              </li>

              <li className={act('doctors')}><a href="/doctors" onClick={onLeafClick}>Doctors</a></li>

              <li className={dd('patients') + act('patients')}>
                <a href={patients.href} onClick={(e) => toggleDropdown(e, 'patients')}>
                  Patients <span className="caret">▾</span>
                </a>
                <div className="dropdown">
                  {patients.children.map((child) => (
                    <a key={child.label} href={child.href} onClick={onLeafClick}><strong>{child.label}</strong></a>
                  ))}
                </div>
              </li>

              <li className={dd('library') + act('library')}>
                <a href={library.href} onClick={(e) => toggleDropdown(e, 'library')}>
                  Health Library <span className="caret">▾</span>
                </a>
                <div className="dropdown">
                  {library.children.map((child) => (
                    <a key={child.label} href={child.href} onClick={onLeafClick}><strong>{child.label}</strong></a>
                  ))}
                </div>
              </li>

              <li className={act('find-care')}><a href="/find-care" onClick={onLeafClick}>Find Care</a></li>

              <li className={act('contact')}><a href="/contact" onClick={onLeafClick}>Contact</a></li>

              <li className="nav-cta-wrap">
                <a href={BOOK} target="_blank" rel="noopener" className="nav-cta" onClick={onLeafClick}>Book Appointment →</a>
              </li>
            </ul>
          </div>
        </nav>
        {features.length > 0 && (
          <nav className="pregnancy-strip" aria-label="Celebrate Pregnancy at Kinder Kochi">
            <div className="container pregnancy-strip-in">
              <a className="pregnancy-strip-lead" href="/hospitals/kochi/celebrate-pregnancy">
                <span className="pregnancy-strip-pulse" aria-hidden="true" />
                Celebrate Pregnancy <span className="pregnancy-strip-where">at Kinder Kochi</span> <span aria-hidden="true">→</span>
              </a>
              <span className="pregnancy-strip-links">
                {celebration.map((f) => <a key={f.slug} href={f.href}>{f.label}</a>)}
                {premium && <a className="pregnancy-strip-premium" href={premium.href}>✦ Premium Birthing Centre <span aria-hidden="true">→</span></a>}
              </span>
            </div>
          </nav>
        )}
      </header>

      <div className="nav-backdrop" onClick={closeMenu}></div>
    </>
  );
}
