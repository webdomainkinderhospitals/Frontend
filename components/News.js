import { sortedNews } from '@/lib/news.mjs';
import NewsCard from '@/components/news/NewsCard';
import newsStyles from '@/components/news/News.module.css';

// The home page's newsroom: the three latest stories, each opening its own
// page, and a way into every story on the News page.
export default function News({ news = [] }) {
  const latest = sortedNews(news).slice(0, 3);
  if (!latest.length) return null;
  return (
    <section id="news" style={{ background: 'var(--bg-soft)' }}>
      <div className="container">
        <div className="section-head">
          <div>
            <span className="section-eyebrow">News &amp; Events</span>
            <h2 className="section-title">
              The latest <em>from Kinder</em>
            </h2>
            <p className="section-intro">
              Celebrations of motherhood, new services, awards and our work in the community, from across Kinder Hospitals.
            </p>
          </div>
          <a href="/news" className="view-all">All news &amp; events →</a>
        </div>
        <div className={newsStyles.grid}>
          {latest.map((item) => <NewsCard key={item.id ?? item.slug ?? item.title} item={item} />)}
        </div>
      </div>
    </section>
  );
}
