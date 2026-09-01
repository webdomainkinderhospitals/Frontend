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

import CentreSpecialities from './CentreSpecialities';

export default function HospitalPage({ loc, slug, specialities = [], catalogue = null, centreSpecific = true, servicePages = [], doctors = [], procedures = [], testimonials = [], news = [], settings }) {
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
      <section id="about">
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

      {/* Specialities at this centre */}
      {(catalogue || specialities.length > 0) && (
        <section id="specialities">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-eyebrow">Departments at Kinder {loc.name}</span>
                <h2 className="section-title">
                  {centreSpecific ? (
                    <>Specialities <em>at this centre</em></>
                  ) : (
                    <>Specialities <em>across our group</em></>
                  )}
                </h2>
              </div>
            </div>
            {catalogue ? (
              <CentreSpecialities
                facilities={catalogue.facilities}
                base={`/hospitals/${slug}/specialities`}
              />
            ) : (
              <div className="spec-grid">
                {/* Every card opens the sub-site detail page for that
                    speciality, which lists only its related doctors. */}
                {specialities.map((spec, i) => {
                  const specSlug = String(spec.name || '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                  return (
                    <a className="spec-card" key={spec.id ?? i} href={`/hospitals/${slug}/specialities/${specSlug}`}>
                      <span className="spec-card-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </span>
                      <span className="spec-card-body">
                        <strong>{spec.name}</strong>
                        {spec.description && <small>{spec.description}</small>}
                      </span>
                      <span className="spec-card-more">
                        View doctors &amp; details
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                      </span>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Doctors at this centre */}
      {doctors.length > 0 && (
        <section id="doctors" style={{ background: 'var(--bg-soft)' }}>
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
                    <a className="svc-doc-book" href={`/doctors/${String(doc.name || '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`}>View Profile →</a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Procedures at this centre */}
      {procedures.length > 0 && (
        <section id="procedures">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-eyebrow">Treatments at Kinder {loc.name}</span>
                <h2 className="section-title">
                  Procedures <em>at this centre</em>
                </h2>
              </div>
            </div>
            <div className="hosp-proc-grid">
              {procedures.map((proc, i) => (
                <article className="hosp-proc-card" key={proc.id ?? i}>
                  <h4>{proc.name}</h4>
                  <p>{proc.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Patient stories at this centre */}
      {testimonials.length > 0 && (
        <section id="testimonials" style={{ background: 'var(--bg-soft)' }}>
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-eyebrow">Patient stories · Kinder {loc.name}</span>
                <h2 className="section-title">
                  Stories of <em>joy from this centre</em>
                </h2>
              </div>
            </div>
            <div className="hosp-testi-grid">
              {testimonials.map((t, i) => (
                <blockquote className="hosp-testi-card" key={t.id ?? i}>
                  <p>“{t.quote}”</p>
                  <footer>
                    <strong>{t.patientName}</strong>
                    <span>{t.relation}</span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* News from this centre */}
      {news.length > 0 && (
        <section id="news">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-eyebrow">Updates from Kinder {loc.name}</span>
                <h2 className="section-title">
                  News &amp; <em>events here</em>
                </h2>
              </div>
            </div>
            <div className="hosp-news-grid">
              {news.map((item, i) => (
                <article className="hosp-news-card" key={item.id ?? i}>
                  {item.imageUrl && (
                    <div className="hosp-news-img" style={{ backgroundImage: `url('${item.imageUrl}')` }}></div>
                  )}
                  <div className="hosp-news-meta">
                    <span className="hosp-news-cat">{item.category}</span>
                    <h4>{item.title}</h4>
                    {item.excerpt && <p>{item.excerpt}</p>}
                  </div>
                </article>
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
