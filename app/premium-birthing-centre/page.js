import { withoutCentre } from '@/lib/no-centre.mjs';
import { notFound } from 'next/navigation';
import { getContent } from '@/lib/api';
import { kochiFeaturePages, PREMIUM_SLUG } from '@/lib/kochi-features.mjs';
import SiteChrome from '@/components/SiteChrome';
import KochiFeaturePage from '@/components/KochiFeaturePage';

export const revalidate = 60;

// The Premium Birthing Centre (at Kinder Hospitals Kochi) on the main site,
// from the same page Kochi's own site shows, with Water Birth spotlighted as
// part of the centre.
async function resolve() {
  const content = await getContent();
  const loc = (content.locations || []).find((l) => /^(kochi|cochin)$/i.test(String(l.name).trim()));
  if (!loc) return null;
  const links = kochiFeaturePages(content.pages, loc.name, { site: 'main' });
  const selected = links.find((link) => link.slug === PREMIUM_SLUG);
  const spotlight = links.find((link) => link.group === 'Premium Birthing Centre' && link !== selected);
  return selected ? { content, loc, links, selected, spotlight } : null;
}

export async function generateMetadata() {
  const found = await resolve();
  return found
    ? { title: `${withoutCentre(found.selected.page.title)} · Kinder Hospitals`, description: withoutCentre(found.selected.page.excerpt) }
    : { title: 'Premium Birthing Centre · Kinder Hospitals' };
}

export default async function PremiumBirthingCentre() {
  const found = await resolve();
  if (!found) notFound();
  const { content, loc, links, selected, spotlight } = found;
  return (
    <SiteChrome content={content}>
      <KochiFeaturePage page={selected.page} loc={loc} links={links} main spotlight={spotlight} />
    </SiteChrome>
  );
}
