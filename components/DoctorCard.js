import { slugify } from '@/lib/services';
import { locationsOf } from '@/lib/locations';

// The one doctor card used across the corporate site and every hospital
// sub-site. Server-safe (no hooks) so it can render anywhere.

const book = (name) =>
  'https://api.whatsapp.com/send?phone=919446654500&text=' +
  encodeURIComponent(`Hello Kinder Hospitals, I would like to book an appointment with ${name}.`);

export function initials(name) {
  return (name || '')
    .replace(/^(Brigadier|Brig\.?|Dr\.?|\(Dr\.\))\s*/gi, '')
    .replace(/[()]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .filter((c) => /[A-Za-z]/.test(c))
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function DoctorCard({ doc, compact = false, hideHospitals = false, servicePages = [] }) {
  const locs = locationsOf(doc);
  const profile = `/doctors/${slugify(doc.name)}`;
  const specSlug = doc.speciality ? slugify(doc.speciality) : '';
  const specHref = specSlug && servicePages.includes(specSlug) ? `/services/${specSlug}` : null;

  return (
    <article className={`dcard${compact ? ' dcard-compact' : ''}`}>
      <a className="dcard-media" href={profile} aria-label={`View profile of ${doc.name}`}>
        <span className="dcard-initials" aria-hidden="true">{initials(doc.name)}</span>
        {doc.imageUrl && (
          <span className="dcard-photo" style={{ backgroundImage: `url('${doc.imageUrl}')` }} role="img" aria-label={doc.name}></span>
        )}
        {!hideHospitals && (
          <span className="dcard-badges">
            {locs.length ? (
              locs.map((n) => (
                <span className="dcard-badge" key={n}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                  {n}
                </span>
              ))
            ) : (
              <span className="dcard-badge dcard-badge-all">All centres</span>
            )}
          </span>
        )}
      </a>
      <div className="dcard-body">
        {doc.speciality && (
          specHref
            ? <a className="dcard-spec" href={specHref}>{doc.speciality}</a>
            : <span className="dcard-spec">{doc.speciality}</span>
        )}
        <h4 className="dcard-name"><a href={profile}>{doc.name}</a></h4>
        {doc.designation && <p className="dcard-role">{doc.designation}</p>}
        {doc.bio && !compact && <p className="dcard-bio">{doc.bio}</p>}
        <div className="dcard-actions">
          <a className="dcard-btn dcard-btn-primary" href={book(doc.name)} target="_blank" rel="noopener">
            {compact ? 'Book' : 'Book appointment'}
          </a>
          <a className="dcard-btn" href={profile}>{compact ? 'Profile' : 'View profile'}</a>
        </div>
      </div>
    </article>
  );
}
