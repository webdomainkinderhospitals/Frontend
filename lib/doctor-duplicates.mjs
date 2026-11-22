// Doctors listed twice: an incomplete copy (no written profile) of a doctor
// who also has a full profile at the same hospital — e.g. a stray
// "Dr.Roshan" beside "Dr. Roshna Ramachandran". The copy without a profile
// is left out wherever doctors are shown. Only a profile-less record is ever
// dropped, and only when its twin at the same hospital has a profile.

const firstName = (name) => String(name || '')
  .replace(/brigadier|\(dr\.?\)|\bdr\b\.?/gi, ' ')
  .trim().split(/[\s.]+/).find((w) => w.length > 1)?.toLowerCase() || '';
const letters = (s) => [...s].sort().join('');
const placesOf = (doc) => String(doc.location || '').split(',').map((s) => s.trim().toLowerCase().replace(/^cochin$/, 'kochi')).filter(Boolean);
const hasProfile = (doc) => String(doc.fullBio || '').trim().length >= 80;

// Same person: the same first name, or one with two letters swapped
// ("Roshan" / "Roshna"), at a hospital they share (or no hospital set).
function samePerson(a, b) {
  const fa = firstName(a.name), fb = firstName(b.name);
  if (fa.length < 3 || fb.length < 3 || letters(fa) !== letters(fb)) return false;
  const pa = placesOf(a), pb = placesOf(b);
  return !pa.length || !pb.length || pa.some((p) => pb.includes(p));
}

export function withoutDuplicateDoctors(doctors = []) {
  return doctors.filter((doc) => hasProfile(doc)
    || !doctors.some((other) => other !== doc && hasProfile(other) && samePerson(doc, other)));
}

// Where all hospitals' doctors are shown together, a doctor with a separate
// record at each of their hospitals (the same full name) is one card listing
// every hospital, rather than the same card twice. Each hospital's own pages
// keep its own record.
const fullName = (name) => String(name || '').toLowerCase()
  .replace(/brigadier|\(dr\.?\)|\bdr\b\.?/g, ' ').replace(/[^a-z]/g, '');

export function oneCardPerDoctor(doctors = []) {
  const seen = new Map();
  const out = [];
  for (const doc of doctors) {
    const k = fullName(doc.name);
    if (!k || !seen.has(k)) { if (k) seen.set(k, out.length); out.push(doc); continue; }
    const first = seen.get(k);
    const kept = out[first];
    const places = [...new Set([...String(kept.location || '').split(','), ...String(doc.location || '').split(',')].map((s) => s.trim()).filter(Boolean))];
    // a record for the whole group (no hospital) stays one for the whole group
    out[first] = { ...kept, location: kept.location && doc.location ? places.join(', ') : '', fullBio: kept.fullBio || doc.fullBio, imageUrl: kept.imageUrl || doc.imageUrl };
  }
  return out;
}
