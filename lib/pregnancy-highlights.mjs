// Admin Content Library pages imported from the two requested Kinder sources.
// Tharattazhaku is not repeated here: Kinder Kochi's own Tharattazhaku page
// (kochi-tharattazhaku) already presents it.
export const PREGNANCY_HIGHLIGHTS = ['spandanam', 'mom-to-be', 'antenatal-classes', 'mom-mix', 'water-birth', 'first-moments'];
export function pregnancyHighlights(pages = [], scope = 'group') {
  return PREGNANCY_HIGHLIGHTS.flatMap((short) => {
    const page = pages.find((p) => p.slug === `celebrate-${short}` && p.published !== false);
    if (!page || (scope === 'kochi' && !String(page.location).split(',').some((name) => /^(kochi|cochin)$/i.test(name.trim())))) return [];
    const route = short;
    return [{ slug: page.slug, short: route, replaces: short, label: page.title, group: 'Celebrate Pregnancy', page,
      href: scope === 'kochi' ? `/hospitals/kochi/information/${page.slug}` : `/celebrate-pregnancy/${route}` }];
  }).sort((a, b) => (a.page.sortOrder ?? 0) - (b.page.sortOrder ?? 0));
}
