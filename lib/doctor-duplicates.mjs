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
