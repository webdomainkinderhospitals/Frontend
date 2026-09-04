import { getContent } from '@/lib/api';
import { locationLabel } from '@/lib/locations';
import SiteChrome from '@/components/SiteChrome';
import PageHero from '@/components/PageHero';

export const revalidate = 60;

export const metadata = {
  title: 'News & Events · Kinder Hospitals',
  description: 'Latest news, health articles, camps and events from the Kinder Medical Group.',
};

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
}

export default async function NewsPage() {
  const content = await getContent();
  const news = content.news || [];
  return (
    <SiteChrome content={content}>
      <main>
        <PageHero
          crumb="News & Events"
          eyebrow="Resources"
          titleHtml="News, health articles <em>& events</em>"
          intro="Insights from our doctors, camp announcements and the latest from across the Kinder network."
        />
        <section>
          <div className="container">
            {news.length === 0 ? (
              <p className="muted">New articles are on the way — check back soon.</p>
            ) : (
              <div className="hosp-news-grid news-page-grid">
                {news.map((item, i) => (
                  <article className="hosp-news-card" key={item.id ?? i}>
                    {item.imageUrl && (
                      <div className="hosp-news-img" style={{ backgroundImage: `url('${item.imageUrl}')` }}></div>
                    )}
                    <div className="hosp-news-meta">
                      <span className="hosp-news-cat">{item.category}</span>
                      <h4>{item.title}</h4>
                      {item.excerpt && <p>{item.excerpt}</p>}
                      <small className="news-byline">
                        {[item.author, formatDate(item.publishedAt), locationLabel(item)]
                          .filter(Boolean)
                          .join(' · ')}
                      </small>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
