import { getContent } from '@/lib/api';
import { groupServices, slugify } from '@/lib/services';
import { carePageHref, isCarePage } from '@/lib/care-content.mjs';
import { hospitalSlugForPage } from '@/lib/locations';
import SiteChrome from '@/components/SiteChrome';
import PageHero from '@/components/PageHero';
import { HubTiles, HubProse, HubCta, whatsapp } from '@/components/Hub';

export const revalidate = 60;

export const metadata = {
  title: 'Celebrate Pregnancy · Kinder Hospitals',
  description: 'Your pregnancy journey at Kinder — antenatal care, birthing options, classes and support, from the first scan to going home.',
};

const JOURNEY = [
  { title: 'Planning & early pregnancy', text: 'Pre-pregnancy checks, confirming your pregnancy and your first consultation with an obstetrician.', href: '/packages', cta: 'See pre-pregnancy checks' },
  { title: 'Antenatal care', text: 'Scheduled scans, screening and consultations through all three trimesters, with fetal medicine support where it is needed.', href: '/services/fetal-medicine', cta: 'Fetal medicine' },
  { title: 'Labour & delivery', text: 'Birthing options, pain relief and a birth plan discussed with your team well before your due date.', href: '#birthing', cta: 'Birthing options', },
  { title: 'After your baby arrives', text: 'Neonatal care, lactation support and paediatric follow-up under the same roof.', href: '/services/neonatology', cta: 'Neonatal care' },
];

export default async function CelebratePregnancyPage() {
  const content = await getContent();
  const pages = (content.pages || []).filter((p) => p.published !== false);

  // Birthing and maternity content published for any centre.
  const birthing = pages
    .filter((p) => isCarePage(p) && /birth|labour|labor|maternity|obstetric/i.test(`${p.title} ${p.excerpt}`))
    .map((p) => ({
      title: p.title,
      text: p.excerpt,
      href: carePageHref(p, hospitalSlugForPage(p, content.locations)),
      cta: 'Explore this service',
    }));

  const maternity = groupServices(content.specialities).find((g) => g.id === 'maternity');
  const services = (maternity?.items || []).map((item) => ({
    title: item.name,
    text: item.description || 'Speak with our maternity team about this service at your nearest centre.',
    href: `/services/${slugify(item.name)}`,
    cta: 'About this speciality',
  }));

  return (
    <SiteChrome content={content}>
      <main>
        <PageHero
          crumb="Celebrate Pregnancy"
          eyebrow="Celebrate Pregnancy"
          titleHtml="Every pregnancy deserves <em>to be celebrated</em>"
          intro="From your first scan to your baby's first vaccines — the care, the classes and the people around you at every step."
        />

        <HubTiles id="journey" eyebrow="Your journey" title={<>Care at <em>every stage</em></>} items={JOURNEY} />

        {birthing.length > 0 && (
          <HubTiles id="birthing" eyebrow="Birthing options" title={<>Where and how <em>you give birth</em></>} soft
            intro="Birthing services published by our centres. Each opens as its own page with what to expect and who to speak to."
            items={birthing} />
        )}

        <HubProse id="support" eyebrow="Classes & support" title={<>You are <em>not doing this alone</em></>}
          intro="Antenatal classes, lactation support, nutrition and physiotherapy run alongside your clinical care. Availability differs by centre — our coordinators will tell you what is running near you."
          points={['Antenatal (ANC) classes', 'Lactation support', 'Dietetics & nutrition', 'Physiotherapy', 'Birth-companion support where offered', 'Paediatric follow-up after discharge']}
          soft={birthing.length === 0} />

        {services.length > 0 && (
          <HubTiles eyebrow="Maternity specialities" title={<>The team behind <em>your pregnancy</em></>} items={services} soft />
        )}

        <HubCta
          title="Planning your pregnancy care?"
          text="Tell us your due date and your city — we will help you book with the right obstetrician."
          href={whatsapp('Hello Kinder Hospitals, I would like to plan my pregnancy care.')}
          label="Talk to our maternity team"
        />
      </main>
    </SiteChrome>
  );
}
