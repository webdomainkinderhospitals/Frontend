import { notFound } from 'next/navigation';
import { getContent } from '@/lib/api';
import { slugify } from '@/lib/services';
import SiteChrome from '@/components/SiteChrome';
import DoctorProfileBody from '@/components/pages/DoctorProfileBody';

export const revalidate = 60;

const findDoctor = (doctors, slug) => doctors.find((d) => slugify(d.name) === slug);

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const content = await getContent();
  const doc = findDoctor(content.doctors, slug);
  if (!doc) return { title: 'Our Doctors · Kinder Hospitals' };
  return {
    title: `${doc.name} · Kinder Hospitals`,
    description: doc.bio || [doc.designation, doc.speciality].filter(Boolean).join(' · '),
  };
}

export default async function DoctorProfilePage({ params }) {
  const { slug } = await params;
  const content = await getContent();
  const doc = findDoctor(content.doctors, slug);
  if (!doc) notFound();
  return (
    <SiteChrome content={content}>
      <DoctorProfileBody doc={doc} content={content} />
    </SiteChrome>
  );
}
