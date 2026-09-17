// Small building blocks shared by the tree's hub pages (Patients Portal,
// Health Library, Find Care, Careers, Media & Press …) so each route stays a
// short, readable description of its own content.

export function HubTiles({ id, eyebrow, title, intro, items = [], soft = false, columns }) {
  if (!items.length) return null;
  return (
    <section id={id} style={soft ? { background: 'var(--bg-soft)' } : undefined}>
      <div className="container">
        {(title || eyebrow) && (
          <div className="section-head">
            <div>
              {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
              {title && <h2 className="section-title">{title}</h2>}
              {intro && <p className="hosp-section-intro">{intro}</p>}
            </div>
          </div>
        )}
        <div className="editorial-grid" style={columns ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` } : undefined}>
          {items.map((item) => (
            <article className="editorial-card" key={item.title}>
              {item.tag && <span className="section-eyebrow">{item.tag}</span>}
              <h3>{item.href ? <a href={item.href} {...(item.external ? { target: '_blank', rel: 'noopener' } : {})}>{item.title}</a> : item.title}</h3>
              <p>{item.text}</p>
              {item.href && (
                <a className="view-all" href={item.href} {...(item.external ? { target: '_blank', rel: 'noopener' } : {})}>
                  {item.cta || 'Read more'} →
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HubProse({ id, eyebrow, title, intro, points = [], children, soft = false }) {
  return (
    <section id={id} style={soft ? { background: 'var(--bg-soft)' } : undefined}>
      <div className="container">
        <div className="hosp-about-grid">
          <div className="hosp-about-text">
            {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
            {title && <h2 className="section-title">{title}</h2>}
            {intro && <p>{intro}</p>}
            {children}
          </div>
          {points.length > 0 && (
            <ul className="hosp-highlights">
              {points.map((point) => (
                <li key={point}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                  {point}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export function HubCta({ title, text, href, label, external = true }) {
  return (
    <section className="hosp-cta-wrap">
      <div className="container">
        <div className="cta-strip">
          <div>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
          <a href={href} className="btn btn-primary" {...(external ? { target: '_blank', rel: 'noopener' } : {})}>{label} →</a>
        </div>
      </div>
    </section>
  );
}

export const whatsapp = (message) =>
  'https://api.whatsapp.com/send?phone=919446654500&text=' + encodeURIComponent(message);
