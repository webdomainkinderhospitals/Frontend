// News & Events: the posts managed in the admin (News & Events), shown on the
// home page, the News page, each centre's page and each story's own page.
import { NEWS_ARCHIVE } from './news-archive.mjs';

const slugify = (s) => String(s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

// A post's address: its slug from the admin, or one made from its title.
export const newsSlug = (item = {}) => String(item.slug || '').trim() || slugify(item.title) || String(item.id ?? '');
export const newsHref = (item) => `/news/${encodeURIComponent(newsSlug(item))}`;

// Newest first; posts without a date go last.
export function sortedNews(list = []) {
  const time = (n) => { const t = Date.parse(n.publishedAt || ''); return Number.isNaN(t) ? -Infinity : t; };
  return (Array.isArray(list) ? list : []).filter((n) => n && n.title && n.published !== false)
    .sort((a, b) => time(b) - time(a));
}

export const findNews = (list, slug) => sortedNews(list).find((n) => newsSlug(n) === decodeURIComponent(String(slug || '')));

// The story's other photos (one URL per line in the admin), without its cover.
export function newsPhotos(item = {}) {
  const cover = String(item.imageUrl || '').trim();
  const seen = new Set([cover]);
  return String(item.galleryUrls || '').split(/\n|\\n/).map((u) => u.trim())
    .filter((u) => (/^https?:\/\//.test(u) || /^\/(?!\/)/.test(u)) && !seen.has(u) && seen.add(u));
}

// Paragraphs of the article. A very long paragraph (the archive's Malayalam
// stories are single blocks) is broken after every few sentences so it reads.
export function newsParagraphs(body = '') {
  return String(body).split(/\n\s*\n/).map((p) => p.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean)
    .flatMap((p) => {
      if (p.length < 700) return [p];
      const out = []; let from = 0;
      for (const m of p.matchAll(/[.!?](?=\s)/g)) {
        const end = m.index + 1;
        // a sentence ends after a word, not after an initial ("കെ. എൽ. എഫ്", "Dr.")
        const word = p.slice(from, m.index).split(/\s+/).pop() || '';
        const short = /[\u0D00-\u0D7F]/.test(word) ? word.length < 5 : word.length < 3 || /^(Dr|Mr|Mrs|Ms|Sri|Smt|Shri|St)$/i.test(word);
        if (short || end - from < 450) continue;
        out.push(p.slice(from, end).trim()); from = end;
      }
      if (p.slice(from).trim()) out.push(p.slice(from).trim());
      return out;
    });
}

export function newsDate(value, style = 'long') {
  const d = new Date(value || '');
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', style === 'short'
    ? { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }
    : { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' });
}

// "Kinder Kochi", "Kinder Kochi & Cherthala", or the group.
export function newsPlace(item = {}) {
  const names = String(item.location || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!names.length) return 'Kinder Hospitals';
  return `Kinder ${names.length > 1 ? `${names.slice(0, -1).join(', ')} & ${names.at(-1)}` : names[0]}`;
}

// Stories to read next: the same type first, then the most recent.
export function relatedNews(list, item, max = 3) {
  const others = sortedNews(list).filter((n) => newsSlug(n) !== newsSlug(item));
  const same = others.filter((n) => n.category && n.category === item.category);
  return [...same, ...others.filter((n) => !same.includes(n))].slice(0, max);
}

// The three sample articles that came with the site's first design (stock
// photos, no article text). They are not Kinder news, so News & Events
// leaves them out once the hospital's own stories are there.
export const SAMPLE_POSTS = new Set(['first-trimester-care', 'ivf-diet-guide', 'hand-foot-mouth-disease-kids']);
const isSample = (n) => SAMPLE_POSTS.has(newsSlug(n)) && !String(n.body || '').trim();

// The posts from the admin, plus every archive story the admin does not have
// yet (a post with the same slug, edited or not, is used instead).
export function withNewsArchive(list = [], archive = NEWS_ARCHIVE) {
  const posts = (Array.isArray(list) ? list : []).filter(Boolean);
  const have = new Set(posts.map(newsSlug));
  const all = [...posts, ...archive.filter((a) => !have.has(newsSlug(a)))];
  const real = all.filter((n) => !isSample(n));
  return real.length ? real : all;
}
