import ContentPages from '@/components/ContentPages';
import { notFound } from 'next/navigation';
import { getContent } from '@/lib/api';
import { findLocationBySlug } from '@/lib/locations';
import { hospitalData } from '@/lib/hospital';

import WhatsAppFloat from '@/components/WhatsAppFloat';
import ScrollEffects from '@/components/ScrollEffects';
import HospitalPage from '@/components/HospitalPage';
import SubSiteHeader from '@/components/SubSiteHeader';
import SubSiteFooter from '@/components/SubSiteFooter';
import KinderChat from '@/components/KinderChat';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const content = await getContent();
  const loc = findLocationBySlug(content.locations, slug);
  if (!loc) return { title: 'Kinder Hospitals' };
  return {
    title: `Kinder ${loc.name} — ${loc.city}, ${loc.country} · Kinder Hospitals`,
    description: loc.tagline || loc.address,
  };
}

export default async function HospitalDetail({ params }) {
  const { slug } = await params;
  const content = await getContent();
  const loc = findLocationBySlug(content.locations, slug);
  if (!loc) notFound();

  const data = hospitalData(content, loc);

  return (
    <>
      <SubSiteHeader loc={loc} settings={content.settings} slug={slug} sections={data.sections} />
      <HospitalPage
        loc={loc}
        hospitalSlug={slug}
        carePages={data.carePages}
        specialities={data.specialities}
        centreSpecific={data.centreSpecific}
        servicePages={data.servicePages}
        doctors={data.doctors}
        procedures={data.procedures}
        testimonials={data.testimonials}
        news={data.news}
        settings={content.settings}
      />
      <ContentPages title="Information for your visit" pages={data.infoPages} />
      <SubSiteFooter loc={loc} settings={content.settings} slug={slug} sections={data.sections} privacyHref={data.privacyHref} />
      <WhatsAppFloat />
      <KinderChat content={content} />
      <ScrollEffects />
    </>
  );
}
