// Celebrate Pregnancy and the Premium Birthing Centre are presented as Kinder
// Hospitals' own, not one centre's, so on the main site their text never
// names a hospital ("Kinder Kochi", "at Kinder Hospitals, Kochi", "the
// Cherthala team"). The stored content is left as it is; this only shapes
// how it reads in these sections.
const C = '(?:Kochi|Cochin|Cherthala|Kollam|Aranmula|Alappuzha|Bengaluru|Singapore)';
const CS = `${C}(?:\\s*(?:,|and|&)\\s*${C})*`;

const RULES = [
  [new RegExp(`\\bKinder(?:\\s+Hospitals?)?,?\\s+${CS}(?:’s|'s)`, 'g'), 'Kinder Hospitals’'],
  [new RegExp(`\\bKinder(?:\\s+Hospitals?)?,?\\s+${CS}\\b`, 'g'), 'Kinder Hospitals'],
  [new RegExp(`\\bthe\\s+${CS}\\s+(maternity\\s+)?team\\b`, 'gi'), 'our $1team'],
  [new RegExp(`\\bContact\\s+${CS}\\s+for\\b`, 'g'), 'Contact us for'],
  [new RegExp(`\\bthe\\s+prime\\s+location\\s+of\\s+${CS}\\b`, 'gi'), 'a prime location'],
  [new RegExp(`\\s+(?:in|at)\\s+${CS}\\b`, 'g'), ''],
  [new RegExp(`,\\s*${CS}\\b`, 'g'), ''],
  [new RegExp(`\\b${CS}\\s+`, 'g'), ''],
];

export function withoutCentre(text) {
  if (text == null) return text;
  let out = String(text);
  for (const [re, to] of RULES) out = out.replace(re, to);
  return out.replace(/Kinder Hospitals’ Kinder Hospitals/g, 'Kinder Hospitals').replace(/[ \t]{2,}/g, ' ').replace(/\s+([.,?!])/g, '$1');
}

// A page's readable fields, without hospital names.
export function pageWithoutCentre(page) {
  if (!page) return page;
  return { ...page, title: withoutCentre(page.title), excerpt: withoutCentre(page.excerpt), body: withoutCentre(page.body) };
}
