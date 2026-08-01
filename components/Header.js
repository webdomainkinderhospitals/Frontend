'use client';

import { useEffect, useState } from 'react';

const HOSPITAL_TAGS = {
  Cherthala: 'Flagship · Since 2011',
  Kochi: 'Multispeciality · Since 2018',
  Bengaluru: "Women's & Fertility · Since 2022",
  Alappuzha: "Women's Clinic · Since 2023",
  Singapore: 'International · HQ',
};

export default function Header({ settings, locations = [] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

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
            <a href="#" className="brand" aria-label={`${settings.siteName} — Home`}>
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
              <li><a href="#" onClick={onLeafClick}>Home</a></li>

              <li className={dd('about')}>
                <a href="#" onClick={(e) => toggleDropdown(e, 'about')}>
                  About Us <span className="caret">▾</span>
                </a>
                <div className="dropdown">
                  <a href="#" onClick={onLeafClick}><strong>The Kinder Group</strong><small>Our story since 2011</small></a>
                  <a href="#" onClick={onLeafClick}><strong>Chairman&apos;s Message</strong><small>From Dr. Pradeep Kumar V.K</small></a>
                  <a href="#" onClick={onLeafClick}><strong>Leadership &amp; Team</strong><small>Across all our centres</small></a>
                  <a href="#" onClick={onLeafClick}><strong>Vision &amp; Mission</strong><small>Kindness at the heart</small></a>
                  <a href="#" onClick={onLeafClick}><strong>Milestones</strong><small>5 hospitals · 13,000+ births</small></a>
                </div>
              </li>

              <li className={`${dd('hospitals')} has-mega`}>
                <a href="#" onClick={(e) => toggleDropdown(e, 'hospitals')}>
                  Our Hospitals <span className="caret">▾</span>
                </a>
                <div className="dropdown mega mega-hospitals">
                  {locations.map((loc) => (
                    <a
                      key={loc.id}
                      href={loc.website || loc.mapUrl || '#'}
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
                        <h6>Kinder {loc.name}</h6>
                        <p>{loc.address}</p>
                        <span className="hospital-link">
                          {loc.websiteLabel || `Visit Kinder ${loc.name} →`}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </li>

              <li className={`${dd('services')} has-mega`}>
                <a href="#" onClick={(e) => toggleDropdown(e, 'services')}>
                  Services <span className="caret">▾</span>
                </a>
                <div className="dropdown mega">
                  <div className="mega-col">
                    <h6>Maternity &amp; Pregnancy</h6>
                    <a href="#" onClick={onLeafClick}>Obstetrics</a>
                    <a href="#" onClick={onLeafClick}>Maternity</a>
                    <a href="#" onClick={onLeafClick}>High Risk Pregnancy</a>
                    <a href="#" onClick={onLeafClick}>Mother &amp; Child Care Programme</a>
                    <a href="#" onClick={onLeafClick}>Fetal Medicine</a>
                    <a href="#" onClick={onLeafClick}>Labor &amp; Delivery Pain Management</a>
                    <a href="#" onClick={onLeafClick}>Lactation Support</a>
                    <a href="#" onClick={onLeafClick}>ANC Classes</a>
                  </div>
                  <div className="mega-col">
                    <h6>Fertility &amp; Gynaecology</h6>
                    <a href="#" onClick={onLeafClick}>Infertility Treatment</a>
                    <a href="#" onClick={onLeafClick}>IVF</a>
                    <a href="#" onClick={onLeafClick}>IUI</a>
                    <a href="#" onClick={onLeafClick}>ICSI</a>
                    <a href="#" onClick={onLeafClick}>Gynecology &amp; Laparoscopic Surgery</a>
                    <a href="#" onClick={onLeafClick}>Reproductive Medicine</a>
                    <a href="#" onClick={onLeafClick}>Gynaec Oncology</a>
                    <a href="#" onClick={onLeafClick}>Women&apos;s Wellness</a>
                  </div>
                  <div className="mega-col">
                    <h6>Children&apos;s Care</h6>
                    <a href="#" onClick={onLeafClick}>Paediatrics</a>
                    <a href="#" onClick={onLeafClick}>General Paediatrics</a>
                    <a href="#" onClick={onLeafClick}>Paediatric Surgery</a>
                    <a href="#" onClick={onLeafClick}>Neonatology</a>
                    <a href="#" onClick={onLeafClick}>Pediatric Intensivist (PICU)</a>
                    <a href="#" onClick={onLeafClick}>Pediatric Anesthesia</a>
                    <a href="#" onClick={onLeafClick}>Pediatric Nephrology</a>
                    <a href="#" onClick={onLeafClick}>Audiology &amp; Speech Therapy</a>
                  </div>
                  <div className="mega-col mega-feature">
                    <h6>Allied &amp; Wellness</h6>
                    <a href="#" onClick={onLeafClick}>General Medicine</a>
                    <a href="#" onClick={onLeafClick}>General Surgery</a>
                    <a href="#" onClick={onLeafClick}>Dermatology &amp; Cosmetology</a>
                    <a href="#" onClick={onLeafClick}>Orthopaedics &amp; Sports Med</a>
                    <a href="#" onClick={onLeafClick}>Plastic &amp; Cosmetic Surgery</a>
                    <a href="#" onClick={onLeafClick}>General ENT</a>
                    <a href="#" onClick={onLeafClick}>Anesthesiology &amp; Pain</a>
                    <a href="#" onClick={onLeafClick}>Dietetics &amp; Nutrition</a>
                    <a href="#" onClick={onLeafClick}>Physiotherapy</a>
                    <div className="mega-cta">
                      <strong>Need a specialist?</strong>
                      <p>Our care coordinators will guide you to the right Kinder doctor.</p>
                      <a href="#" className="mega-btn" onClick={onLeafClick}>Book Appointment →</a>
                    </div>
                  </div>
                </div>
              </li>

              <li><a href="#" onClick={onLeafClick}>Doctors</a></li>

              <li className={dd('packages')}>
                <a href="#" onClick={(e) => toggleDropdown(e, 'packages')}>
                  Packages <span className="caret">▾</span>
                </a>
                <div className="dropdown">
                  <a href="#" onClick={onLeafClick}><strong>Kinder Jananimitra Package</strong><small>Comprehensive pregnancy package</small></a>
                  <a href="#" onClick={onLeafClick}><strong>Comprehensive Health Check-Up</strong><small>Full body screening</small></a>
                  <a href="#" onClick={onLeafClick}><strong>Well Women Health Check-Up</strong><small>Tailored for women</small></a>
                  <a href="#" onClick={onLeafClick}><strong>Pre-Pregnancy Health Check-Up</strong><small>Plan parenthood with confidence</small></a>
                  <a href="#" onClick={onLeafClick}><strong>Silver / Golden / Platinum Tiers</strong><small>From ₹1,550 onwards</small></a>
                </div>
              </li>

              <li className={dd('resources')}>
                <a href="#" onClick={(e) => toggleDropdown(e, 'resources')}>
                  Resources <span className="caret">▾</span>
                </a>
                <div className="dropdown">
                  <a href="#" onClick={onLeafClick}><strong>Gallery</strong><small>Inside our hospitals</small></a>
                  <a href="#" onClick={onLeafClick}><strong>News &amp; Press</strong><small>Latest from the Kinder Group</small></a>
                  <a href="#" onClick={onLeafClick}><strong>Health Blogs</strong><small>Insights from our doctors</small></a>
                  <a href="#" onClick={onLeafClick}><strong>Media &amp; Events</strong><small>Awareness drives &amp; camps</small></a>
                  <a href="#" onClick={onLeafClick}><strong>Patient Testimonials</strong><small>Real stories of joy</small></a>
                  <a href="#" onClick={onLeafClick}><strong>Careers at Kinder</strong><small>Join our growing team</small></a>
                </div>
              </li>

              <li><a href="#" onClick={onLeafClick}>Contact</a></li>

              <li className="nav-cta-wrap">
                <a href="#" className="nav-cta" onClick={onLeafClick}>Book Appointment →</a>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      <div className="nav-backdrop" onClick={closeMenu}></div>
    </>
  );
}
