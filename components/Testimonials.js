export default function Testimonials({ testimonials = [] }) {
  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="section-eyebrow">Patient Stories</span>
            <h2 className="section-title">
              What our patients <em>are saying</em>
            </h2>
            <p className="section-intro">
              Our patients are our best advocates — hear inspiring stories of treatment journeys
              and the kinder care that made the difference.
            </p>
          </div>
          <a href="#testimonials" className="view-all">View All Stories →</a>
        </div>
        <div className="testi-grid">
          {testimonials.map((t, i) => (
            <div className="testi-card" key={t.id ?? i}>
              <div
                className="testi-video"
                style={{
                  backgroundImage: t.imageUrl
                    ? `url('${t.imageUrl}'), var(--mesh-card)`
                    : 'var(--mesh-card)',
                }}
              >
                <div className="play-btn">
                  <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                </div>
              </div>
              <div className="testi-content">
                <p>&ldquo;{t.quote}&rdquo;</p>
                <div className="testi-author">
                  <strong>{t.patientName}</strong>
                  <span>{t.relation}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
