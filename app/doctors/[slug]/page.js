import { notFound } from 'next/navigation';
import { getContent } from '@/lib/api';
import { slugify, matchesService, allServices } from '@/lib/services';
import SiteChrome from '@/components/SiteChrome';
import PageHero from '@/components/PageHero';

export const revalidate = 60;

const esc = (s) =>
  String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const book = (name) =>
  'https://api.whatsapp.com/send?phone=919446654500&text=' +
  encodeURIComponent(`Hello Kinder Hospitals, I would like to book an appointment with ${name}.`);

const findDoctor = (doctors, slug) => doctors.find((d) => slugify(d.name) === slug);

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const content = await getContent();
  const doc = findDoctor(content.doctors, slug);
  if (!doc) return { title: 'Our Doctors · Kinder Hospitals' };
  return {
    title: `${doc.name} · Kinder Hospitals`,
    description: doc.bio || [doc.designation, doc.speciality].filter(Boolean).join(' · '),
  };
}

export default async function DoctorProfilePage({ params }) {
  const { slug } = await params;
  const content = await getContent();
  const doc = findDoctor(content.doctors, slug);
  if (!doc) notFound();

  const service = allServices(content.specialities).find((s) => matchesService(doc.speciality, s.name));
  const loc = content.locations.find(
    (l) => (l.name || '').toLowerCase() === (doc.location || '').toLowerCase()
  );
  const locSlug = loc && (loc.slug || slugify(loc.name));
  const bioText = doc.fullBio || doc.bio || '';
  const paragraphs = bioText.split(/\n\s*\n|\n/).map((p) => p.trim()).filter(Boolean);
  const colleagues = content.doctors
    .filter((d) => d.id !== doc.id && matchesService(d.speciality, doc.speciality || '__none__'))
    .slice(0, 3);

  return (
    <SiteChrome content={content}>
      <main>
        <PageHero
          crumb={doc.name}
          eyebrow={doc.speciality || 'Our Specialists'}
          titleHtml={esc(doc.name)}
          intro={[doc.designation, doc.location ? `Kinder ${doc.location}` : ''].filter(Boolean).join(' · ')}
        />

        <section>
          <div className="container">
            <div className="doc-profile">
              <div
                className="doc-profile-photo"
                style={{ backgroundImage: doc.imageUrl ? `url('${doc.imageUrl}')` : 'var(--mesh-card)' }}
                role="img"
                aria-label={`Portrait of ${doc.name}`}
              ></div>
              <div className="doc-profile-body">
                <span className="section-eyebrow">About the doctor</span>
                <h2 className="section-title">{doc.name}</h2>
                <p className="doc-profile-role">{doc.designation}</p>
                <div className="doc-profile-tags">
                  {doc.speciality && (
                    service ? (
                      <a className="doc-tag" href={`/services/${service.slug}`}>{doc.speciality} →</a>
                    ) : (
                      <span className="doc-tag">{doc.speciality}</span>
                    )
                  )}
                  {loc && (
                    <a className="doc-tag" href={`/hospitals/${locSlug}`}>Kinder {loc.name} →</a>
                  )}
                </div>
                {paragraphs.length > 0 ? (
                  paragraphs.map((p, i) => <p key={i} className="doc-profile-text">{p}</p>)
                ) : (
                  <p className="doc-profile-text">
                    {doc.name} practises {doc.speciality ? `${doc.speciality} ` : ''}with the Kinder
                    family of doctors — under the group&apos;s shared protocols, audit and clinical
                    governance. Our care coordinators will gladly tell you more and arrange a
                    consultation.
                  </p>
                )}
                <div className="doc-profile-actions">
                  <a href={book(doc.name)} target="_blank" rel="noopener" className="btn btn-primary">
                    Book an Appointment →
                  </a>
                  <a href="/doctors" className="btn btn-soft">All doctors</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {colleagues.length > 0 && (
          <section style={{ background: 'var(--bg-soft)' }}>
            <div className="container">
              <div className="section-head">
                <div>
                  <span className="section-eyebrow">{doc.speciality}</span>
                  <h2 className="section-title">
                    Colleagues in the <em>same speciality</em>
                  </h2>
                </div>
              </div>
              <div className="hosp-doctor-grid">
                {colleagues.map((d) => (
                  <article className="hosp-doctor-card" key={d.id}>
                    <div
                      className="hosp-doctor-img"
                      style={{ backgroundImage: d.imageUrl ? `url('${d.imageUrl}')` : 'var(--mesh-card)' }}
                    ></div>
                    <div className="hosp-doctor-meta">
                      <h4>{d.name}</h4>
                      <span>{d.designation}</span>
                      {d.location && <p className="svc-doc-loc">Kinder {d.location}</p>}
                      <a className="svc-doc-book" href={`/doctors/${slugify(d.name)}`}>View Profile →</a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </SiteChrome>
  );
}
