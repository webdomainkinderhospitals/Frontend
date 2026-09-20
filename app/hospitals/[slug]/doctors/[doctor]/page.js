import { notFound } from 'next/navigation';
import { slugify } from '@/lib/services';
import { atLocation } from '@/lib/locations';
import { hospitalContext } from '@/lib/hospital';
import SubSiteChrome from '@/components/SubSiteChrome';
import DoctorProfileBody from '@/components/pages/DoctorProfileBody';

export const revalidate = 60;

async function resolve(params) {
  const { slug, doctor } = await params;
  const ctx = await hospitalContext(slug);
  if (!ctx) return null;
  const doc = ctx.content.doctors.find(
    (d) => slugify(d.name) === doctor && atLocation(d, ctx.loc.name)
  );
  return doc ? { ...ctx, doc } : null;
}

export async function generateMetadata({ params }) {
  const found = await resolve(params);
  if (!found) return { title: 'Page not found' };
  return {
    title: `${found.doc.name} · Kinder ${found.loc.name}`,
    description: found.doc.bio || [found.doc.designation, found.doc.speciality].filter(Boolean).join(' · '),
  };
}

export default async function HospitalDoctorPage({ params }) {
  const found = await resolve(params);
  if (!found) notFound();
  const { content, loc, slug, base, data, doc } = found;
  return (
    <SubSiteChrome content={content} loc={loc} slug={slug} sections={data.sections} privacyHref={data.privacyHref}>
      <DoctorProfileBody doc={doc} content={content} base={base} loc={loc} />
    </SubSiteChrome>
  );
}
