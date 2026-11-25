// Leadership is hidden on the website for now, as the hospital asked (9 Oct
// 2026): the About Us section, its menu link, a centre's leaders and the
// profile pages. Set to true to bring it all back — nothing else changes.
export const SHOW_LEADERSHIP = true;

import { LEADERSHIP_PROFILES } from './leadership-profiles.mjs';

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
    role: ROLES[page.slug] || role,
    summary: shorten(excerpt.length > 30 ? excerpt : bio),
    photo: LATEST[page.slug] || String(page.imageUrl || '').trim() || PHOTOS[page.slug] || '',
    initials: words.length ? (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : '')).toUpperCase() : '',
  };
}

// Designations the hospital has confirmed (Nov 2026), over the profile text.
const ROLES = {
  'leadership-mr-anto-twinkle': 'Chief Operating Officer, Kinder Hospitals Kochi',
  'leadership-mr-rajesh-kumar-b': 'Chief Operating Officer – Cluster Head, Kinder Hospitals Cherthala, Alappuzha & Aranmula',
  'leadership-mr-sojo-p-devaraj': 'Manager – Operations, Kinder Hospitals Aranmula',
};

// The hospital's order for the group's leaders, and the leaders who belong
// to one centre. These apply whatever the stored Display order says; other
// leaders follow in Display order, and a Location set in the admin wins.
const GROUP_ORDER = ['leadership-dr-v-k-pradeep-kumar', 'leadership-mr-renjith-krishnan', 'leadership-mr-basanta-kumar-dash'];
const CENTRE_OF = { 'leadership-mr-anto-twinkle': 'kochi' };
// Portraits supplied by the hospital, used until a photo is set on the page.
const PHOTOS = {
  'leadership-dr-v-k-pradeep-kumar': '/leadership/dr-v-k-pradeep-kumar-head.webp',
  'leadership-mr-renjith-krishnan': '/leadership/renjith-krishnan-head.webp',
  'leadership-mr-anto-twinkle': '/leadership/anto-twinkle-head.webp',
  'leadership-mr-sojo-p-devaraj': '/leadership/team/sojo.webp',
};

// Portraits the hospital sent after a photo was already set on the page
// (Mr Basanta Kumar Dash, 18 Nov 2026): these replace the page's photo.
// Dr V. K. Pradeep Kumar's studio portrait (21 Nov 2026) and Rajesh Kumar
// B's (22 Nov 2026) likewise.
const LATEST = {
  'leadership-mr-rajesh-kumar-b': '/leadership/rajesh-kumar-b-head.webp',
  'leadership-mr-basanta-kumar-dash': '/leadership/basanta-kumar-dash-head.webp',
  'leadership-dr-v-k-pradeep-kumar': '/leadership/dr-v-k-pradeep-kumar-head.webp',
};

// Full-length portraits for a leader's own profile page.
const PORTRAITS = {
  'leadership-dr-v-k-pradeep-kumar': '/leadership/dr-v-k-pradeep-kumar.webp',
  'leadership-mr-rajesh-kumar-b': '/leadership/rajesh-kumar-b.webp',
  'leadership-mr-anto-twinkle': '/leadership/anto-twinkle.webp',
  'leadership-mr-basanta-kumar-dash': '/leadership/basanta-kumar-dash.webp',
  'leadership-mr-sojo-p-devaraj': '/leadership/team/sojo.webp',
};
export const leaderPortrait = (page = {}) => (page.category === 'Leadership' ? PORTRAITS[page.slug] || '' : '');
// True when the supplied portrait should be shown over the page's own photo.
export const portraitReplacesPhoto = (page = {}) => Boolean(page.category === 'Leadership' && LATEST[page.slug] && PORTRAITS[page.slug]);

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

// Each hospital's Leadership section (the hospital's list, 21-22 Nov 2026):
// the Chairman and the MD & CEO lead every centre, then the centre's own
// heads — Anto Twinkle at Kochi; Rajesh Kumar B, COO and Cluster Head, at
// Cherthala, Alappuzha and Aranmula (with Sojo P. Devaraj, Manager –
// Operations, at Aranmula); Abeesh at Kollam — then any other leader whose
// page is set to the centre. These come
// from the site itself, so the section shows even when the content database
// can't be reached. A centre head with a Leadership page links to it; the
// Chairman and the CEO link to their profiles on About Us.
const GROUP_HEADS = ['leadership-dr-v-k-pradeep-kumar', 'leadership-mr-renjith-krishnan'];
const RAJESH = { slug: 'leadership-mr-rajesh-kumar-b', name: 'Rajesh Kumar B', photo: '/leadership/rajesh-kumar-b-head.webp' };
const CENTRE_HEADS = {
  kochi: [{ slug: 'leadership-mr-anto-twinkle', name: 'Anto Twinkle', photo: '/leadership/anto-twinkle-head.webp' }],
  cherthala: [RAJESH],
  alappuzha: [RAJESH],
  aranmula: [RAJESH, { slug: 'leadership-mr-sojo-p-devaraj', name: 'Sojo P. Devaraj', photo: '/leadership/team/sojo.webp' }],
  kollam: [{ slug: 'centre-head-abeesh', name: 'Abeesh', photo: '/leadership/team/abeesh.webp' }],
};

const initialsOf = (name) => {
  const words = String(name).replace(HONORIFIC, '').split(/\s+/).filter((w) => w.length > 1);
  return words.length ? (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : '')).toUpperCase() : '';
};

export function hospitalLeaders(pages = [], centre = '') {
  const here = String(centre).trim().toLowerCase().replace(/^cochin$/, 'kochi');
  const place = String(centre).trim().replace(/^cochin$/i, 'Kochi');
  const group = GROUP_HEADS.map((slug) => LEADERSHIP_PROFILES.find((p) => p.slug === slug)).filter(Boolean).map((p) => ({
    slug: p.slug,
    name: p.name,
    role: p.role,
    summary: shorten(p.bio[0]),
    photo: LATEST[p.slug] || PHOTOS[p.slug] || '',
    initials: initialsOf(p.name),
    href: `/about#${p.slug}`,
  }));
  const own = centreLeaders(pages, here);
  const heads = (CENTRE_HEADS[here] || []).filter((h) => !own.some((l) => l.slug === h.slug)).map((h) => ({
    ...h,
    role: ROLES[h.slug] || `Kinder Hospitals ${place}`,
    summary: '',
    photo: h.photo || '',
    initials: initialsOf(h.name),
    href: null, // no profile page to open
  }));
  return [...group, ...heads, ...own.filter((l) => !GROUP_HEADS.includes(l.slug))]
    // the centre's head straight after the group's leaders, then the others
    .sort((a, b) => rankHere(a, here) - rankHere(b, here));
}
const rankHere = (l, here) => {
  if (GROUP_HEADS.includes(l.slug)) return GROUP_HEADS.indexOf(l.slug);
  const head = (CENTRE_HEADS[here] || []).findIndex((h) => h.slug === l.slug);
  return GROUP_HEADS.length + (head === -1 ? 99 : head);
};
