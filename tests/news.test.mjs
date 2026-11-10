import test from 'node:test';
import assert from 'node:assert/strict';
import { newsSlug, newsHref, sortedNews, findNews, newsPhotos, newsParagraphs, newsDate, newsPlace, relatedNews } from '../lib/news.mjs';

const posts = [
  { id: 1, title: 'Older camp', slug: 'older-camp', category: 'Camp', publishedAt: '2021-07-28T04:30:00.000Z' },
  { id: 2, title: 'Mom Mix Season 3', slug: 'mom-mix-season-3', category: 'Event', publishedAt: '2025-10-26T04:30:00.000Z', location: 'Kochi',
    imageUrl: 'https://cdn/cover.webp', galleryUrls: 'https://cdn/1.webp\nhttps://cdn/cover.webp\nnot a url\nhttps://cdn/2.webp' },
  { id: 3, title: 'Times Health Excellence 2023', category: 'Award', publishedAt: '2023-12-01T04:30:00.000Z', location: 'Kochi, Cherthala' },
  { id: 4, title: 'Hidden', published: false, publishedAt: '2026-01-01' },
];

test('posts newest first, hidden ones left out, each with its own address', () => {
  assert.deepEqual(sortedNews(posts).map((p) => p.id), [2, 3, 1]);
  assert.equal(newsSlug(posts[2]), 'times-health-excellence-2023');
  assert.equal(newsHref(posts[1]), '/news/mom-mix-season-3');
  assert.equal(findNews(posts, 'times-health-excellence-2023').id, 3);
  assert.equal(findNews(posts, 'hidden'), undefined);
});

test('a story\'s photos: valid URLs only, never its cover twice', () => {
  assert.deepEqual(newsPhotos(posts[1]), ['https://cdn/1.webp', 'https://cdn/2.webp']);
  assert.deepEqual(newsPhotos({}), []);
});

test('long single-block stories are broken into readable paragraphs', () => {
  const block = 'ഒന്ന് രണ്ട് മൂന്ന് നാല് അഞ്ച് ആറ് ഏഴ് എട്ട്. '.repeat(30).trim();
  const paras = newsParagraphs(block);
  assert.ok(paras.length > 1);
  assert.equal(paras.join(' '), block);
  assert.deepEqual(newsParagraphs('First.\n\nSecond line\ncontinues.'), ['First.', 'Second line continues.']);
});

test('dates, places and stories to read next', () => {
  assert.equal(newsDate('2025-10-26T04:30:00.000Z'), '26 October 2025');
  assert.equal(newsDate('2025-10-26T04:30:00.000Z', 'short'), '26 Oct 2025');
  assert.equal(newsDate(''), '');
  assert.equal(newsPlace(posts[1]), 'Kinder Kochi');
  assert.equal(newsPlace(posts[2]), 'Kinder Kochi & Cherthala');
  assert.equal(newsPlace(posts[0]), 'Kinder Hospitals');
  assert.deepEqual(relatedNews(posts, posts[1]).map((p) => p.id), [3, 1]);
});

test('the hospital\'s news archive is always there; the admin\'s copy of a story wins', async () => {
  const { withNewsArchive, SAMPLE_POSTS } = await import('../lib/news.mjs');
  const { NEWS_ARCHIVE } = await import('../lib/news-archive.mjs');
  assert.equal(NEWS_ARCHIVE.length, 21);
  const samples = [...SAMPLE_POSTS].map((slug, i) => ({ id: i, slug, title: slug, body: '' }));
  // Backend not deployed yet: the three design samples give way to the archive
  const merged = withNewsArchive(samples);
  assert.equal(merged.length, 21);
  assert.ok(merged.every((n) => !SAMPLE_POSTS.has(n.slug)));
  // Backend deployed: its posts (GCS photos, admin edits) replace the bundled copies
  const fromAdmin = { id: 99, slug: 'mom-mix-season-3', title: 'Edited in the admin', imageUrl: 'https://storage.googleapis.com/x.webp' };
  const both = withNewsArchive([fromAdmin, ...samples]);
  assert.equal(both.length, 21);
  assert.equal(both.filter((n) => n.slug === 'mom-mix-season-3').length, 1);
  assert.equal(both.find((n) => n.slug === 'mom-mix-season-3').title, 'Edited in the admin');
  // A post the team writes in the admin is kept, and every archive photo exists
  assert.equal(withNewsArchive([{ id: 5, slug: 'new-camp', title: 'New camp' }]).length, 22);
  const fs = await import('node:fs');
  for (const n of NEWS_ARCHIVE) for (const u of [n.imageUrl, ...n.galleryUrls.split('\n').filter(Boolean)]) assert.ok(fs.existsSync(`public${u}`), u);
});
