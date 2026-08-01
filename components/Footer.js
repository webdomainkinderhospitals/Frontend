const FOOTER_LOC_TAGS = {
  Cherthala: 'Cherthala · Flagship',
  Kochi: 'Kochi · Multispeciality',
  Bengaluru: 'Bengaluru · Whitefield',
  Alappuzha: 'Alappuzha · Clinic',
  Singapore: 'Singapore · International HQ',
};

const FOOTER_LOC_ADDR = {
  Cherthala: 'Maruthorvattom Temple Road, Near NH 66, Cherthala — 688 539',
  Kochi: 'Kadavil Castle, Pukkattupady Road, Edappally — Kochi 682024',
  Bengaluru: '40F, Doddanekundi Industrial Area, Hoodi Village, Krishnarajapura — 560048',
  Singapore: '290 Orchard Road, The Paragon, Unit #07-02 — 238859',
};

export default function Footer({ settings, locations = [] }) {
  const stats = settings.stats || [];
  const footerLocations = locations.filter((l) => l.name !== 'Alappuzha').slice(0, 4);
  const year = new Date().getFullYear();

  return (
    <footer className="footer" id="contact">
      {/* Top CTA strip */}
      <div className="footer-cta">
        <div className="container">
          <div className="footer-cta-inner">
            <div>
              <h3>
                Ready to begin your <em>Kinder journey</em>?
              </h3>
              <p>
                Book an appointment, schedule a consultation, or speak to a care coordinator —
                we&apos;re here to help.
              </p>
            </div>
            <div className="footer-cta-actions">
              <a href="https://api.whatsapp.com/send?phone=919446654500&text=Hello%20Kinder%20Hospitals%2C%20I%20would%20like%20to%20book%20an%20appointment." target="_blank" rel="noopener" className="footer-cta-btn primary">Book Appointment →</a>
              <a
                href={`tel:${(settings.emergencyPhone || '').replace(/\s/g, '')}`}
                className="footer-cta-btn secondary"
              >
                Call 24/7 Helpline
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Brand column */}
            <div className="footer-brand">
              <div className="brand brand-footer">
                <span className="brand-pill">
                  <img
                    src={settings.logoUrl || '/logo.png'}
                    alt={`${settings.siteName} — Kindles life`}
                    className="brand-logo"
                    width="540"
                    height="276"
                  />
                </span>
              </div>

              <p className="footer-tagline">{settings.tagline}</p>
              <p>
                A unit of Kindorama Healthcare Pvt Ltd — caring for women &amp; children across
                our network of hospitals since 2011.
              </p>

              <div className="social">
                <a href="https://www.facebook.com/kinderhospitalsbangalore" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" /></svg>
                </a>
                <a href="https://www.instagram.com/kinderhospitalsbangalore/" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.16c3.2 0 3.58 0 4.85.07 3.25.15 4.77 1.7 4.92 4.92.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58 0-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.16 15.58 2.16 15.2 2.16 12s0-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.18 8.8 2.16 12 2.16zm0 5.4a4.44 4.44 0 100 8.88 4.44 4.44 0 000-8.88zM12 14a2 2 0 110-4 2 2 0 010 4z" /></svg>
                </a>
                <a href="https://www.linkedin.com/company/kinder-hospitals-bangalore" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.6 3H4.4C3.6 3 3 3.6 3 4.4v15.2c0 .8.6 1.4 1.4 1.4h15.2c.8 0 1.4-.6 1.4-1.4V4.4c0-.8-.6-1.4-1.4-1.4zM8.4 18.3H5.7V9.7h2.7v8.6zM7 8.5c-.9 0-1.6-.7-1.6-1.6s.7-1.6 1.6-1.6 1.6.7 1.6 1.6-.7 1.6-1.6 1.6zm11.3 9.8h-2.7v-4.6c0-1.1-.4-1.7-1.3-1.7-1 0-1.5.7-1.5 1.7v4.6h-2.7V9.7h2.6v1.2c.4-.7 1.4-1.2 2.4-1.2 2 0 3.2 1.2 3.2 3.4v5.2z" /></svg>
                </a>
                <a href="https://www.youtube.com/@kinderhospitalsbangalore" aria-label="YouTube">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.4.5A3 3 0 0 0 .5 6.2C0 8 0 12 0 12s0 4 .5 5.8a3 3 0 0 0 2.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.8.5-5.8.5-5.8s0-4-.5-5.8zM9.6 15.6V8.4l6.4 3.6-6.4 3.6z" /></svg>
                </a>
                <a href="https://api.whatsapp.com/send?phone=919446654500" aria-label="WhatsApp">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" /></svg>
                </a>
              </div>

              {/* Newsletter signup */}
              <div className="footer-newsletter">
                <h6>Stay Connected</h6>
                <p>Health insights, ANC class updates &amp; Kinder news — direct to your inbox.</p>
                <form className="footer-form" action="#" method="post">
                  <input type="email" placeholder="your.email@example.com" required />
                  <button type="submit">Subscribe →</button>
                </form>
                <small>We respect your privacy. Unsubscribe anytime.</small>
              </div>

              {/* Trust signal stats */}
              <div className="footer-stats">
                {stats.slice(0, 3).map((stat, i) => (
                  <div className="footer-stat" key={i}>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h5>Our Services</h5>
              <ul>
                <li><a href="#specialities">Maternity &amp; Obstetrics</a></li>
                <li><a href="#specialities">IVF &amp; Fertility</a></li>
                <li><a href="#specialities">Gynaecology</a></li>
                <li><a href="#specialities">Neonatology &amp; NICU</a></li>
                <li><a href="#specialities">Paediatrics</a></li>
                <li><a href="#specialities">Fetal Medicine</a></li>
                <li><a href="#packages">Health Packages</a></li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h5>Quick Links</h5>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#about">Chairman&apos;s Message</a></li>
                <li><a href="#doctors">Our Doctors</a></li>
                <li><a href="https://api.whatsapp.com/send?phone=919446654500&text=Hello%20Kinder%20Hospitals%2C%20I%20would%20like%20to%20book%20an%20appointment." target="_blank" rel="noopener">ANC Class Booking</a></li>
                <li><a href="https://api.whatsapp.com/send?phone=919446654500&text=Hello%20Kinder%20Hospitals%2C%20I%20would%20like%20to%20book%20an%20appointment." target="_blank" rel="noopener">Online Consultation</a></li>
                <li><a href="#testimonials">Patient Testimonials</a></li>
                <li><a href={`mailto:${settings.email}?subject=Careers%20at%20Kinder`}>Careers at Kinder</a></li>
              </ul>
            </div>

            {/* Centres + Emergency */}
            <div>
              <h5>Our Centres</h5>
              <ul className="footer-locations">
                {footerLocations.map((loc, i) => (
                  <li key={loc.id ?? i}>
                    <strong>{FOOTER_LOC_TAGS[loc.name] || `${loc.name} · ${loc.country}`}</strong>
                    <small>{FOOTER_LOC_ADDR[loc.name] || loc.address}</small>
                    {loc.phone ? (
                      <a href={`tel:${loc.phone.replace(/\s/g, '')}`}>{loc.phone}</a>
                    ) : (
                      <a href={loc.website || '#'}>
                        {(loc.website || '').replace(/^https?:\/\/(www\.)?/, '') || 'Visit website'}
                      </a>
                    )}
                  </li>
                ))}
              </ul>

              <div className="footer-emergency">
                <span className="footer-emergency-label">24 / 7 Emergency Helpline</span>
                <a href={`tel:${(settings.emergencyPhone || '').replace(/\s/g, '')}`}>
                  {settings.emergencyPhone}
                </a>
                <p>{settings.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accreditation strip */}
      <div className="container">
        <div className="footer-accred">
          <span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>{' '}
            NABH Accredited
          </span>
          <span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7" /><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" /></svg>{' '}
            ART Certified IVF
          </span>
          <span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>{' '}
            Nursing Excellence
          </span>
          <span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" /></svg>{' '}
            Times Health Award 2023
          </span>
          <span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" /><path d="M12 22V12" /><path d="M4 7l8 5 8-5" /></svg>{' '}
            ISO 9001:2015
          </span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="container">
        <div className="footer-bottom">
          <span>
            © {year} Kinder Medical Group · A unit of Kindorama Healthcare Pvt Ltd. All rights
            reserved.
          </span>
          <div className="footer-bottom-links">
            <a href="#home">Privacy Policy</a>
            <a href="#home">Terms &amp; Conditions</a>
            <a href="#home">Cookies</a>
            <a href="#home">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
