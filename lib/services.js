// Corporate service groups: built from the admin-managed specialities
// (grouped by their `category`), falling back to the shipped catalogue for
// any group the database doesn't cover yet.

export const SERVICE_GROUPS = [
  {
    id: 'maternity',
    title: 'Maternity & Pregnancy',
    intro: 'From your first scan to your baby’s first vaccines — one seamless journey.',
    fallback: ['Obstetrics', 'Maternity', 'High Risk Pregnancy', 'Mother & Child Care Programme', 'Fetal Medicine', 'Labor & Delivery Pain Management', 'Lactation Support', 'ANC Classes'],
  },
  {
    id: 'fertility',
    title: 'Fertility & Gynaecology',
    intro: 'ART-certified IVF laboratories and senior fertility specialists.',
    fallback: ['Infertility Treatment', 'IVF', 'IUI', 'ICSI', 'Gynecology & Laparoscopic Surgery', 'Reproductive Medicine', 'Gynaec Oncology', "Women's Wellness"],
  },
  {
    id: 'children',
    title: "Children's Care",
    intro: 'From Level III NICU intensive care to everyday paediatrics.',
    fallback: ['Paediatrics', 'General Paediatrics', 'Paediatric Surgery', 'Neonatology', 'Pediatric Intensivist (PICU)', 'Pediatric Anesthesia', 'Pediatric Nephrology', 'Audiology & Speech Therapy'],
  },
  {
    id: 'allied',
    title: 'Allied & Wellness',
    intro: 'Complete care for the whole family, under one roof.',
    fallback: ['General Medicine', 'General Surgery', 'Dermatology & Cosmetology', 'Orthopaedics & Sports Med', 'Plastic & Cosmetic Surgery', 'General ENT', 'Anesthesiology & Pain', 'Dietetics & Nutrition', 'Physiotherapy'],
  },
];

const norm = (s) => String(s || '').trim().toLowerCase();

export const slugify = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// A doctor belongs to a service when their speciality matches its name —
// exactly, or as part of a wider label (e.g. "Infertility & IVF" → IVF).
export function matchesService(docSpeciality, serviceName) {
  const d = norm(docSpeciality);
  const s = norm(serviceName);
  return !!d && !!s && (d === s || d.includes(s));
}

// Flat list of every corporate service with its slug and group.
export function allServices(specialities = []) {
  const list = [];
  for (const group of groupServices(specialities)) {
    for (const item of group.items) {
      list.push({ ...item, slug: slugify(item.name), group });
    }
  }
  return list;
}

export function findService(specialities, slug) {
  return allServices(specialities).find((s) => s.slug === slug);
}

export function doctorsForService(serviceName, doctors = []) {
  return doctors.filter((d) => d.published !== false && matchesService(d.speciality, serviceName));
}

// -> [{id, title, intro, items: [{name, description?}]}]
export function groupServices(specialities = []) {
  const corporate = specialities.filter((s) => !s.location && s.published !== false);
  return SERVICE_GROUPS.map((g) => {
    const own = corporate.filter((s) => s.category === g.title);
    return {
      ...g,
      items: own.length
        ? own.map((s) => ({ name: s.name, description: s.description }))
        : g.fallback.map((name) => ({ name })),
    };
  });
}

// Doctors whose speciality matches one of the group's service names.
export function doctorsForGroup(group, doctors = []) {
  return doctors.filter(
    (d) => d.published !== false && group.items.some((i) => matchesService(d.speciality, i.name))
  );
}
