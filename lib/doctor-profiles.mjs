// Profiles the hospital sent for a doctor, set out for the website (the
// backend saves the same text on the doctor's record on deploy; see
// backend/src/lib/bootstrapAnanthenProfile.js). Shown until the record
// carries a profile of its own: a profile written in the admin always wins.
const PROFILES = [
  {
    "name": "Dr. Ananthen K S",
    "qualifications": "MBBS, DCH, MD (Paediatrics), Fellowship in Paediatric Cardiology, PGDMLE",
    "earlierStart": "Dr. Ananthen Killikulangara Sadanandan completed his M.B.B.S in 1998",
    "fullBio": "Dr. Ananthen Killikulangara Sadanandan completed his MBBS in 1998 at Government Medical College, Thrissur, and his DCH (2002) and MD in Paediatrics (2003) at Government Medical College, Alappuzha. He completed a Fellowship in Paediatric Cardiology at Amrita Institute of Medical Sciences, Kochi, in 2004, and holds a Postgraduate Diploma in Medical Law & Ethics (PGDMLE) from the National Law School of India University, Bangalore.\n\nFrom 2005 to 2007 he worked in the Department of Neonatology at MOSC Medical College, Kolenchery, Kerala. He then underwent advanced training in neonatology in Australia, where he worked for five years in some of the best neonatal centres, including Monash Medical Centre, Melbourne; the Royal Hospital for Women, Sydney; and Liverpool Hospital, Sydney.\n\nDuring his work overseas he was exposed to the latest advances in neonatal care, including the resuscitation, stabilisation and ongoing care of extremely premature babies. He was also part of the renowned Neonatal and Paediatric Emergency Transport Service (NETS), Westmead, Sydney, and has performed almost a hundred retrievals of sick infants and children by road, rotor-wing and fixed-wing transport.\n\nHis other interests include teaching and research. He was a Conjoint Lecturer at the University of New South Wales, Sydney, has three publications to his name and has delivered many presentations in India and abroad.\n\nHe is presently Chief Consultant and Head of the Department of Paediatrics and Neonatology at Kinder Women’s Hospital & Fertility Centre, Cherthala.\n\n### Areas of interest\n\n- Neonatology\n- High-risk preterm care\n- Teaching & research"
  },
  // Sent by the hospital on 27 Nov 2026.
  {
    "name": "Dr. Chris Placid",
    "qualifications": "MBBS, MD (Pediatrics), Fellowship in Neonatology",
    "fullBio": "Dr. Chris Placid is a Consultant Pediatrician and Neonatologist dedicated to providing comprehensive, compassionate and evidence-based healthcare for newborns, infants, children and adolescents.\n\nHe completed his MBBS in 2018 and his MD in Pediatrics at Pushpagiri Medical College, Tiruvalla, in 2023. Following his postgraduate training, he served as a Consultant Pediatrician at Thiruvalla Medical Mission Hospital, Thiruvalla. He subsequently pursued advanced training in Neonatology at Rajagiri Hospital, Aluva, completing his fellowship in December 2025.\n\nWith a special interest in newborn care and neonatal medicine, Dr. Chris is committed to the early recognition and management of neonatal illnesses, supporting premature and high-risk newborns, and ensuring a smooth transition from hospital care to healthy childhood.\n\nHis approach combines clinical expertise with clear communication, helping parents make informed decisions about their child’s health and wellbeing.\n\n### Areas of special interest\n\n- Newborn and neonatal care\n- Premature and low birth weight babies\n- High-risk newborn follow-up\n- General Pediatrics\n- Childhood infections and respiratory illnesses\n- Allergy and asthma\n- Growth, nutrition and developmental monitoring\n- Preventive healthcare and immunisation\n\nDr. Chris believes in building lasting relationships with families through accessible, ethical and personalised paediatric care. He has several publications to his credit and maintains a keen interest in clinical research."
  },
  {
    "name": "Dr. Simi Thomas",
    "qualifications": "Fellowship in Minimal Access Surgery, Fellowship in Reproductive Medicine, Professional Diploma in Fetal Medicine",
    "fullBio": "Dr. Simi Thomas is a passionate, sincere and dedicated Obstetrician and Gynaecologist with over 15 years of professional experience in Obstetrics and Gynaecology. Her clinical practice is driven by a strong commitment to compassionate patient care, ethical medical practice and evidence-based treatment.\n\nShe completed her postgraduate training in Obstetrics and Gynaecology at Jawaharlal Nehru Medical College, KLE Deemed University, Belagavi, Karnataka. With a keen interest in advanced surgical techniques, she subsequently completed a Fellowship in Minimal Access Surgery at World Laparoscopy Hospital, Delhi.\n\nDr. Simi is also a Fertility Specialist, having completed a Fellowship in Reproductive Medicine, with a special interest in the evaluation and management of infertility and helping couples achieve their dream of parenthood.\n\nHer passion for the care of the unborn child led her to pursue advanced training in Fetal Medicine. She holds a Professional Diploma in Fetal Medicine from Cairo, Egypt, further strengthening her expertise in prenatal diagnosis, fetal assessment and the management of pregnancies requiring specialised care.\n\n### Areas of special interest\n\n- Fetal Medicine & Prenatal Diagnosis\n- Infertility Evaluation & Management\n- High-Risk Obstetrics\n- Reproductive Medicine\n- Minimal Access Gynaecological Surgery\n- Comprehensive Obstetric & Gynaecological Care\n\nDr. Simi’s professional philosophy is centred on precision in diagnosis, sincerity in care and compassion for every patient. She believes that every pregnancy deserves individualised attention, and that early diagnosis and timely intervention can make a meaningful difference to both mother and baby.\n\nHer particular passion lies in Fetal Medicine and Infertility Management, combining advanced medical expertise with a compassionate approach to support women and families through some of the most important journeys of their lives."
  },
  // Her updated profile (27 Nov 2026), in place of the first one sent that day.
  {
    "name": "Dr. Sethulakshmi S",
    "qualifications": "MBBS, DNB, MNAMS, FCGSM · Fellowship in Laparoscopy & Cosmetic Gynaecology",
    "earlierQualifications": [
      "MBBS, DNB, MNAMS · Diploma in Cosmetic Gynaecology · Fellowship in Laparoscopy & NDVH"
    ],
    "earlierStart": "Dr. Sethulakshmi S is a highly skilled Consultant Gynaecologist",
    "fullBio": "Dr. Sethulakshmi S is a dedicated Obstetrician and Gynaecologist with a special interest in advanced gynaecological surgery, minimally invasive laparoscopy and cosmetic gynaecology. With qualifications including MBBS, DNB, MNAMS and FCGSM, she brings together clinical expertise, advanced surgical training and a compassionate approach to women’s healthcare.\n\nShe holds a Fellowship in Laparoscopy and Cosmetic Gynaecology, is trained in robotic surgery and has trained in sexual medicine.\n\n### Advanced laparoscopic surgery – precision with minimal intervention\n\nWith fellowship training in gynaecological laparoscopy and exposure to robotic surgery, she is committed to offering advanced minimally invasive surgical solutions. Her areas of interest include laparoscopic management of ovarian cysts, fibroids, endometriosis and other gynaecological conditions. She believes in the principles of precision, surgical safety, faster recovery and preserving a woman’s quality of life.\n\n### Cosmetic gynaecology – beyond beauty, towards intimate wellness\n\nWith advanced training in cosmetic gynaecology and sexual medicine, she has a special focus on the evolving field of intimate wellness. She offers a personalised approach to concerns about vaginal health, pelvic floor function, intimate area aesthetics and sexual well-being.\n\nHer areas of interest include vaginal rejuvenation, energy-based treatments, labiaplasty, pelvic floor rehabilitation and other procedures aimed at improving intimate health and confidence. She believes that every woman deserves a safe, non-judgemental space to discuss even the most intimate concerns and explore appropriate treatment options.\n\n### Her philosophy of care\n\nDr. Sethulakshmi believes that women’s healthcare goes far beyond treating a medical condition. It is about listening without judgement, understanding individual needs and empowering women to make informed decisions about their bodies and health.\n\nHer approach combines evidence-based medicine, advanced surgical techniques and personalised care, with a commitment to making every woman feel heard, respected and confident — because every woman deserves not just better health, but the confidence and freedom to feel her best at every stage of life."
  },
];

