import ContentPages from '@/components/ContentPages';
import LeadershipTeam from '@/components/LeadershipTeam';
import { groupLeaders } from '@/lib/leadership.mjs';
import Accreditations from '@/components/Accreditations';
import { HubProse } from '@/components/Hub';
import { getContent } from '@/lib/api';
import SiteChrome from '@/components/SiteChrome';
import styles from './about.module.css';

export const revalidate = 60;

export const metadata = {
  title: 'About Us · Kinder Hospitals',
  description:
    "The Kinder Medical Group story — from Singapore's largest paediatric group to a women's & children's healthcare network across India and Singapore.",
};

const MILESTONES = [
  ['2000', 'Kinder Clinic founded in Singapore — grows into one of its largest paediatric group practices.'],
  ['2011', 'Kinder Cherthala opens: the first NABH-accredited women & children hospital in Alappuzha.'],
  ['2018', 'Kinder Hospitals Kochi opens — a 125-bed multispeciality hospital, now with 35 specialities.'],
  ['2022', "Kinder Bengaluru opens in Whitefield — now among Bangalore's best-known IVF centres."],
  ['2023', "Kinder Cherthala opens its women's & children's clinic in Alappuzha town."],
  ['Today', '5 centres · 6,00,000+ women treated · 18,000+ births · 1,500+ IVF successes.'],
];

// The brand book's philosophy, edited in the admin under Site Settings →
// Brand philosophy. These are the words it ships with.
const BRAND = {
  brandVision: 'To be a trusted healthcare partner offering compassionate, advanced, and affordable care.',
  brandMission:
    'To make available high-quality, personalised care with specialised and comprehensive range of services, in a cost-effective health care facility in India at par with international standards.',
  brandValues: 'Compassion\nIntegrity\nExcellence\nInnovation\nAccessibility',
  brandMark:
    "The red form represents a mother, symbolising love, care, protection and nurturing, while the blue form represents a child, reflecting innocence, trust and the promise of a healthy future. Together, the two forms create a warm and distinctive symbol of the unbreakable bond between mother and child, embodying Kinder Hospitals' commitment to nurturing life with compassion and care.",
  brandCoreIdea: 'A caring presence protecting and nurturing life.',
};

const VALUE_ICONS = {
  compassion: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />,
  integrity: <><path d="m11 17 2 2a1 1 0 1 0 3-3" /><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.9-3.9a2 2 0 0 0-2.8 0l-.9.9a1 1 0 1 1-3-3l2.8-2.8a3.8 3.8 0 0 1 4.6-.6l.5.3a2 2 0 0 0 1.5.2L21 4" /><path d="m21 3 1 11h-2" /><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" /><path d="M3 4h8" /></>,
  excellence: <><circle cx="12" cy="9" r="6" /><path d="m9 14.5-1.5 7L12 19l4.5 2.5-1.5-7" /><path d="m9.5 9 1.8 1.8L14.5 7.5" /></>,
  innovation: <><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2Z" /></>,
  accessibility: <><circle cx="12" cy="4" r="2" /><path d="M5 8h14" /><path d="M12 8v6" /><path d="m8 21 4-7 4 7" /></>,
};

function brandOf(settings = {}) {
  const pick = (key) => String(settings[key] || '').trim() || BRAND[key];
  return {
    vision: pick('brandVision'),
    mission: pick('brandMission'),
    values: pick('brandValues').split(/\\n|\n/).map((v) => v.trim()).filter(Boolean),
    mark: pick('brandMark'),
    coreIdea: pick('brandCoreIdea'),
  };
}

