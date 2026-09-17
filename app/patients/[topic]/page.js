import { notFound } from 'next/navigation';
import { getContent } from '@/lib/api';
import { PATIENT_TOPICS } from '@/lib/patient-topics';
import SiteChrome from '@/components/SiteChrome';
import PageHero from '@/components/PageHero';
import ContentBody from '@/components/ContentBody';
import { HubProse, HubCta, whatsapp } from '@/components/Hub';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { topic } = await params;
  const entry = PATIENT_TOPICS[topic];
  return entry ? { title: `${entry.title} · Kinder Hospitals`, description: entry.intro } : { title: 'Page not found' };
}

export default async function PatientTopicPage({ params }) {
  const { topic } = await params;
  const entry = PATIENT_TOPICS[topic];
  if (!entry) notFound();
  const content = await getContent();
  // A page published in the CMS under this slug replaces the group-wide copy.
  const page = (content.pages || []).find((p) => p.slug === topic && p.published !== false);

  return (
    <SiteChrome content={content}>
      <main>
        <PageHero
          crumb={entry.title}
          eyebrow={entry.eyebrow}
          titleHtml={entry.title}
          intro={page?.excerpt || entry.intro}
        />
        {page?.body ? (
          <section><div className="container"><article className="editorial-body">
            <ContentBody text={page.body} />
          </article></div></section>
        ) : (
          <HubProse eyebrow="What to know" title={<>The essentials, <em>in short</em></>} points={entry.points}>
            <p>Details differ between our centres. For anything specific to your admission, ask the front desk at your centre or message our coordinators — they will confirm it for you.</p>
            <p><a className="view-all" href="/patients">Back to the patients portal →</a></p>
          </HubProse>
        )}
        <HubCta
          title="Need this confirmed for your centre?"
          text="Our coordinators answer on WhatsApp, and can put you through to the desk that handles it."
          href={whatsapp(entry.ask)}
          label="Ask our team"
        />
      </main>
    </SiteChrome>
  );
}
