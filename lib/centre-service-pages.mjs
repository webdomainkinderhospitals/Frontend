import { KOCHI_FINAL_PAGES } from './kochi-final-pages.mjs';
import { KOCHI_DEPARTMENTS, KOCHI_ENT } from './kochi-departments.mjs';

// Speciality pages a hospital has written in full for its own site, shown on
// /hospitals/<centre>/services/<speciality> in place of the short description
// from the admin: the opening paragraph under the title, the page body, its
// questions and answers (also published as FAQPage structured data) and the
// search title and description.
//
// Kochi · General Medicine: "Kinder-General-Medicine-Page-Rewrite.docx"
// (19 Nov 2026). Kochi · ENT and every other Kochi department: the hospital's
// department texts (20 Nov 2026, lib/kochi-departments.mjs). "Kinder
// Hospital" is written as the site's brand.

const PAGES = {
  kochi: {
    'general-medicine': {
      metaTitle: 'General Medicine & Vaccination Clinic in Kochi | Kinder Hospitals',
      metaDescription: 'The Department of General Medicine at Kinder Hospitals Kochi offers diagnosis and treatment for diabetes, hypertension, chronic illness and infections, plus dedicated diabetic and vaccination clinics — adult, paediatric, women’s and travel vaccination.',
      heading: 'General Medicine (Internal Medicine) in Kochi',
      intro: 'The Department of General Medicine at Kinder Hospitals Kochi, also known as internal medicine, handles the prevention, diagnosis and non-surgical treatment of diseases affecting the body’s internal organs — including diabetes, hypertension, heart disease, asthma, arthritis, infections, and chronic or familial conditions. The department also runs dedicated Diabetic and Vaccination Clinics, covering everything from routine immunisation to travel and visa vaccination.',
      body: [
        '## Why awareness matters',
        'Managing a condition well starts with recognising it early. Diabetes, for instance, often shows up first as frequent urination, increased hunger, excessive thirst, unexplained weight loss, blurred vision, tiredness, or slow-healing wounds — and noticing these early makes a real difference to how manageable the condition stays.',
        'The same applies to less obvious warning signs: a fever that won’t resolve, a persistent loss of appetite, a cough lasting more than three months, or unexplained weight loss noticed by you, a friend or a family member. These can point to chronic conditions such as tuberculosis or immune-deficient states — conditions that are highly manageable today, but only when caught and treated early.',
        '## How we care for you',
        'Illness and injury rarely arrive on schedule, and our General Medicine team is built around that reality. We look for the full picture — signs, symptoms and a thorough clinical examination — backed by strong laboratory and pathology support, to reach an accurate diagnosis. From there, we build a treatment plan focused not just on managing the illness itself, but on helping you understand it, cope with it, and prevent it from recurring.',
        'Every patient is followed with a planned treatment schedule and regular monitoring, supported by physicians experienced in managing both acute illness and long-term disease, working alongside a dedicated team of nurses and paramedical staff — so you’re supported at every stage, not just at diagnosis.',
        '## General Medicine services',
        [
          'Detailed initial assessment',
          'Diabetic education',
          'General health education',
          'On-site glucose measurement (glucometer)',
          'Nebulisation',
          'ECG facilities',
          'Ultrasound',
          'Insulin injection technique orientation',
          'Expert care for communicable and non-communicable diseases',
          'Comprehensive health check-ups',
          'Prophylactic vaccination for adults',
          'Evaluation and treatment for multi-system disorders',
        ],
        '## Diabetic Clinic',
        'Diabetes care isn’t one-size-fits-all, and our Diabetic Clinic is structured around who’s being treated and what they need at each life stage — from a child newly diagnosed with Type 1 diabetes to a mother managing gestational diabetes to an adult on long-term insulin therapy.',
        [
          'Adult diabetic care — diagnosis, ongoing management, and complication screening for Type 1 and Type 2 diabetes',
          'Paediatric diabetic care — specialised support for children and adolescents newly diagnosed with or managing diabetes',
          'Diabetic education — practical, one-on-one guidance on diet, monitoring, and daily management',
          'Insulin injection technique orientation — hands-on training for patients and caregivers',
          'On-site glucose monitoring and regular review',
        ],
        '## Vaccination Clinic',
        'Our Vaccination Clinic covers immunisation needs across every life stage and situation — not only routine adult vaccination, but the specific, often time-sensitive vaccination needs that come with travel, work and family life.',
        [
          'Adult vaccination — routine and age-appropriate immunisation, including boosters',
          'Women’s vaccination — immunisation needs specific to women, including pre-conception and pregnancy-related vaccination guidance',
          'Foreign travel and visa vaccination — destination-specific travel vaccines, including Yellow Fever vaccination with official ICVP certification where applicable, planned around your departure date since several vaccines require lead time to take effect',
          'Food handlers’ vaccination — immunisation and health clearance for individuals working in food handling and hospitality roles',
        ],
        'Because travel vaccines like Yellow Fever require certification from an authorised centre and need to be administered at least 10 days before departure, we recommend booking a travel vaccination consultation as soon as your trip is confirmed rather than in the final days before you fly.',
      ],
      faqs: [
        ['What does a General Medicine (internal medicine) doctor treat?', 'A general medicine physician diagnoses and manages non-surgical conditions affecting internal organs, including diabetes, hypertension, heart disease, asthma, arthritis, infections, and chronic or multi-system disorders.'],
        ['Does Kinder Hospitals Kochi have a dedicated diabetic clinic?', 'Yes. Kinder’s Diabetic Clinic provides care for adults, children and expectant mothers, including diabetic education, insulin injection training and ongoing monitoring.'],
        ['Where can I get travel vaccination in Kochi?', 'The Vaccination Clinic at Kinder Hospitals Kochi provides travel and visa vaccination, including destination-specific immunisation and Yellow Fever vaccination with official certification where required — plan your visit at least a few weeks before departure, since some vaccines need time to take effect.'],
        ['Do I need a vaccination certificate for food handling jobs?', 'Many food handling and hospitality employers require proof of specific vaccinations. Kinder’s Vaccination Clinic provides food handlers’ vaccination and the documentation needed for employment requirements.'],
        ['When should I see a general physician instead of a specialist?', 'A general physician is usually the right first step for symptoms that aren’t yet clearly linked to one organ system — persistent fever, unexplained weight loss, fatigue, or a cough lasting more than three months — and will refer you to the right specialist if needed.'],
        ['How early should I book travel vaccinations before an international trip?', 'As early as possible once your trip is confirmed — ideally 4 to 6 weeks before departure. Some vaccines, like Yellow Fever, only become valid 10 days after the dose, and several require multiple doses spaced weeks apart.'],
      ],
      cta: 'Book a consultation with the General Medicine, Diabetic or Vaccination Clinic at Kinder Hospitals Kochi.',
    },
    ent: KOCHI_ENT,
    ...KOCHI_DEPARTMENTS,
  },
};

