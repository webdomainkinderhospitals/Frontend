const WHATSAPP_BOOK =
  'https://api.whatsapp.com/send?phone=919446654500&text=' +
  encodeURIComponent('Hello Kinder Hospitals, I would like to book an appointment.');

function slugOf(loc) {
  return (
    loc.slug ||
    String(loc.name || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  );
}

export default function HospitalPage({ loc, doctors = [], others = [], settings }) {
  const highlights = String(loc.highlights || '')
    .split('\n')
    .map((h) => h.trim())
    .filter(Boolean);
  const hero = loc.heroImageUrl || loc.imageUrl;

  return (
    <main>
      {/* Banner */}
      <section
        className="hosp-hero"
        style={{
          backgroundImage: hero ? `url('${hero}'), var(--mesh-hero)` : 'var(--mesh-hero)',
        }}
      >
        <div className="container">
          <div className="hosp-hero-content">
            <span className="hero-eyebrow">
              {loc.since || `${loc.city} · ${loc.country}`}
            </span>
            <h1 className="hero-title">
              Kinder <em>{loc.name}</em>
            </h1>
            {loc.tagline && <p className="hero-text">{loc.tagline}</p>}
            <div className="hosp-hero-ctas">
              <a href={WHATSAPP_BOOK} target="_blank" rel="noopener" className="btn btn-primary">
                Book an Appointment →
              </a>
              {loc.phone && (
                <a href={`tel:${loc.phone.replace(/\s/g, '')}`} className="btn btn-outline">
                  Call {loc.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact strip */}
      <div className="container">
        <div className="hosp-contact-bar">
          <div className="hosp-contact-item">
            <strong>Address</strong>
            <span>{loc.address}</span>
          </div>
          {loc.phone && (
            <div className="hosp-contact-item">
              <strong>Phone</strong>
              <a href={`tel:${loc.phone.replace(/\s/g, '')}`}>{loc.phone}</a>
            </div>
          )}
          {loc.email && (
            <div className="hosp-contact-item">
              <strong>Email</strong>
              <a href={`mailto:${loc.email}`}>{loc.email}</a>
            </div>
          )}
          {(loc.mapUrl || loc.website) && (
            <div className="hosp-contact-item">
              <strong>Links</strong>
              <span className="hosp-links">
                {loc.mapUrl && (
                  <a href={loc.mapUrl} target="_blank" rel="noopener">Directions →</a>
                )}
                {loc.website && (
                  <a href={loc.website} target="_blank" rel="noopener">
                    {loc.websiteLabel || 'Official website →'}
                  </a>
                )}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* About + highlights */}
      <section>
        <div className="container">
          <div className="hosp-about-grid">
            <div className="hosp-about-text">
              <span className="section-eyebrow">About this centre</span>
              <h2 className="section-title">
                Care with <em>kindness</em>, close to home
              </h2>
              <p>{loc.description || loc.address}</p>
            </div>
            {highlights.length > 0 && (
              <ul className="hosp-highlights">
                {highlights.map((h, i) => (
                  <li key={i}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Doctors at this centre */}
      {doctors.length > 0 && (
        <section style={{ background: 'var(--bg-soft)' }}>
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-eyebrow">Our team at Kinder {loc.name}</span>
                <h2 className="section-title">
                  Specialists <em>at this centre</em>
                </h2>
              </div>
            </div>
            <div className="hosp-doctor-grid">
              {doctors.map((doc, i) => (
                <article className="hosp-doctor-card" key={doc.id ?? i}>
                  <div
                    className="hosp-doctor-img"
                    style={{
                      backgroundImage: doc.imageUrl ? `url('${doc.imageUrl}')` : 'var(--mesh-card)',
                    }}
                  ></div>
                  <div className="hosp-doctor-meta">
                    <h4>{doc.name}</h4>
                    <span>{doc.designation}</span>
                    {doc.bio && <p>{doc.bio}</p>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other centres */}
      {others.length > 0 && (
        <section>
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-eyebrow">The Kinder network</span>
                <h2 className="section-title">
                  Our other <em>centres</em>
                </h2>
              </div>
            </div>
            <div className="hosp-others">
              {others.map((o, i) => (
                <a className="hosp-other-card" href={`/hospitals/${slugOf(o)}`} key={o.id ?? i}>
                  <span className="hosp-other-since">{o.since || o.country}</span>
                  <strong>Kinder {o.name}</strong>
                  <span className="hosp-other-city">{o.city} · {o.country}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="hosp-cta-wrap">
        <div className="container">
          <div className="cta-strip">
            <div>
              <h3>Visit Kinder {loc.name}</h3>
              <p>
                {loc.phone
                  ? `Call ${loc.phone} or book on WhatsApp — our care coordinators will guide you.`
                  : 'Book on WhatsApp — our care coordinators will guide you.'}
              </p>
            </div>
            <a href={WHATSAPP_BOOK} target="_blank" rel="noopener" className="btn btn-primary">
              Book an Appointment →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
