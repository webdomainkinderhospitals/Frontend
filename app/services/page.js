import { getContent } from '@/lib/api';
import SiteChrome from '@/components/SiteChrome';
import PageHero from '@/components/PageHero';

export const revalidate = 60;

export const metadata = {
  title: 'Services · Kinder Hospitals',
  description: 'Maternity, fertility & IVF, children’s care and allied wellness services across the Kinder network.',
};

const WHATSAPP =
  'https://api.whatsapp.com/send?phone=919446654500&text=' +
  encodeURIComponent('Hello Kinder Hospitals, I would like to know more about a service.');

const CATEGORIES = [
  {
    id: 'maternity',
    title: 'Maternity & Pregnancy',
    intro: 'From your first scan to your baby’s first vaccines — one seamless journey.',
    items: ['Obstetrics', 'Maternity', 'High Risk Pregnancy', 'Mother & Child Care Programme', 'Fetal Medicine', 'Labor & Delivery Pain Management', 'Lactation Support', 'ANC Classes'],
  },
  {
    id: 'fertility',
    title: 'Fertility & Gynaecology',
    intro: 'ART-certified IVF laboratories and senior fertility specialists.',
    items: ['Infertility Treatment', 'IVF', 'IUI', 'ICSI', 'Gynecology & Laparoscopic Surgery', 'Reproductive Medicine', 'Gynaec Oncology', "Women's Wellness"],
  },
  {
    id: 'children',
    title: "Children's Care",
    intro: 'From Level III NICU intensive care to everyday paediatrics.',
    items: ['Paediatrics', 'General Paediatrics', 'Paediatric Surgery', 'Neonatology', 'Pediatric Intensivist (PICU)', 'Pediatric Anesthesia', 'Pediatric Nephrology', 'Audiology & Speech Therapy'],
  },
  {
    id: 'allied',
    title: 'Allied & Wellness',
    intro: 'Complete care for the whole family, under one roof.',
    items: ['General Medicine', 'General Surgery', 'Dermatology & Cosmetology', 'Orthopaedics & Sports Med', 'Plastic & Cosmetic Surgery', 'General ENT', 'Anesthesiology & Pain', 'Dietetics & Nutrition', 'Physiotherapy'],
  },
];

export default async function ServicesPage() {
  const content = await getContent();
  return (
    <SiteChrome content={content}>
      <main>
        <PageHero
          crumb="Services"
          eyebrow="What We Do"
          titleHtml="Every speciality, <em>one promise of kindness</em>"
          intro="Comprehensive women's and children's healthcare — maternity, fertility, neonatology, paediatrics and allied specialities across all Kinder centres."
        />

        {CATEGORIES.map((cat, idx) => (
          <section key={cat.id} id={cat.id} style={idx % 2 ? { background: 'var(--bg-soft)' } : undefined}>
            <div className="container">
              <div className="section-head">
                <div>
                  <span className="section-eyebrow">{cat.title}</span>
                  <h2 className="section-title">{cat.title}</h2>
                  <p className="section-intro">{cat.intro}</p>
                </div>
              </div>
              <div className="svc-grid">
                {cat.items.map((item) => (
                  <a key={item} className="svc-card" href={WHATSAPP} target="_blank" rel="noopener">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                    <span>{item}</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        ))}

        <section className="hosp-cta-wrap">
          <div className="container">
            <div className="cta-strip">
              <div>
                <h3>Need a specialist?</h3>
                <p>Our care coordinators will guide you to the right department and doctor.</p>
              </div>
              <a href={WHATSAPP} target="_blank" rel="noopener" className="btn btn-primary">Book an Appointment →</a>
            </div>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
