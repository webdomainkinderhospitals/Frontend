// One icon per speciality, from the hospital's own icon set: the client's
// "Medical Specialties" directory (32 icons), plus a few drawn in the same
// line style for departments the directory has no picture for (IVF, IUI,
// ICSI, lactation, andrology…). All live in public/icons/specialities.
//
// The icon is picked from the department's name, so every department —
// including ones added later in the admin — gets a fitting picture. Each
// rule lists its icons in order of preference. A single icon takes the
// first; a list (a menu, a hospital's departments) gives each department
// the first of its icons not already shown in that list, so no picture
// appears twice. Rules run top to bottom and the first match wins, so
// "Paediatric Surgery" is the paediatric-surgery icon and "General &
// Laparoscopic Surgery" general surgery, not gynaecology. Anything
// unrecognised gets General Medicine.
//
// (components/SpecialityIcon.js draws it.) The SVG is a CSS mask filled with
// currentColor, so one file works on light tiles and dark bands alike, and
// the browser caches each icon once.

const CLIENT_ICONS = [
  'anaesthesiology', 'cardiology', 'cosmetic-gynaecology', 'dental', 'dermatology', 'emergency-medicine',
  'endocrinology', 'ent', 'fetomaternal-medicine', 'gastroenterology', 'general-medicine', 'general-surgery',
  'geriatrics', 'gynaecological-oncology', 'gynaecology', 'hepatology', 'joint-replacement', 'neonatology',
  'nephrology', 'neurology', 'neurosurgery', 'ophthalmology', 'orthopaedics', 'paediatric-orthopaedics',
  'paediatric-surgery', 'paediatrics', 'plastic-surgery', 'psychiatry', 'pulmonology', 'radiology',
  'reproductive-medicine', 'urology',
];
const DRAWN_ICONS = [
  'andrology', 'antenatal-classes', 'child-health', 'critical-care', 'diabetology', 'dietetics',
  'high-risk-pregnancy', 'icsi', 'iui', 'ivf', 'laboratory', 'labour-care', 'lactation', 'mother-child',
  'paediatric-urology', 'pharmacy', 'physiotherapy', 'speech-therapy', 'wellness', 'womens-health',
];
export const SPECIALITY_ICONS = [...CLIENT_ICONS, ...DRAWN_ICONS];

// [pattern, icons in order of preference]
const RULES = [
  [/cosmetic gyn/, ['cosmetic-gynaecology', 'womens-health']],
  [/oncolog|cancer|tumou?r/, ['gynaecological-oncology', 'womens-health']],
  [/paediatric ortho|pediatric ortho/, ['paediatric-orthopaedics', 'orthopaedics']],
  [/paediatric surg|pediatric surg/, ['paediatric-surgery', 'general-surgery']],
  [/paediatric (urol|nephro)|pediatric (urol|nephro)/, ['paediatric-urology', 'urology', 'nephrology']],
  [/paediatric (intensiv|critical)|pediatric (intensiv|critical)|picu/, ['critical-care', 'paediatrics', 'anaesthesiology']],
  [/paediatric an(a)?esth|pediatric an(a)?esth/, ['anaesthesiology', 'critical-care', 'paediatrics']],
  [/androl/, ['andrology', 'urology']],
  [/feto-?maternal|fetal|foetal/, ['fetomaternal-medicine', 'radiology']],
  [/neonat|nicu|newborn/, ['neonatology', 'child-health']],
  [/general paediat|general pediat/, ['paediatrics', 'child-health']],
  [/paediatric|pediatric/, ['paediatrics', 'child-health', 'paediatric-surgery']],
  [/lactation|breast ?feed|feeding/, ['lactation', 'mother-child']],
  [/\banc\b|antenatal|class|education/, ['antenatal-classes', 'gynaecology']],
  [/labou?r|deliver/, ['labour-care', 'anaesthesiology', 'gynaecology']],
  [/high.?risk/, ['high-risk-pregnancy', 'fetomaternal-medicine', 'gynaecology']],
  [/mother|maternity/, ['mother-child', 'paediatric-orthopaedics', 'gynaecology', 'paediatrics']],
  [/\bicsi\b/, ['icsi', 'laboratory', 'reproductive-medicine']],
  [/\biui\b|insemination/, ['iui', 'reproductive-medicine']],
  [/\bivf\b|in vitro/, ['ivf', 'reproductive-medicine']],
  [/embryo|laborator|patholog|\blab\b/, ['laboratory', 'icsi']],
  [/reproduct|fertil/, ['reproductive-medicine', 'ivf', 'laboratory']],
  [/derma|skin|hair/, ['dermatology', 'plastic-surgery']],
  [/plastic|cosmet|aesthetic/, ['plastic-surgery', 'dermatology']],
  [/hepat|\bliver\b/, ['hepatology', 'gastroenterology']],
  [/joint|replacement|spine/, ['joint-replacement', 'orthopaedics']],
  [/neurosurg/, ['neurosurgery', 'neurology']],
  [/neuro|brain|epilep|stroke/, ['neurology', 'neurosurgery']],
  [/physio|rehab/, ['physiotherapy', 'orthopaedics']],
  [/ortho|bone|sport|fractur/, ['orthopaedics', 'joint-replacement', 'physiotherapy']],
  [/anaesth|anesth|pain/, ['anaesthesiology', 'critical-care', 'pharmacy']],
  [/critical|intensiv|\bicu\b/, ['critical-care', 'anaesthesiology']],
  [/emergenc|trauma|casualty|ambulance/, ['emergency-medicine', 'critical-care']],
  [/cardi|heart|vascul/, ['cardiology', 'high-risk-pregnancy']],
  [/dent|oral|maxillo/, ['dental']],
  [/audio|speech|hearing/, ['speech-therapy', 'ent']],
  [/\bent\b|otolaryn|\bears?\b/, ['ent', 'speech-therapy']],
  [/general.*surg/, ['general-surgery']],
  [/general medicine|internal medicine/, ['general-medicine', 'diabetology']],
  [/diet|nutri/, ['dietetics', 'gastroenterology']],
  [/gastro|digest|endoscop/, ['gastroenterology', 'hepatology']],
  [/nephro|kidney|dialysis/, ['nephrology', 'urology']],
  [/urolog/, ['urology', 'nephrology']],
  [/ophthal|\beyes?\b|vision/, ['ophthalmology']],
  [/psych|mental|counsel|behavio/, ['psychiatry', 'neurology']],
  [/pulmo|respir|lung|asthma|chest/, ['pulmonology']],
  [/radiol|imaging|scan|diagnos|ultraso|x-?ray/, ['radiology', 'fetomaternal-medicine', 'laboratory']],
  [/diabet/, ['diabetology', 'endocrinology']],
  [/endocrin|thyroid|hormon/, ['endocrinology', 'diabetology']],
  [/geriatr|elderly/, ['geriatrics']],
  [/pharma/, ['pharmacy', 'general-medicine']],
  [/wellness|health check|preventive/, ['wellness', 'womens-health']],
  [/obstet|pregnan|birth|midwi/, ['gynaecology', 'high-risk-pregnancy', 'mother-child']],
  [/women/, ['womens-health', 'gynaecology']],
  [/gyn|laparoscop|hysteroscop|menopaus/, ['gynaecology', 'cosmetic-gynaecology', 'womens-health']],
  [/child|\bkids?\b|infant|adolescen|vaccin|immuni/, ['paediatrics', 'child-health']],
  [/surg/, ['general-surgery']],
];
const FALLBACK = ['general-medicine', 'wellness'];

