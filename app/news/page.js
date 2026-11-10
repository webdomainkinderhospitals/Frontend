import { getContent } from '@/lib/api';
import { sortedNews } from '@/lib/news.mjs';
import SiteChrome from '@/components/SiteChrome';
import PageHero from '@/components/PageHero';
import NewsBrowser from '@/components/news/NewsBrowser';
import styles from '@/components/news/News.module.css';

export const revalidate = 60;

export const metadata = {
  title: 'News & Events · Kinder Hospitals',
  description: 'Celebrations, milestones, awards, health camps and community work from across Kinder Hospitals.',
};

export default async function NewsPage() {
  const content = await getContent();
  const news = sortedNews(content.news);
  return (
    <SiteChrome content={content}>
      <main>
        <PageHero
          crumb="News & Events"
          eyebrow="Newsroom"
          titleHtml="News, events <em>&amp; milestones</em>"
          intro="Celebrations of motherhood, new services, awards, health camps and community work — the stories of Kinder Hospitals."
        />
        <section className={styles.newsroom}>
          <div className="container">
            {news.length === 0
              ? <p className="muted">New stories are on the way — check back soon.</p>
              : <NewsBrowser news={news} />}
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
