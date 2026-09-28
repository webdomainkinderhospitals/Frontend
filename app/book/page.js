import { getContent } from '@/lib/api';
import { bookingCentres, bookingDoctors } from '@/lib/booking-data';
import SiteChrome from '@/components/SiteChrome';
import PageHero from '@/components/PageHero';
import BookingPage from '@/components/booking/BookingPage';

export const revalidate = 60;

export const metadata = {
  title: 'Book an Appointment · Kinder Hospitals',
  description: 'Find a Kinder doctor by hospital, department or name, choose a preferred day, and send your appointment request on WhatsApp.',
};

export default async function BookPage() {
  const content = await getContent();
  const doctors = bookingDoctors(content);
  return (
    <SiteChrome content={content}>
      <main>
        <PageHero
          crumb="Book an appointment"
          eyebrow="Appointments"
          titleHtml="Book an <em>appointment</em>"
          intro="Find your doctor by hospital, department or name, and choose a day that suits you. Our care coordinators confirm the time with you on WhatsApp."
        />
        <BookingPage doctors={doctors} centres={bookingCentres(content, doctors)} />
      </main>
    </SiteChrome>
  );
}
