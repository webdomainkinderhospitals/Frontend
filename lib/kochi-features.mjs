export const KOCHI_FEATURES = [
  { slug: 'kochi-tharattazhaku', short: 'tharattazhaku', label: 'Tharattazhaku', group: 'Celebrate Pregnancy' },
  { slug: 'kochi-wow-mom', short: 'wow-mom', label: 'WOW MOM', group: 'Celebrate Pregnancy' },
  { slug: 'kochi-water-birthing-suite', short: 'water-birthing-suite', label: 'Water Birth', group: 'Celebrate Pregnancy' },
  { slug: 'kochi-premium-birthing-centre', short: 'premium-birthing-centre', label: 'Premium Birthing Centre', group: 'Premium Birthing Centre' },
];

// Where a feature opens. On the main site the pregnancy experiences live
// under /celebrate-pregnancy and the birthing centre has its own page; on
// Kinder Kochi's own site they keep their Kochi addresses.
function featureHref(feature, site) {
  if (site === 'main') {
    return feature.group === 'Premium Birthing Centre' ? '/premium-birthing-centre' : `/celebrate-pregnancy/${feature.short}`;
  }
  return feature.group === 'Celebrate Pregnancy' && feature.slug !== 'kochi-water-birthing-suite'
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

// Just enough of each feature page for the site menus (which run in the
// browser) to build their links — never ship full page bodies to the client.
export function featureMenuPages(pages = []) {
  return (pages || [])
    .filter((p) => KOCHI_FEATURES.some((f) => f.slug === p.slug))
    .map(({ slug, published, location }) => ({ slug, published, location }));
}