const key = (name) => String(name || '').toLowerCase().replace(/\bdr\b\.?/g, ' ').replace(/[^a-z]/g, '');
const letters = (s) => String(s || '').toLowerCase().replace(/[^a-z]/g, '');

// "Dr Simi Thomas" / "Dr. Simi Thomas K": the same name, or failing that,
// the same first name with every word of the shorter name in the longer
// (or the same first and last name), when no other doctor in the list fits.
const words = (name) => String(name || '').toLowerCase().replace(/\bdr\b\.?/g, ' ').replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(Boolean);
export const fitsName = (a, b) => key(a) === key(b) || firstLast(a, b);
const firstLast = (a, b) => {
  const x = words(a), y = words(b);
  if (x.length < 2 || y.length < 2 || x[0] !== y[0]) return false;
  const [short, long] = x.length <= y.length ? [x, y] : [y, x];
  return x.at(-1) === y.at(-1) || short.every((w) => long.includes(w));
};

export function withSuppliedProfiles(doctors = []) {
  const profileOf = (doc) => PROFILES.find((x) => key(x.name) === key(doc.name))
    || PROFILES.find((x) => firstLast(x.name, doc.name) && doctors.filter((d) => firstLast(x.name, d.name)).length === 1);
  return doctors.map((doc) => {
    const p = profileOf(doc);
    if (!p) return doc;
    const out = { ...doc };
    const current = String(doc.fullBio || '').trim();
    if (!current || (p.earlierStart && letters(current).startsWith(letters(p.earlierStart)))) out.fullBio = p.fullBio;
    if (p.qualifications && String(doc.bio || '').trim().length < 6) out.bio = p.qualifications;
    // degrees the hospital has since updated, wherever the record keeps them
    const earlier = new Set((p.earlierQualifications || []).map(letters));
    for (const field of ['bio', 'designation']) {
      if (earlier.has(letters(doc[field]))) { out.bio = p.qualifications; if (field === 'designation') out.designation = ''; }
    }
    return out;
  });
}
