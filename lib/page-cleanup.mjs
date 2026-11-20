// Some imported pages carry a summary that is only a title ("Mr.", "Dr."):
// the import took the first word of the profile. Such a summary says nothing,
// so it is left out, wherever the page's summary would show.
const TITLE_ONLY = /^\s*(mr|mrs|ms|dr|prof|brigadier)\.?\s*$/i;

export function withoutStubExcerpts(pages = []) {
  return pages.map((p) => (TITLE_ONLY.test(String(p.excerpt || '')) ? { ...p, excerpt: '' } : p));
}
