import { getContent } from '@/lib/api';
import { slugOfLocation } from '@/lib/locations';
import { LOCATION_SECTIONS } from '@/lib/site-tree';
import SiteChrome from '@/components/SiteChrome';
import PageHero from '@/components/PageHero';
import { HubCta, whatsapp } from '@/components/Hub';

export const revalidate = 60;

// The centres are named from the CMS, so a new hospital never leaves this
// description listing yesterday's network.
export async function generateMetadata() {
  const content = await getContent();
  const names = (content.locations || []).map((loc) => loc.name);
  const listed = names.length
    ? `${names.slice(0, -1).join(', ')}${names.length > 1 ? ' and ' : ''}${names[names.length - 1]}`
    : 'every city we serve';
  return {
    title: 'Our Locations · Kinder Hospitals',
    description: `Every Kinder centre — ${listed} — with its own departments, doctors, facilities and contact details.`,
  };
}

export default async function LocationsPage() {
  const content = await getContent();
  const locations = content.locations || [];
  return (
    <SiteChrome content={content}>
      <main>
        <PageHero
          crumb="Our Locations"
          eyebrow="Our Locations"
          titleHtml="One promise of kindness, <em>in every city we serve</em>"
          intro="Each centre has its own site: departments and specialities, doctors, facilities, packages and contact details."
        />
        <section>
          <div className="container">
            <div className="loc-grid">
              {locations.map((loc) => {
                const slug = slugOfLocation(loc);
                return (
                  <article className="loc-card" key={loc.id ?? slug}>
                    <div className="loc-img" style={{ backgroundImage: loc.imageUrl ? `url('${loc.imageUrl}'), var(--mesh-card)` : 'var(--mesh-card)' }} />
                    <div className="loc-body">
                      <span className="hosp-other-since">{loc.since || `${loc.city} · ${loc.country}`}</span>
                      <h4>Kinder {loc.name}</h4>
                      <p>{loc.tagline || loc.address}</p>
                      <div className="loc-links">
                        {LOCATION_SECTIONS.slice(0, 5).map((section) => (
                          <a key={section.label} href={`/hospitals/${slug}${section.hash}`}>{section.label}</a>
                        ))}
                      </div>
                      <a className="view-all" href={`/hospitals/${slug}`}>Visit Kinder {loc.name} →</a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
        <HubCta
          title="Not sure which centre to visit?"
          text="Tell us where you are and what you need — our coordinators will point you to the nearest Kinder team."
          href={whatsapp('Hello Kinder Hospitals, which centre is nearest to me?')}
          label="Ask our team"
        />
      </main>
    </SiteChrome>
  );
}
