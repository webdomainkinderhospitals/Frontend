import { notFound } from 'next/navigation';
import { getContent } from '@/lib/api';
import { atLocation, findLocationBySlug } from '@/lib/locations';
import { isCarePage } from '@/lib/care-content.mjs';
import { hospitalData } from '@/lib/hospital';

import KochiCarePage from '@/components/KochiCare';
import KochiFeaturePage from '@/components/KochiFeaturePage';
import { kochiFeaturePages } from '@/lib/kochi-features.mjs';
import SubSiteHeader from '@/components/SubSiteHeader';
import SubSiteFooter from '@/components/SubSiteFooter';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import ScrollEffects from '@/components/ScrollEffects';
import KinderChat from '@/components/KinderChat';

export const revalidate = 60;

// A care page is its own page on the centre's sub-site: the centre's header,
// the centre's footer, and a back link to the hospital it belongs to.
async function resolve(params) {
  const { slug, care } = await params;
  const content = await getContent();
  const loc = findLocationBySlug(content.locations, slug);
  if (!loc) return null;
  const page = (content.pages || []).find(
    (p) => p.slug === care && isCarePage(p) && p.published !== false && atLocation(p, loc.name)
  );
  return page ? { content, loc, page, slug } : null;
}

export async function generateMetadata({ params }) {
  const found = await resolve(params);
  if (!found) return { title: 'Page not found' };
  return {
    title: `${found.page.title} · Kinder ${found.loc.name}`,
    description: found.page.excerpt,
  };
}

export default async function HospitalCareDetail({ params }) {
  const found = await resolve(params);
  if (!found) notFound();
  const { content, loc, page, slug } = found;
  const { sections } = hospitalData(content, loc);

  return (
    <>
      <SubSiteHeader loc={loc} settings={content.settings} slug={slug} sections={sections} pages={content.pages} />
      {['kochi-premium-birthing-centre', 'kochi-water-birthing-suite'].includes(page.slug)
        ? <KochiFeaturePage page={page} loc={loc} links={kochiFeaturePages(content.pages, loc.name)} />
        : <KochiCarePage page={page} content={content} loc={loc} hospitalSlug={slug} />}
      <SubSiteFooter loc={loc} settings={content.settings} slug={slug} sections={sections} />
      <WhatsAppFloat />
      <KinderChat content={content} />
      <ScrollEffects />
    </>
  );
}
