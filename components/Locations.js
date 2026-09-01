export default function Locations({ locations = [] }) {
  return (
    <section className="locations" id="hospitals">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="section-eyebrow">Our Hospitals</span>
            <h2 className="section-title">
              Multiple centres, <em>one promise of kindness</em>
            </h2>
            <p className="section-intro">
              From our first centre in Cherthala (2011) to Singapore — a growing family of
              hospitals delivering the same trusted Kinder standard wherever you are. Click any
              centre to explore its doctors, facilities and contact details.
            </p>
          </div>
        </div>
        <div className="loc-grid">
          {locations.map((loc, i) => (
            <div
              className={`loc-card${loc.international ? ' loc-international' : ''}`}
              key={loc.id ?? i}
            >
              <div
                className="loc-img"
                style={{
                  backgroundImage: loc.imageUrl
                    ? `url('${loc.imageUrl}'), var(--mesh-card)`
                    : 'var(--mesh-card)',
                }}
              ></div>
              <div className="loc-body">
                <span className={`loc-since${loc.international ? ' loc-since-intl' : ''}`}>
                  {loc.since || `${loc.city} · ${loc.country}`}
                </span>
                <h4>{loc.name}</h4>
                <p>{loc.address}</p>
                {loc.phone ? (
                  <a href={`tel:${loc.phone.replace(/\s/g, '')}`} className="loc-phone">
                    📞 {loc.phone}
                  </a>
                ) : (
                  <a href={loc.website || '#'} className="loc-phone">🌐 Visit website</a>
                )}
                <a
                  href={`/hospitals/${loc.slug || String(loc.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  className="loc-visit"
                >
                  Explore Kinder {loc.name} →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
