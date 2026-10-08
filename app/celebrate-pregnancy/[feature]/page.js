import { pregnancyHighlights } from '@/lib/pregnancy-highlights.mjs';
import { withoutCentre } from '@/lib/no-centre.mjs';
import { notFound, permanentRedirect } from 'next/navigation';
import { getContent } from '@/lib/api';
import { kochiFeaturePages } from '@/lib/kochi-features.mjs';
import SiteChrome from '@/components/SiteChrome';
import KochiFeaturePage from '@/components/KochiFeaturePage';

export const revalidate = 60;

// Source highlights and existing Kochi programmes stay on the main site.
// Keep the original programme URLs and full CMS stories available.
async function resolve(params) {
  const { feature } = await params;
  // Water Birth moved under the Premium Birthing Centre.
  if (feature === 'water-birthing-suite') permanentRedirect('/premium-birthing-centre/water-birth');
  const content = await getContent();
  const links = [...pregnancyHighlights(content.pages), ...kochiFeaturePages(content.pages, 'Kochi', { site: 'main' })];
  const selected = links.find((link) => link.short === feature && link.group === 'Celebrate Pregnancy');
  if (!selected) return null;
  const name = String(selected.page.location || 'Kochi').split(',')[0].trim();
  const normalise = (value) => String(value).trim().toLowerCase().replace(/^cochin$/, 'kochi');
  const loc = (content.locations || []).find((location) => normalise(location.name) === normalise(name));
  return loc ? { content, loc, links, selected } : null;
}

export async function generateMetadata({ params }) {
  const found = await resolve(params);
  return found
    ? { title: `${withoutCentre(found.selected.page.title)} · Celebrate Pregnancy · Kinder Hospitals`, description: withoutCentre(found.selected.page.excerpt) }
    : { title: 'Page not found' };
}

export default async function PregnancyExperience({ params }) {
  const found = await resolve(params);
  if (!found) notFound();
  const { content, loc, links, selected } = found;
  return (
    <SiteChrome content={content}>
      <KochiFeaturePage page={selected.page} loc={loc} links={links} main />
    </SiteChrome>
  );
}
