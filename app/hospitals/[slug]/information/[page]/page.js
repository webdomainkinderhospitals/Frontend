import { notFound, redirect } from 'next/navigation';
import { atLocation } from '@/lib/locations';
import { isCarePage, carePageHref } from '@/lib/care-content.mjs';
import { hospitalContext } from '@/lib/hospital';
import SubSiteChrome from '@/components/SubSiteChrome';
import InformationBody from '@/components/pages/InformationBody';

export const revalidate = 60;

// An information page — a policy, a visit note, anything in the Content
// Library — read inside the centre it belongs to. Group-wide pages open here
// too, so a visitor following a link from this centre stays on its site.
async function resolve(params) {
  const { slug, page: pageSlug } = await params;
  const ctx = await hospitalContext(slug);
  if (!ctx) return null;
  const page = (ctx.content.pages || []).find(
    (p) =>
      p.slug === pageSlug &&
      p.published !== false &&
      (atLocation(p, ctx.loc.name) || !String(p.location || '').trim())
  );
  return page ? { ...ctx, page } : null;
}

export async function generateMetadata({ params }) {
  const found = await resolve(params);
  if (!found) return { title: 'Page not found' };
  return { title: `${found.page.title} · Kinder ${found.loc.name}`, description: found.page.excerpt };
}

export default async function HospitalInformationPage({ params }) {
  const found = await resolve(params);
  if (!found) notFound();
  const { content, loc, slug, base, data, page } = found;
  // Care pages have their own richer layout at /hospitals/<slug>/care/<slug>.
  if (isCarePage(page)) redirect(carePageHref(page, slug));
  return (
    <SubSiteChrome content={content} loc={loc} slug={slug} sections={data.sections} privacyHref={data.privacyHref}>
      <InformationBody page={page} base={base} loc={loc} />
    </SubSiteChrome>
  );
}
