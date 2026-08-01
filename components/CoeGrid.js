const SERVICES = [
  ['Obstetrics', 'From your first scan to delivery — expert obstetric care backed by fetal medicine and high-risk pregnancy management.'],
  ['Maternity', 'Birth-friendly labour suites, painless delivery options, and a Kinder Jananimitra package designed for joyful motherhood.'],
  ['Infertility & IVF', 'ART-certified IVF lab offering the full spectrum — IVF, IUI, ICSI — with affordable packages and high success rates.'],
  ['Neonatology', 'Level III NICU with neonatal transport — gentle, expert care for premature and critically ill newborns.'],
  ['Paediatrics', 'From routine vaccinations to PICU care, paediatric surgery, and specialist referrals — your child in safe hands.'],
  ['Gynaecology & Laparoscopy', "Minimally invasive gynaecological surgery, women's health screening, and post-menopausal care."],
  ['Fetal Medicine', 'Advanced foetal scanning, anomaly detection, and counselling — peace of mind through every trimester.'],
  ['Plastic & Cosmetic Surgery', 'Reconstructive and cosmetic procedures — from post-natal recovery to aesthetic enhancements.'],
  ['24/7 Emergency & Diagnostics', 'Round-the-clock emergency, ambulance services, and advanced diagnostics — accessible whenever you need them.'],
];

export default function CoeGrid() {
  return (
    <section id="services">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="section-eyebrow">Our Services</span>
            <h2 className="section-title">
              Comprehensive care, <em>delivered with kindness</em>
            </h2>
            <p className="section-intro">
              Nine signature services where Kinder has built deep expertise — from your first ANC
              visit to your child&apos;s first steps, and everything in between.
            </p>
          </div>
          <a href="#specialities" className="view-all">View All Services →</a>
        </div>
        <div className="coe-grid">
          {SERVICES.map(([title, text]) => (
            <div className="coe-card" key={title}>
              <div className="coe-content">
                <h3>{title}</h3>
                <p>{text}</p>
                <a href="#specialities">Know More →</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
