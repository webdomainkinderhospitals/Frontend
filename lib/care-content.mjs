export function careSections(text = '') {
  return String(text).split(/\n(?=## )/).filter((s) => s.trim()).map((block, i) => {
    const heading = block.match(/^## (.+)\n?/);
    return { id: `care-section-${i}`, title: heading?.[1] || 'Overview', body: heading ? block.slice(heading[0].length).trim() : block.trim() };
  });
}
export function careFaqs(section) {
  if (!/frequently asked questions/i.test(section.title)) return [];
  return section.body.split(/(?:^|\n)### /).filter((s) => s.trim()).map((block) => {
    const [question, ...answer] = block.split('\n');
    return { question: question.trim(), answer: answer.join('\n').trim() };
  }).filter((item) => item.question && item.answer);
}

export const CARE_CATEGORY = 'Kochi Care';

export function isCarePage(page) {
  return page?.category === CARE_CATEGORY;
}

// A care page is read on its hospital's own sub-site — with that centre's
// header and a way back to it — rather than on the corporate site.
export function carePageHref(page, hospitalSlug) {
  return hospitalSlug ? `/hospitals/${hospitalSlug}/care/${page.slug}` : `/information/${page.slug}`;
}

export function carePagesFor(pages = [], at) {
  return pages
    .filter((p) => isCarePage(p) && p.published !== false && (!at || at(p)))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}
