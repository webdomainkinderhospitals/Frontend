import ContentPages from '@/components/ContentPages';
import PageHero from '@/components/PageHero';
import { atLocation } from '@/lib/locations';

const wa = (msg) =>
  'https://api.whatsapp.com/send?phone=919446654500&text=' + encodeURIComponent(msg);

// Packages and signature procedures. On a centre's sub-site this narrows to
// what that centre offers, and every link stays inside the sub-site.
export default function PackagesBody({ content, base = '', loc = null }) {
  const here = loc ? loc.name : '';
  const at = (item) => !loc || atLocation(item, loc.name) || !String(item.location || '').trim();
  const procedures = (content.procedures || []).filter(at);
  const packagePages = (content.pages || []).filter((p) => p.category === 'Packages' && at(p));

  return (
    <main>
      <PageHero
        crumb="Packages"
        eyebrow={loc ? `Health Packages · Kinder ${here}` : 'Health Packages'}
        titleHtml="Care packages for <em>every stage of life</em>"
        homeHref={base || '/'}
        homeLabel={loc ? `Kinder ${here}` : 'Home'}
        trail={loc ? [{ label: 'Patient services', href: `${base}#patient-services` }] : []}
        intro={
          loc
            ? `Package details, included services and eligibility at Kinder ${here}. Our team here can help you choose the right care.`
            : 'Explore package details, included services and eligibility. Our team can help you choose the right care.'
        }
      />

      <ContentPages title="Our care packages" pages={packagePages} base={base} locations={content.locations} />
      {packagePages.length === 0 && (
        <section><div className="container">
          <p>
            Please contact our team{loc ? ` at Kinder ${here}` : ''} for available packages,
            current prices and eligibility.
          </p>
        </div></section>
      )}

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
              <p>
                {loc && loc.phone
                  ? `Call ${loc.phone} and our coordinators at Kinder ${here} will recommend the right tier.`
                  : 'Tell us your needs — our coordinators will recommend the right tier and centre.'}
              </p>
            </div>
            <a
              href={wa(`Hello Kinder Hospitals, please help me choose a health package${loc ? ` at Kinder ${here}` : ''}.`)}
              target="_blank"
              rel="noopener"
              className="btn btn-primary"
            >
              Get Guidance →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
