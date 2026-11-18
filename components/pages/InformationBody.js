import ContentBody from '@/components/ContentBody';
import { locationLabel } from '@/lib/locations';
import { leaderPortrait, portraitReplacesPhoto } from '@/lib/leadership.mjs';
import ReadMore from '@/components/ReadMore';

// A leader's profile text opens with their name, already the page heading.
const plainName = (s) => String(s || '').toLowerCase().replace(/^(dr|mr|mrs|ms)\.?\s+/, '').replace(/[^a-z]/g, '');
function withoutNameLine(page) {
  const paras = String(page.body || '').split(/\n\s*\n/);
  return paras.length > 1 && plainName(paras[0]) === plainName(page.title) ? paras.slice(1).join('\n\n') : page.body;
}

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
        {page.imageUrl && /^https?:\/\//.test(page.imageUrl) && !portraitReplacesPhoto(page) ? (
          <img className="editorial-cover" src={page.imageUrl} alt={page.title} />
        ) : leaderPortrait(page) && (
          <img className="editorial-portrait" src={leaderPortrait(page)} alt={page.title} width={800} height={1200} />
        )}
        {page.category === 'Leadership' ? (
          <ReadMore height={300} bg="#F7F9FC"><ContentBody text={withoutNameLine(page)} /></ReadMore>
        ) : (
          <ContentBody text={page.body} />
        )}
        <a href={loc ? `${base}#contact` : '/contact'} className="btn btn-primary">
          {loc ? `Contact the Kinder ${here} team` : 'Contact our team'} →
        </a>
      </article>
    </main>
  );
}
