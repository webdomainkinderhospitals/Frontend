// The same speciality under the names the group's catalogue has used (the
// backend's catalogue keeps the older names as aliases: "Plastic & Cosmetic"
// for "Plastic & Cosmetic Surgery"…). A link written with one name still
// opens the page when the database lists the speciality under another.
const GROUPS = [
  ['plastic-and-cosmetic-surgery', 'plastic-and-cosmetic'],
  ['gynecology-and-laparoscopic-surgery', 'gynaec-and-laparoscopic', 'gynaecology-and-laparoscopic-surgery'],
  ['infertility-treatment', 'infertility-and-ivf'],
  ['dermatology-and-cosmetology', 'dermatology'],
  ['paediatric-surgery', 'paed-surgery'],
  ['orthopaedics-and-sports-med', 'orthopaedics-and-sports-medicine', 'orthopaedics'],
  ['anesthesiology-and-pain', 'anaesthesiology-and-pain'],
];

// Every name the speciality behind `slug` goes by (the slug itself first).
export function sameService(slug) {
  const group = GROUPS.find((g) => g.includes(slug));
  return group ? [slug, ...group.filter((s) => s !== slug)] : [slug];
}
