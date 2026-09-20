import { notFound } from 'next/navigation';
import { getContent } from '@/lib/api';
import { PATIENT_TOPICS } from '@/lib/patient-topics';
import SiteChrome from '@/components/SiteChrome';
import PatientTopicBody from '@/components/pages/PatientTopicBody';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { topic } = await params;
  const entry = PATIENT_TOPICS[topic];
  return entry ? { title: `${entry.title} · Kinder Hospitals`, description: entry.intro } : { title: 'Page not found' };
}

export default async function PatientTopicPage({ params }) {
  const { topic } = await params;
  const entry = PATIENT_TOPICS[topic];
  if (!entry) notFound();
  const content = await getContent();
  // A page published in the CMS under this slug replaces the group-wide copy.
  const page = (content.pages || []).find((p) => p.slug === topic && p.published !== false);
  return (
    <SiteChrome content={content}>
      <PatientTopicBody entry={entry} page={page} />
    </SiteChrome>
  );
}
