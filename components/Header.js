'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { groupServices, slugify } from '@/lib/services';
import { siteTree } from '@/lib/site-tree';
import { centreName, hospitalsOnly, slugOfLocation } from '@/lib/locations';
import { kochiFeaturePages, menuHighlights, pregnancyPhoto, JOURNEY_PHOTO, PREMIUM_SLUG, BIRTHING_STILL } from '@/lib/kochi-features.mjs';
import SpecialityIcon from '@/components/SpecialityIcon';
import { iconsForList } from '@/lib/speciality-icons.mjs';
import NavIcon from '@/components/NavIcon';
import HospitalContacts from '@/components/HospitalContacts';
import { parseContacts } from '@/lib/enquiries.mjs';

const HOSPITAL_TAGS = {
  Cherthala: 'Flagship · Since 2011',
  Kochi: 'Multispeciality · Since 2018',
  Bengaluru: "Women's & Fertility · Since 2022",
  Singapore: 'International · HQ',
};

// Book Appointment opens the booking page: every doctor, filterable, with a
// preferred day and a request sent on WhatsApp.
const BOOK = '/book';

// One line under each pregnancy experience in the Celebrate Pregnancy menu.
const FEATURE_NOTES = {
  'kochi-tharattazhaku': 'Our pregnancy fashion show',
  'kochi-wow-mom': 'Pregnancy club for mothers-to-be',
  'kochi-water-birthing-suite': 'Kerala’s first water birthing suite',
  'kochi-premium-birthing-centre': 'LDRP suites & painless labour',
};
// The Celebrate Pregnancy menu's order, as the hospital asked; anything not
// listed (a new experience) goes before the closing "Your pregnancy journey".
const MENU_ORDER = ['kochi-tharattazhaku', 'celebrate-spandanam', 'celebrate-mom-mix', 'celebrate-mom-to-be', 'kochi-wow-mom'];
const menuRank = (key) => (key === 'journey' ? 99 : MENU_ORDER.includes(key) ? MENU_ORDER.indexOf(key) : 50);
// The Premium Birthing Centre menu: a still from the hospital's own film for
// the centre, and a fuller line under each.
const BIRTHING_PHOTOS = { [PREMIUM_SLUG]: BIRTHING_STILL };
const BIRTHING_NOTES = {
  'kochi-premium-birthing-centre': 'Private LDRP suites, painless labour and a dedicated birthing team',
  'kochi-water-birthing-suite': 'Kerala’s first water birthing suite — calm, warm-water labour',
};

