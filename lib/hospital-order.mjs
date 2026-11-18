// The order of doctors at each hospital, set in the admin as a serial number
// per hospital (Services & Doctors → a hospital tab → Arrange doctors). The
// backend keeps it on each doctor as JSON text: {"Kochi":1,"Cherthala":4}.
// At a hospital, numbered doctors come first, 1, 2, 3…; the others follow in
// the order they had.
const key = (name) => String(name || '').trim().toLowerCase().replace(/^cochin$/, 'kochi');

function ordersOf(doc) {
  const raw = doc?.hospitalOrder;
  if (!raw) return {};
  if (typeof raw === 'object') return raw;
  try { const v = JSON.parse(raw); return v && typeof v === 'object' ? v : {}; } catch { return {}; }
}

export function orderAt(doc, hospital) {
  const want = key(hospital);
  if (!want) return null;
  for (const [name, n] of Object.entries(ordersOf(doc))) {
    if (key(name) === want && Number.isInteger(Number(n)) && Number(n) > 0) return Number(n);
  }
  return null;
}

export function byHospitalOrder(doctors = [], hospital = '') {
  if (!hospital) return doctors;
  const numbered = doctors.map((d, i) => ({ d, i, n: orderAt(d, hospital) }));
  if (!numbered.some((x) => x.n !== null)) return doctors;
  return numbered
    .sort((a, b) => (a.n ?? Infinity) - (b.n ?? Infinity) || a.i - b.i)
    .map((x) => x.d);
}
