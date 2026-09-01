import { notFound } from 'next/navigation';
import { getContent } from '@/lib/api';
import { allServices } from '@/lib/services';
import { centreCatalogue } from '@/lib/centreSpecialities';

import WhatsAppFloat from '@/components/WhatsAppFloat';
import ScrollEffects from '@/components/ScrollEffects';
import HospitalPage from '@/components/HospitalPage';
import SubSiteHeader from '@/components/SubSiteHeader';
import SubSiteFooter from '@/components/SubSiteFooter';
import KinderChat from '@/components/KinderChat';

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
  // Every sub-site shows a Specialities menu. Priority: admin-entered
  // specialities tagged to this centre, then the shipped centre catalogue
  // (e.g. Kochi's facility tabs), then the group-wide list.
  const ownSpecialities = content.specialities.filter(at);
  const catalogue = ownSpecialities.length ? null : centreCatalogue(slug);
  const specialities = ownSpecialities.length
    ? ownSpecialities
    : catalogue
      ? []
      : allServices(content.specialities).map((s) => ({ name: s.name, description: s.description }));
  const doctors = content.doctors.filter(at);
  const procedures = content.procedures.filter(at);
  const testimonials = content.testimonials.filter(at);
  const news = content.news.filter(at);

  const sections = {
    specialities: specialities.length > 0 || !!catalogue,
    doctors: doctors.length > 0,
    procedures: procedures.length > 0,
    testimonials: testimonials.length > 0,
    news: news.length > 0,
  };

  return (
    <>
      <SubSiteHeader loc={loc} settings={content.settings} slug={slug} sections={sections} />
      <HospitalPage loc={loc} slug={slug} specialities={specialities} catalogue={catalogue} centreSpecific={ownSpecialities.length > 0 || !!catalogue} servicePages={allServices(content.specialities).map((s) => s.slug)} doctors={doctors} procedures={procedures} testimonials={testimonials} news={news} settings={content.settings} />
      <SubSiteFooter loc={loc} settings={content.settings} slug={slug} />
      <WhatsAppFloat />
      <KinderChat content={content} />
      <ScrollEffects />
    </>
  );
}