export default function Header({ settings, locations: allLocations = [], specialities = [], pages = [] }) {
  // Kinder Kochi's pregnancy experiences, from the same published pages as the
  // Kochi menu bar, listed in the Celebrate Pregnancy dropdown.
  // The group site lists hospitals only; clinics are reached from the
  // sub-site of the hospital they belong to.
  const hospitals = hospitalsOnly(allLocations);
  const locations = hospitals;
  // They open on the main site, not on Kinder Kochi's own site.
  const allFeatures = kochiFeaturePages(pages, 'Kochi', { site: 'main' });
  // The Premium Birthing Centre leads its own menu, with Water Birth inside it.
  const premium = allFeatures.find((f) => f.slug === PREMIUM_SLUG);
  const birthing = allFeatures.filter((f) => f.group === 'Premium Birthing Centre');
  const features = allFeatures.filter((f) => f.group === 'Celebrate Pregnancy');
  // Spandanam and Cake Mixing (Mom Mix), from their Content Library pages.
  const highlights = menuHighlights(pages);
  const serviceGroups = groupServices(specialities);
  // The Specialities menu shows its columns side by side, so no icon repeats across them.
  const megaIcons = iconsForList([
    ...serviceGroups.slice(0, 3).flatMap((g) => g.items.slice(0, 8)),
    ...(serviceGroups[3]?.items.slice(0, 9) || []),
  ].map((item) => item.name));
  // Menus are built from the agreed site tree, so the navigation cannot drift
  // away from the architecture.
  const tree = siteTree(locations);
  const node = (label) => tree.find((n) => n.label === label);
  const about = node('About Us');
  const patients = node('Patients Portal');
  const library = node('Health Library');
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  // The hospitals menu lives in its own highlighted bar under the main menu.
  const [hospitalsOpen, setHospitalsOpen] = useState(false);
  const hospitalsRef = useRef(null);
  const pathname = usePathname() || '/';

  // Which top-level menu item owns the current page.
  const sectionOf = (p) => {
    if (p.startsWith('/about') || p.startsWith('/careers') || p.startsWith('/media') || p.startsWith('/international-patients')) return 'about';
    if (p.startsWith('/celebrate-pregnancy')) return 'pregnancy';
    if (p.startsWith('/premium-birthing-centre')) return 'premium';
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
      if (e.key === 'Escape') { closeMenu(); setHospitalsOpen(false); }
    };
    const onPointer = (e) => {
      if (hospitalsRef.current && !hospitalsRef.current.contains(e.target)) setHospitalsOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
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
      document.removeEventListener('pointerdown', onPointer);
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
            {/* The hospitals menu sits in the logo row on larger screens and as a
                slim band under it on phones and tablets. */}
            <nav className="hospitals-strip" aria-label="Kinder hospitals">
              <div className="hospitals-strip-in">
                <span className="hospitals-strip-note">
                  <span className="hospitals-strip-pulse" aria-hidden="true" />
                  One standard of care, across all Kinder Hospitals
                </span>
                <div
                  ref={hospitalsRef}
                  className={`hospitals-menu${hospitalsOpen ? ' is-open' : ''}${active === 'locations' ? ' is-active' : ''}`}
                >
                  <button
                    type="button"
                    className="hospitals-trigger"
                    aria-expanded={hospitalsOpen}
                    aria-controls="hospitals-panel"
                    onClick={() => setHospitalsOpen((v) => !v)}
                  >
                    <NavIcon name="pin" />
                    Our Hospitals
                    <span className="caret" aria-hidden="true">▾</span>
                  </button>
                  <div className="hospitals-panel" id="hospitals-panel">
                    <div className="hospitals-panel-grid">
                      {hospitals.map((loc) => (
                        <a
                          key={loc.id ?? loc.name}
                          href={`/hospitals/${slugOfLocation(loc)}`}
                          className={`hospital-card${loc.international ? ' hospital-international' : ''}`}
                          onClick={() => setHospitalsOpen(false)}
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
                            <span className="hospital-link">{`Explore ${centreName(loc)} →`}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                    <a className="hospitals-panel-all" href="/hospitals" onClick={() => setHospitalsOpen(false)}>
                      View all hospitals →
                    </a>
                  </div>
                </div>
              </div>
            </nav>
            <div className="header-actions">
              <button
                className="mobile-toggle"
                aria-label="Toggle menu"
                onClick={() => setMenuOpen((v) => !v)}
              >
                <span></span><span></span><span></span>
              </button>
              {/* Each hospital's own number and email, with a call-back
                  request that reaches the admin portal. The group helpline
                  shows only if no hospital numbers are set. */}
              {parseContacts(settings.helplineContacts).length ? (
                <HospitalContacts text={settings.helplineContacts} />
              ) : (
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
              )}
            </div>
          </div>
        </div>

        <nav className="nav" id="mainNav">
          <div className="container">
            <ul className="nav-list">
              <li className={act('home')}><a href="/" onClick={onLeafClick}><NavIcon name="home" />Home</a></li>

              <li className={dd('about') + act('about')}>
                <a href={about.href} onClick={(e) => toggleDropdown(e, 'about')}>
                  <NavIcon name="about" />{about.label} <span className="caret">▾</span>
                </a>
                <div className="dropdown">
                  {about.children.map((child) => (
                    <a key={child.label} href={child.href} onClick={onLeafClick}><strong>{child.label}</strong></a>
                  ))}
                </div>
              </li>

              {features.length || highlights.length ? (
                <li className={dd('pregnancy') + ' nav-pregnancy' + act('pregnancy')}>
                  <a href="/celebrate-pregnancy" onClick={(e) => toggleDropdown(e, 'pregnancy')}>
                    <span className="nav-spark" aria-hidden="true">✦</span> Celebrate Pregnancy <span className="caret">▾</span>
                  </a>
                  <div className="dropdown dropdown-pregnancy">
                    {[
                      { key: 'journey', href: '/celebrate-pregnancy', label: 'Your pregnancy journey', note: 'Antenatal care to going home', photo: JOURNEY_PHOTO },
                      ...features.map((f) => ({ key: f.slug, href: f.href, label: f.label, note: FEATURE_NOTES[f.slug] || f.group, photo: f.page.photo || pregnancyPhoto(f.page) })),
                      ...highlights.map((h) => ({ key: h.slug, ...h })),
                    ].sort((a, b) => menuRank(a.key) - menuRank(b.key)).map((item) => (
                      <a key={item.key} href={item.href} onClick={onLeafClick} className="preg-item">
                        <span className="preg-thumb" aria-hidden="true">{item.photo && <img src={item.photo} alt="" loading="lazy" />}</span>
                        <span className="preg-text"><strong>{item.label}</strong><small>{item.note}</small></span>
                      </a>
                    ))}
                  </div>
                </li>
              ) : (
                <li className={act('pregnancy')}><a href="/celebrate-pregnancy" onClick={onLeafClick}>Celebrate Pregnancy</a></li>
              )}

              {premium && (birthing.length > 1 ? (
                <li className={dd('premium') + ' nav-premium' + act('premium')}>
                  <a href={premium.href} onClick={(e) => toggleDropdown(e, 'premium')} aria-label="Premium Birthing Centre">
                    <span className="nav-premium-mark" aria-hidden="true">✦</span>
                    <span className="nav-label-full" aria-hidden="true"> Premium Birthing Centre</span>
                    <span className="nav-label-short" aria-hidden="true"> Birthing Centre</span>
                    <span className="caret" aria-hidden="true">▾</span>
                  </a>
                  <div className="dropdown dropdown-pregnancy dropdown-birthing">
                    <span className="birthing-head" aria-hidden="true">Premium Birthing Centre · Kinder Hospitals</span>
                    {birthing.map((f) => (
                      <a key={f.slug} href={f.href} onClick={onLeafClick} className="preg-item birthing-card">
                        <span className="preg-thumb" aria-hidden="true"><img src={BIRTHING_PHOTOS[f.slug] || f.page.photo || pregnancyPhoto(f.page)} alt="" loading="lazy" /></span>
                        <span className="preg-text">
                          <strong>{f.slug === PREMIUM_SLUG ? 'The Birthing Centre' : f.label}</strong>
                          <small>{BIRTHING_NOTES[f.slug] || FEATURE_NOTES[f.slug] || f.group}</small>
                          <em>{f.slug === PREMIUM_SLUG ? 'Discover the suites' : 'Explore water birth'} <span aria-hidden="true">→</span></em>
                        </span>
                      </a>
                    ))}
                  </div>
                </li>
              ) : (
                <li className={'nav-premium' + act('premium')}>
                  <a href={premium.href} onClick={onLeafClick} aria-label="Premium Birthing Centre">
                    <span className="nav-premium-mark" aria-hidden="true">✦</span>
                    <span className="nav-label-full" aria-hidden="true"> Premium Birthing Centre</span>
                    <span className="nav-label-short" aria-hidden="true"> Birthing Centre</span>
                  </a>
                </li>
              ))}

              <li className={`${dd('services')} has-mega` + act('services')}>
                <a href="/services" onClick={(e) => toggleDropdown(e, 'services')}>
                  <NavIcon name="stethoscope" />Specialities <span className="caret">▾</span>
                </a>
                <div className="dropdown mega">
                  {serviceGroups.slice(0, 3).map((group) => (
                    <div className="mega-col" key={group.id}>
                      <h6>{group.title}</h6>
                      {group.items.slice(0, 8).map((item) => (
                        <a key={item.name} className="mega-spec" href={`/services/${slugify(item.name)}`} onClick={onLeafClick}><SpecialityIcon name={item.name} icon={megaIcons.get(item.name)} /><span>{item.name}</span></a>
                      ))}
                    </div>
                  ))}
                  <div className="mega-col mega-feature">
                    <h6>{serviceGroups[3].title}</h6>
                    {serviceGroups[3].items.slice(0, 9).map((item) => (
                      <a key={item.name} className="mega-spec" href={`/services/${slugify(item.name)}`} onClick={onLeafClick}><SpecialityIcon name={item.name} icon={megaIcons.get(item.name)} /><span>{item.name}</span></a>
                    ))}
                    <div className="mega-cta">
                      <strong>Need a specialist?</strong>
                      <p>Our care coordinators will guide you to the right Kinder doctor.</p>
                      <a href={BOOK} className="mega-btn" onClick={onLeafClick}>Book Appointment →</a>
                    </div>
                  </div>
                </div>
              </li>

              <li className={act('doctors')}><a href="/doctors" onClick={onLeafClick}><NavIcon name="doctor" />Doctors</a></li>

              <li className={dd('patients') + act('patients')}>
                <a href={patients.href} onClick={(e) => toggleDropdown(e, 'patients')}>
                  <NavIcon name="patients" />Patients <span className="caret">▾</span>
                </a>
                <div className="dropdown">
                  {patients.children.map((child) => (
                    <a key={child.label} href={child.href} onClick={onLeafClick}><strong>{child.label}</strong></a>
                  ))}
                </div>
              </li>

              <li className={dd('library') + act('library')}>
                <a href={library.href} onClick={(e) => toggleDropdown(e, 'library')}>
                  <NavIcon name="book" />Health Library <span className="caret">▾</span>
                </a>
                <div className="dropdown">
                  {library.children.map((child) => (
                    <a key={child.label} href={child.href} onClick={onLeafClick}><strong>{child.label}</strong></a>
                  ))}
                </div>
              </li>

              <li className={'nav-findcare' + act('find-care')}><a href="/find-care" onClick={onLeafClick}><NavIcon name="search" />Find Care</a></li>

              <li className={act('contact')}><a href="/contact" onClick={onLeafClick}><NavIcon name="phone" />Contact</a></li>

              <li className="nav-cta-wrap">
                <a href={BOOK} className="nav-cta" onClick={onLeafClick}>Book Appointment →</a>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      <div className="nav-backdrop" onClick={closeMenu}></div>
    </>
  );
}
