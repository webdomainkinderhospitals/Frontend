// Compact hero used by every inner page: breadcrumb, eyebrow, title and intro
// over the brand gradient. On a hospital sub-site the trail starts at that
// centre rather than the corporate home, so a visitor is never offered a way
// out of the site they are reading.
export default function PageHero({
  crumb,
  eyebrow,
  titleHtml,
  intro,
  homeHref = '/',
  homeLabel = 'Home',
  trail = [],
}) {
  return (
    <section className="page-hero">
      <div className="container">
        <nav className="crumbs" aria-label="Breadcrumb">
          <a href={homeHref}>{homeLabel}</a>
          {trail.map((step) => (
            <span key={step.label} style={{ display: 'contents' }}>
              <span aria-hidden="true">›</span>
              <a href={step.href}>{step.label}</a>
            </span>
          ))}
          <span aria-hidden="true">›</span>
          <span>{crumb}</span>
        </nav>
        {eyebrow && <span className="hero-eyebrow">{eyebrow}</span>}
        <h1 className="page-hero-title" dangerouslySetInnerHTML={{ __html: titleHtml }} />
        {intro && <p className="page-hero-intro">{intro}</p>}
      </div>
    </section>
  );
}
