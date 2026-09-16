import ContentPages from '@/components/ContentPages';
import { getContent } from '@/lib/api';
import SiteChrome from '@/components/SiteChrome';
import PageHero from '@/components/PageHero';

export const revalidate = 60;

export const metadata = {
  title: 'Health Packages · Kinder Hospitals',
  description: 'Explore Kinder hospital maternity and health check-up packages, inclusions and eligibility.',
};

const wa = (msg) =>
  'https://api.whatsapp.com/send?phone=919446654500&text=' + encodeURIComponent(msg);

export default async function PackagesPage() {
  const content = await getContent();
  const procedures = content.procedures || [];
  return (
    <SiteChrome content={content}>
      <main>
        <PageHero
          crumb="Packages"
          eyebrow="Health Packages"
          titleHtml="Care packages for <em>every stage of life</em>"
          intro="Explore package details, included services and eligibility. Our team can help you choose the right care."
        />

        <ContentPages title="Our care packages" pages={(content.pages || []).filter((p) => p.category === 'Packages')} />
        {!(content.pages || []).some((p) => p.category === 'Packages') && <section><div className="container"><p>Please contact our team for available packages, current prices and eligibility.</p></div></section>}

        {procedures.length > 0 && (
          <section style={{ background: 'var(--bg-soft)' }}>
            <div className="container">
              <div className="section-head">
                <div>
                  <span className="section-eyebrow">Signature procedures</span>
                  <h2 className="section-title">Advanced care, <em>done kindly</em></h2>
                </div>
              </div>
              <div className="hosp-proc-grid">
                {procedures.map((proc, i) => (
                  <article className="hosp-proc-card" key={proc.id ?? i}>
                    <h4>{proc.name}</h4>
                    <p>{proc.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="hosp-cta-wrap">
          <div className="container">
            <div className="cta-strip">
              <div>
                <h3>Which package fits you?</h3>
                <p>Tell us your needs — our coordinators will recommend the right tier and centre.</p>
              </div>
              <a href={wa('Hello Kinder Hospitals, please help me choose a health package.')} target="_blank" rel="noopener" className="btn btn-primary">
                Get Guidance →
              </a>
            </div>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
