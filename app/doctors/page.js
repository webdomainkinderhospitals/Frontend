import { getContent } from '@/lib/api';
import { atLocation, locationsOf } from '@/lib/locations';
import { slugify } from '@/lib/services';
import SiteChrome from '@/components/SiteChrome';
import PageHero from '@/components/PageHero';

export const revalidate = 60;

export const metadata = {
  title: 'Our Doctors · Kinder Hospitals',
  description: 'Senior consultants and specialists across every Kinder centre — medicine, surgery, fertility and women’s & children’s health.',
};

const WHATSAPP_BOOK =
  'https://api.whatsapp.com/send?phone=919446654500&text=' +
  encodeURIComponent('Hello Kinder Hospitals, I would like to book an appointment with a doctor.');

export default async function DoctorsPage() {
  const content = await getContent();
  const { doctors, locations } = content;

  const groups = [];
  for (const loc of locations) {
    // A consultant who practises at several centres is listed under each.
    const team = doctors.filter((d) => atLocation(d, loc.name));
    if (team.length) groups.push({ name: loc.name, team });
  }
  const unassigned = doctors.filter(
    (d) => !locations.some((l) => atLocation(d, l.name))
  );
  if (unassigned.length) groups.push({ name: 'Kinder Medical Group', team: unassigned });

  return (
    <SiteChrome content={content}>
      <main>
        <PageHero
          crumb="Doctors"
          eyebrow="Our Specialists"
          titleHtml="Meet the <em>Kinder family of doctors</em>"
          intro="Senior consultants practising under shared protocols, audit and clinical governance across every Kinder centre."
        />

        {groups.map((group) => (
          <section key={group.name}>
            <div className="container">
              <div className="section-head">
                <div>
                  <span className="section-eyebrow">Kinder {group.name}</span>
                  <h2 className="section-title">
                    Specialists at <em>{group.name}</em>
                  </h2>
                </div>
              </div>
              <div className="hosp-doctor-grid">
                {group.team.map((doc, i) => (
                  <article className="hosp-doctor-card" key={doc.id ?? i}>
                    <div
                      className="hosp-doctor-img"
                      style={{ backgroundImage: doc.imageUrl ? `url('${doc.imageUrl}')` : 'var(--mesh-card)' }}
                    ></div>
                    <div className="hosp-doctor-meta">
                      <h4>{doc.name}</h4>
                      <span>{doc.designation}</span>
                      {doc.bio && <p>{doc.bio}</p>}
                      <div className="doc-card-links">
                        <a href={`/doctors/${slugify(doc.name)}`} className="svc-doc-book">View Profile →</a>
                        <a href={WHATSAPP_BOOK} target="_blank" rel="noopener" className="doctor-book-link">
                          Book appointment →
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ))}

        <section className="hosp-cta-wrap">
          <div className="container">
            <div className="cta-strip">
              <div>
                <h3>Not sure which specialist you need?</h3>
                <p>Our care coordinators will guide you to the right Kinder doctor.</p>
              </div>
              <a href={WHATSAPP_BOOK} target="_blank" rel="noopener" className="btn btn-primary">
                Talk to Us →
              </a>
            </div>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
