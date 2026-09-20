import { notFound } from 'next/navigation';
import { PATIENT_TOPICS } from '@/lib/patient-topics';
import { hospitalContext } from '@/lib/hospital';
import SubSiteChrome from '@/components/SubSiteChrome';
import PatientTopicBody from '@/components/pages/PatientTopicBody';

export const revalidate = 60;

async function resolve(params) {
  const { slug, topic } = await params;
  const entry = PATIENT_TOPICS[topic];
  if (!entry) return null;
  const ctx = await hospitalContext(slug);
  if (!ctx) return null;
  const page = (ctx.content.pages || []).find((p) => p.slug === topic && p.published !== false);
  return { ...ctx, entry, page };
}

export async function generateMetadata({ params }) {
  const found = await resolve(params);
  if (!found) return { title: 'Page not found' };
  return { title: `${found.entry.title} · Kinder ${found.loc.name}`, description: found.entry.intro };
}

export default async function HospitalPatientTopicPage({ params }) {
  const found = await resolve(params);
  if (!found) notFound();
  const { content, loc, slug, base, data, entry, page } = found;
  return (
    <SubSiteChrome content={content} loc={loc} slug={slug} sections={data.sections} privacyHref={data.privacyHref}>
      <PatientTopicBody entry={entry} page={page} base={base} loc={loc} />
    </SubSiteChrome>
  );
}
