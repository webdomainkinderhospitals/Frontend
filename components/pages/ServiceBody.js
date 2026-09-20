import ContentBody from '@/components/ContentBody';
import PageHero from '@/components/PageHero';
import DoctorCard from '@/components/DoctorCard';
import { doctorsForService, slugify } from '@/lib/services';
import { atLocation, locationsOf } from '@/lib/locations';

const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const enquire = (name, where) =>
  'https://api.whatsapp.com/send?phone=919446654500&text=' +
  encodeURIComponent(`Hello Kinder Hospitals, I would like to enquire about ${name}${where ? ` at Kinder ${where}` : ''}.`);

// One speciality page, rendered the same on the corporate site and inside a
// centre's sub-site. `base` is '' or '/hospitals/<slug>', and `loc` — set only
// on a sub-site — narrows the doctors to the ones practising at that centre.
export default function ServiceBody({ svc, content, base = '', loc = null }) {
  const here = loc ? loc.name : '';
  const all = doctorsForService(svc.name, content.doctors);
  const team = loc ? all.filter((d) => atLocation(d, loc.name)) : all;
  const related = svc.group.items.filter((i) => i.name !== svc.name);
  const centres = [...new Set(team.flatMap((d) => locationsOf(d)))];

  return (
    <main>
      <PageHero
        crumb={svc.name}
        eyebrow={loc ? `${svc.group.title} · Kinder ${here}` : svc.group.title}
        titleHtml={esc(svc.name)}
        homeHref={base || '/'}
        homeLabel={loc ? `Kinder ${here}` : 'Home'}
        trail={[{ label: 'Specialities', href: loc ? `${base}#specialities` : '/services' }]}
        intro={
          svc.description ||
          (loc
            ? `${svc.name} at Kinder ${here} — part of our ${svc.group.title.toLowerCase()} care, delivered under the protocols shared across every Kinder centre.`
            : `${svc.name} at Kinder Hospitals — part of our ${svc.group.title.toLowerCase()} care, delivered under shared protocols across every Kinder centre.`)
        }
      />

      {svc.fullDescription && (
        <section><div className="container"><ContentBody text={svc.fullDescription} /></div></section>
      )}

      <section>
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-eyebrow">Our specialists</span>
              <h2 className="section-title">
                Doctors for <em>{svc.name}</em>
              </h2>
              {loc ? (
                <p className="section-intro">At Kinder {here}</p>
              ) : (
                centres.length > 0 && (
                  <p className="section-intro">
                    Available at {centres.map((c) => `Kinder ${c}`).join(' · ')}
                  </p>
                )
              )}
            </div>
            {loc && <a className="view-all" href={`${base}#doctors`}>All doctors at Kinder {here} →</a>}
          </div>
          {team.length > 0 ? (
            <div className="hosp-doctor-grid">
              {team.map((doc) => (
                <DoctorCard doc={doc} key={doc.id} base={base} hideHospitals={!!loc} />
              ))}
            </div>
          ) : (
            <div className="cta-strip">
              <div>
                <h3>Meet our {svc.name} team</h3>
                <p>
                  Our care coordinators will connect you with the right Kinder specialist
                  for {svc.name}{loc ? ` at Kinder ${here}` : ''}.
                </p>
              </div>
              <a href={enquire(svc.name, here)} target="_blank" rel="noopener" className="btn btn-primary">
                Enquire on WhatsApp →
              </a>
            </div>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section style={{ background: 'var(--bg-soft)' }}>
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-eyebrow">{svc.group.title}</span>
                <h2 className="section-title">
                  Related <em>services</em>
                </h2>
              </div>
              <a href={loc ? `${base}#specialities` : `/services#${svc.group.id}`} className="view-all">
                {loc ? `All specialities at Kinder ${here}` : `All ${svc.group.title}`} →
              </a>
            </div>
            <div className="svc-grid">
              {related.map((item) => (
                <a
                  key={item.name}
                  className="svc-card"
                  href={`${base}/services/${slugify(item.name)}`}
                  title={item.description || undefined}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                  <span>{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="hosp-cta-wrap">
        <div className="container">
          <div className="cta-strip">
            <div>
              <h3>Ready to talk to us about {svc.name}?</h3>
              <p>
                {loc && loc.phone
                  ? `Call ${loc.phone} or message us on WhatsApp — our coordinators at Kinder ${here} will arrange your consultation.`
                  : 'Message us on WhatsApp and our coordinators will arrange your consultation.'}
              </p>
            </div>
            <a href={enquire(svc.name, here)} target="_blank" rel="noopener" className="btn btn-primary">
              Book an Appointment →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
