import { getContent } from '@/lib/api';
import { allServices, groupServices, slugify } from '@/lib/services';
import { slugOfLocation } from '@/lib/locations';
import SiteChrome from '@/components/SiteChrome';
import PageHero from '@/components/PageHero';
import { HubCta, whatsapp } from '@/components/Hub';
import SpecialityIcon from '@/components/SpecialityIcon';

export const revalidate = 60;

export const metadata = {
  title: 'Find Care · Kinder Hospitals',
  description: 'Find the right Kinder care — by speciality, by centre or by doctor — and book an appointment.',
};

export default async function FindCarePage() {
  const content = await getContent();
  const groups = groupServices(content.specialities);
  const locations = content.locations || [];
  const total = allServices(content.specialities).length;

  return (
    <SiteChrome content={content}>
      <main>
        <PageHero
          crumb="Find Care"
          eyebrow="Find Care"
          titleHtml="Tell us what you need — <em>we will point you to it</em>"
          intro={`${total} specialities across ${locations.length} centres. Start from the care you are looking for, the centre nearest you, or the doctor you want to see.`}
        />

        <section>
          <div className="container">
            <div className="quick-bar find-care-bar">
              <a className="quick-item" href="#by-speciality">
                <div className="quick-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg></div>
                <div className="quick-text"><strong>By speciality</strong><span>Browse every department</span></div>
              </a>
              <a className="quick-item" href="#by-centre">
                <div className="quick-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" /><circle cx="12" cy="10" r="2.5" /></svg></div>
                <div className="quick-text"><strong>By centre</strong><span>Care close to home</span></div>
              </a>
              <a className="quick-item" href="/doctors">
                <div className="quick-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg></div>
                <div className="quick-text"><strong>By doctor</strong><span>Search and filter</span></div>
              </a>
              <a className="quick-item" href="/health-library">
                <div className="quick-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" /></svg></div>
                <div className="quick-text"><strong>By condition</strong><span>Read the health library</span></div>
              </a>
            </div>
          </div>
        </section>

        <section id="by-speciality">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-eyebrow">By speciality</span>
                <h2 className="section-title">What kind of care <em>do you need?</em></h2>
              </div>
              <a className="view-all" href="/services">All specialities →</a>
            </div>
            <div className="hosp-spec-groups">
              {groups.map((group) => (
                <div className="hosp-spec-group" key={group.id}>
                  <h3>{group.title}</h3>
                  <div className="svc-grid">
                    {group.items.map((item) => (
                      <a className="svc-card" key={item.name} href={`/services/${slugify(item.name)}`} title={item.description || undefined}>
                        <SpecialityIcon name={item.name} />
                        <span>{item.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="by-centre" style={{ background: 'var(--bg-soft)' }}>
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-eyebrow">By centre</span>
                <h2 className="section-title">Care <em>close to home</em></h2>
              </div>
              <a className="view-all" href="/hospitals">All locations →</a>
            </div>
            <div className="contact-loc-grid">
              {locations.map((loc) => (
                <article className="contact-loc-card" key={loc.id ?? loc.name}>
                  <span className="hosp-other-since">{loc.since || loc.country}</span>
                  <h4>Kinder {loc.name}</h4>
                  <p>{loc.tagline || loc.address}</p>
                  <div className="contact-loc-links">
                    <a href={`/hospitals/${slugOfLocation(loc)}#specialities`}>Specialities</a>
                    <a href={`/doctors?hospital=${encodeURIComponent(loc.name)}`}>Doctors</a>
                    {loc.phone && <a href={`tel:${loc.phone.replace(/\s/g, '')}`}>{loc.phone}</a>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <HubCta
          title="Still not sure where to start?"
          text="Describe your symptoms or the care you are looking for — a coordinator will route you to the right team."
          href={whatsapp('Hello Kinder Hospitals, I need help finding the right care.')}
          label="Ask a coordinator"
        />
      </main>
    </SiteChrome>
  );
}
