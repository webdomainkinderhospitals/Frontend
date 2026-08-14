// Compact hero used by every inner corporate page: breadcrumb, eyebrow,
// title and intro over the brand gradient, in the site's design language.
export default function PageHero({ crumb, eyebrow, titleHtml, intro }) {
  return (
    <section className="page-hero">
      <div className="container">
        <nav className="crumbs" aria-label="Breadcrumb">
          <a href="/">Home</a>
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
