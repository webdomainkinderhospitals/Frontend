import { getContent } from '@/lib/api';
import { locationLabel } from '@/lib/locations';
import { groupServices, doctorsForGroup, slugify } from '@/lib/services';
import SiteChrome from '@/components/SiteChrome';
import PageHero from '@/components/PageHero';

export const revalidate = 60;

export const metadata = {
  title: 'Services · Kinder Hospitals',
  description: 'Maternity, fertility & IVF, children’s care and allied wellness services across the Kinder network.',
};

const WHATSAPP =
  'https://api.whatsapp.com/send?phone=919446654500&text=' +
  encodeURIComponent('Hello Kinder Hospitals, I would like to know more about a service.');

export default async function ServicesPage() {
  const content = await getContent();
  const groups = groupServices(content.specialities);
  return (
    <SiteChrome content={content}>
      <main>
        <PageHero
          crumb="Services"
          eyebrow="What We Do"
          titleHtml="Every speciality, <em>one promise of kindness</em>"
          intro="Comprehensive women's and children's healthcare — maternity, fertility, neonatology, paediatrics and allied specialities across all Kinder centres."
        />

        {groups.map((cat, idx) => {
          const team = doctorsForGroup(cat, content.doctors);
          return (
            <section key={cat.id} id={cat.id} style={idx % 2 ? { background: 'var(--bg-soft)' } : undefined}>
              <div className="container">
                <div className="section-head">
                  <div>
                    <span className="section-eyebrow">{cat.title}</span>
                    <h2 className="section-title">{cat.title}</h2>
                    <p className="section-intro">{cat.intro}</p>
                  </div>
                </div>
                <div className="svc-grid">
                  {cat.items.map((item) => (
                    <a
                      key={item.name}
                      className="svc-card"
                      href={`/services/${slugify(item.name)}`}
                      title={item.description || undefined}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                      <span>{item.name}</span>
                    </a>
                  ))}
                </div>

                {team.length > 0 && (
                  <div className="svc-team">
                    <h3 className="svc-team-title">Our {cat.title} specialists</h3>
                    <div className="hosp-doctor-grid">
                      {team.map((doc) => (
                        <article className="hosp-doctor-card" key={doc.id}>
                          <div
                            className="hosp-doctor-img"
                            style={{ backgroundImage: doc.imageUrl ? `url('${doc.imageUrl}')` : 'var(--mesh-card)' }}
                          ></div>
                          <div className="hosp-doctor-meta">
                            <h4>{doc.name}</h4>
                            <span>{[doc.designation, doc.speciality].filter(Boolean).join(' · ')}</span>
                            {locationLabel(doc) && <p className="svc-doc-loc">{locationLabel(doc)}</p>}
                            <div className="doc-card-links">
                              <a className="svc-doc-book" href={`/doctors/${slugify(doc.name)}`}>View Profile →</a>
                              <a className="svc-doc-book" href={WHATSAPP} target="_blank" rel="noopener">Book →</a>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          );
        })}

        <section className="hosp-cta-wrap">
          <div className="container">
            <div className="cta-strip">
              <div>
                <h3>Need a specialist?</h3>
                <p>Our care coordinators will guide you to the right department and doctor.</p>
              </div>
              <a href={WHATSAPP} target="_blank" rel="noopener" className="btn btn-primary">Book an Appointment →</a>
            </div>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
