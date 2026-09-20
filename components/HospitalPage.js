import { KochiCareCards } from '@/components/KochiCare';
import ContentBody from '@/components/ContentBody';
import DoctorCard from '@/components/DoctorCard';
const WHATSAPP_BOOK =
  'https://api.whatsapp.com/send?phone=919446654500&text=' +
  encodeURIComponent('Hello Kinder Hospitals, I would like to book an appointment.');

// Newline-separated admin fields: some records carry the escape sequence
// literally rather than a real line break.
export function lines(text) {
  return String(text || '')
    .split(/\\n|\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

// A facility may be written as "Level 3 NICU — five beds, round-the-clock
// care": the name is printed in bold with its description beneath. Plain
// highlights (no dash) stay a one-line tick, exactly as before.
export function splitHighlight(line) {
  const match = String(line).match(/^(.{2,60}?)\s+[—–]\s+(.+)$/s);
  return match ? { title: match[1], text: match[2] } : { title: '', text: line };
}

// Specialities read better grouped by the care journey they belong to than as
// one long alphabet of department names.
function groupSpecialities(specialities) {
  const groups = [];
  for (const spec of specialities) {
    const title = spec.group || spec.category || '';
    let group = groups.find((g) => g.title === title);
    if (!group) groups.push((group = { title, items: [] }));
    group.items.push(spec);
  }
  return groups.length > 1 || groups[0]?.title ? groups : [];
}

export default function HospitalPage({ loc, hospitalSlug, carePages = [], specialities = [], centreSpecific = true, servicePages = [], doctors = [], procedures = [], testimonials = [], news = [], settings }) {
  const highlights = lines(loc.highlights).map(splitHighlight);
  const about = lines(loc.description);
  const hero = loc.heroImageUrl || loc.imageUrl;
  // A centre with its own booking link (its hospital app, say) uses it for
  // every Book Appointment button here; the rest keep the group WhatsApp.
  const book = String(loc.bookingUrl || '').trim() || WHATSAPP_BOOK;
  const specialityGroups = groupSpecialities(specialities);

  const renderSpeciality = (spec, i) => {
    const slug = String(spec.name || '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const Tag = servicePages.includes(slug) ? 'a' : 'div';
    if (spec.fullDescription) return <details className="editorial-speciality" key={spec.id ?? i}><summary>{spec.name}</summary><ContentBody text={spec.fullDescription} /></details>;
    return (
      <Tag className="svc-card" key={spec.id ?? i} title={spec.description || undefined} {...(Tag === 'a' ? { href: `/services/${slug}` } : {})}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
        <span>{spec.name}</span>
      </Tag>
    );
  };

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
              <a href={book} target="_blank" rel="noopener" className="btn btn-primary">
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
              {(about.length ? about : [loc.address]).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            {highlights.length > 0 && (
              <div id="facilities" className="hosp-facilities">
                <h3 className="hosp-facilities-title">Facilities at this centre</h3>
                <ul className="hosp-highlights">
                  {highlights.map((h, i) => (
                    <li key={i}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      {h.title ? (
                        <span className="hosp-highlight-body">
                          <strong>{h.title}</strong>
                          <span>{h.text}</span>
                        </span>
                      ) : (
                        h.text
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Care pages for this centre — each opens as its own page */}
      <KochiCareCards pages={carePages} hospitalSlug={hospitalSlug} hospitalName={loc.name} />

      {/* Specialities at this centre */}
      {specialities.length > 0 && (
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
                <p className="hosp-section-intro">
                  Grouped by the kind of care you are looking for — {specialities.length} departments in all.
                </p>
              </div>
              {carePages.length > 0 && (
                <a className="view-all" href="#care">Read our care pages →</a>
              )}
            </div>
            {specialityGroups.length > 0 ? (
              <div className="hosp-spec-groups">
                {specialityGroups.map((group, gi) => (
                  <div className="hosp-spec-group" key={group.title || gi}>
                    {group.title && <h3>{group.title}</h3>}
                    <div className="svc-grid">{group.items.map(renderSpeciality)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="svc-grid">{specialities.map(renderSpeciality)}</div>
            )}
          </div>
        </section>
      )}

      {/* Packages, insurance and consultation for this centre */}
      <section id="patient-services">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-eyebrow">Patient services · Kinder {loc.name}</span>
              <h2 className="section-title">Packages, insurance <em>&amp; consultations</em></h2>
              <p className="hosp-section-intro">Arrangements run across the group; our team at this centre confirms what applies to your visit.</p>
            </div>
          </div>
          <div className="editorial-grid">
            {[
              { title: 'Packages & health checkups', text: 'Maternity, well-woman, pre-pregnancy and full-body packages with their inclusions and tiers.', href: '/packages', cta: 'See packages' },
              { title: 'Insurance & TPA / cashless', text: 'Empanelment, pre-authorisation and what to bring for a cashless admission.', href: '/patients/insurance-and-tpa', cta: 'How it works' },
              { title: 'Online consultation', text: 'Speak to a specialist from home — our coordinators will set up the consultation.', href: WHATSAPP_BOOK, cta: 'Book a consultation', external: true },
              { title: 'Book an appointment', text: `Book at Kinder ${loc.name}${loc.phone ? ` or call ${loc.phone}` : ''}.`, href: book, cta: loc.bookingUrl ? 'Book online' : 'Book on WhatsApp', external: true },
              { title: 'Visitor guidelines', text: 'Visiting hours, attendant passes and the rules for NICU, ICU and maternity wards.', href: '/patients/visitor-guidelines', cta: 'Before you visit' },
              { title: 'Patient rights', text: 'What you can expect from us, and what helps us care for you safely.', href: '/patients/patient-rights', cta: 'Read the charter' },
            ].map((item) => (
              <article className="editorial-card" key={item.title}>
                <h3><a href={item.href} {...(item.external ? { target: '_blank', rel: 'noopener' } : {})}>{item.title}</a></h3>
                <p>{item.text}</p>
                <a className="view-all" href={item.href} {...(item.external ? { target: '_blank', rel: 'noopener' } : {})}>{item.cta} →</a>
              </article>
            ))}
          </div>
        </div>
      </section>

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
                <DoctorCard doc={doc} key={doc.id} hideHospitals servicePages={servicePages} />
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
            <a href={book} target="_blank" rel="noopener" className="btn btn-primary">
              Book an Appointment →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
