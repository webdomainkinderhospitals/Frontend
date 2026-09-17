import { getContent } from '@/lib/api';
import { slugOfLocation } from '@/lib/locations';
import SiteChrome from '@/components/SiteChrome';
import PageHero from '@/components/PageHero';
import { HubProse, HubTiles, HubCta, whatsapp } from '@/components/Hub';

export const revalidate = 60;

export const metadata = {
  title: 'International Patients · Kinder Hospitals',
  description: 'Planning treatment at a Kinder centre from abroad — enquiries, estimates, travel and stay, and the care team who will look after you.',
};

const STEPS = [
  { title: '1 · Send us your reports', text: 'Share your medical reports and what you are seeking treatment for. Our team routes them to the right specialist.', cta: 'Start an enquiry' },
  { title: '2 · Opinion & estimate', text: 'You receive a clinical opinion and an indicative estimate for the treatment and expected length of stay.' },
  { title: '3 · Travel & arrival', text: 'We share the documents you need for a medical visa and help you plan dates around the treatment schedule.' },
  { title: '4 · Treatment & follow-up', text: 'A coordinator stays with you through admission, treatment and discharge, and arranges remote follow-up once you are home.' },
];

export default async function InternationalPatientsPage() {
  const content = await getContent();
  const centres = (content.locations || []).filter((l) => l.international || l.country !== 'India');
  const email = content.settings.email || '';

  return (
    <SiteChrome content={content}>
      <main>
        <PageHero
          crumb="International Patients"
          eyebrow="International Patients"
          titleHtml="Coming to us <em>from abroad</em>"
          intro="Kinder began in Singapore and treats families from across borders. One coordinator stays with you from your first email to your follow-up at home."
        />

        <HubTiles eyebrow="How it works" title={<>From first email <em>to follow-up</em></>} items={STEPS.map((s) => ({
          ...s,
          href: s.cta ? whatsapp('Hello Kinder Hospitals, I am an international patient and would like an opinion.') : undefined,
          external: true,
        }))} />

        <HubProse eyebrow="What we help with" soft title={<>Practical help, <em>arranged for you</em></>}
          intro="Tell us what you need and we will organise it around your treatment dates."
          points={[
            'Clinical opinion on reports sent ahead of travel',
            'Indicative treatment estimate and expected length of stay',
            'Documentation for a medical visa',
            'Appointments scheduled around your arrival',
            'Interpreter support where we can arrange it',
            'Remote follow-up after you return home',
          ]} />

        {centres.length > 0 && (
          <HubTiles eyebrow="Our international presence" title={<>Where you <em>can be seen</em></>} items={centres.map((loc) => ({
            title: `Kinder ${loc.name}`,
            text: loc.tagline || loc.address,
            href: `/hospitals/${slugOfLocation(loc)}`,
            cta: 'Visit this centre',
          }))} />
        )}

        <HubCta
          title="Planning treatment from outside India?"
          text={`Send your reports to ${email} or message us — we will come back with an opinion and an estimate.`}
          href={whatsapp('Hello Kinder Hospitals, I am an international patient planning treatment.')}
          label="Start your enquiry"
        />
      </main>
    </SiteChrome>
  );
}
