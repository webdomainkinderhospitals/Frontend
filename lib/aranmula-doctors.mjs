import { fitsName } from './doctor-profiles.mjs';

// Doctors the hospital asked to list at Kinder Aranmula (27 Nov 2026). A
// doctor already on the site (at another hospital) gets Aranmula added to
// their hospitals; one not yet on the site is added at Aranmula, with the
// speciality and degrees in the hospital's profile. Their portraits and profiles come
// from lib/studio-photos.mjs and lib/doctor-profiles.mjs. Dr Charlie Cherian
// came without a speciality, so he is only added to Aranmula when he is
// already on the site. The backend adds the same doctors to the database
// (backend/src/lib/bootstrapAranmula.js, v4).
const PLACE = 'Aranmula';
const JOINING = [
  { name: 'Dr. Chris Placid', speciality: 'Paediatrics', bio: 'MBBS, MD (Pediatrics), Fellowship in Neonatology' },
  { name: 'Dr. Simi Thomas', speciality: 'Obstetrics & Gynaecology', bio: 'Fellowship in Minimal Access Surgery, Fellowship in Reproductive Medicine, Professional Diploma in Fetal Medicine' },
  { name: 'Dr. Charlie Cherian', onlyIfListed: true },
];

const places = (doc) => String(doc.location || '').split(',').map((s) => s.trim()).filter(Boolean);
const here = (doc) => places(doc).some((p) => p.toLowerCase() === PLACE.toLowerCase());
const slug = (name) => String(name).toLowerCase().replace(/\bdr\b\.?/g, '').replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');

export function withAranmulaDoctors(doctors = []) {
  let out = doctors;
  for (const join of JOINING) {
    const listed = out.filter((d) => fitsName(join.name, d.name));
    if (listed.some(here)) continue;
    // a doctor for the whole group (no hospital) is already shown everywhere
    if (listed.some((d) => !places(d).length)) continue;
    if (listed.length) {
      const first = listed[0];
      out = out.map((d) => (d === first ? { ...d, location: [...places(d), PLACE].join(', ') } : d));
    } else if (!join.onlyIfListed) {
      out = [...out, {
        id: `aranmula-${slug(join.name)}`, name: join.name, designation: '', speciality: join.speciality,
        location: PLACE, bio: join.bio, fullBio: '', imageUrl: '', published: true,
      }];
    }
  }
  return out;
}
