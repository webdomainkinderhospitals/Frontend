// "Kinder Hospitals Aranmula" is all the hospital wants said of the centre —
// not its district, Pathanamthitta (the hospital asked, 24 Nov 2026). The
// district is taken out of whatever the site shows: the centre's line under
// its name ("Women & Children's · Pathanamthitta"), its address, its
// description, pages and news.
const RULES = [
  [/\s*[·•|–-]\s*Pathanamthitta\b/gi, ''],
  [/,\s*Pathanamthitta\b/gi, ''],
  [/\b(to|in|across|of)\s+Pathanamthitta\b/gi, '$1 Aranmula'],
  [/\bPathanamthitta\b\s*,?\s*/gi, ''],
  [/\bAranmula,\s*Aranmula\b/g, 'Aranmula'],
];
const plain = (text) => RULES.reduce((t, [find, put]) => t.replace(find, put), text);
const clean = (value) => (typeof value === 'string' ? (/pathanamthitta/i.test(value) ? plain(value) : value)
  : Array.isArray(value) ? value.map(clean)
  : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, clean(v)]))
  : value);

export function withoutDistrictName(content) {
  if (!content || !JSON.stringify(content).match(/pathanamthitta/i)) return content;
  return { ...content, ...Object.fromEntries(['locations', 'pages', 'news', 'specialities', 'procedures', 'settings', 'testimonials', 'doctors'].filter((k) => k in content).map((k) => [k, clean(content[k])])) };
}
