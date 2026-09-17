import { getContent } from '@/lib/api';
import { PATIENT_TOPICS } from '@/lib/patient-topics';
import SiteChrome from '@/components/SiteChrome';
import PageHero from '@/components/PageHero';
import { HubTiles, HubProse, HubCta, whatsapp } from '@/components/Hub';

export const revalidate = 60;

export const metadata = {
  title: 'Patients Portal · Kinder Hospitals',
  description: 'Everything you need around your visit — health checkup packages, insurance and TPA, patient rights, second opinions and visitor guidelines.',
};

export default async function PatientsPage() {
  const content = await getContent();
  const portalUrl = content.settings.patientPortalUrl || '';

  const items = [
    { title: 'Health Checkup Packages', text: 'Maternity, well-woman, pre-pregnancy and full-body packages, with inclusions and tiers.', href: '/packages', cta: 'See packages' },
    ...Object.entries(PATIENT_TOPICS).map(([slug, topic]) => ({
      title: topic.title, text: topic.intro, href: `/patients/${slug}`, cta: 'Read more',
    })),
  ];

  return (
    <SiteChrome content={content}>
      <main>
        <PageHero
          crumb="Patients Portal"
          eyebrow="Patients Portal"
          titleHtml="Everything around <em>your visit</em>"
          intro="Packages, insurance, your rights as a patient, second opinions and the practical rules for visiting — in one place."
        />

        <HubProse id="login" eyebrow="Patient login" title={<>Your records, <em>when you need them</em></>}
          intro={portalUrl
            ? 'Sign in to view your reports, prescriptions and appointment history.'
            : 'Online sign-in is being rolled out across our centres. Until it reaches yours, our records desk will send your reports, discharge summary or prescription to you directly — usually the same day.'}
          points={['Reports and discharge summaries', 'Prescriptions and follow-up dates', 'Appointment history at any Kinder centre']}>
          <p>
            {portalUrl
              ? <a className="btn btn-primary" href={portalUrl} target="_blank" rel="noopener">Open the patient portal →</a>
              : <a className="btn btn-primary" href={whatsapp('Hello Kinder Hospitals, I would like a copy of my medical records.')} target="_blank" rel="noopener">Request your records →</a>}
          </p>
        </HubProse>

        <HubTiles eyebrow="Before and after your visit" title={<>Practical things, <em>answered</em></>} items={items} soft />

        <HubCta
          title="Something else you need?"
          text="Billing, appointments, reports or a complaint — tell us and we will route it to the right desk."
          href={whatsapp('Hello Kinder Hospitals, I have a question about my visit.')}
          label="Message our team"
        />
      </main>
    </SiteChrome>
  );
}
