import { notFound } from 'next/navigation';
import { hospitalContext } from '@/lib/hospital';
import { bookingDoctors, centreOf } from '@/lib/booking-data';
import { centreName } from '@/lib/locations';
import SubSiteChrome from '@/components/SubSiteChrome';
import PageHero from '@/components/PageHero';
import BookingPage from '@/components/booking/BookingPage';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const ctx = await hospitalContext(slug);
  if (!ctx) return { title: 'Page not found' };
  return {
    title: `Book an Appointment · ${centreName(ctx.loc)}`,
    description: `Choose a doctor at ${centreName(ctx.loc)} and a preferred day, and send your appointment request to our care team.`,
  };
}

// A centre's own booking page: only its doctors, inside its own site.
export default async function HospitalBookPage({ params }) {
  const { slug } = await params;
  const ctx = await hospitalContext(slug);
  if (!ctx) notFound();
  const { content, loc, base, data } = ctx;
  const title = centreName(loc);
  return (
    <SubSiteChrome content={content} loc={loc} slug={slug} sections={data.sections} privacyHref={data.privacyHref}>
      <main>
        <PageHero
          crumb="Book an appointment"
          eyebrow={title}
          titleHtml="Book an <em>appointment</em>"
          homeHref={base}
          homeLabel={title}
          intro={`Choose your doctor at ${title} and a day that suits you. Our care coordinators call you to confirm the time.`}
        />
        <BookingPage doctors={bookingDoctors(content, loc)} fixedCentre={centreOf(loc)} />
      </main>
    </SubSiteChrome>
  );
}
