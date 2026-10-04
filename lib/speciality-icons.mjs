// One icon per speciality, from the hospital's own icon set (the client's
// "Medical Specialties" directory, 32 icons in public/icons/specialities).
// The icon is picked from the department's name so every department —
// including ones added later in the admin — gets a fitting picture wherever
// specialities are listed. Rules run top to bottom and the first match wins,
// so "Paediatric Surgery" is the paediatric-surgery icon and "General &
// Laparoscopic Surgery" general surgery, not gynaecology. Anything
// unrecognised gets General Medicine.
//
// (The component in components/SpecialityIcon.js draws it.) The SVG is drawn as a CSS mask filled with currentColor, so one file works
// on light tiles and dark ones, and the browser caches each icon once.

export const SPECIALITY_ICONS = [
  'anaesthesiology', 'cardiology', 'cosmetic-gynaecology', 'dental', 'dermatology', 'emergency-medicine',
  'endocrinology', 'ent', 'fetomaternal-medicine', 'gastroenterology', 'general-medicine', 'general-surgery',
  'geriatrics', 'gynaecological-oncology', 'gynaecology', 'hepatology', 'joint-replacement', 'neonatology',
  'nephrology', 'neurology', 'neurosurgery', 'ophthalmology', 'orthopaedics', 'paediatric-orthopaedics',
  'paediatric-surgery', 'paediatrics', 'plastic-surgery', 'psychiatry', 'pulmonology', 'radiology',
  'reproductive-medicine', 'urology',
];

const RULES = [
  [/cosmetic gyn/, 'cosmetic-gynaecology'],
  [/oncolog|cancer|tumou?r/, 'gynaecological-oncology'],
  [/paediatric ortho|pediatric ortho/, 'paediatric-orthopaedics'],
  [/paediatric surg|pediatric surg/, 'paediatric-surgery'],
  [/paediatric urol|pediatric urol|androl/, 'urology'],
  [/feto-?maternal|fetal|foetal/, 'fetomaternal-medicine'],
  [/neonat|nicu|newborn/, 'neonatology'],
  [/paediatric|pediatric/, 'paediatrics'],
  [/obstet|pregnan|maternity|labou?r|deliver|birth|antenatal|\banc\b|midwi|lactation/, 'gynaecology'],
  [/reproduct|ivf|\biui\b|icsi|fertil|embryo/, 'reproductive-medicine'],
  [/derma|skin|hair/, 'dermatology'],
  [/plastic|cosmet|aesthetic/, 'plastic-surgery'],
  [/hepat|\bliver\b/, 'hepatology'],
  [/joint|replacement|spine/, 'joint-replacement'],
  [/neurosurg/, 'neurosurgery'],
  [/neuro|brain|epilep|stroke/, 'neurology'],
  [/ortho|bone|sport|fractur|physio|rehab/, 'orthopaedics'],
  [/anaesth|anesth|pain|critical|intensiv|\bp?icu\b/, 'anaesthesiology'],
  [/emergenc|trauma|casualty|ambulance/, 'emergency-medicine'],
  [/cardi|heart|vascul/, 'cardiology'],
  [/dent|oral|maxillo/, 'dental'],
  [/\bent\b|otolaryn|\bears?\b|hearing|audio|speech/, 'ent'],
  [/general.*surg/, 'general-surgery'],
  [/general medicine|internal medicine/, 'general-medicine'],
  [/gastro|digest|endoscop|diet|nutri/, 'gastroenterology'],
  [/nephro|kidney|dialysis/, 'nephrology'],
  [/urolog/, 'urology'],
  [/ophthal|\beyes?\b|vision/, 'ophthalmology'],
  [/psych|mental|counsel|behavio/, 'psychiatry'],
  [/pulmo|respir|lung|asthma|chest/, 'pulmonology'],
  [/radiol|imaging|scan|diagnos|ultraso|x-?ray/, 'radiology'],
  [/endocrin|diabet|thyroid|hormon/, 'endocrinology'],
  [/geriatr|elderly/, 'geriatrics'],
  [/gyn|women|laparoscop|hysteroscop|menopaus/, 'gynaecology'],
  [/paediat|pediat|child|\bkids?\b|infant|adolescen|vaccin|immuni/, 'paediatrics'],
  [/surg/, 'general-surgery'],
];

export function specialityIconKey(name) {
  const n = String(name || '').toLowerCase();
  return (RULES.find(([re]) => re.test(n)) || [null, 'general-medicine'])[1];
}

// A department's icon, or an icon picked by its key from SPECIALITY_ICONS.
export const specialityIconUrl = (name, key) =>
  `/icons/specialities/${SPECIALITY_ICONS.includes(key) ? key : specialityIconKey(name)}.svg`;
