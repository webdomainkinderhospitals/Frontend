'use client';

import { useEffect, useMemo, useState } from 'react';
import { CAKE_MIXING, isCakeMixing } from '@/lib/news-topics.mjs';
import NewsCard from './NewsCard';
import styles from './News.module.css';

const ORDER = ['Event', 'News', 'Award', 'Community', 'Camp'];

// The News page: the latest story as the lead, then every story, with a
// filter by type (events, news, awards…) and by topic (Cake Mixing, every
// Mom Mix season). /news?topic=cake-mixing opens on that topic.
export default function NewsBrowser({ news = [] }) {
  const [type, setType] = useState('');
  const cakeMixing = news.filter(isCakeMixing);
  useEffect(() => {
    const topic = new URLSearchParams(window.location.search).get('topic');
    if (topic === CAKE_MIXING && cakeMixing.length) setType(CAKE_MIXING);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const choose = (next) => {
    setType(next);
    const url = new URL(window.location.href);
    if (next === CAKE_MIXING) url.searchParams.set('topic', CAKE_MIXING); else url.searchParams.delete('topic');
    window.history.replaceState(null, '', url);
  };
  const types = useMemo(() => {
    const present = [...new Set(news.map((n) => n.category).filter(Boolean))];
    return present.sort((a, b) => (ORDER.indexOf(a) + 1 || 99) - (ORDER.indexOf(b) + 1 || 99));
  }, [news]);
  const shown = type === CAKE_MIXING ? cakeMixing : type ? news.filter((n) => n.category === type) : news;
  const [lead, ...rest] = type ? [null, ...shown] : shown;

  return (
    <>
      {types.length > 1 && (
        <div className={styles.filters} role="group" aria-label="Show stories of one type">
          <button type="button" className={!type ? styles.filterOn : ''} aria-pressed={!type} onClick={() => choose('')}>All stories <small>{news.length}</small></button>
          {cakeMixing.length > 0 && (
            <button type="button" className={type === CAKE_MIXING ? styles.filterOn : ''} aria-pressed={type === CAKE_MIXING} onClick={() => choose(CAKE_MIXING)}>
              Cake Mixing · Mom Mix <small>{cakeMixing.length}</small>
            </button>
          )}
          {types.map((t) => (
            <button key={t} type="button" className={type === t ? styles.filterOn : ''} aria-pressed={type === t} onClick={() => choose(t)}>
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
