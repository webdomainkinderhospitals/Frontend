// The Kinder Hospitals management team, in the hospital's order (Nov 2026),
// shown on About Us as one series with their studio portraits.
// A member with a full profile links to it.
import { LEADERSHIP_PROFILES } from './leadership-profiles.mjs';
import { photoChosenInAdmin } from './studio-photos.mjs';

export const MANAGEMENT_TEAM = [
  // The leadership the hospital shows, in its order (20 Nov 2026).
  { slug: 'dr-v-k-pradeep-kumar', name: 'Dr V. K. Pradeep Kumar', role: 'Chairman', href: '#leadership-dr-v-k-pradeep-kumar', page: 'leadership-dr-v-k-pradeep-kumar' },
  { slug: 'renjith-krishnan', name: 'Renjith Krishnan', role: 'Managing Director & CEO', href: '#leadership-mr-renjith-krishnan', page: 'leadership-mr-renjith-krishnan' },
  // Group Financial Controller; his profile as imported from the hospital's
  // team documents ("Basanta Kumar Dash.docx"). Not one of our doctors.
  {
    slug: 'basanta-kumar-dash', name: 'Basanta Kumar Dash', role: 'Group Financial Controller', notDoctor: true,
    photo: '/leadership/basanta-kumar-dash.webp',
    profile: [
      'Mr. Basanta Kumar Dash has more than 12 years of experience in the healthcare industry and is currently the Group Financial Controller at Kinder Group of Hospitals, India.',
      'An established finance leader, he brings extensive global experience in shareholder value creation, project management, corporate governance, business partnering, treasury and funding, investor relations, cost management, taxation, financial accounting and reporting. His wide-ranging experience in financial management and internal controls significantly enhances the enterprise value of the Group.',
    ],
  },
  { slug: 'sivadas', name: 'Sivadas', role: 'General Manager, Human Resources' },
  // "Prasanth_MK_Professional_Profile.docx" (19 Nov 2026). Not one of our
  // doctors, so never matched to a doctor of the same first name.
  {
    slug: 'prasanth', name: 'Prasanth M. K.', role: 'Chief Information Officer', notDoctor: true,
    // his studio portrait as the hospital sent it (20 Nov 2026)
    photo: '/leadership/team/prasanth-m-k.webp',
    profile: [
      'Mr. Prasanth M. K. is an accomplished information technology leader with more than 18 years of experience spanning healthcare, hospitality and education. He combines strategic technology leadership with extensive hands-on expertise in enterprise resource planning systems, IT infrastructure and digital transformation.',
      'He holds a Master of Computer Applications from Bangalore University. His professional expertise includes implementing Hospital Information Systems, Radiology and Laboratory Information Systems, healthcare technology projects, enterprise applications, IT administration, and technology operations.',
      'As Chief Information Officer of Kinder Hospitals, he leads the Group’s information technology function, including implementing and managing its Hospital Information System and IT infrastructure across its centres in Cherthala, Kochi, Kollam and Bengaluru. His role focuses on building reliable, scalable and integrated technology platforms that support hospital operations and organisational growth.',
      'He also serves as Technology Advisor for Skill Keralam – Emerging Technology Skilling Program, a Government of Kerala initiative launched by the ICT Academy of Kerala (ICTAK), where he helps shape future-ready talent for Kerala by providing strategic guidance on emerging technology curriculum and industry alignment.',
      'Throughout his career, he has worked with prominent healthcare organisations including Westfort Hospital Group, Al Abeer Educity, Meitra Hospital and Kinder Medical Group. In these assignments, he contributed to IT infrastructure administration, HIS implementation, technology transformation, and deploying systems for new projects.',
      'He is also an active member of the CIO Association, Kerala Chapter.',
    ],
  },
  // His profile as the hospital sent it (20 Nov 2026).
  {
    slug: 'jithin-raj', name: 'Jithin Raj VR', role: 'Head – Media & Branding', notDoctor: true,
    profile: [
      'Great brands are built on trust, clarity, and a genuine connection with the people they serve. With over 15 years of experience in brand development, strategic marketing, and creative communications, Jithin Raj VR leads initiatives that translate organizational vision into strong, credible brand identities aligned with international standards.',
      'Combining strategic discipline with thoughtful storytelling, Jithin oversees brand positioning, digital marketing, media planning, and corporate communications. His focus is on creating cohesive, multi-channel brand experiences that build lasting audience loyalty and drive measurable business growth.',
      'Prior to his current leadership role, Jithin spent five years strengthening brand presence and public engagement at Manappuram Healthcare Pvt. Ltd., following a three-year tenure at Sha International Branding Solutions where he gained foundational expertise in agency-led brand building and creative execution. Today, he continues to guide brand strategy and communications with purpose, consistency, and impact.',
    ],
  },
  // Kept for their portraits (Dr Sojo and Dr Abeesh's doctor cards) but not
  // shown in the leadership, as the hospital asked (20 Nov 2026).
  { hidden: true, slug: 'sreejith-s', name: 'Sreejith S', role: 'General Manager, Healthcare Promotions' },
  { hidden: true, slug: 'anto-twinkle', name: 'Anto Twinkle', role: 'Chief Operating Officer, Kinder Hospitals Kochi', href: '/hospitals/kochi/information/leadership-mr-anto-twinkle', page: 'leadership-mr-anto-twinkle' },
  { hidden: true, slug: 'sojo', name: 'Sojo', role: '' },
  { hidden: true, slug: 'abeesh', name: 'Abeesh', role: '' },
].map((m) => ({ ...m, photo: m.photo || `/leadership/team/${m.slug}.webp` }));

// Team members who also practise as doctors: the doctor in the site's list
// whose name is this member's (the same full name, or for a first name only,
// the one doctor of that first name), so the doctor card can use the new
// portrait and the team card can open the doctor's profile.
const words = (name) => String(name || '').toLowerCase()
  .replace(/brigadier|\(dr\.?\)|\bdr\b\.?|\bmr\b\.?|\bmrs\b\.?|\bms\b\.?/g, ' ')
  .replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(Boolean);
export function doctorOfMember(member, doctors = []) {
  if (member.notDoctor) return null;
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
    if (m.profile) { out[m.slug] = { text: m.profile.join('\n\n') }; continue; }
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
