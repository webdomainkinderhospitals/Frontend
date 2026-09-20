import { notFound } from 'next/navigation';
import { getContent } from '@/lib/api';
import { findService } from '@/lib/services';
import SiteChrome from '@/components/SiteChrome';
import ServiceBody from '@/components/pages/ServiceBody';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const content = await getContent();
  const svc = findService(content.specialities, slug);
  if (!svc) return { title: 'Services · Kinder Hospitals' };
  return {
    title: `${svc.name} · Kinder Hospitals`,
    description: svc.description || `${svc.name} — ${svc.group.title} care across the Kinder network.`,
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const content = await getContent();
  const svc = findService(content.specialities, slug);
  if (!svc) notFound();
  return (
    <SiteChrome content={content}>
      <ServiceBody svc={svc} content={content} />
    </SiteChrome>
  );
}
