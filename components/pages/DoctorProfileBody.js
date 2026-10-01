import PageHero from '@/components/PageHero';
import DoctorCard from '@/components/DoctorCard';
import { slugify, matchesService, allServices } from '@/lib/services';
import { atLocation, centreName, locationLabel } from '@/lib/locations';
import ContentBody from '@/components/ContentBody';
import { profileText, tidyQualifications } from '@/lib/doctor-profile.mjs';
import { initials } from '@/components/DoctorCard';

const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');


// A doctor's profile. On a centre's sub-site the speciality link, the "all
// doctors" link and the colleague cards all stay within that centre.
export default function DoctorProfileBody({ doc, content, base = '', loc = null }) {
  const here = loc ? loc.name : '';
  const service = allServices(content.specialities).find((s) => matchesService(doc.speciality, s.name));
  const docLocs = content.locations.filter((l) => atLocation(doc, l.name));
  // The written profile (lead, then Expertise / Education lists), or one
  // factual sentence for a doctor without one yet.
  const centre = loc ? centreName(loc) : docLocs.length === 1 ? centreName(docLocs[0]) : '';
  const profile = profileText(doc, centre);
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
            >
              {!doc.imageUrl && <span className="doc-profile-initials" aria-hidden="true">{initials(doc.name)}</span>}
            </div>
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
              {doc.bio && (
                <p className="doc-profile-quals"><span>Qualifications</span>{tidyQualifications(doc.bio)}</p>
              )}
              <div className="doc-profile-text">
                <ContentBody text={profile} />
              </div>
              <div className="doc-profile-actions">
                <a href={`${base}/book?doctor=${slugify(doc.name)}`} className="btn btn-primary">
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
