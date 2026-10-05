import { specialityIconUrl } from '@/lib/speciality-icons.mjs';

// The homepage's signature services, in the same deep-blue band as a
// hospital's departments: each icon in a glass badge with the logo's red dot,
// turning white with the brand colours when hovered or tapped.
//
// [title, one line about it, page it opens, icon from the hospital's icon set]
const SERVICES = [
  ['Obstetrics', 'First scan to delivery, with fetal medicine and high-risk pregnancy care', '/services/obstetrics', 'gynaecology'],
  ['Maternity', 'Birth-friendly labour suites and painless delivery options', '/services/maternity', 'mother-child'],
  ['Infertility & IVF', 'ART-certified IVF lab — IVF, IUI and ICSI', '/services/ivf', 'reproductive-medicine'],
  ['Neonatology', 'Level III NICU with neonatal transport', '/services/neonatology', 'neonatology'],
  ['Paediatrics', 'From vaccinations to PICU care and paediatric surgery', '/services/paediatrics', 'paediatrics'],
  ['Gynaecology & Laparoscopy', "Minimally invasive surgery and women's health", '/services/gynecology-and-laparoscopic-surgery', 'womens-health'],
  ['Fetal Medicine', 'Advanced fetal scans, anomaly detection and counselling', '/services/fetal-medicine', 'fetomaternal-medicine'],
  ['Plastic & Cosmetic Surgery', 'Reconstructive and aesthetic procedures', '/services/plastic-and-cosmetic-surgery', 'plastic-surgery'],
  ['24/7 Emergency & Diagnostics', 'Round-the-clock emergency, ambulance and diagnostics', '/contact', 'emergency-medicine'],
];

export default function CoeGrid() {
  return (
    <section id="services" className="dept-section coe-section">
      <div className="dept-band coe-band">
        <div className="container dept-band-in">
          <div className="dept-head">
            <span className="section-eyebrow">Our Specialities</span>
            <h2 className="section-title">Comprehensive care, <em>delivered with kindness</em></h2>
            <p className="coe-lead">
              Nine signature services where Kinder has built deep expertise — from your first antenatal
              visit to your child&apos;s first steps, and everything in between.
            </p>
          </div>
          <ul className="coe-badges">
            {SERVICES.map(([title, text, href, icon]) => (
              <li key={title}>
                <a className="dept-item coe-item" href={href}>
                  <span className="dept-badge" aria-hidden="true">
                    <span className="dept-ico" style={{ '--ico': `url(${specialityIconUrl(title, icon)})` }} />
                  </span>
                  <span className="dept-name">{title}</span>
                  <span className="coe-text">{text}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="coe-actions">
            <a href="/services" className="coe-all">View all specialities <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </div>
    </section>
  );
}
