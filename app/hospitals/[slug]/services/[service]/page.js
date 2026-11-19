import { notFound } from 'next/navigation';
import { findHospitalService } from '@/lib/services';
import { hospitalContext } from '@/lib/hospital';
import SubSiteChrome from '@/components/SubSiteChrome';
import ServiceBody from '@/components/pages/ServiceBody';
import { centreServicePage } from '@/lib/centre-service-pages.mjs';

export const revalidate = 60;

// A speciality read inside the centre's own site: its header, its footer, its
// doctors. The corporate /services/<slug> page is the same body under the
// group's chrome.
async function resolve(params) {
  const { slug, service } = await params;
  const ctx = await hospitalContext(slug);
  if (!ctx) return null;
  const svc = findHospitalService(ctx.content, ctx.loc, service);
  return svc ? { ...ctx, svc } : null;
}

export async function generateMetadata({ params }) {
  const found = await resolve(params);
  if (!found) return { title: 'Page not found' };
  const page = centreServicePage(found.loc, (await params).service);
  return {
    // a page the hospital wrote in full carries its own search title
    title: page?.metaTitle ? { absolute: page.metaTitle } : `${found.svc.name} · Kinder ${found.loc.name}`,
    description: page?.metaDescription || found.svc.description || `${found.svc.name} at Kinder ${found.loc.name}.`,
  };
}

export default async function HospitalServicePage({ params }) {
  const found = await resolve(params);
  if (!found) notFound();
  const { content, loc, slug, base, data, svc } = found;
  return (
    <SubSiteChrome content={content} loc={loc} slug={slug} sections={data.sections} privacyHref={data.privacyHref}>
      <ServiceBody svc={svc} content={content} base={base} loc={loc} />
    </SubSiteChrome>
  );
}