// Every icon that fits a department, best first.
export function specialityIconChoices(name) {
  const n = String(name || '').toLowerCase();
  return (RULES.find(([re]) => re.test(n)) || [null, FALLBACK])[1];
}

export const specialityIconKey = (name) => specialityIconChoices(name)[0];

// Icons for a list of departments shown together, with no picture repeated.
// It is an assignment problem: each department may take any of its choices,
// a better-ranked choice costs less, and sharing an icon (only when every
// choice is taken) costs most. The cheapest assignment keeps as many first
// choices as possible; ties favour the department listed first.
const SHARE = 100;
export function uniqueSpecialityIcons(names = []) {
  const choices = names.map(specialityIconChoices);
  const n = names.length;
  if (!n) return [];
  const icons = [...new Set(choices.flat())];
  const m = icons.length + n; // every icon, plus one "share" column per department
  const INF = 1e9;
  const cost = (i, j) => {
    if (j < icons.length) {
      const rank = choices[i].indexOf(icons[j]);
      return rank < 0 ? INF : rank * (1 + (n - i) / (n + 1));
    }
    return j - icons.length === i ? SHARE : INF;
  };
  // Hungarian algorithm (rows = departments, columns = icons and shares).
  const u = new Array(n + 1).fill(0);
  const v = new Array(m + 1).fill(0);
  const p = new Array(m + 1).fill(0);
  const way = new Array(m + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    p[0] = i;
    let j0 = 0;
    const minv = new Array(m + 1).fill(Infinity);
    const used = new Array(m + 1).fill(false);
    do {
      used[j0] = true;
      const i0 = p[j0];
      let delta = Infinity;
      let j1 = 0;
      for (let j = 1; j <= m; j++) {
        if (used[j]) continue;
        const cur = cost(i0 - 1, j - 1) - u[i0] - v[j];
        if (cur < minv[j]) { minv[j] = cur; way[j] = j0; }
        if (minv[j] < delta) { delta = minv[j]; j1 = j; }
      }
      for (let j = 0; j <= m; j++) {
        if (used[j]) { u[p[j]] += delta; v[j] -= delta; } else minv[j] -= delta;
      }
      j0 = j1;
    } while (p[j0] !== 0);
    do { const j1 = way[j0]; p[j0] = p[j1]; j0 = j1; } while (j0);
  }
  const keys = choices.map((c) => c[0]);
  for (let j = 1; j <= icons.length; j++) if (p[j]) keys[p[j] - 1] = icons[j - 1];
  return keys;
}

// The same as a lookup: department name -> its icon in this list.
export function iconsForList(names = []) {
  const keys = uniqueSpecialityIcons(names);
  return new Map(names.map((name, i) => [name, keys[i]]));
}

// A department's icon, or an icon picked by its key from SPECIALITY_ICONS.
export const specialityIconUrl = (name, key) =>
  `/icons/specialities/${SPECIALITY_ICONS.includes(key) ? key : specialityIconKey(name)}.svg`;
