'use client';

import { useMemo, useState } from 'react';
import NewsCard from './NewsCard';
import styles from './News.module.css';

const ORDER = ['Event', 'News', 'Award', 'Community', 'Camp'];

// The News page: the latest story as the lead, then every story, with a
// filter by type (events, news, awards…).
export default function NewsBrowser({ news = [] }) {
  const [type, setType] = useState('');
  const types = useMemo(() => {
    const present = [...new Set(news.map((n) => n.category).filter(Boolean))];
    return present.sort((a, b) => (ORDER.indexOf(a) + 1 || 99) - (ORDER.indexOf(b) + 1 || 99));
  }, [news]);
  const shown = type ? news.filter((n) => n.category === type) : news;
  const [lead, ...rest] = type ? [null, ...shown] : shown;

  return (
    <>
      {types.length > 1 && (
        <div className={styles.filters} role="group" aria-label="Show stories of one type">
          <button type="button" className={!type ? styles.filterOn : ''} aria-pressed={!type} onClick={() => setType('')}>All stories <small>{news.length}</small></button>
          {types.map((t) => (
            <button key={t} type="button" className={type === t ? styles.filterOn : ''} aria-pressed={type === t} onClick={() => setType(t)}>
              {t === 'Community' ? 'Community & CSR' : t === 'Award' ? 'Awards' : t === 'Camp' ? 'Health camps' : t === 'Event' ? 'Events' : t}
              <small>{news.filter((n) => n.category === t).length}</small>
            </button>
          ))}
        </div>
      )}
      {lead && <NewsCard item={lead} feature headingLevel={2} />}
      <div className={styles.grid}>
        {rest.map((item) => <NewsCard key={item.id ?? item.slug ?? item.title} item={item} />)}
      </div>
    </>
  );
}
