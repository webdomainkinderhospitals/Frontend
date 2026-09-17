import { locationLabel, hospitalSlugForPage } from '@/lib/locations';
import { carePageHref, isCarePage } from '@/lib/care-content.mjs';

export default function ContentPages({ pages = [], title = 'Helpful information', locations = [] }) {
  if (!pages.length) return null;
  // A care page lives on its hospital's sub-site; everything else on the
  // corporate information shelf.
  const href = (page) => carePageHref(page, isCarePage(page) ? hospitalSlugForPage(page, locations) : '');
  return <section className="editorial-section"><div className="container">
    <div className="section-head"><h2 className="section-title">{title}</h2></div>
    <div className="editorial-grid">{pages.map((page) => <article key={page.id} className="editorial-card">
      <span className="section-eyebrow">{page.category}</span>
      <h3><a href={href(page)}>{page.title}</a></h3>
      {page.location && <small>{locationLabel(page)}</small>}
      <p>{page.excerpt}</p>
      <a href={href(page)} className="view-all">Read more →</a>
    </article>)}</div>
  </div></section>;
}
