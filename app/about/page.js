import { getContent } from '@/lib/api';
import SiteChrome from '@/components/SiteChrome';
import PageHero from '@/components/PageHero';

export const revalidate = 60;

export const metadata = {
  title: 'About Us · Kinder Hospitals',
  description:
    "The Kinder Medical Group story — from Singapore's largest paediatric group to a women's & children's healthcare network across India and Singapore.",
};

const MILESTONES = [
  ['2000', 'Kinder Clinic founded in Singapore — grows into one of its largest paediatric group practices.'],
  ['2011', 'Kinder Cherthala opens: the first NABH-accredited women & children hospital in Alappuzha.'],
  ['2018', 'Kinder Kochi opens — a 125-bed multispeciality hospital with 25 specialities in Edappally.'],
  ['2022', "Kinder Bengaluru opens in Whitefield — now among Bangalore's best-known IVF centres."],
  ['2023', "Kinder Women's & Children's Clinic opens in Alappuzha town."],
  ['Today', '5 centres · 6,00,000+ women treated · 18,000+ births · 1,500+ IVF successes.'],
];

export default async function AboutPage() {
  const content = await getContent();
  return (
    <SiteChrome content={content}>
      <main>
        <PageHero
          crumb="About Us"
          eyebrow="The Kinder Medical Group"
          titleHtml="Kindness, from Singapore <em>to every tiny heartbeat</em>"
          intro="A unit of Kindorama Healthcare Pvt Ltd — a women's and children's healthcare network built on one promise: world-class care, delivered with kindness, close to home."
        />

        <section id="story">
          <div className="container">
            <div className="hosp-about-grid">
              <div className="hosp-about-text">
                <span className="section-eyebrow">Our story</span>
                <h2 className="section-title">From one clinic to <em>five centres</em></h2>
                <p>
                  Kinder began in Singapore in 2000 and grew into one of its largest paediatric
                  group practices. In 2011 we brought that experience home to Kerala, opening the
                  first NABH-accredited women &amp; children hospital in Alappuzha. Today the group
                  spans Cherthala, Kochi, Bengaluru, Alappuzha and Singapore — every centre
                  practising under shared protocols, clinical audit and governance.
                </p>
                <p>
                  Our focus has never changed: comprehensive, personalised maternity, fertility,
                  neonatology and paediatric care at affordable cost, to all strata of society.
                </p>
              </div>
              <ul className="hosp-highlights">
                {[
                  'NABH accredited · Nursing Excellence',
                  '5 centres across India & Singapore',
                  '6,00,000+ women treated',
                  '18,000+ births delivered',
                  '1,500+ IVF successes',
                  '60+ senior consultants',
                ].map((h) => (
                  <li key={h}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="vision" style={{ background: 'var(--bg-soft)' }}>
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-eyebrow">Vision &amp; Mission</span>
                <h2 className="section-title">Kindness at the heart of <em>everything we do</em></h2>
              </div>
            </div>
            <div className="value-grid">
              <div className="value-card">
                <h4>Our Vision</h4>
                <p>To be the most trusted women's and children's healthcare network in the region — where every family receives international-standard care with genuine warmth.</p>
              </div>
              <div className="value-card">
                <h4>Our Mission</h4>
                <p>Comprehensive, personalised maternity, IVF, neonatology and paediatric care at affordable cost — upholding international protocols in every city we serve.</p>
              </div>
              <div className="value-card">
                <h4>Our Values</h4>
                <p>Kindness first. Clinical excellence. Honesty with every family. One standard of care across every Kinder centre.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="milestones">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-eyebrow">Milestones</span>
                <h2 className="section-title">A growing family <em>since 2000</em></h2>
              </div>
            </div>
            <ol className="timeline">
              {MILESTONES.map(([year, text]) => (
                <li key={year}>
                  <span className="timeline-year">{year}</span>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="leadership" style={{ background: 'var(--bg-soft)' }}>
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-eyebrow">Leadership</span>
                <h2 className="section-title">Chairman&apos;s <em>message</em></h2>
              </div>
            </div>
            <blockquote className="chairman-quote">
              <p>
                “When we started Kinder, we made one promise — that every mother and every child
                who walks through our doors is treated the way we would treat our own family.
                Five centres later, that promise has not changed. Kindness is not our slogan;
                it is our clinical standard.”
              </p>
              <footer>
                <strong>Dr. Pradeep Kumar V.K</strong>
                <span>Chairman, Kinder Medical Group</span>
              </footer>
            </blockquote>
          </div>
        </section>

        <section className="hosp-cta-wrap">
          <div className="container">
            <div className="cta-strip">
              <div>
                <h3>Experience the Kinder standard</h3>
                <p>Find your nearest centre or talk to our care coordinators today.</p>
              </div>
              <a href="/#hospitals" className="btn btn-primary">Find Your Nearest Hospital →</a>
            </div>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
