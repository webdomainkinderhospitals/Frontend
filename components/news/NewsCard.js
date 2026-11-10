import { newsDate, newsHref, newsPlace, newsPhotos } from '@/lib/news.mjs';
import styles from './News.module.css';

// One story as a card: its cover, type, date, title and summary, the whole
// card linking to the story. `feature` makes the large lead card.
export default function NewsCard({ item, feature = false, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`;
  const photos = newsPhotos(item).length;
  return (
    <article className={`${styles.card}${feature ? ` ${styles.feature}` : ''}`}>
      <a href={newsHref(item)} className={styles.cardLink}>
        <span className={styles.cardMedia}>
          {item.imageUrl ? <img src={item.imageUrl} alt="" loading={feature ? 'eager' : 'lazy'} decoding="async" /> : <span className={styles.cardBlank} aria-hidden="true">Kinder</span>}
          {item.category && <span className={styles.cardType}>{item.category}</span>}
          {photos > 0 && <span className={styles.cardCount} aria-label={`${photos + 1} photos`}>{photos + 1} photos</span>}
        </span>
        <span className={styles.cardBody}>
          <span className={styles.cardMeta}>
            {newsDate(item.publishedAt, 'short') && <time dateTime={item.publishedAt}>{newsDate(item.publishedAt, 'short')}</time>}
            <span>{newsPlace(item)}</span>
          </span>
          <Heading className={styles.cardTitle}>{item.title}</Heading>
          {item.excerpt && <span className={styles.cardExcerpt}>{item.excerpt}</span>}
          <span className={styles.cardMore}>Read the story <span aria-hidden="true">→</span></span>
        </span>
      </a>
    </article>
  );
}