// Kochi · General & Laparoscopic Surgery: the speciality page carries the
// final page the hospital approved (lib/kochi-final-pages.mjs) — its opening
// paragraph, sections and questions — so the specialities menu leads to it.
function fromFinalPage(slug) {
  const page = KOCHI_FINAL_PAGES.find((p) => p.slug === slug);
  const [intro, ...rest] = page.body.split(/\n\n(?=## )/);
  const sections = rest.filter((s) => !/^## Frequently asked questions/i.test(s));
  const faqBlock = rest.find((s) => /^## Frequently asked questions/i.test(s)) || '';
  const faqs = faqBlock.replace(/^## .+\n+/, '').split(/\n\n(?=### )/)
    .map((b) => b.match(/^### (.+)\n+([\s\S]+)$/)).filter(Boolean)
    .map(([, q, a]) => [q.trim(), a.trim()]);
  // the closing line after the last answer is the page's call to action
  const last = faqs.at(-1);
  let cta = '';
  if (last) {
    const paras = last[1].split(/\n\n/);
    if (paras.length > 1) { cta = paras.pop(); last[1] = paras.join('\n\n'); }
  }
  return { metaTitle: page.metaTitle, metaDescription: page.excerpt, heading: page.title, intro: intro.trim(), body: sections, faqs, cta };
}
PAGES.kochi['general-laparoscopic-surgery'] = fromFinalPage('kochi-general-laparoscopic-surgery');

// Other addresses the same page answers to (the group-wide speciality name).
// Kochi's departments are named a little differently from the group's
// catalogue ("General Medicine & Diabetology", "Neonatology with Level 3 NICU
// Care"), so both spellings lead to the same page.
const ALIASES = {
  kochi: {
    'general-medicine-and-diabetology': 'general-medicine',
    'general-ent': 'ent',
    'general-surgery': 'general-laparoscopic-surgery',
    'general-and-laparoscopic-surgery': 'general-laparoscopic-surgery',
    'orthopaedics-and-sports-med': 'orthopaedics-and-sports-medicine',
    orthopaedics: 'orthopaedics-and-sports-medicine',
    dermatology: 'dermatology-and-cosmetology',
    'anesthesiology-and-pain': 'anaesthesiology-and-critical-care',
    'general-paediatrics': 'paediatrics',
    neonatology: 'neonatology-with-level-3-nicu-care',
    'fetal-medicine': 'fetomaternal-medicine',
    'infertility-treatment': 'reproductive-medicine',
    'infertility-and-ivf': 'reproductive-medicine',
    'gynaec-oncology': 'gynaecological-oncology',
    'gynecology-and-laparoscopic-surgery': 'obstetrics-and-gynaecology',
    'gynaec-and-laparoscopic': 'obstetrics-and-gynaecology',
    gynaecology: 'obstetrics-and-gynaecology',
    psychiatry: 'psychiatry-and-clinical-psychology',
    'radiology-and-diagnostics': 'radiology',
    'radiology-and-imaging': 'radiology',
    'neonatology-and-paediatrics': 'neonatology-with-level-3-nicu-care',
    'neonatology-and-nicu': 'neonatology-with-level-3-nicu-care',
    'obstetrics-and-gynecology': 'obstetrics-and-gynaecology',
    gynecology: 'obstetrics-and-gynaecology',
    'gynaecological-oncology-services': 'gynaecological-oncology',
    'gynecologic-oncology': 'gynaecological-oncology',
    'fetal-and-maternal-medicine': 'fetomaternal-medicine',
    'pediatrics': 'paediatrics',
    'dental': 'dentistry',
    'dental-care': 'dentistry',
    'ent-and-head-and-neck-surgery': 'ent',
    'orthopaedics-and-sports-medicine-and-joint-replacement': 'orthopaedics-and-sports-medicine',
    orthopedics: 'orthopaedics-and-sports-medicine',
  },
};

const centreKey = (loc) => String(loc?.slug || loc?.name || '').trim().toLowerCase().replace(/^cochin$/, 'kochi');

// The page a centre has written for a speciality, with its body as text the
// content renderer reads ("## Heading", "- item"), or null.
export function centreServicePage(loc, slug) {
  const centre = centreKey(loc);
  const key = PAGES[centre]?.[slug] ? slug : ALIASES[centre]?.[slug];
  const page = key && PAGES[centre]?.[key];
  if (!page) return null;
  const text = page.body.map((block) => (Array.isArray(block) ? block.map((item) => `- ${item}`).join('\n') : block)).join('\n\n');
  return { ...page, key, fullDescription: text };
}

// FAQPage structured data for search engines.
export function faqSchema(faqs = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })),
  };
}

// The same page for the group's site and the other hospitals, as Kinder
// Hospitals' own text, without the centre's name (the hospital asked, 24 Nov
// 2026): "General Medicine (Internal Medicine) in Kochi" → "General Medicine
// (Internal Medicine)", "Kinder Hospitals Kochi" → "Kinder Hospitals".
const CENTRE_NAME = [
  [/Kinder Hospitals['’]?,?\s+(Kochi|Cochin)\b/g, 'Kinder Hospitals'],
  [/Kinder Hospital['’]s\s+(Kochi|Cochin)\b/g, 'Kinder Hospitals'],
  [/Kinder\s+(Kochi|Cochin)\b/g, 'Kinder Hospitals'],
  [/Kinder (Multispeciality )?Hospital,?\s+(Kochi|Cochin)\b/g, 'Kinder Hospitals'],
  [/,?\s+(in|at)\s+(Kochi|Cochin)\b/g, ''],
  [/,\s*(Kochi|Cochin)\b/g, ''],
  [/\s+(Kochi|Cochin)\b/g, ''],
];
const plain = (text) => CENTRE_NAME.reduce((t, [find, put]) => t.replace(find, put), text);
const without = (value) => (typeof value === 'string' ? plain(value)
  : Array.isArray(value) ? value.map(without)
  : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, without(v)]))
  : value);

export function withoutCentreName(page) {
  return page ? without(page) : null;
}
