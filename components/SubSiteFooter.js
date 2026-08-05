// Compact footer for a hospital sub-website: this centre's details only,
// plus the corporate-site link. No other hospitals are listed here.
export default function SubSiteFooter({ loc, settings, slug }) {
  const home = `/hospitals/${slug}`;
  return (
    <footer className="subsite-footer" id="contact">
      <div className="container">
        <div className="subsite-footer-grid">
          <div>
            <img src={settings.logoUrl || '/logo.png'} alt="Kinder" className="subsite-footer-logo" />
            <h4>Kinder {loc.name}</h4>
            {loc.tagline && <p className="subsite-footer-tag">{loc.tagline}</p>}
            <p className="subsite-footer-addr">{loc.address}</p>
          </div>
          <div>
            <h5>Contact</h5>
            {loc.phone && <a href={`tel:${loc.phone.replace(/\s/g, '')}`}>{loc.phone}</a>}
            {loc.email && <a href={`mailto:${loc.email}`}>{loc.email}</a>}
            {loc.mapUrl && (
              <a href={loc.mapUrl} target="_blank" rel="noopener">Directions →</a>
            )}
            {loc.website && (
              <a href={loc.website} target="_blank" rel="noopener">
                {loc.websiteLabel || 'Official website →'}
              </a>
            )}
          </div>
          <div>
            <h5>Quick links</h5>
            <a href={home}>Home</a>
            <a href={`${home}#about`}>About this centre</a>
            <a href={`${home}#contact`}>Contact</a>
            <a href="/" className="subsite-footer-corp">Kinder Medical Group — Corporate Website →</a>
          </div>
        </div>
        <div className="subsite-footer-bottom">
          <span>© {new Date().getFullYear()} {settings.siteName || 'Kinder Hospitals'} · Kinder {loc.name}</span>
          <span>A unit of Kindorama Healthcare Pvt Ltd</span>
        </div>
      </div>
    </footer>
  );
}
