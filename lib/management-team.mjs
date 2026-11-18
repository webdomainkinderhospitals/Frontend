// The Kinder Hospitals management team, in the hospital's order (Nov 2026),
// shown on About Us as one series with their studio portraits.
// A member with a full profile links to it.
export const MANAGEMENT_TEAM = [
  { slug: 'dr-v-k-pradeep-kumar', name: 'Dr V. K. Pradeep Kumar', role: 'Chairman', href: '#leadership-dr-v-k-pradeep-kumar' },
  { slug: 'renjith-krishnan', name: 'Renjith Krishnan', role: 'Managing Director & CEO', href: '#leadership-mr-renjith-krishnan' },
  { slug: 'sreejith-s', name: 'Sreejith S', role: 'General Manager, Healthcare Promotions' },
  { slug: 'jithin-raj', name: 'Jithin Raj', role: 'Head, Branding & Media' },
  { slug: 'sivadas', name: 'Sivadas', role: 'General Manager, Human Resources' },
  { slug: 'anto-twinkle', name: 'Anto Twinkle', role: 'Chief Operating Officer, Kinder Hospitals Kochi', href: '/hospitals/kochi/information/leadership-mr-anto-twinkle' },
  { slug: 'sijo', name: 'Sijo', role: '' },
  { slug: 'prasanth', name: 'Prasanth', role: '' },
  { slug: 'abeesh', name: 'Abeesh', role: '' },
].map((m) => ({ ...m, photo: `/leadership/team/${m.slug}.webp` }));
