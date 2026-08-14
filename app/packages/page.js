import { getContent } from '@/lib/api';
import SiteChrome from '@/components/SiteChrome';
import PageHero from '@/components/PageHero';

export const revalidate = 60;

export const metadata = {
  title: 'Health Packages · Kinder Hospitals',
  description: 'Kinder Jananimitra maternity package, health check-ups and procedures — from ₹1,550 onwards.',
};

const wa = (msg) =>
  'https://api.whatsapp.com/send?phone=919446654500&text=' + encodeURIComponent(msg);

const PACKAGES = [
  {
    id: 'jananimitra',
    name: 'Kinder Jananimitra Package',
    tag: 'Maternity',
    text: "Comprehensive pregnancy package — from your first scan to your baby's first vaccines, with fixed transparent pricing.",
  },
  {
    id: 'comprehensive',
    name: 'Comprehensive Health Check-Up',
    tag: 'Full body',
    text: 'Complete screening with consultations, lab work and imaging — your annual health picture in one visit.',
  },
  {
    id: 'wellwomen',
    name: 'Well Women Health Check-Up',
    tag: "Women's health",
    text: 'Tailored screening for women — gynaecology consult, breast screening, hormones and more.',
  },
  {
    id: 'prepregnancy',
    name: 'Pre-Pregnancy Health Check-Up',
    tag: 'Planning',
    text: 'Plan parenthood with confidence — fertility assessment and pre-conception screening for couples.',
  },
];

export default async function PackagesPage() {
  const content = await getContent();
  const procedures = content.procedures || [];
  return (
    <SiteChrome content={content}>
      <main>
        <PageHero
          crumb="Packages"
          eyebrow="Health Packages"
          titleHtml="Transparent packages, <em>from ₹1,550 onwards</em>"
          intro="Silver, Golden and Platinum tiers across our centres — fixed pricing, senior consultants, no surprises."
        />

        <section id="checkup">
          <div className="container">
            <div className="pkg-grid">
              {PACKAGES.map((p) => (
                <article className="pkg-card" key={p.id} id={p.id}>
                  <span className="pkg-tag">{p.tag}</span>
                  <h3>{p.name}</h3>
                  <p>{p.text}</p>
                  <a
                    className="btn btn-primary"
                    href={wa(`Hello Kinder Hospitals, I would like to know more about the ${p.name}.`)}
                    target="_blank"
                    rel="noopener"
                  >
                    Enquire on WhatsApp →
                  </a>
                </article>
              ))}
            </div>
            <p className="pkg-tiers" id="tiers">
              <strong>Silver · Golden · Platinum tiers</strong> — every package is available in
              tiers starting from ₹1,550, so you choose the depth of screening that fits.
            </p>
          </div>
        </section>

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
