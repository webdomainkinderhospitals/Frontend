import { getContent } from '@/lib/api';
import SiteChrome from '@/components/SiteChrome';
import PageHero from '@/components/PageHero';

export const revalidate = 60;

export const metadata = {
  title: 'Contact Us · Kinder Hospitals',
  description: 'Reach any Kinder centre — helpline, emergency numbers, addresses and directions.',
};

const WHATSAPP =
  'https://api.whatsapp.com/send?phone=919446654500&text=' +
  encodeURIComponent('Hello Kinder Hospitals, I have an enquiry.');

function slugOf(loc) {
  return (
    loc.slug ||
    String(loc.name || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  );
}

export default async function ContactPage() {
  const content = await getContent();
  const { settings, locations } = content;
  return (
    <SiteChrome content={content}>
      <main>
        <PageHero
          crumb="Contact"
          eyebrow="We're Here 24/7"
          titleHtml="Talk to <em>Kinder</em>"
          intro={`Helpline ${settings.helplinePhone} · Emergency ${settings.emergencyPhone} · ${settings.email}`}
        />

        <section>
          <div className="container">
            <div className="contact-quick">
              <a className="contact-quick-card" href={`tel:${(settings.helplinePhone || '').replace(/\s/g, '')}`}>
                <strong>24/7 Helpline</strong>
                <span>{settings.helplinePhone}</span>
              </a>
              <a className="contact-quick-card contact-quick-emergency" href={`tel:${(settings.emergencyPhone || '').replace(/\s/g, '')}`}>
                <strong>Emergency</strong>
                <span>{settings.emergencyPhone}</span>
              </a>
              <a className="contact-quick-card" href={WHATSAPP} target="_blank" rel="noopener">
                <strong>WhatsApp</strong>
                <span>Chat with our coordinators</span>
              </a>
              <a className="contact-quick-card" href={`mailto:${settings.email}`}>
                <strong>Email</strong>
                <span>{settings.email}</span>
              </a>
            </div>
          </div>
        </section>

        <section style={{ background: 'var(--bg-soft)' }}>
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-eyebrow">Our centres</span>
                <h2 className="section-title">Find us <em>near you</em></h2>
              </div>
            </div>
            <div className="contact-loc-grid">
              {locations.map((loc, i) => (
                <article className="contact-loc-card" key={loc.id ?? i}>
                  <span className="hosp-other-since">{loc.since || loc.country}</span>
                  <h4>Kinder {loc.name}</h4>
                  <p>{loc.address}</p>
                  <div className="contact-loc-links">
                    {loc.phone && <a href={`tel:${loc.phone.replace(/\s/g, '')}`}>{loc.phone}</a>}
                    {loc.mapUrl && <a href={loc.mapUrl} target="_blank" rel="noopener">Directions →</a>}
                    <a href={`/hospitals/${slugOf(loc)}`}>Visit its website →</a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="hosp-cta-wrap">
          <div className="container">
            <div className="cta-strip">
              <div>
                <h3>Book an appointment</h3>
                <p>Our care coordinators reply within minutes on WhatsApp.</p>
              </div>
              <a href={WHATSAPP} target="_blank" rel="noopener" className="btn btn-primary">Book on WhatsApp →</a>
            </div>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
