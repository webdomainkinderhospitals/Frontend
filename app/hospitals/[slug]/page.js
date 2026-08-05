import { notFound } from 'next/navigation';
import { getContent } from '@/lib/api';

import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import ScrollEffects from '@/components/ScrollEffects';
import HospitalPage from '@/components/HospitalPage';

export const revalidate = 60;

export function slugOf(loc) {
  return (
    loc.slug ||
    String(loc.name || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const content = await getContent();
  const loc = content.locations.find((l) => slugOf(l) === slug);
  if (!loc) return { title: 'Kinder Hospitals' };
  return {
    title: `Kinder ${loc.name} — ${loc.city}, ${loc.country} · Kinder Hospitals`,
    description: loc.tagline || loc.address,
  };
}

export default async function HospitalDetail({ params }) {
  const { slug } = await params;
  const content = await getContent();
  const loc = content.locations.find((l) => slugOf(l) === slug);
  if (!loc) notFound();

  const at = (item) => (item.location || '').toLowerCase() === (loc.name || '').toLowerCase();
  const doctors = content.doctors.filter(at);
  const procedures = content.procedures.filter(at);
  const testimonials = content.testimonials.filter(at);
  const news = content.news.filter(at);
  const others = content.locations.filter((l) => slugOf(l) !== slug);

  return (
    <>
      <TopBar settings={content.settings} locations={content.locations} />
      <Header settings={content.settings} locations={content.locations} />
      <HospitalPage loc={loc} doctors={doctors} procedures={procedures} testimonials={testimonials} news={news} others={others} settings={content.settings} />
      <Footer settings={content.settings} locations={content.locations} />
      <WhatsAppFloat />
      <ScrollEffects />
    </>
  );
}
