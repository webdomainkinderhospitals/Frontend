export default function Support() {
  return (
    <section className="support">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="section-eyebrow">Our Facilities</span>
            <h2 className="section-title">
              Round-the-clock <em>support, every step</em>
            </h2>
            <p className="section-intro">
              From Level III NICU to ART-certified IVF labs and modular OTs — every facility at
              Kinder is built for safety, comfort, and outcomes that families can trust.
            </p>
          </div>
        </div>
        <div className="support-grid">
          <div className="support-card">
            <div className="support-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2a5 5 0 0 0-5 5v3a7 7 0 1 0 10 0V7a5 5 0 0 0-5-5zM9 21h6" /></svg>
            </div>
            <h4>NICU – Level 3</h4>
            <p>Advanced neonatal intensive care for premature and critically ill newborns — the 1st in Alappuzha.</p>
          </div>
          <div className="support-card">
            <div className="support-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 12h2l3-9 4 18 3-9h6" /></svg>
            </div>
            <h4>PICU &amp; Surgical ICU</h4>
            <p>Pediatric intensive care unit and surgical ICU — for the youngest and most complex cases.</p>
          </div>
          <div className="support-card">
            <div className="support-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2L4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4z" /><circle cx="12" cy="10" r="2" /></svg>
            </div>
            <h4>ART-Certified IVF Lab</h4>
            <p>Modular IVF laboratory meeting India&apos;s ART certification — the 1st in Alappuzha.</p>
          </div>
          <div className="support-card">
            <div className="support-icon support-icon-image">
              <img src="/nabh-badge.png" alt="NABH Accredited — Patient Safety & Quality of Care" width="84" height="84" loading="lazy" />
            </div>
            <h4>NABH Accredited</h4>
            <p>Proudly NABH and Nursing Excellence accredited — quality &amp; safety you can verify.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
