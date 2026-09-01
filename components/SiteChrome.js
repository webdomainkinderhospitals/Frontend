import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import ScrollEffects from '@/components/ScrollEffects';
import KinderChat from '@/components/KinderChat';

// Standard corporate-site chrome wrapped around every inner page.
export default function SiteChrome({ content, children }) {
  return (
    <>
      <TopBar settings={content.settings} locations={content.locations} />
      <Header settings={content.settings} locations={content.locations} specialities={content.specialities} />
      {children}
      <Footer settings={content.settings} locations={content.locations} />
      <WhatsAppFloat />
      <KinderChat content={content} />
      <ScrollEffects />
    </>
  );
}
