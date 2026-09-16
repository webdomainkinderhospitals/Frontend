import { locationLabel } from '@/lib/locations';
export default function ContentPages({ pages = [], title = 'Helpful information' }) {
  if (!pages.length) return null;
  return <section className="editorial-section"><div className="container">
    <div className="section-head"><h2 className="section-title">{title}</h2></div>
    <div className="editorial-grid">{pages.map((page) => <article key={page.id} className="editorial-card">
      <span className="section-eyebrow">{page.category}</span>
      <h3><a href={`/information/${page.slug}`}>{page.title}</a></h3>
      {page.location && <small>{locationLabel(page)}</small>}
      <p>{page.excerpt}</p>
      <a href={`/information/${page.slug}`} className="view-all">Read more →</a>
    </article>)}</div>
  </div></section>;
}
