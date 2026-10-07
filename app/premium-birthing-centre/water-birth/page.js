import { notFound } from 'next/navigation';
import { getContent } from '@/lib/api';
import { kochiFeaturePages, PREMIUM_SLUG } from '@/lib/kochi-features.mjs';
import SiteChrome from '@/components/SiteChrome';
import KochiFeaturePage from '@/components/KochiFeaturePage';

export const revalidate = 60;

// Water Birth, part of the Premium Birthing Centre at Kinder Hospitals Kochi,
// with the centre itself spotlighted alongside.
async function resolve() {
  const content = await getContent();
  const loc = (content.locations || []).find((l) => /^(kochi|cochin)$/i.test(String(l.name).trim()));
  if (!loc) return null;
  const links = kochiFeaturePages(content.pages, loc.name, { site: 'main' });
  const selected = links.find((link) => link.slug === 'kochi-water-birthing-suite');
  const spotlight = links.find((link) => link.slug === PREMIUM_SLUG);
  return selected ? { content, loc, links, selected, spotlight } : null;
}

export async function generateMetadata() {
  const found = await resolve();
  return found
    ? { title: `${found.selected.page.title} · Premium Birthing Centre · Kinder Hospitals`, description: found.selected.page.excerpt }
    : { title: 'Water Birth · Premium Birthing Centre · Kinder Hospitals' };
}

export default async function WaterBirth() {
  const found = await resolve();
  if (!found) notFound();
  const { content, loc, links, selected, spotlight } = found;
  return (
    <SiteChrome content={content}>
      <KochiFeaturePage page={selected.page} loc={loc} links={links} main spotlight={spotlight} />
    </SiteChrome>
  );
}
