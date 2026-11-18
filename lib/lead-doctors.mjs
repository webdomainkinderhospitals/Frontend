// The doctors the group lists first wherever all its doctors are shown
// together (the home page's "Meet our doctors" with All hospitals, and the
// Our Doctors page before a hospital is picked), as the hospital asked
// (18 Nov 2026). The rest follow in their usual order.
const LEAD = ['Brigadier (Dr.) A P Radhakrishnan', 'Dr. Ananthen K S'];

const key = (name) => String(name || '').toLowerCase()
  .replace(/brigadier|\(dr\.?\)|\bdr\b\.?/g, ' ')
  .replace(/[^a-z]/g, '');

export function leadDoctorsFirst(doctors = []) {
  const lead = LEAD.map((name) => doctors.find((d) => key(d.name) === key(name))).filter(Boolean);
  if (!lead.length) return doctors;
  const taken = new Set(lead);
  return [...lead, ...doctors.filter((d) => !taken.has(d))];
}
