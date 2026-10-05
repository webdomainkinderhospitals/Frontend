import CelebratePregnancy from './CelebratePregnancy';
import PremiumBirthingCentre from './PremiumBirthingCentre';
import { KochiCareCards } from '@/components/KochiCare';
import DoctorCard from '@/components/DoctorCard';
import PromoBanner from '@/components/PromoBanner';
import { promoSlides } from '@/lib/promo';
import { isOwnImageOf } from '@/lib/hospital';
import { centreName } from '@/lib/locations';
import { whatsappLink, whatsappNumber } from '@/lib/booking.mjs';
import DepartmentShowcase from '@/components/DepartmentShowcase';
import CentreServiceMenu from '@/components/CentreServiceMenu';
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

const tel = (phone) => `tel:${String(phone).replace(/[^+\d]/g, '')}`;

// The centre's address, numbers and email.
function ContactDetails({ loc, phones, className = 'hosp-contact-bar', links = true }) {
  return (
    <div className={className}>
      <div className="hosp-contact-item">
        <strong>{loc.officeAddress ? 'Hospital address' : 'Address'}</strong>
        <span>{loc.address}</span>
        {loc.officeAddress && (
          <>
            <strong className="hosp-contact-sub">Office address</strong>
            <span>{loc.officeAddress}</span>
          </>
        )}
      </div>
      {phones.length > 0 && (
        <div className="hosp-contact-item">
          <strong>Phone</strong>
          {phones.map((p) => <a key={p} href={tel(p)}>{p}</a>)}
        </div>
      )}
      {loc.email && (
        <div className="hosp-contact-item">
          <strong>Email</strong>
          <a href={`mailto:${loc.email}`}>{loc.email}</a>
        </div>
      )}
      {links && (loc.mapUrl || loc.website) && (
        <div className="hosp-contact-item">
          <strong>{loc.website ? 'Links' : 'Find us'}</strong>
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
  );
}

export default function HospitalPage({ loc, hospitalSlug, carePages = [], specialities = [], centreSpecific = true, servicePages = [], doctors = [], procedures = [], testimonials = [], news = [], settings, pregnancyClubHref = '', featurePages = [] }) {
  const highlights = lines(loc.highlights).map(splitHighlight);
  const about = lines(loc.description);
  const hero = loc.heroImageUrl || loc.imageUrl;
  // Every inner link from this page opens inside this centre's own site,
  // and Book Appointment opens its booking page with this centre's doctors.
  const base = `/hospitals/${hospitalSlug}`;
  const book = `${base}/book`;
  const specialityGroups = groupSpecialities(specialities);
  // "Kinder Hospitals Kochi": the name is set in the display face with the
  // place picked out, so split it into its lead-in and the place itself.
  const name = centreName(loc);
  const lead = name.endsWith(loc.name) ? name.slice(0, -loc.name.length).trim() : 'Kinder';
  const isKochi = /^(kochi|cochin)$/i.test(String(loc.name).trim());
  const phones = [loc.phone, loc.phone2].filter((p) => String(p || '').trim());
  const enquire = (topic) => whatsappLink(whatsappNumber(loc), `Hello ${name}, I would like to ${topic}.`);

  const specSlug = (name) => String(name || '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  // A centre whose departments fall into two or three substantial groups
  // (Kochi: Multispeciality Services and the Women & Fertility Centre) gets
  // them as its headline menu under the banner; its address then moves down
  // to a Visit us section near the end of the page.
  const menuGroups = specialityGroups.length >= 2 && specialityGroups.length <= 3 && specialityGroups.every((g) => g.title && g.items.length >= 3)
    ? specialityGroups.map((g) => ({
      title: g.title,
      items: g.items.map((d) => ({ name: d.name, description: d.description || '', href: `${base}/services/${specSlug(d.name)}` })),
    }))
    : [];

  // Kochi's department menu and its campaign banner open the page, above
  // the hospital's own banner; other centres show their campaign banner just
  // below it.
  const topFirst = menuGroups.length > 0;
  const campaign = <PromoBanner slides={promoSlides(loc, 'promo')} label={`Kinder ${loc.name} announcements`} />;

  return (
    <main>
      {topFirst && (
        <div className="hosp-top">
          <div className="container">
            <CentreServiceMenu groups={menuGroups} centre={name} image={hero || ''} />
          </div>
          {campaign}
        </div>
      )}

      {/* Banner */}
      <section
        className="hosp-hero"
        style={{
          backgroundImage: hero ? `url('${hero}'), var(--mesh-hero)` : 'var(--mesh-hero)',
        }}
      >
        <div className="container">
          <div className="hosp-hero-content">
            {!loc.since && (loc.accreditation || loc.accreditationLogoUrl) ? (
              <span className="hero-eyebrow hosp-accreditation">
                {loc.accreditationLogoUrl && <img src={loc.accreditationLogoUrl} alt="" width="28" height="28" />}
                {loc.accreditation || 'Accredited'}
              </span>
            ) : (
              <span className="hero-eyebrow">
                {loc.since || `${loc.city} · ${loc.country}`}
              </span>
            )}
            <h1 className="hero-title">
              <span className="hero-lead">{lead}</span> <em>{loc.name}</em>
            </h1>
            {loc.tagline && <p className="hero-text">{loc.tagline}</p>}
            <div className="hosp-hero-ctas">
              <a href={book} className="btn btn-primary">
                Book an Appointment →
              </a>
              {loc.phone && (
                <a href={tel(loc.phone)} className="btn btn-outline">
                  Call {loc.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Campaign banner, set per centre in the admin portal (at the top for
          Kochi); every centre's address, numbers and map are in the Visit us
          section near the end */}
      {!topFirst && campaign}

      {/* Kochi's Celebrate Pregnancy and Premium Birthing Centre, set in the
          admin portal */}
      {isKochi && <>
        <CelebratePregnancy pages={featurePages} settings={settings} scope="kochi" />
        <PremiumBirthingCentre pages={featurePages} settings={settings} scope="kochi" />
      </>}

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

      {/* The building itself. These are watercolour elevations on paper, so
          they are shown whole on a paper ground rather than cropped into a
          band or scrimmed behind text — a drawing of the place a family is
          about to visit is worth seeing at size. */}
      {isOwnImageOf(loc.imageUrl) && (
        <section className="hosp-plate">
          <div className="container">
            <figure className="hosp-plate-fig">
              <img
                src={loc.imageUrl}
                alt={`Illustration of the ${name} building`}
                width={1400}
                height={875}
                loading="lazy"
                decoding="async"
              />
            </figure>
          </div>
        </section>
      )}

      {/* Care pages for this centre — each opens as its own page */}
      <KochiCareCards
        pages={carePages}
        hospitalSlug={hospitalSlug}
        hospitalName={loc.name}
        centreLabel={name}
        extra={[{
          slug: 'packages',
          title: 'Packages & Health Check-ups',
          excerpt: 'Maternity, fertility and health check-up packages — what each includes, so you can plan with confidence.',
          href: `${base}/packages`,
          cta: 'View packages',
        }]}
      />

      {/* Departments at this centre: the hospital's icon band, one tab per group */}
      {specialities.length > 0 && (
        <section id="specialities" className="dept-section">
          <DepartmentShowcase
            centre={name}
            image={hero || ''}
            groups={(specialityGroups.length ? specialityGroups : [{ title: '', items: specialities }]).map((g) => ({
              title: g.title,
              items: g.items.map((d) => ({ name: d.name, description: d.description || '', href: `${base}/services/${specSlug(d.name)}` })),
            }))}
            heading={(
              <div className="dept-head">
                <span className="section-eyebrow">Departments at {name}</span>
                <h2 className="section-title">
                  {centreSpecific ? <>Our <em>departments</em></> : <>Specialities <em>across our group</em></>}
                </h2>
              </div>
            )}
          />
        </section>
      )}

      {/* Packages, insurance and consultation for this centre */}
      <section id="patient-services">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-eyebrow">Patient services · {name}</span>
              <h2 className="section-title">Packages, insurance <em>&amp; consultations</em></h2>
              <p className="hosp-section-intro">Arrangements run across the group; our team at this centre confirms what applies to your visit.</p>
            </div>
          </div>
          <div className="editorial-grid">
            {[
              { title: 'Packages & health checkups', text: 'Maternity, well-woman, pre-pregnancy and full-body packages with their inclusions and tiers.', href: `${base}/packages`, cta: 'See packages' },
              { title: 'Insurance & TPA / cashless', text: 'Empanelment, pre-authorisation and what to bring for a cashless admission.', href: `${base}/patients/insurance-and-tpa`, cta: 'How it works' },
              { title: 'Online consultation', text: 'Speak to a specialist from home — our coordinators will set up the consultation.', href: WHATSAPP_BOOK, cta: 'Book a consultation', external: true },
              { title: 'Book an appointment', text: `Book at ${name}${loc.phone ? ` or call ${loc.phone}` : ''}.`, href: book, cta: 'Choose a doctor & day' },
              // Requested for Kochi; other centres add these once they offer them.
              isKochi && { title: 'Pregnancy Club membership', text: 'Join our pregnancy club — classes, celebrations and a care team beside you from the first trimester to your baby’s arrival.', href: pregnancyClubHref || enquire('know about the Pregnancy Club membership'), cta: pregnancyClubHref ? 'Explore the club' : 'Ask about membership', external: !pregnancyClubHref },
              isKochi && { title: 'Mammogram booking', text: 'Book a screening mammogram — our team will confirm a convenient date and time with you.', href: enquire('book a mammogram'), cta: 'Book a mammogram', external: true },
              { title: 'Visitor guidelines', text: 'Visiting hours, attendant passes and the rules for NICU, ICU and maternity wards.', href: `${base}/patients/visitor-guidelines`, cta: 'Before you visit' },
            ].filter(Boolean).map((item) => (
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
                <span className="section-eyebrow">Our team at {name}</span>
                <h2 className="section-title">
                  Specialists <em>at this centre</em>
                </h2>
              </div>
            </div>
            <div className="hosp-doctor-grid">
              {doctors.map((doc, i) => (
                <DoctorCard doc={doc} key={doc.id} hideHospitals servicePages={servicePages} base={base} />
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
                <span className="section-eyebrow">Treatments at {name}</span>
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
                <span className="section-eyebrow">Patient stories · {name}</span>
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
                <span className="section-eyebrow">Updates from {name}</span>
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

      {/* Visit us: where the centre is, with its numbers, email and map */}
      {(loc.address || loc.phone || loc.email) && (
        <section className="hosp-visit" id="location">
          <div className="container">
            <div className="hosp-visit-card">
              <div className="hosp-visit-info">
                <span className="section-eyebrow">Visit us</span>
                <h2 className="section-title">Find <em>{name}</em></h2>
                <ContactDetails loc={loc} phones={phones} className="hosp-visit-details" links={false} />
                <div className="hosp-visit-actions">
                  {(loc.mapUrl || loc.address) && (
                    <a className="btn btn-primary" target="_blank" rel="noopener"
                      href={loc.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${loc.address}`)}`}>
                      Get directions →
                    </a>
                  )}
                  {loc.phone && <a className="btn btn-soft" href={tel(loc.phone)}>Call {loc.phone}</a>}
                  {loc.website && (
                    <a className="hosp-visit-web" href={loc.website} target="_blank" rel="noopener">
                      {loc.websiteLabel || 'Official website →'}
                    </a>
                  )}
                </div>
              </div>
              {loc.address && (
                <div className="hosp-visit-map">
                  <iframe
                    title={`Map showing ${name}`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(`${name}, ${loc.address}`)}&output=embed`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="hosp-cta-wrap">
        <div className="container">
          <div className="cta-strip">
            <div>
              <h3>Visit {name}</h3>
              <p>
                {loc.phone
                  ? `Call ${loc.phone} or book on WhatsApp — our care coordinators will guide you.`
                  : 'Book on WhatsApp — our care coordinators will guide you.'}
              </p>
            </div>
            <a href={book} className="btn btn-primary">
              Book an Appointment →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
