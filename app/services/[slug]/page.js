import { notFound } from 'next/navigation';
import { getContent } from '@/lib/api';
import { locationsOf, locationLabel } from '@/lib/locations';
import { findService, doctorsForService, slugify } from '@/lib/services';
import SiteChrome from '@/components/SiteChrome';
import PageHero from '@/components/PageHero';
import DoctorCard from '@/components/DoctorCard';

export const revalidate = 60;

const esc = (s) =>
  String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const enquire = (name) =>
  'https://api.whatsapp.com/send?phone=919446654500&text=' +
  encodeURIComponent(`Hello Kinder Hospitals, I would like to enquire about ${name}.`);

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const content = await getContent();
  const svc = findService(content.specialities, slug);
  if (!svc) return { title: 'Services · Kinder Hospitals' };
  return {
    title: `${svc.name} · Kinder Hospitals`,
    description: svc.description || `${svc.name} — ${svc.group.title} care across the Kinder network.`,
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const content = await getContent();
  const svc = findService(content.specialities, slug);
  if (!svc) notFound();

  const team = doctorsForService(svc.name, content.doctors);
  const related = svc.group.items.filter((i) => i.name !== svc.name);
  const centres = [...new Set(team.flatMap((d) => locationsOf(d)))];

  return (
    <SiteChrome content={content}>
      <main>
        <PageHero
          crumb={svc.name}
          eyebrow={svc.group.title}
          titleHtml={esc(svc.name)}
          intro={
            svc.description ||
            `${svc.name} at Kinder Hospitals — part of our ${svc.group.title.toLowerCase()} care, delivered under shared protocols across every Kinder centre.`
          }
        />

        {/* Doctors for this service */}
        <section>
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-eyebrow">Our specialists</span>
                <h2 className="section-title">
                  Doctors for <em>{svc.name}</em>
                </h2>
                {centres.length > 0 && (
                  <p className="section-intro">
                    Available at {centres.map((c) => `Kinder ${c}`).join(' · ')}
                  </p>
                )}
              </div>
            </div>
            {team.length > 0 ? (
              <div className="hosp-doctor-grid">
                {team.map((doc) => (
                  <DoctorCard doc={doc} key={doc.id} />
                ))}
              </div>
            ) : (
              <div className="cta-strip">
                <div>
                  <h3>Meet our {svc.name} team</h3>
                  <p>Our care coordinators will connect you with the right Kinder specialist for {svc.name}.</p>
                </div>
                <a href={enquire(svc.name)} target="_blank" rel="noopener" className="btn btn-primary">
                  Enquire on WhatsApp →
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Related services in the same group */}
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
                <a href={`/services#${svc.group.id}`} className="view-all">All {svc.group.title} →</a>
              </div>
              <div className="svc-grid">
                {related.map((item) => (
                  <a key={item.name} className="svc-card" href={`/services/${slugify(item.name)}`} title={item.description || undefined}>
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
                <p>Message us on WhatsApp and our coordinators will arrange your consultation.</p>
              </div>
              <a href={enquire(svc.name)} target="_blank" rel="noopener" className="btn btn-primary">
                Book an Appointment →
              </a>
            </div>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
