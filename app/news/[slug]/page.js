import { notFound } from 'next/navigation';
import { getContent } from '@/lib/api';
import { findNews, newsDate, newsParagraphs, newsPhotos, newsPlace, relatedNews } from '@/lib/news.mjs';
import SiteChrome from '@/components/SiteChrome';
import PageHero from '@/components/PageHero';
import NewsCard from '@/components/news/NewsCard';
import NewsPhotos from '@/components/news/NewsPhotos';
import styles from '@/components/news/News.module.css';

export const revalidate = 60;

const escape = (s) => String(s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = findNews((await getContent()).news, slug);
  if (!item) return { title: 'Story not found · Kinder Hospitals' };
  return {
    title: `${item.title} · Kinder Hospitals`,
    description: item.excerpt || undefined,
    openGraph: { title: item.title, description: item.excerpt || undefined, images: item.imageUrl ? [item.imageUrl] : undefined, type: 'article' },
  };
}

export default async function NewsStory({ params }) {
  const { slug } = await params;
  const content = await getContent();
  const item = findNews(content.news, slug);
  if (!item) notFound();
  const photos = newsPhotos(item);
  const paragraphs = newsParagraphs(item.body);
  const date = newsDate(item.publishedAt);
  const place = newsPlace(item);
  const more = relatedNews(content.news, item);
  // Stories kept in Malayalam, as the hospital wrote them, are marked so
  // browsers and screen readers use the right language.
  const malayalam = /[ഀ-ൿ]/.test(paragraphs.join(' '));

  return (
    <SiteChrome content={content}>
      <main>
        <PageHero
          crumb={item.category || 'Story'}
          trail={[{ label: 'News & Events', href: '/news' }]}
          eyebrow={[item.category, date].filter(Boolean).join(' · ')}
          titleHtml={escape(item.title)}
        />
        <article className={styles.story}>
          <div className={`container ${styles.storyWrap}`}>
            <div className={styles.storyMain}>
              {item.imageUrl && (
                <figure className={styles.storyCover}>
                  <img src={item.imageUrl} alt={item.title} fetchPriority="high" />
                </figure>
              )}
              <dl className={styles.storyFacts}>
                {date && <div><dt>Date</dt><dd><time dateTime={item.publishedAt}>{date}</time></dd></div>}
                <div><dt>Where</dt><dd>{place}</dd></div>
                {item.category && <div><dt>Type</dt><dd>{item.category}</dd></div>}
              </dl>
              {item.excerpt && <p className={styles.storyLead}>{item.excerpt}</p>}
              {paragraphs.length > 0 && (
                <div className={styles.storyBody} lang={malayalam ? 'ml' : undefined}>
                  {malayalam && <p className={styles.storyLangNote} lang="en">The story in Malayalam, as published by the hospital:</p>}
                  {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              )}
              <NewsPhotos photos={photos} title={item.title} location={item.location} />
              <p className={styles.storyBack}><a href="/news"><span aria-hidden="true">←</span> All news &amp; events</a></p>
            </div>
          </div>
        </article>
        {more.length > 0 && (
          <section className={styles.more} aria-labelledby="more-stories">
            <div className="container">
              <div className={styles.moreHead}>
                <span className="section-eyebrow">Keep reading</span>
                <h2 id="more-stories" className="section-title">More from <em>Kinder</em></h2>
              </div>
              <div className={styles.grid}>
                {more.map((n) => <NewsCard key={n.id ?? n.slug ?? n.title} item={n} />)}
              </div>
            </div>
          </section>
        )}
      </main>
    </SiteChrome>
  );
}
