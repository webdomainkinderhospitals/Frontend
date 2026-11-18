// The Kinder Hospitals management team, in the hospital's order (Nov 2026),
// shown on About Us as one series with their studio portraits.
// A member with a full profile links to it.
import { LEADERSHIP_PROFILES } from './leadership-profiles.mjs';
import { photoChosenInAdmin } from './studio-photos.mjs';

export const MANAGEMENT_TEAM = [
  { slug: 'dr-v-k-pradeep-kumar', name: 'Dr V. K. Pradeep Kumar', role: 'Chairman', href: '#leadership-dr-v-k-pradeep-kumar', page: 'leadership-dr-v-k-pradeep-kumar' },
  { slug: 'renjith-krishnan', name: 'Renjith Krishnan', role: 'Managing Director & CEO', href: '#leadership-mr-renjith-krishnan', page: 'leadership-mr-renjith-krishnan' },
  { slug: 'sreejith-s', name: 'Sreejith S', role: 'General Manager, Healthcare Promotions' },
  { slug: 'jithin-raj', name: 'Jithin Raj', role: 'Head, Branding & Media' },
  { slug: 'sivadas', name: 'Sivadas', role: 'General Manager, Human Resources' },
  { slug: 'anto-twinkle', name: 'Anto Twinkle', role: 'Chief Operating Officer, Kinder Hospitals Kochi', href: '/hospitals/kochi/information/leadership-mr-anto-twinkle', page: 'leadership-mr-anto-twinkle' },
  { slug: 'sijo', name: 'Sijo', role: '' },
  { slug: 'prasanth', name: 'Prasanth', role: '' },
  { slug: 'abeesh', name: 'Abeesh', role: '' },
].map((m) => ({ ...m, photo: `/leadership/team/${m.slug}.webp` }));

// Team members who also practise as doctors: the doctor in the site's list
// whose name is this member's (the same full name, or for a first name only,
// the one doctor of that first name), so the doctor card can use the new
// portrait and the team card can open the doctor's profile.
const words = (name) => String(name || '').toLowerCase()
  .replace(/brigadier|\(dr\.?\)|\bdr\b\.?|\bmr\b\.?|\bmrs\b\.?|\bms\b\.?/g, ' ')
  .replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(Boolean);
export function doctorOfMember(member, doctors = []) {
  const want = words(member.name);
  if (!want.length) return null;
  const same = doctors.filter((d) => words(d.name).join('') === want.join(''));
  if (same.length === 1) return same[0];
  if (same.length > 1) return null;
  const byFirstLast = want.length > 1
    ? doctors.filter((d) => { const w = words(d.name); return w[0] === want[0] && w.at(-1) === want.at(-1); })
    : doctors.filter((d) => words(d.name)[0] === want[0]);
  return byFirstLast.length === 1 ? byFirstLast[0] : null;
}

export function withTeamPhotos(doctors = []) {
  const photoOf = new Map();
  for (const m of MANAGEMENT_TEAM) {
    const doc = doctorOfMember(m, doctors);
    if (doc && !photoChosenInAdmin(doc)) photoOf.set(doc, m.photo);
  }
  return photoOf.size ? doctors.map((d) => (photoOf.has(d) ? { ...d, imageUrl: photoOf.get(d) } : d)) : doctors;
}

// The team as the first cards of the home page's doctor slider, in the
// hospital's order. A member who is in the doctor list is that doctor's own
// card (with the new portrait); anyone else gets a card of their own with
// their role, opening their profile on About Us.
export function teamAsDoctors(doctors = []) {
  return MANAGEMENT_TEAM.map((m) => {
    const doc = doctorOfMember(m, doctors);
    if (doc) return { ...doc, imageUrl: photoChosenInAdmin(doc) ? doc.imageUrl : m.photo, teamOf: doc };
    return {
      id: `team-${m.slug}`, name: m.name, speciality: m.role, designation: '', imageUrl: m.photo,
      location: m.slug === 'anto-twinkle' ? 'Kochi' : '',
      profileHref: m.href && m.href.startsWith('#') ? `/about${m.href}` : (m.href || '/about#leadership'),
      bookable: false,
      team: m.slug,
    };
  });
}

// What a team member's profile shows when it opens over the page: the
// written profile for the Chairman and the CEO, a leader's Content Library
// page (Mr Anto Twinkle) with its name line left out, and for everyone else
// their name and role only. Keyed by the member's slug.
const plainName = (s) => String(s || '').toLowerCase().replace(/^(dr|mr|mrs|ms)\.?\s+/, '').replace(/[^a-z]/g, '');
export function teamProfiles(pages = []) {
  const out = {};
  for (const m of MANAGEMENT_TEAM) {
    const written = LEADERSHIP_PROFILES.find((p) => p.slug === m.page);
    if (written) {
      out[m.slug] = { text: written.bio.join('\n\n'), quote: written.quote, facts: written.facts };
      continue;
    }
    const page = m.page && (pages || []).find((p) => p.slug === m.page);
    if (!page) continue;
    const paras = String(page.body || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    if (paras.length && plainName(paras[0]) === plainName(m.name)) paras.shift();
    if (paras.length) out[m.slug] = { text: paras.join('\n\n') };
  }
  return out;
}
