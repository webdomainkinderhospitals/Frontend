const CARE_ITEMS = [
  {
    title: 'Kinder Jananimitra',
    text: "Comprehensive maternity package — antenatal scans, classes, normal/C-section delivery, post-natal care & baby's first vaccines.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" /><path d="M12 11v.01M12 14v3" /></svg>
    ),
  },
  {
    title: 'Insurance & Cashless',
    text: 'Empanelled with all major insurers and TPAs — cashless admissions handled smoothly by our dedicated insurance desk.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" /><path d="M9 12l2 2 4-4" /></svg>
    ),
  },
  {
    title: '24/7 Emergency',
    text: "Round-the-clock emergency department, ambulance services, and neonatal transport — for moments that can't wait.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
    ),
  },
  {
    title: 'Health Check-Up Tiers',
    text: "Silver, Golden & Platinum packages from ₹1,550 — comprehensive women's wellness screenings at every life stage.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 12h6M12 9v6" /></svg>
    ),
  },
  {
    title: 'ANC Classes & Yoga',
    text: 'Antenatal classes, prenatal yoga, lactation support, and postnatal physiotherapy — for confident, joyful motherhood.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" /></svg>
    ),
  },
];

export default function Care() {
  return (
    <section className="care">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="section-eyebrow" style={{ color: 'var(--accent)' }}>
              We Provide Best Care
            </span>
            <h2 className="section-title">
              Beyond treatment, <em>a complete experience</em>
            </h2>
            <p className="section-intro">
              Specialised doctors, world-class technology, and personalised services bringing
              global standards of women&apos;s &amp; children&apos;s healthcare to every patient.
            </p>
          </div>
        </div>
        <div className="care-grid">
          {CARE_ITEMS.map((item) => (
            <div className="care-card" key={item.title}>
              <div className="care-icon">{item.icon}</div>
              <h4>{item.title}</h4>
              <p>{item.text}</p>
              <a href="https://api.whatsapp.com/send?phone=919446654500&text=Hello%20Kinder%20Hospitals%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services." target="_blank" rel="noopener">Know More →</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
