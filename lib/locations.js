// A record's `location` field can name one hospital ("Kochi"), several
// ("Kochi, Bengaluru") or none ("" = the whole group). These helpers are the
// one place that understands that format.

const norm = (s) => String(s || '').trim().toLowerCase();

export function locationsOf(item) {
  return String(item?.location || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function atLocation(item, name) {
  const n = norm(name);
  return !!n && locationsOf(item).some((l) => norm(l) === n);
}

// "Kinder Kochi · Kinder Bengaluru" (empty string when group-wide)
export function locationLabel(item) {
  return locationsOf(item).map((n) => `Kinder ${n}`).join(' · ');
}
