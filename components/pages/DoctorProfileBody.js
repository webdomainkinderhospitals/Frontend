import PageHero from '@/components/PageHero';
import DoctorCard from '@/components/DoctorCard';
import { slugify, matchesService, allServices } from '@/lib/services';
import { atLocation, locationLabel } from '@/lib/locations';

const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const book = (name) =>
  'https://api.whatsapp.com/send?phone=919446654500&text=' +
  encodeURIComponent(`Hello Kinder Hospitals, I would like to book an appointment with ${name}.`);

// A doctor's profile. On a centre's sub-site the speciality link, the "all
// doctors" link and the colleague cards all stay within that centre.
export default function DoctorProfileBody({ doc, content, base = '', loc = null }) {
  const here = loc ? loc.name : '';
  const service = allServices(content.specialities).find((s) => matchesService(doc.speciality, s.name));
  const docLocs = content.locations.filter((l) => atLocation(doc, l.name));
  const bioText = doc.fullBio || doc.bio || '';
  const paragraphs = bioText.split(/\n\s*\n|\n/).map((p) => p.trim()).filter(Boolean);
  const colleagues = content.doctors
    .filter((d) => d.id !== doc.id && matchesService(d.speciality, doc.speciality || '__none__'))
    .filter((d) => !loc || atLocation(d, loc.name))
    .slice(0, 3);

  return (
    <main>
      <PageHero
        crumb={doc.name}
        eyebrow={doc.speciality || 'Our Specialists'}
        titleHtml={esc(doc.name)}
        homeHref={base || '/'}
        homeLabel={loc ? `Kinder ${here}` : 'Home'}
        trail={[{ label: 'Doctors', href: loc ? `${base}#doctors` : '/doctors' }]}
        intro={[doc.designation, loc ? `Kinder ${here}` : locationLabel(doc)].filter(Boolean).join(' · ')}
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
                    <a className="doc-tag" href={`${base}/services/${service.slug}`}>{doc.speciality} →</a>
                  ) : (
                    <span className="doc-tag">{doc.speciality}</span>
                  )
                )}
                {/* On a sub-site the centre is already the site you are in. */}
                {!loc && docLocs.map((l) => (
                  <a className="doc-tag" key={l.id} href={`/hospitals/${l.slug || slugify(l.name)}`}>Kinder {l.name} →</a>
                ))}
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
                <a href={loc ? `${base}#doctors` : '/doctors'} className="btn btn-soft">
                  {loc ? `All doctors at Kinder ${here}` : 'All doctors'}
                </a>
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
                <DoctorCard doc={d} key={d.id} base={base} hideHospitals={!!loc} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
