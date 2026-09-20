import PageHero from '@/components/PageHero';
import ContentBody from '@/components/ContentBody';
import { HubProse, HubCta, whatsapp } from '@/components/Hub';

// One patient-services topic (insurance, visitor guidelines, patient rights…).
// Rendered on the corporate site and inside every centre's sub-site, where the
// wording points at that centre's own desk.
export default function PatientTopicBody({ entry, page, base = '', loc = null }) {
  const here = loc ? loc.name : '';
  return (
    <main>
      <PageHero
        crumb={entry.title}
        eyebrow={loc ? `${entry.eyebrow} · Kinder ${here}` : entry.eyebrow}
        titleHtml={entry.title}
        homeHref={base || '/'}
        homeLabel={loc ? `Kinder ${here}` : 'Home'}
        trail={[{ label: 'Patient services', href: loc ? `${base}#patient-services` : '/patients' }]}
        intro={page?.excerpt || entry.intro}
      />
      {page?.body ? (
        <section><div className="container"><article className="editorial-body">
          <ContentBody text={page.body} />
        </article></div></section>
      ) : (
        <HubProse eyebrow="What to know" title={<>The essentials, <em>in short</em></>} points={entry.points}>
          <p>
            {loc
              ? `For anything specific to your admission at Kinder ${here}, ask the front desk here or message our coordinators — they will confirm it for you.`
              : 'Details differ between our centres. For anything specific to your admission, ask the front desk at your centre or message our coordinators — they will confirm it for you.'}
          </p>
          <p>
            <a className="view-all" href={loc ? `${base}#patient-services` : '/patients'}>
              {loc ? `Back to patient services at Kinder ${here}` : 'Back to the patients portal'} →
            </a>
          </p>
        </HubProse>
      )}
      <HubCta
        title={loc ? `Need this confirmed for Kinder ${here}?` : 'Need this confirmed for your centre?'}
        text="Our coordinators answer on WhatsApp, and can put you through to the desk that handles it."
        href={whatsapp(loc ? `${entry.ask} (Kinder ${here})` : entry.ask)}
        label="Ask our team"
      />
    </main>
  );
}
