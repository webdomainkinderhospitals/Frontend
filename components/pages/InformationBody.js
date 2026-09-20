import ContentBody from '@/components/ContentBody';
import { locationLabel } from '@/lib/locations';

// One information page (privacy policy, visit notes, anything filed in the
// Content Library). Reads the same on the corporate shelf and inside a
// centre's sub-site; only the breadcrumb and the closing link differ.
export default function InformationBody({ page, base = '', loc = null }) {
  const here = loc ? loc.name : '';
  return (
    <main>
      <article className="editorial-article container">
        <nav aria-label="Breadcrumb">
          {loc ? (
            <>
              <a href={base}>Kinder {here}</a> / {page.category}
            </>
          ) : (
            <>
              <a href="/information">Hospital &amp; patient information</a> / {page.category}
            </>
          )}
        </nav>
        <header>
          <span className="section-eyebrow">{page.category}</span>
          <h1>{page.title}</h1>
          {!loc && page.location && <p>{locationLabel(page)}</p>}
          {page.excerpt && <p className="editorial-lead">{page.excerpt}</p>}
        </header>
        {page.imageUrl && /^https?:\/\//.test(page.imageUrl) && (
          <img className="editorial-cover" src={page.imageUrl} alt={page.title} />
        )}
        <ContentBody text={page.body} />
        <a href={loc ? `${base}#contact` : '/contact'} className="btn btn-primary">
          {loc ? `Contact the Kinder ${here} team` : 'Contact our team'} →
        </a>
      </article>
    </main>
  );
}
