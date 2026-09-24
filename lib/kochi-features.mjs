export const KOCHI_FEATURES = [
  { slug: 'kochi-tharattazhaku', label: 'Tharattazhaku', group: 'Celebrate Pregnancy' },
  { slug: 'kochi-wow-mom', label: 'WOW MOM', group: 'Celebrate Pregnancy' },
  { slug: 'kochi-water-birthing-suite', label: 'Water Birth', group: 'Celebrate Pregnancy' },
  { slug: 'kochi-premium-birthing-centre', label: 'Premium Birthing Centre', group: 'Premium Birthing Centre' },
];

export function kochiFeaturePages(pages = [], location = '') {
  if (!/^(kochi|cochin)$/i.test(String(location).trim())) return [];
  return KOCHI_FEATURES.flatMap((feature) => {
    const page = pages.find((p) => p.slug === feature.slug && p.published !== false &&
      String(p.location || '').split(',').some((name) => /^(kochi|cochin)$/i.test(name.trim())));
    return page ? [{ ...feature, page, href: feature.group === 'Celebrate Pregnancy' && feature.slug !== 'kochi-water-birthing-suite'
      ? `/hospitals/kochi/celebrate-pregnancy/${feature.slug}`
      : `/hospitals/kochi/care/${feature.slug}` }] : [];
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
