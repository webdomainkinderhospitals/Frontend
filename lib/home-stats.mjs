// The homepage numbers, as the hospital asked on 9 Oct 2026: births are
// "30K+" (any older births figure is updated) and "32K+ Surgeries Performed"
// follows births when the list has no surgeries number. Applied to whatever
// list is shown — the numbers saved in the admin or the site's defaults — so
// it works without a backend deploy. Anything else in the list is kept.
const OLD_BIRTHS = /^\s*1[0-9],?000\s*\+?\s*$/; // 13,000+ and similar earlier figures

export function homeStats(stats = []) {
  if (!Array.isArray(stats) || !stats.length) return stats;
  const isBirths = (s) => s && /birth/i.test(String(s.label || ''));
  const out = stats.map((s) => (isBirths(s) && OLD_BIRTHS.test(String(s.value || '')) ? { ...s, value: '30K+' } : s));
  if (!out.some((s) => s && /surg/i.test(String(s.label || '')))) {
    const births = out.findIndex(isBirths);
    out.splice(births === -1 ? out.length : births + 1, 0, { label: 'Surgeries Performed', value: '32K+' });
  }
  return out;
}
