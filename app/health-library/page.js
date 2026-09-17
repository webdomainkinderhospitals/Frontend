import { getContent } from '@/lib/api';
import { LIBRARY_SHELVES } from '@/lib/health-library';
import SiteChrome from '@/components/SiteChrome';
import PageHero from '@/components/PageHero';
import { HubTiles, HubCta, whatsapp } from '@/components/Hub';

export const revalidate = 60;

export const metadata = {
  title: 'Health Library · Kinder Hospitals',
  description: 'Diseases and conditions, procedure explainers, wellness and prevention, and the latest updates from the Kinder network.',
};

export default async function HealthLibraryPage() {
  const content = await getContent();
  const pages = (content.pages || []).filter((p) => p.published !== false);
  const count = (shelf) => pages.filter((p) => shelf.categories.includes(p.category)).length;

  const shelves = Object.entries(LIBRARY_SHELVES).map(([slug, shelf]) => ({
    title: shelf.title,
    text: shelf.intro,
    href: `/health-library/${slug}`,
    tag: count(shelf) ? `${count(shelf)} article${count(shelf) > 1 ? 's' : ''}` : 'Growing shelf',
    cta: 'Open this shelf',
  }));
  shelves.push({
    title: 'News & Updates',
    text: 'Camps, awareness drives, new services and announcements from across the Kinder network.',
    href: '/news',
    tag: (content.news || []).length ? `${content.news.length} posts` : 'Latest',
    cta: 'Read the news',
  });

  return (
    <SiteChrome content={content}>
      <main>
        <PageHero
          crumb="Health Library"
          eyebrow="Health Library"
          titleHtml="Care you can <em>read up on</em>"
          intro="Written and reviewed by our clinical teams — conditions, procedures and prevention, in language you can act on."
        />
        <HubTiles items={shelves} />
        <HubCta
          title="Can't find what you are looking for?"
          text="Tell us the condition or procedure and we will point you to the right specialist."
          href={whatsapp('Hello Kinder Hospitals, I am looking for information about a condition.')}
          label="Ask our team"
        />
      </main>
    </SiteChrome>
  );
}
