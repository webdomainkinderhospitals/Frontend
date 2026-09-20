import { locationSectionsFor } from '@/lib/site-tree';

const WHATSAPP_BOOK =
  'https://api.whatsapp.com/send?phone=919446654500&text=' +
  encodeURIComponent('Hello Kinder Hospitals, I would like to book an appointment.');

// Compact footer for a hospital sub-website: this centre's details only,
// plus the corporate-site link. No other hospitals are listed here.
export default function SubSiteFooter({ loc, settings, slug, sections = {}, privacyHref = '/policies/privacy-policy' }) {
  const home = `/hospitals/${slug}`;
  const book = String(loc.bookingUrl || '').trim() || WHATSAPP_BOOK;
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
            <h5>On this centre</h5>
            <a href={home}>Home</a>
            <a href={`${home}#about`}>About this centre</a>
            {locationSectionsFor(sections).map((section) => (
              <a key={section.label} href={`${home}${section.hash}`}>{section.label}</a>
            ))}
            <a href={book} target="_blank" rel="noopener">Book an appointment →</a>
            <a href={privacyHref}>Privacy Policy</a>
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
