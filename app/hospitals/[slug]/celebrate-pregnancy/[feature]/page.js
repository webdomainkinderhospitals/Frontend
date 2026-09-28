import { notFound } from 'next/navigation';
import { hospitalContext } from '@/lib/hospital';
import { kochiFeaturePages } from '@/lib/kochi-features.mjs';
import SubSiteChrome from '@/components/SubSiteChrome';
import KochiFeaturePage from '@/components/KochiFeaturePage';

export const revalidate = 60;

async function resolve(params) {
  const { slug, feature } = await params;
  const ctx = await hospitalContext(slug);
  if (!ctx || !/^(kochi|cochin)$/i.test(ctx.loc.name)) return null;
  const links = kochiFeaturePages(ctx.content.pages, ctx.loc.name);
  const selected = links.find((link) => link.slug === feature && link.group === 'Celebrate Pregnancy' && link.slug !== 'kochi-water-birthing-suite');
  return selected ? { ctx, links, selected } : null;
}

export async function generateMetadata({ params }) {
  const found = await resolve(params);
  return found ? { title: `${found.selected.page.title} · Kinder Kochi`, description: found.selected.page.excerpt } : { title: 'Page not found' };
}

export default async function KochiPregnancyDetail({ params }) {
  const found = await resolve(params);
  if (!found) notFound();
  const { ctx, links, selected } = found;
  return <SubSiteChrome content={ctx.content} loc={ctx.loc} slug={ctx.slug} sections={ctx.data.sections} privacyHref={ctx.data.privacyHref}>
    <KochiFeaturePage page={selected.page} loc={ctx.loc} links={links} />
  </SubSiteChrome>;
}
