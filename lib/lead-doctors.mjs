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

// Each department's head, as the hospital named them (22 Nov 2026), listed
// first among their department's doctors wherever those are shown: the
// speciality pages, a hospital's doctors, the Our Doctors page and booking.
// Everyone else keeps their place (and the admin's serial order).
export const DEPARTMENT_HEADS = [
  'Brigadier (Dr.) A P Radhakrishnan', // General Medicine
  'Dr. Smitha Surendran', // Gynaecology
  'Dr. Praveen Kumar K S', // Orthopaedics
  'Dr. Vinay Raj', // ENT
  'Dr. Abhishek Radhakrishnan', // IVF / Reproductive Medicine
  'Dr. Boban Abraham', // Fetomaternal Medicine
];
const HEADS = new Set(DEPARTMENT_HEADS.map(key));
const dept = (d) => String(d.speciality || '').trim().toLowerCase().replace(/&/g, 'and').replace(/[^a-z]+/g, ' ').trim();

// The same list with each department's head moved up to where that
// department's first doctor stood. `oneDepartment`: the list is a single
// department's (a speciality page), whatever each doctor's department is
// called, so its head simply comes first.
export function departmentHeadsFirst(doctors = [], { oneDepartment = false } = {}) {
  if (oneDepartment) {
    const heads = doctors.filter((d) => HEADS.has(key(d.name)));
    return [...heads, ...doctors.filter((d) => !heads.includes(d))];
  }
  const out = [...doctors];
  for (const head of doctors.filter((d) => HEADS.has(key(d.name)) && dept(d))) {
    const from = out.indexOf(head);
    const to = out.findIndex((d) => dept(d) === dept(head));
    if (to < from && !HEADS.has(key(out[to].name))) {
      out.splice(from, 1);
      out.splice(to, 0, head);
    }
  }
  return out;
}
