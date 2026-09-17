import { notFound } from 'next/navigation';
import { getContent } from '@/lib/api';
import { LIBRARY_SHELVES } from '@/lib/health-library';
import { carePageHref, isCarePage } from '@/lib/care-content.mjs';
import { hospitalSlugForPage } from '@/lib/locations';
import SiteChrome from '@/components/SiteChrome';
import PageHero from '@/components/PageHero';
import ContentPages from '@/components/ContentPages';
import { HubTiles, HubCta, whatsapp } from '@/components/Hub';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { topic } = await params;
  const shelf = LIBRARY_SHELVES[topic];
  return shelf ? { title: `${shelf.title} · Health Library · Kinder Hospitals`, description: shelf.intro } : { title: 'Page not found' };
}

export default async function LibraryShelfPage({ params }) {
  const { topic } = await params;
  const shelf = LIBRARY_SHELVES[topic];
  if (!shelf) notFound();
  const content = await getContent();
  const pages = (content.pages || []).filter((p) => p.published !== false && shelf.categories.includes(p.category));

  // Service pages our centres have published read as explainers too.
  const carePages = shelf.includeProcedures
    ? (content.pages || [])
        .filter((p) => isCarePage(p) && p.published !== false)
        .map((p) => ({ title: p.title, text: p.excerpt, href: carePageHref(p, hospitalSlugForPage(p, content.locations)), cta: 'Read the service page' }))
    : [];
  const procedures = shelf.includeProcedures
    ? (content.procedures || []).map((proc) => ({ title: proc.name, text: proc.description, href: '/packages', cta: 'Ask about this procedure' }))
    : [];

  const empty = !pages.length && !carePages.length && !procedures.length;

  return (
    <SiteChrome content={content}>
      <main>
        <PageHero crumb={shelf.title} eyebrow="Health Library" titleHtml={shelf.title} intro={shelf.intro} />
        <ContentPages title={shelf.title} pages={pages} locations={content.locations} />
        {carePages.length > 0 && <HubTiles eyebrow="From our centres" title={<>Services, <em>explained</em></>} items={carePages} soft />}
        {procedures.length > 0 && <HubTiles eyebrow="Signature procedures" title={<>What we do <em>most often</em></>} items={procedures} />}
        {empty && (
          <section><div className="container">
            <p className="muted">Articles for this shelf are being written by our clinical teams. In the meantime, <a href="/services">browse our specialities</a> or <a href="/contact">ask our care team</a>.</p>
          </div></section>
        )}
        <HubCta
          title="Have a question about your own health?"
          text="Reading only goes so far — our coordinators can book you with the right specialist."
          href={whatsapp('Hello Kinder Hospitals, I have a health question.')}
          label="Talk to a coordinator"
        />
      </main>
    </SiteChrome>
  );
}
