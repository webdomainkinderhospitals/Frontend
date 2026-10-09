// Leadership is hidden on the website for now, as the hospital asked (9 Oct
// 2026): the About Us section, its menu link, a centre's leaders and the
// profile pages. Set to true to bring it all back — nothing else changes.
export const SHOW_LEADERSHIP = false;

// Leadership profiles are Content Library pages (category "Leadership"),
// imported from the hospital's profile documents. Their text starts with the
// person's name and, usually, a designation line ("CEO – Kinder Hospitals
// Group"), followed by the biography. Pages with no Location belong to the
// group; a page with a Location belongs to that centre.

const HONORIFIC = /^(dr|mr|mrs|ms|prof)\.?\s+/i;
const plain = (s) => String(s || '').toLowerCase().replace(HONORIFIC, '').replace(/[^a-z]/g, '');

// "CEO – KINDER HOSPITALS GROUP" → "CEO – Kinder Hospitals Group"; acronyms stay.
function tidy(text) {
  return String(text).replace(/\b([A-Z])([A-Z]{3,})\b/g, (_, a, b) => a + b.toLowerCase());
}

function shorten(text, max = 190) {
  const t = String(text || '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  // The last full stop that ends a sentence (not "Mr." or "Dr.").
  let stop = -1;
  for (const m of cut.matchAll(/\. /g)) if (!/\b(Mr|Mrs|Ms|Dr|Prof|St)$/.test(cut.slice(0, m.index))) stop = m.index;
  return stop > 80 ? cut.slice(0, stop + 1) : `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

export function leaderOf(page) {
  const name = String(page.title || '').trim();
  const paras = String(page.body || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  if (paras.length && plain(paras[0]) === plain(name)) paras.shift();
  let role = '';
  if (paras.length && paras[0].length <= 90 && !/[.:]$/.test(paras[0])) role = tidy(paras.shift());
  const bio = paras.find((p) => p.length > 60 && !/^[-•]/.test(p)) || '';
  const excerpt = String(page.excerpt || '').trim();
  const words = name.replace(HONORIFIC, '').split(/\s+/).filter((w) => w.length > 1);
  return {
    slug: page.slug,
    name,
    role,
    summary: shorten(excerpt.length > 30 ? excerpt : bio),
    photo: String(page.imageUrl || '').trim() || PHOTOS[page.slug] || '',
    initials: words.length ? (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : '')).toUpperCase() : '',
  };
}

// The hospital's order for the group's leaders, and the leaders who belong
// to one centre. These apply whatever the stored Display order says; other
// leaders follow in Display order, and a Location set in the admin wins.
const GROUP_ORDER = ['leadership-dr-v-k-pradeep-kumar', 'leadership-mr-renjith-krishnan', 'leadership-mr-basanta-kumar-dash'];
const CENTRE_OF = { 'leadership-mr-anto-twinkle': 'kochi' };
// Portraits supplied by the hospital, used until a photo is set on the page.
const PHOTOS = { 'leadership-dr-v-k-pradeep-kumar': '/leadership/dr-v-k-pradeep-kumar-head.webp' };

const rank = (p) => (GROUP_ORDER.includes(p.slug) ? GROUP_ORDER.indexOf(p.slug) : GROUP_ORDER.length);
const byOrder = (a, b) => rank(a) - rank(b) || (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
const isLeader = (p) => p.category === 'Leadership' && p.published !== false;
const placesOf = (p) => {
  const set = String(p.location || '').split(',').map((s) => s.trim().toLowerCase().replace(/^cochin$/, 'kochi')).filter(Boolean);
  return set.length ? set : (CENTRE_OF[p.slug] ? [CENTRE_OF[p.slug]] : []);
};

export function groupLeaders(pages = []) {
  return pages.filter((p) => isLeader(p) && !placesOf(p).length).sort(byOrder).map(leaderOf);
}

export function centreLeaders(pages = [], centre = '') {
  const here = String(centre).trim().toLowerCase().replace(/^cochin$/, 'kochi');
  return pages.filter((p) => isLeader(p) && placesOf(p).includes(here)).sort(byOrder).map(leaderOf);
}