export default async function AboutPage() {
  const content = await getContent();
  const brand = brandOf(content.settings);
  // The group's leaders (centre leaders appear on their centre's page). The
  // About Kinder Hospitals and Mission pages are already this page's story
  // and purpose, so only other About Us pages are listed at the end.
  const leaders = groupLeaders(content.pages || []);
  const SHOWN = new Set(['about-us-about-kinder-hospitals', 'about-us-mission-vision-values']);
  const morePages = (content.pages || []).filter((p) => p.category === 'About Us' && !SHOWN.has(p.slug));
  return (
    <SiteChrome content={content}>
      <main className={styles.about}>
        <section className={styles.hero}>
          <div className="container">
            <nav className={styles.breadcrumb} aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">About us</span></nav>
            <div className={styles.heroGrid}>
              <div>
                <span className={styles.eyebrow}>THE KINDER MEDICAL GROUP</span>
                <h1>Expert care.<br /><em>A kinder touch.</em></h1>
                <p>A women&apos;s and children&apos;s healthcare network built on one promise: world-class care, delivered with kindness, close to home.</p>
                <div className={styles.heroActions}><a href="#story" className="btn btn-primary">Discover our story <span aria-hidden="true">↗</span></a><a href="/#hospitals" className={styles.textLink}>Find a Kinder hospital <span aria-hidden="true">→</span></a></div>
                <span className={styles.legal}>A unit of Kindorama Healthcare Pvt Ltd</span>
              </div>
              <aside className={styles.brandPanel} aria-label="The Kinder philosophy">
                <span className={styles.panelLabel}>OUR CORE IDEA</span>
                <svg className={styles.heart} viewBox="0 0 120 110" fill="none" aria-hidden="true"><path d="M60 96 17 55C-12 25 30-9 60 23 90-9 132 25 103 55Z" stroke="currentColor" strokeWidth="2"/><path d="M30 55h15l8-17 14 35 9-18h15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <h2>{brand.coreIdea}</h2>
                <div className={styles.panelFooter}><span>Rooted in Singapore</span><span>Connected by care</span></div>
              </aside>
            </div>
          </div>
        </section>
        <nav className={styles.sectionNav} aria-label="Explore About Us"><div className="container">
          {[['story', 'Our story'], ['vision', 'Our purpose'], ['milestones', 'Our journey'], ['leadership', 'Leadership'], ['accreditations', 'Accreditations'], ['quality', 'Quality & safety'], ['csr', 'CSR'], ['academics', 'Academics']].map(([id, label], i) => <a key={id} href={`#${id}`}><span>0{i + 1}</span>{label}<span aria-hidden="true">↗</span></a>)}
        </div></nav>

        <section id="story" className={styles.story}>
          <div className="container">
            <div className="hosp-about-grid">
              <div className="hosp-about-text">
                <span className="section-eyebrow">Our story</span>
                <h2 className="section-title">From one clinic to <em>a growing network</em></h2>
                <p>
                  Kinder began in Singapore in 2000 and grew into one of its largest paediatric
                  group practices. In 2011 we brought that experience home to Kerala, opening the
                  first NABH-accredited women &amp; children hospital in Alappuzha. Today the group
                  has hospitals across Kerala, in Bengaluru and in Singapore — every centre
                  practising under shared protocols, clinical audit and governance.
                </p>
                <p>
                  Our focus has never changed: comprehensive, personalised maternity, fertility,
                  neonatology and paediatric care at affordable cost, to all strata of society.
                </p>
              </div>
              <ul className={`hosp-highlights ${styles.highlights}`}>
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

        <section id="vision" className={styles.purpose}>
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-eyebrow">Brand philosophy</span>
                <h2 className="section-title">Kindness at the heart of <em>everything we do</em></h2>
              </div>
            </div>
            <div className={styles.philosophy}>
              <div className="value-card">
                <span className={styles.cardNumber}>01 / THE FUTURE WE SEE</span><h3>Our Vision</h3>
                <p>{brand.vision}</p>
              </div>
              <div className="value-card">
                <span className={styles.cardNumber}>02 / THE WORK WE DO</span><h3>Our Mission</h3>
                <p>{brand.mission}</p>
              </div>
            </div>
            <div className={styles.values}>
              <span className={styles.cardNumber}>03 / WHAT GUIDES US · CORE VALUES</span>
              <ul>
                {brand.values.map((value) => (
                  <li key={value}>
                    <span className={styles.valueIcon} aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        {VALUE_ICONS[value.toLowerCase()] || <circle cx="12" cy="12" r="5" />}
                      </svg>
                    </span>
                    {value}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.mark}>
              <div className={styles.markLogo}>
                <img src={content.settings.logoUrl || '/logo.png'} alt="The Kinder Hospitals brand mark" width="540" height="276" loading="lazy" />
              </div>
              <div>
                <span className={styles.cardNumber}>04 / OUR BRAND MARK</span>
                <h3>A mother and child, together</h3>
                <p>{brand.mark}</p>
                <p className={styles.coreIdea}><span>Core idea</span>{brand.coreIdea}</p>
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
            <ol className={styles.journey}>
              {MILESTONES.map(([year, text]) => (
                <li key={year}>
                  <span className="timeline-year">{year}</span>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="leadership" className={styles.leadership}>
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-eyebrow">Leadership</span>
                <h2 className="section-title">Chairman&apos;s <em>message</em></h2>
              </div>
            </div>
            {/* The chairman's message: his portrait beside the quote, signed */}
            <figure className={styles.chairman}>
              <div className={styles.chairmanPhoto}>
                <img src="/leadership/dr-v-k-pradeep-kumar.webp" alt="Dr. V K Pradeep Kumar, Chairman, Kinder Medical Group" width={760} height={866} loading="lazy" />
                <span className={styles.chairmanBadge}>Chairman</span>
              </div>
              <blockquote className={styles.chairmanQuote}>
                <span className={styles.quoteMark} aria-hidden="true">“</span>
                <p>
                  When we started Kinder, we made one promise — that every mother and every child
                  who walks through our doors is treated the way we would treat our own family.
                  Five centres later, that promise has not changed. <strong>Kindness is not our slogan;
                  it is our clinical standard.</strong>
                </p>
                <figcaption className={styles.signature}>
                  <span className={styles.signLine} aria-hidden="true" />
                  <span>
                    <strong>Dr. V K Pradeep Kumar</strong>
                    <small>Chairman, Kinder Medical Group · Kindorama Healthcare Pvt Ltd</small>
                  </span>
                </figcaption>
              </blockquote>
            </figure>
            {leaders.length > 0 && <>
              <div className={styles.teamHead}>
                <span className="section-eyebrow">Our leadership team</span>
                <h3>The people who lead <em>Kinder Hospitals</em></h3>
              </div>
              <LeadershipTeam leaders={leaders} />
            </>}
          </div>
        </section>

        <section id="accreditations" style={{ background: 'var(--bg-soft)' }}>
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-eyebrow">Accreditations &amp; certifications</span>
                <h2 className="section-title">Standards we are <em>held to</em></h2>
                <p className="hosp-section-intro">Accreditation is an outside audit of how we actually work — protocols, infection control, records, consent and outcomes. Certificates for each centre are displayed at its reception and available on request.</p>
              </div>
            </div>
            <Accreditations />
          </div>
        </section>

        <HubProse id="quality" eyebrow="Quality &amp; patient safety" title={<>One standard of care, <em>every centre</em></>}
          intro="Our centres work to shared clinical protocols with audit and clinical governance across the group, so the care a family receives does not depend on which Kinder hospital they walk into."
          points={[
            'Shared clinical protocols across all centres',
            'Clinical audit and governance review',
            'Infection-control and hand-hygiene programmes',
            'Informed consent before every procedure',
            'Incident reporting, with learning shared across the group',
            'Patient feedback reviewed by each centre\u2019s management',
          ]}>
          <p><a className="view-all" href="/patients/patient-rights">Patient rights &amp; responsibilities →</a></p>
        </HubProse>

        <HubProse id="csr" eyebrow="CSR" soft title={<>Care beyond <em>our walls</em></>}
          intro="Kinder teams run health camps, screening drives and awareness programmes in the communities around our centres, often with schools, local bodies and partner organisations. Centres publish the camps they are running under news and events."
          points={['Community health and screening camps', 'Awareness drives on maternal and child health', 'School and community education sessions', 'Support for families who need help accessing care']}>
          <p><a className="view-all" href="/news">See camps &amp; events →</a></p>
        </HubProse>

        <HubProse id="academics" eyebrow="Academics" title={<>Teaching, <em>training, research</em></>}
          intro="Structured teaching sessions, case discussions and skills training run alongside clinical work, and our consultants supervise trainees and visiting clinicians. For academic collaborations or observerships, write to our team."
          points={['Structured teaching and case discussions', 'Skills and simulation training for clinical teams', 'Observerships and supervised training by arrangement', 'Academic collaboration enquiries welcome']}>
          <p><a className="view-all" href="/contact">Enquire about academics →</a></p>
        </HubProse>

        <ContentPages title="More about Kinder Hospitals" pages={morePages} />
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
