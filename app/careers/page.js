import { getContent } from '@/lib/api';
import SiteChrome from '@/components/SiteChrome';
import PageHero from '@/components/PageHero';
import ContentPages from '@/components/ContentPages';
import { HubProse, HubCta } from '@/components/Hub';

export const revalidate = 60;

export const metadata = {
  title: 'Careers · Kinder Hospitals',
  description: 'Current openings and life at Kinder — clinical, nursing and support roles across our centres in India and Singapore.',
};

export default async function CareersPage() {
  const content = await getContent();
  const openings = (content.pages || []).filter((p) => p.published !== false && /careers|openings|recruitment/i.test(p.category));
  const email = content.settings.email || '';
  const apply = `mailto:${email}?subject=${encodeURIComponent('Application — Kinder Hospitals')}`;

  return (
    <SiteChrome content={content}>
      <main>
        <PageHero
          crumb="Careers"
          eyebrow="Careers"
          titleHtml="Build your career <em>around kindness</em>"
          intro="Clinicians, nurses, allied health and support teams across five centres in India and Singapore."
        />

        <section id="openings">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-eyebrow">Current openings</span>
                <h2 className="section-title">Roles <em>open now</em></h2>
              </div>
              <a className="view-all" href={apply}>Send your CV →</a>
            </div>
            {openings.length === 0 && (
              <p className="muted">
                We are not advertising specific vacancies on the site at the moment. We do keep CVs on
                file for clinical, nursing and allied health roles — send yours to{' '}
                <a href={apply}>{email}</a> with the role and centre you are interested in.
              </p>
            )}
          </div>
        </section>
        {openings.length > 0 && <ContentPages title="Current openings" pages={openings} locations={content.locations} />}

        <HubProse id="life" eyebrow="Life at Kinder" title={<>What it is like <em>to work here</em></>} soft
          intro="Kinder is a women's and children's healthcare network — a unit of Kindorama Healthcare Pvt Ltd — with centres in Kerala, Bengaluru and Singapore. Teams work to shared clinical protocols and governance across every centre."
          points={[
            'Shared protocols, audit and clinical governance across all centres',
            'Multi-speciality teams: obstetrics, neonatology, paediatrics, fertility, surgery and allied health',
            'Structured academics and teaching sessions',
            'Opportunities across Kerala, Bengaluru and Singapore',
          ]} />

        <HubCta
          title="Interested in joining us?"
          text="Send your CV with the role and the centre you have in mind — our HR team will take it from there."
          href={apply}
          label="Email your CV"
          external={false}
        />
      </main>
    </SiteChrome>
  );
}
