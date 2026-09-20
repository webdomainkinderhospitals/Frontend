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

// A speciality page inside a centre's sub-site.
//
// A centre's own departments are tagged to it and so never appear in the group
// catalogue, which takes only untagged specialities. Resolve them first, then
// the catalogue, then a department named only by one of the centre's doctors —
// so a card on the centre's page never links to a page that doesn't exist.
export function findHospitalService(content, loc, slug) {
  const atLoc = (item) =>
    String(item?.location || '')
      .split(',')
      .some((l) => l.trim().toLowerCase() === String(loc?.name || '').trim().toLowerCase());

  const own = (content.specialities || []).filter((s) => s.published !== false && atLoc(s));
  const listed = (items) => items.map((s) => ({ name: s.name, description: s.description }));

  const mine = own.find((s) => slugify(s.name) === slug);
  if (mine) {
    const siblings = mine.category ? own.filter((s) => s.category === mine.category) : [];
    return {
      name: mine.name,
      description: mine.description,
      fullDescription: mine.fullDescription,
      slug,
      group: {
        id: '',
        title: mine.category || `Departments at Kinder ${loc.name}`,
        items: listed(siblings.length > 1 ? siblings : own),
      },
    };
  }

  const corporate = findService(content.specialities, slug);
  if (corporate) return corporate;

  // A doctor's speciality that is not a listed department still deserves a
  // page rather than a dead link from their card.
  const named = (content.doctors || [])
    .filter((d) => d.published !== false && atLoc(d) && d.speciality)
    .map((d) => d.speciality)
    .find((name) => slugify(name) === slug);
  if (!named) return null;
  return {
    name: named,
    description: '',
    slug,
    group: { id: '', title: `Departments at Kinder ${loc.name}`, items: listed(own) },
  };
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
        ? own.map((s) => ({ name: s.name, description: s.description, fullDescription: s.fullDescription }))
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
