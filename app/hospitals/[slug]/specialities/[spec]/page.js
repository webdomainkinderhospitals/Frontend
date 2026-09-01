import { notFound } from 'next/navigation';
import { getContent } from '@/lib/api';
import { slugify, matchesService, findService } from '@/lib/services';
import { findCentreSpeciality } from '@/lib/centreSpecialities';

import WhatsAppFloat from '@/components/WhatsAppFloat';
import ScrollEffects from '@/components/ScrollEffects';
import SubSiteHeader from '@/components/SubSiteHeader';
import SubSiteFooter from '@/components/SubSiteFooter';

export const revalidate = 60;

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

const book = (name, hospital) =>
  'https://api.whatsapp.com/send?phone=919446654500&text=' +
  encodeURIComponent(
    `Hello Kinder ${hospital}, I would like to book an appointment with ${name}.`
  );

// A speciality on a sub-site resolves from, in order: the shipped centre
// catalogue, the CMS specialities tagged to this centre, then the
// corporate services catalogue.
async function resolve(slug, spec) {
  const content = await getContent();
  const loc = content.locations.find((l) => slugOf(l) === slug);
  if (!loc) return { content, loc: null, detail: null };

  const at = (item) => (item.location || '').toLowerCase() === (loc.name || '').toLowerCase();

  let detail = findCentreSpeciality(slug, spec);
  if (!detail) {
    const own = content.specialities.filter(at).find((s) => slugify(s.name) === spec);
    if (own) detail = { name: own.name, overview: own.description };
  }
  if (!detail) {
    const corp = findService(content.specialities, spec);
    if (corp) detail = { name: corp.name, overview: corp.description };
  }
  return { content, loc, at, detail };
}

export async function generateMetadata({ params }) {
  const { slug, spec } = await params;
  const { loc, detail } = await resolve(slug, spec);
  if (!loc || !detail) return { title: 'Kinder Hospitals' };
  return {
    title: `${detail.name} · Kinder ${loc.name}`,
    description: detail.overview || `${detail.name} at Kinder ${loc.name}.`,
  };
}

export default async function CentreSpecialityPage({ params }) {
  const { slug, spec } = await params;
  const { content, loc, at, detail } = await resolve(slug, spec);
  if (!loc || !detail) notFound();

  const home = `/hospitals/${slug}`;

  // Nav flags mirror the sub-site home page so the menu stays consistent.
  const sections = {
    specialities: true,
    doctors: content.doctors.filter(at).length > 0,
    procedures: content.procedures.filter(at).length > 0,
    testimonials: content.testimonials.filter(at).length > 0,
    news: content.news.filter(at).length > 0,
  };

  // Prefer this centre's own doctors for the speciality; fall back to the
  // wider Kinder network so the page is never empty of care options.
  const centreDoctors = content.doctors.filter(
    (d) => d.published !== false && at(d) && matchesService(d.speciality, detail.name)
  );
  const networkDoctors = centreDoctors.length
    ? []
    : content.doctors.filter(
        (d) => d.published !== false && matchesService(d.speciality, detail.name)
      );
  const doctors = centreDoctors.length ? centreDoctors : networkDoctors;

  const treatments = detail.treatments || [];

  return (
    <>
      <SubSiteHeader loc={loc} settings={content.settings} slug={slug} sections={sections} />
      <main>
        <section className="hosp-hero spec-hero">
          <div className="container">
            <div className="hosp-hero-content">
              <span className="hero-eyebrow">
                {detail.facility || `Kinder ${loc.name}`}
              </span>
              <h1 className="hero-title">{detail.name}</h1>
              {detail.overview && <p className="hero-text">{detail.overview}</p>}
              <div className="hosp-hero-ctas">
                <a href={book(detail.name, loc.name)} target="_blank" rel="noopener" className="btn btn-primary">
                  Book an Appointment →
                </a>
                <a href={`${home}#specialities`} className="btn btn-outline">
                  ← All specialities
                </a>
              </div>
            </div>
          </div>
        </section>

        {treatments.length > 0 && (
          <section>
            <div className="container">
              <div className="section-head">
                <div>
                  <span className="section-eyebrow">{detail.name} at Kinder {loc.name}</span>
                  <h2 className="section-title">
                    What we <em>treat &amp; offer</em>
                  </h2>
                </div>
              </div>
              <div className="svc-grid">
                {treatments.map((t) => (
                  <div className="svc-card" key={t}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {doctors.length > 0 && (
          <section style={{ background: 'var(--bg-soft)' }}>
            <div className="container">
              <div className="section-head">
                <div>
                  <span className="section-eyebrow">
                    {centreDoctors.length
                      ? `Our team at Kinder ${loc.name}`
                      : 'Specialists across the Kinder network'}
                  </span>
                  <h2 className="section-title">
                    Doctors for <em>{detail.name}</em>
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
                      {!centreDoctors.length && doc.location && <span>Kinder {doc.location}</span>}
                      <a className="svc-doc-book" href={`/doctors/${slugify(doc.name)}`}>View Profile →</a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="hosp-cta-wrap">
          <div className="container">
            <div className="cta-strip">
              <div>
                <h3>{detail.name} — Kinder {loc.name}</h3>
                <p>
                  {loc.phone
                    ? `Call ${loc.phone} or book on WhatsApp — our care coordinators will guide you.`
                    : 'Book on WhatsApp — our care coordinators will guide you.'}
                </p>
              </div>
              <a href={book(detail.name, loc.name)} target="_blank" rel="noopener" className="btn btn-primary">
                Book an Appointment →
              </a>
            </div>
          </div>
        </section>
      </main>
      <SubSiteFooter loc={loc} settings={content.settings} slug={slug} />
      <WhatsAppFloat />
      <ScrollEffects />
    </>
  );
}
