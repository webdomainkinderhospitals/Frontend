export default function Stats({ settings }) {
  const stats = settings.stats || [];

  return (
    <section className="overview">
      <div className="container">
        <div className="overview-grid">
          <div className="overview-img">
            <img
              src="https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?auto=format&fit=crop&w=1000&q=80"
              alt="Mother and baby at Kinder Hospital"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="overview-text">
            <span className="section-eyebrow">Welcome to Kinder Medical Group</span>
            <h2 className="section-title">
              A network built on <em>kindness, trust &amp; expertise</em>.
            </h2>
            <p>
              Kinder Medical Group — a unit of <strong>Kindorama Healthcare Pvt Ltd</strong> — has
              grown from one of Singapore&apos;s largest paediatric groups into a regional
              healthcare network focused on women&apos;s and children&apos;s health. We operate
              across India and Singapore, with a clear vision: world-class care, close to home.
            </p>
            <p>
              In India, our centres in <strong>Cherthala (2011)</strong>,{' '}
              <strong>Kochi (2018)</strong>, <strong>Bengaluru (2022)</strong>, and{' '}
              <strong>Alappuzha (2023)</strong> uphold international standards — providing
              comprehensive, personalised maternity, IVF, neonatology, and paediatric care at
              affordable cost, to all strata of society.
            </p>
            <div className="stats-row">
              {stats.map((stat, i) => (
                <div className="stat" key={i}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
