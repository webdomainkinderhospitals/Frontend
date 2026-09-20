import { notFound } from 'next/navigation';
import { hospitalContext } from '@/lib/hospital';
import SubSiteChrome from '@/components/SubSiteChrome';
import PackagesBody from '@/components/pages/PackagesBody';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const ctx = await hospitalContext(slug);
  if (!ctx) return { title: 'Page not found' };
  return {
    title: `Health Packages · Kinder ${ctx.loc.name}`,
    description: `Maternity and health check-up packages, inclusions and eligibility at Kinder ${ctx.loc.name}.`,
  };
}

export default async function HospitalPackagesPage({ params }) {
  const { slug } = await params;
  const ctx = await hospitalContext(slug);
  if (!ctx) notFound();
  const { content, loc, base, data } = ctx;
  return (
    <SubSiteChrome content={content} loc={loc} slug={slug} sections={data.sections} privacyHref={data.privacyHref}>
      <PackagesBody content={content} base={base} loc={loc} />
    </SubSiteChrome>
  );
}
