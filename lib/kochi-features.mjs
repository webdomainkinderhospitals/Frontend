// Water Birth is part of the Premium Birthing Centre: it is listed with the
// centre, after it, and on the main site opens under its address.
export const KOCHI_FEATURES = [
  { slug: 'kochi-tharattazhaku', short: 'tharattazhaku', label: 'Tharattazhaku', group: 'Celebrate Pregnancy' },
  { slug: 'kochi-wow-mom', short: 'wow-mom', label: 'WOW MOM', group: 'Celebrate Pregnancy' },
  { slug: 'kochi-premium-birthing-centre', short: 'premium-birthing-centre', label: 'Premium Birthing Centre', group: 'Premium Birthing Centre' },
  { slug: 'kochi-water-birthing-suite', short: 'water-birthing-suite', label: 'Water Birth', group: 'Premium Birthing Centre', path: 'water-birth' },
];
export const PREMIUM_SLUG = 'kochi-premium-birthing-centre';
// A still from the hospital's Water Birthing film: a mother arriving at her suite.
export const BIRTHING_STILL = '/premium-birthing-centre/welcome.webp';

// Where a feature opens. On the main site the pregnancy experiences live
// under /celebrate-pregnancy and the birthing centre (with Water Birth) under
// /premium-birthing-centre; on Kinder Kochi's own site they keep their Kochi
// addresses.
function featureHref(feature, site) {
  if (site === 'main') {
    if (feature.group === 'Premium Birthing Centre') return feature.path ? `/premium-birthing-centre/${feature.path}` : '/premium-birthing-centre';
    return `/celebrate-pregnancy/${feature.short}`;
  }
  return feature.group === 'Celebrate Pregnancy'
    ? `/hospitals/kochi/celebrate-pregnancy/${feature.slug}`
    : `/hospitals/kochi/care/${feature.slug}`;
}

// Kinder Kochi's published feature pages, with their links for `site`
// ('kochi' for its own site, 'main' for the group site).
export function kochiFeaturePages(pages = [], location = '', { site = 'kochi' } = {}) {
  if (!/^(kochi|cochin)$/i.test(String(location).trim())) return [];
  return KOCHI_FEATURES.flatMap((feature) => {
    const page = pages.find((p) => p.slug === feature.slug && p.published !== false &&
      String(p.location || '').split(',').some((name) => /^(kochi|cochin)$/i.test(name.trim())));
    return page ? [{ ...feature, page, href: featureHref(feature, site) }] : [];
  });
}

export function featureImages(page) {
  const urls = String(page.galleryUrls || '').split(/\n|\\n/).map((x) => x.trim()).filter((x) => /^https:\/\//.test(x) || /^\/(?!\/)/.test(x));
  // The existing imported birthing-centre draft predates the gallery field.
  if (!urls.length && page.slug === 'kochi-premium-birthing-centre') {
    return ['https://www.kinderkochi.com/images/birth1.jpg', 'https://www.kinderkochi.com/images/birth2.jpg'];
  }
  return urls;
}

// The photo that represents a pregnancy page. A photo chosen in the admin
// wins; the generic banners first imported from kinderkochi.com, and pages
// with no photo yet, use the hospital's own photo of that experience.
const PHOTOS = {
  'kochi-tharattazhaku': '/celebrate-pregnancy/tharattazhaku/season-5-winners-walk.webp',
  'kochi-wow-mom': '/kochi/tharattazhaku/mother-to-be.webp',
  'kochi-water-birthing-suite': '/celebrate-pregnancy/water-birth.webp',
  'celebrate-water-birth': '/celebrate-pregnancy/water-birth.webp',
  'celebrate-spandanam': '/celebrate-pregnancy/spandanam.webp',
  'celebrate-mom-mix': '/celebrate-pregnancy/cake-mixing.webp',
  'celebrate-mom-to-be': '/celebrate-pregnancy/mom-to-be.webp',
  'celebrate-antenatal-classes': '/celebrate-pregnancy/antenatal-classes.webp',
};
export const JOURNEY_PHOTO = '/celebrate-pregnancy/antenatal-classes.webp';
const IMPORTED_BANNER = /kinderkochi\.com\/images\/(tharatt_left_banner|appointment)\./;
export function pregnancyPhoto(page = {}) {
  const own = String(page.imageUrl || '').trim();
  if (own && !IMPORTED_BANNER.test(own)) return own;
  return PHOTOS[page.slug] || featureImages(page)[0] || own;
}

// Just enough of each feature page for the site menus (which run in the
// browser) to build their links — never ship full page bodies to the client.
// Also the Celebrate Pregnancy highlights the menu lists by name.
export const MENU_HIGHLIGHTS = [
  { slug: 'celebrate-spandanam', label: 'Spandanam', note: 'Music & motherhood celebration', href: '/celebrate-pregnancy/spandanam' },
  { slug: 'celebrate-mom-to-be', label: 'Mom-to-be', note: 'Baby shower celebrations', href: '/celebrate-pregnancy/mom-to-be' },
  { slug: 'celebrate-mom-mix', label: 'Cake Mixing', note: 'Mom Mix · a sweet celebration', href: '/celebrate-pregnancy/mom-mix' },
];
export function menuHighlights(pages = []) {
  return MENU_HIGHLIGHTS.flatMap((h) => {
    const page = (pages || []).find((p) => p.slug === h.slug && p.published !== false);
    return page ? [{ ...h, photo: page.photo || pregnancyPhoto(page) }] : [];
  });
}
export function featureMenuPages(pages = []) {
  return (pages || [])
    .filter((p) => KOCHI_FEATURES.some((f) => f.slug === p.slug) || MENU_HIGHLIGHTS.some((h) => h.slug === p.slug))
    .map((p) => ({ slug: p.slug, published: p.published, location: p.location, photo: pregnancyPhoto(p) }));
}
