import { getContent } from '@/lib/api';
import SiteChrome from '@/components/SiteChrome';
import PageHero from '@/components/PageHero';
import { HubTiles, HubProse, HubCta } from '@/components/Hub';

export const revalidate = 60;

export const metadata = {
  title: 'Media & Press · Kinder Hospitals',
  description: 'Press releases, awards and recognition, and photos and videos from across the Kinder Medical Group.',
};

function formatDate(d) {
  try { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch { return ''; }
}

export default async function MediaPage() {
  const content = await getContent();
  const news = content.news || [];
  const press = news.filter((n) => /press|media|announcement|news/i.test(n.category || 'News'));
  const awards = news.filter((n) => /award|recognition|accredit/i.test(`${n.category} ${n.title}`));
  const gallery = [
    ...news.filter((n) => n.imageUrl).map((n) => ({ src: n.imageUrl, caption: n.title })),
    ...(content.locations || []).filter((l) => l.imageUrl).map((l) => ({ src: l.imageUrl, caption: `Kinder ${l.name}` })),
  ];
  const email = content.settings.email || '';

  return (
    <SiteChrome content={content}>
      <main>
        <PageHero
          crumb="Media & Press"
          eyebrow="Media & Press"
          titleHtml="News from <em>the Kinder network</em>"
          intro="Press releases, awards and recognition, and pictures from our centres. For interviews or media requests, our communications team is one email away."
        />

        <HubTiles
          id="press"
          eyebrow="Press releases"
          title={<>Announcements <em>& coverage</em></>}
          items={press.slice(0, 9).map((n) => ({
            title: n.title,
            text: n.excerpt || formatDate(n.publishedAt),
            tag: formatDate(n.publishedAt),
            href: '/news',
            cta: 'Read in news',
          }))}
        />
        {press.length === 0 && (
          <section id="press"><div className="container"><p className="muted">Press releases are published here as they are issued. For media enquiries, write to <a href={`mailto:${email}`}>{email}</a>.</p></div></section>
        )}

        <HubProse id="awards" eyebrow="Awards & recognition" soft title={<>Recognition <em>we are proud of</em></>}
          intro={awards.length ? 'Recognition and accreditations announced across the network.' : 'Our centres hold quality accreditations and have been recognised by patients and peers alike. Details of each accreditation are on the About Us page.'}
          points={awards.length ? awards.slice(0, 6).map((a) => a.title) : undefined}>
          <p><a className="view-all" href="/about#accreditations">See accreditations & certifications →</a></p>
        </HubProse>

        <section id="gallery">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-eyebrow">Photo & video gallery</span>
                <h2 className="section-title">Inside <em>our hospitals</em></h2>
              </div>
            </div>
            {gallery.length === 0 ? (
              <p className="muted">Photos and videos are being added. Follow us on social media in the meantime — the links are in the footer.</p>
            ) : (
              <div className="gallery-grid">
                {gallery.slice(0, 12).map((item, i) => (
                  <figure className="gallery-item" key={i}>
                    <img src={item.src} alt={item.caption} loading="lazy" decoding="async" />
                    <figcaption>{item.caption}</figcaption>
                  </figure>
                ))}
              </div>
            )}
          </div>
        </section>

        <HubCta
          title="Media or interview request?"
          text="Our communications team handles press enquiries across all centres."
          href={`mailto:${email}?subject=${encodeURIComponent('Media enquiry')}`}
          label="Email the press desk"
          external={false}
        />
      </main>
    </SiteChrome>
  );
}
