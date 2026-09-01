// Built-in specialities catalogue for individual centres, shown on that
// hospital's sub-website. Each speciality opens its own detail page at
// /hospitals/[slug]/specialities/[spec].
//
// Admin-entered specialities tagged to a centre always win over this
// catalogue — it is the shipped default for centres whose lists haven't
// been curated in the CMS yet.

import { slugify } from './services';

// -> { facilities: [{ name, items: [{name, overview, treatments[]}] }] } | null
export function centreCatalogue(hospitalSlug) {
  return CATALOGUES[hospitalSlug] || null;
}

// Flat list of a centre's catalogue items with slugs.
export function centreSpecialityList(hospitalSlug) {
  const cat = centreCatalogue(hospitalSlug);
  if (!cat) return [];
  const out = [];
  for (const f of cat.facilities) {
    for (const item of f.items) {
      out.push({ ...item, slug: slugify(item.name), facility: f.name });
    }
  }
  return out;
}

export function findCentreSpeciality(hospitalSlug, specSlug) {
  return centreSpecialityList(hospitalSlug).find((s) => s.slug === specSlug) || null;
}

const CATALOGUES = {
  kochi: {
    facilities: [
      {
        name: 'Kinder Multi-Speciality Hospital',
        items: [
          {
            name: 'General Medicine & Diabetology',
            overview:
              'Comprehensive adult medicine for everyday illness and long-term conditions, with a dedicated diabetology service for prevention, control and complication screening.',
            treatments: [
              'Fever, infection & general illness care',
              'Diabetes diagnosis & lifelong management',
              'Hypertension, thyroid & cholesterol clinics',
              'Preventive health checks & vaccinations',
              'Diabetic foot & complication screening',
              'Inpatient medical care',
            ],
          },
          {
            name: 'Orthopaedics & Sports Medicine',
            overview:
              'Bone, joint and muscle care for all ages — from fracture management to sports injuries — helping you move without pain.',
            treatments: [
              'Fracture & trauma management',
              'Arthroscopic (keyhole) surgery',
              'Sports injury care & rehabilitation',
              'Ligament & tendon repair',
              'Arthritis & joint pain clinics',
              'Physiotherapy-guided recovery',
            ],
          },
          {
            name: 'General & Lap Surgery',
            overview:
              'Advanced general and laparoscopic surgery with an emphasis on minimally invasive, faster-recovery techniques.',
            treatments: [
              'Laparoscopic gallbladder & appendix surgery',
              'Hernia repair (open & laparoscopic)',
              'Piles, fissure & fistula treatment',
              'Thyroid & breast surgery',
              'Abdominal & soft-tissue surgery',
              'Day-care surgical procedures',
            ],
          },
          {
            name: 'ENT',
            overview:
              'Ear, nose and throat care for children and adults, covering everything from recurrent infections to endoscopic sinus and ear surgery.',
            treatments: [
              'Ear infection & hearing disorder care',
              'Endoscopic sinus surgery',
              'Tonsil & adenoid surgery',
              'Voice & throat disorder treatment',
              'Vertigo & balance clinics',
              'Snoring & sleep apnoea evaluation',
            ],
          },
          {
            name: 'Urology',
            overview:
              'Diagnosis and treatment of kidney, bladder, prostate and urinary tract conditions using modern endoscopic and laser techniques.',
            treatments: [
              'Kidney stone treatment (laser & endoscopic)',
              'Prostate evaluation & surgery',
              'Urinary infection & incontinence care',
              'Bladder & ureter disorders',
              'Male urological health',
              'Minimally invasive urologic surgery',
            ],
          },
          {
            name: 'Pulmonology',
            overview:
              'Specialist care for asthma, COPD and other lung conditions, backed by pulmonary function testing and bronchoscopy.',
            treatments: [
              'Asthma & allergy management',
              'COPD & chronic cough clinics',
              'Pulmonary function testing',
              'Bronchoscopy',
              'Pneumonia & respiratory infection care',
              'Sleep-related breathing disorders',
            ],
          },
          {
            name: 'Dentistry',
            overview:
              'Complete dental care for the whole family — preventive, restorative and cosmetic — in a child-friendly setting.',
            treatments: [
              'Dental check-ups & cleaning',
              'Fillings & root canal treatment',
              'Extractions & minor oral surgery',
              'Crowns, bridges & dentures',
              'Paediatric dentistry',
              'Smile design & whitening',
            ],
          },
          {
            name: 'Dermatology & Cosmetology',
            overview:
              'Medical and cosmetic skin, hair and nail care — from acne and allergies to advanced aesthetic procedures.',
            treatments: [
              'Acne, eczema & psoriasis care',
              'Hair fall & scalp treatment',
              'Skin allergy & pigmentation clinics',
              'Laser & aesthetic procedures',
              'Anti-ageing & skin rejuvenation',
              'Nail & minor skin surgery',
            ],
          },
          {
            name: 'Plastic & Cosmetic Surgery',
            overview:
              'Reconstructive and aesthetic surgery performed by experienced plastic surgeons, restoring both form and function.',
            treatments: [
              'Reconstructive surgery after injury',
              'Burn care & scar revision',
              'Cosmetic facial & body procedures',
              'Hand surgery',
              'Skin grafting & flap surgery',
              'Congenital deformity correction',
            ],
          },
          {
            name: 'Gastroenterology',
            overview:
              'Medical gastroenterology for liver and GI tract disease, with an advanced endoscopy suite offering therapeutic procedures well beyond routine endoscopy and colonoscopy.',
            treatments: [
              'Upper GI endoscopy & colonoscopy',
              'Pancreatic & biliary therapeutic ERCP',
              'Capsule endoscopy & balloon enteroscopy',
              'Endoscopic mucosal resection (EMR)',
              'High-resolution manometry & pH metry',
              'Cholangioscopy & pancreatoscopy',
              'Magnification & chromoendoscopy',
            ],
          },
          {
            name: 'Hepatology & Liver Transplant Medicine',
            overview:
              'Dedicated liver care — fatty liver, hepatitis, cirrhosis — with transplant work-up and post-transplant follow-up by hepatology specialists.',
            treatments: [
              'Fatty liver & hepatitis management',
              'Cirrhosis & liver failure care',
              'Liver transplant evaluation',
              'Post-transplant follow-up',
              'Liver health screening',
              'Jaundice evaluation & treatment',
            ],
          },
          {
            name: 'Neuro Surgery',
            overview:
              'Surgical care for disorders of the brain, spine and nerves, with modern operative techniques and critical-care support.',
            treatments: [
              'Brain tumour surgery',
              'Head injury & trauma care',
              'Spine surgery (disc & degenerative)',
              'Hydrocephalus & shunt procedures',
              'Peripheral nerve surgery',
              'Neuro critical care',
            ],
          },
          {
            name: 'Neurology',
            overview:
              'Diagnosis and long-term management of neurological conditions — stroke, epilepsy, headache, movement disorders and more.',
            treatments: [
              'Stroke care & prevention',
              'Epilepsy & seizure management',
              'Headache & migraine clinics',
              "Parkinson's & movement disorders",
              'Neuropathy & nerve disorders',
              'Memory & dementia evaluation',
            ],
          },
          {
            name: 'Ophthalmology',
            overview:
              'Complete eye care for all ages — routine vision checks, cataract surgery and management of diabetic eye disease.',
            treatments: [
              'Comprehensive eye examinations',
              'Cataract surgery',
              'Diabetic retinopathy screening',
              'Glaucoma diagnosis & care',
              'Paediatric eye care & squint',
              'Dry eye & allergy clinics',
            ],
          },
          {
            name: 'Cardiology',
            overview:
              'Heart care from prevention to intervention — risk assessment, diagnostics and cardiac emergency support around the clock.',
            treatments: [
              'ECG, echo & TMT diagnostics',
              'Chest pain & cardiac emergency care',
              'Hypertension & cholesterol management',
              'Heart failure treatment',
              'Preventive cardiology check-ups',
              'Arrhythmia evaluation',
            ],
          },
          {
            name: 'Nephrology',
            overview:
              'Kidney care from early disease detection to dialysis, focused on protecting kidney function for the long term.',
            treatments: [
              'Chronic kidney disease management',
              'Dialysis services',
              'Kidney stone & infection care',
              'Hypertension-related kidney care',
              'Electrolyte & fluid disorders',
              'Transplant work-up & follow-up',
            ],
          },
          {
            name: 'Joint Replacement & Spine Surgery',
            overview:
              'Advanced joint replacement and spine surgery restoring mobility for arthritis, degenerative disease and complex injuries.',
            treatments: [
              'Total knee replacement',
              'Total hip replacement',
              'Revision joint surgery',
              'Disc & degenerative spine surgery',
              'Spinal fixation for trauma',
              'Post-surgical rehabilitation',
            ],
          },
          {
            name: 'Geriatrics',
            overview:
              'Compassionate, coordinated healthcare for older adults — managing multiple conditions while preserving independence and quality of life.',
            treatments: [
              'Comprehensive geriatric assessment',
              'Multi-condition medication review',
              'Falls & frailty prevention',
              'Memory & cognition care',
              'Bone health & osteoporosis',
              'Home-care guidance for families',
            ],
          },
          {
            name: 'Andrology',
            overview:
              "Specialist care for men's reproductive and sexual health, offered with complete privacy and sensitivity.",
            treatments: [
              'Male infertility evaluation & treatment',
              'Sexual health consultations',
              'Hormonal disorder management',
              'Varicocele & related surgery',
              'Andrology lab services',
              'Counselling & follow-up care',
            ],
          },
          {
            name: 'Anaesthesiology & Critical Care',
            overview:
              'Safe anaesthesia for every surgery and round-the-clock intensive care for critically ill patients, led by experienced specialists.',
            treatments: [
              'Pre-anaesthesia evaluation',
              'General & regional anaesthesia',
              'ICU & ventilator care',
              'Post-operative pain management',
              'Critical care for medical emergencies',
              '24/7 intensivist cover',
            ],
          },
          {
            name: 'Psychiatry & Clinical Psychology',
            overview:
              'Confidential mental health care combining psychiatric treatment and psychological therapy for children, adults and families.',
            treatments: [
              'Depression & anxiety treatment',
              'Stress & sleep disorder care',
              'Child & adolescent mental health',
              'Counselling & psychotherapy',
              'De-addiction support',
              'Family & relationship counselling',
            ],
          },
          {
            name: 'Emergency & Trauma Care',
            overview:
              'A 24/7 emergency department equipped for medical, surgical and trauma emergencies, with rapid triage and critical-care backup.',
            treatments: [
              '24/7 emergency response',
              'Accident & trauma stabilisation',
              'Cardiac & stroke emergency care',
              'Paediatric emergencies',
              'Ambulance coordination',
              'Emergency surgery support',
            ],
          },
          {
            name: 'Radiology',
            overview:
              'Modern diagnostic imaging supporting every department — accurate, timely reporting for confident treatment decisions.',
            treatments: [
              'Digital X-ray',
              'Ultrasound & Doppler studies',
              'CT scan services',
              'Pregnancy & fetal scans',
              'Image-guided procedures',
              'Prompt specialist reporting',
            ],
          },
        ],
      },
      {
        name: "Kinder Women's Hospital & Fertility Centre",
        items: [
          {
            name: 'Obstetrics & Gynaecology',
            overview:
              'Care for women of all ages — from well-women exams to complex medical and surgical care during the reproductive and post-reproductive years, including urogynaecology.',
            treatments: [
              'Antenatal care & safe delivery',
              'Painless (epidural) delivery',
              'Well-women exams & screening',
              'Complex gynaecological surgery',
              'Urogynaecology care',
              'Menstrual disorder & menopause care',
            ],
          },
          {
            name: 'High Risk Pregnancy',
            overview:
              'Specialised monitoring and delivery planning for pregnancies that need extra attention, supported by our newborn intensive care unit.',
            treatments: [
              'High-risk pregnancy monitoring',
              'Diabetes & hypertension in pregnancy',
              'Multiple pregnancy care',
              'Preterm labour management',
              'Fetal growth surveillance',
              'NICU-backed delivery planning',
            ],
          },
          {
            name: 'Reproductive Medicine & IVF',
            overview:
              'The Kinder IVF centre brings the latest ART technologies to Kerala with a 15-year legacy — complete fertility care from counselling through IUI and IVF.',
            treatments: [
              'Fertility evaluation & counselling',
              'Ovulation induction & IUI',
              'IVF & ICSI',
              'Fertility preservation',
              'Recurrent implantation failure care',
              'Male fertility services',
            ],
          },
          {
            name: 'Gynaec Laparoscopic Surgery',
            overview:
              'Keyhole surgery for gynaecological conditions — smaller incisions, less pain and a faster return to normal life.',
            treatments: [
              'Laparoscopic hysterectomy',
              'Fibroid & ovarian cyst removal',
              'Endometriosis surgery',
              'Diagnostic hystero-laparoscopy',
              'Ectopic pregnancy surgery',
              'Tubal & uterine procedures',
            ],
          },
          {
            name: 'Paediatrics',
            overview:
              'Everyday and specialist care for children — growth, vaccinations, illness and development — from birth through adolescence.',
            treatments: [
              'Well-baby & growth clinics',
              'Immunisation & vaccination',
              'Childhood illness treatment',
              'Development & behaviour assessment',
              'Nutrition & feeding guidance',
              'Adolescent health care',
            ],
          },
          {
            name: 'Neonatology & NICU',
            overview:
              'State-of-the-art newborn intensive care for premature and sick babies, staffed by experienced neonatologists round the clock.',
            treatments: [
              'NICU intensive care',
              'Premature baby care',
              'Newborn screening',
              'Neonatal ventilation & support',
              'Kangaroo mother care',
              'High-risk newborn follow-up',
            ],
          },
          {
            name: 'Fetal Medicine',
            overview:
              'Advanced scanning and diagnostics to monitor your baby’s health and development throughout pregnancy.',
            treatments: [
              'NT & anomaly scans',
              'Fetal growth & Doppler studies',
              'Genetic screening & counselling',
              'Twin pregnancy surveillance',
              'Fetal well-being assessment',
              'Targeted diagnostic procedures',
            ],
          },
          {
            name: 'Antenatal & Lactation Care',
            overview:
              'Preparation and support for new parents — antenatal classes, breastfeeding guidance and postnatal recovery.',
            treatments: [
              'Antenatal (ANC) classes',
              'Birth preparation & exercises',
              'Lactation consultation',
              'Postnatal mother care',
              'Newborn care training for parents',
              'Diet & nutrition guidance',
            ],
          },
        ],
      },
    ],
  },
};
