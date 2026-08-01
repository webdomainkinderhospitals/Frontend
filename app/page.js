import { getContent } from '@/lib/api';

import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import QuickBar from '@/components/QuickBar';
import Stats from '@/components/Stats';
import CoeGrid from '@/components/CoeGrid';
import Doctors from '@/components/Doctors';
import Specialities from '@/components/Specialities';
import Procedures from '@/components/Procedures';
import Care from '@/components/Care';
import Support from '@/components/Support';
import Testimonials from '@/components/Testimonials';
import News from '@/components/News';
import Accreditations from '@/components/Accreditations';
import Locations from '@/components/Locations';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import ScrollEffects from '@/components/ScrollEffects';

export const revalidate = 60;

export default async function HomePage() {
  const content = await getContent();
  const { settings, specialities, locations, doctors, testimonials, news, procedures } = content;

  return (
    <>
      <TopBar settings={settings} locations={locations} />
      <Header settings={settings} locations={locations} />
      <Hero settings={settings} />
      <QuickBar />
      <Stats settings={settings} />
      <CoeGrid />
      <Doctors doctors={doctors} />
      <Specialities specialities={specialities} />
      <Procedures procedures={procedures} />
      <Care />
      <Support />
      <Testimonials testimonials={testimonials} />
      <News news={news} />
      <Accreditations />
      <Locations locations={locations} />
      <Footer settings={settings} locations={locations} />
      <WhatsAppFloat />
      <ScrollEffects />
    </>
  );
}
