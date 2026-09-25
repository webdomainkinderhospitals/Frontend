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

// URL slug for a hospital's own sub-site ("Kochi" -> /hospitals/kochi).
export function slugOfLocation(loc) {
  return (
    loc?.slug ||
    String(loc?.name || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  );
}

export function findLocationBySlug(locations = [], slug) {
  return locations.find((l) => slugOfLocation(l) === slug);
}

// The hospital a page belongs to, when it names exactly one. Pages shared by
// several centres stay on the corporate information shelf.
export function hospitalSlugForPage(page, locations = []) {
  const names = locationsOf(page);
  if (names.length !== 1) return '';
  const loc = locations.find((l) => norm(l.name) === norm(names[0]));
  return loc ? slugOfLocation(loc) : '';
}

// How a centre is named in menus and lists: "Kinder Hospital Kochi". Two
// centres are clinics rather than hospitals — the women's & children's clinic
// in Alappuzha and Kinder Clinic in Singapore — so they keep their shorter
// name instead of being called a hospital they are not.
const CLINICS = new Set(['alappuzha', 'singapore']);

// A centre marked "Clinic" in the admin (Location.kind). Listed in the
// header's Clinics menu instead of among the hospitals.
export const isClinic = (loc) => String(loc?.kind || '').toLowerCase() === 'clinic';

export function centreName(loc) {
  const name = String(loc?.name || '').trim();
  return isClinic(loc) || CLINICS.has(name.toLowerCase()) ? `Kinder ${name}` : `Kinder Hospital ${name}`;
}

// Stock photography shipped with the design, kept in step with the admin's
// own definition of a sample image. A stock photo is fine as a decorative
// card background; it must never be presented as a picture of a centre.
const SAMPLE_IMAGE = /images\.unsplash\.com|picsum\.photos|placehold\.(co|it)|via\.placeholder/i;

export function isOwnImageOf(url) {
  const u = String(url || '').trim();
  return !!u && !SAMPLE_IMAGE.test(u);
}
