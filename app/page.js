import { featureMenuPages } from '@/lib/kochi-features.mjs';
import { getContent } from '@/lib/api';
import { slugOfLocation } from '@/lib/locations';

import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import HomeHero from '@/components/HomeHero';
import styles from './home.module.css';
import QuickBar from '@/components/QuickBar';
import PromoBanner from '@/components/PromoBanner';
import { promoSlides } from '@/lib/promo';
import Stats from '@/components/Stats';
import CelebratePregnancy from '@/components/CelebratePregnancy';
import CoeGrid from '@/components/CoeGrid';
import Doctors from '@/components/Doctors';
import Procedures from '@/components/Procedures';
import Care from '@/components/Care';
import Support from '@/components/Support';
import Testimonials from '@/components/Testimonials';
import News from '@/components/News';
import Accreditations from '@/components/Accreditations';
import Locations from '@/components/Locations';
import Footer from '@/components/Footer';
import KinderChat from '@/components/KinderChat';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import ScrollEffects from '@/components/ScrollEffects';
import HomeInteractions from '@/components/HomeInteractions';

export const revalidate = 60;

export default async function HomePage() {
  const content = await getContent();
  const { settings, specialities, locations, doctors, testimonials, news, procedures } = content;

  return (
    <>
      <TopBar settings={settings} locations={locations} />
      <Header settings={settings} locations={locations} specialities={specialities} pages={featureMenuPages(content.pages)} />
      <main className={styles.home}>
      <HomeHero settings={settings} locations={locations} />
      <QuickBar />
      <PromoBanner slides={promoSlides(settings, 'homePromo')} label="Kinder Hospitals announcements" />
      <Stats
        settings={settings}
        hospitals={(locations || []).map((loc) => ({ slug: slugOfLocation(loc), name: loc.name }))}
      />
      <CelebratePregnancy pages={content.pages} />
      <CoeGrid />
      <Doctors doctors={doctors} locations={locations} />
      <Procedures procedures={procedures} />
      <Care />
      <Support />
      <Testimonials testimonials={testimonials} />
      <News news={news} />
      <Accreditations />
      <Locations locations={locations} />
      </main>
      <Footer settings={settings} locations={locations} />
      <KinderChat content={content} />
      <WhatsAppFloat />
      <HomeInteractions />
      <ScrollEffects />
    </>
  );
}
