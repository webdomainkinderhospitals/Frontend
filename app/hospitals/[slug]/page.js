import ContentPages from '@/components/ContentPages';
import { notFound } from 'next/navigation';
import { getContent } from '@/lib/api';
import { centreName, findLocationBySlug } from '@/lib/locations';
import { kochiFeaturePages } from '@/lib/kochi-features.mjs';
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
    title: `${centreName(loc)} — ${loc.city}, ${loc.country} · Kinder Hospitals`,
    description: loc.tagline || loc.address,
  };
}

export default async function HospitalDetail({ params }) {
  const { slug } = await params;
  const content = await getContent();
  const loc = findLocationBySlug(content.locations, slug);
  if (!loc) notFound();

  const data = hospitalData(content, loc);
  // Pregnancy Club Membership opens the WOW MOM pregnancy club page when it is
  // published, else the centre's Celebrate Pregnancy hub; with neither, the
  // card opens a WhatsApp enquiry instead.
  const features = kochiFeaturePages(content.pages, loc.name);
  const club = features.find((f) => f.slug === 'kochi-wow-mom');
  const pregnancyClubHref = club
    ? club.href
    : features.some((f) => f.group === 'Celebrate Pregnancy') ? `/hospitals/${slug}/celebrate-pregnancy` : '';

  return (
    <>
      <SubSiteHeader loc={loc} settings={content.settings} slug={slug} sections={data.sections} locations={content.locations} />
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
        pregnancyClubHref={pregnancyClubHref}
        featurePages={content.pages}
      />
      <ContentPages title="Information for your visit" pages={data.infoPages} base={`/hospitals/${slug}`} />
      <SubSiteFooter loc={loc} settings={content.settings} slug={slug} sections={data.sections} privacyHref={data.privacyHref} />
      <WhatsAppFloat />
      <KinderChat content={content} />
      <ScrollEffects />
    </>
  );
}
