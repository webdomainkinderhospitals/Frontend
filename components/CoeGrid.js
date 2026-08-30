// [title, text, page it opens]
const SERVICES = [
  ['Obstetrics', 'From your first scan to delivery — expert obstetric care backed by fetal medicine and high-risk pregnancy management.', '/services/obstetrics'],
  ['Maternity', 'Birth-friendly labour suites, painless delivery options, and a Kinder Jananimitra package designed for joyful motherhood.', '/services/maternity'],
  ['Infertility & IVF', 'ART-certified IVF lab offering the full spectrum — IVF, IUI, ICSI — with affordable packages and high success rates.', '/services/ivf'],
  ['Neonatology', 'Level III NICU with neonatal transport — gentle, expert care for premature and critically ill newborns.', '/services/neonatology'],
  ['Paediatrics', 'From routine vaccinations to PICU care, paediatric surgery, and specialist referrals — your child in safe hands.', '/services/paediatrics'],
  ['Gynaecology & Laparoscopy', "Minimally invasive gynaecological surgery, women's health screening, and post-menopausal care.", '/services/gynecology-and-laparoscopic-surgery'],
  ['Fetal Medicine', 'Advanced foetal scanning, anomaly detection, and counselling — peace of mind through every trimester.', '/services/fetal-medicine'],
  ['Plastic & Cosmetic Surgery', 'Reconstructive and cosmetic procedures — from post-natal recovery to aesthetic enhancements.', '/services/plastic-and-cosmetic-surgery'],
  ['24/7 Emergency & Diagnostics', 'Round-the-clock emergency, ambulance services, and advanced diagnostics — accessible whenever you need them.', '/contact'],
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
          <a href="/services" className="view-all">View All Services →</a>
        </div>
        <div className="coe-grid">
          {SERVICES.map(([title, text, href]) => (
            <a className="coe-card" href={href} key={title} aria-label={`${title} — know more`}>
              <div className="coe-content">
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="coe-more">Know More →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
