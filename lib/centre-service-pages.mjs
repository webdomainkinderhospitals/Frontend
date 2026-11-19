// Speciality pages a hospital has written in full for its own site, shown on
// /hospitals/<centre>/services/<speciality> in place of the short description
// from the admin: the opening paragraph under the title, the page body, its
// questions and answers (also published as FAQPage structured data) and the
// search title and description.
//
// Kochi · General Medicine: "Kinder-General-Medicine-Page-Rewrite.docx"
// (19 Nov 2026), with "Kinder Hospital" written as the site's brand.

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
  },
};

const centreKey = (loc) => String(loc?.slug || loc?.name || '').trim().toLowerCase().replace(/^cochin$/, 'kochi');

// The page a centre has written for a speciality, with its body as text the
// content renderer reads ("## Heading", "- item"), or null.
export function centreServicePage(loc, slug) {
  const page = PAGES[centreKey(loc)]?.[slug];
  if (!page) return null;
  const text = page.body.map((block) => (Array.isArray(block) ? block.map((item) => `- ${item}`).join('\n') : block)).join('\n\n');
  return { ...page, fullDescription: text };
}

// FAQPage structured data for search engines.
export function faqSchema(faqs = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })),
  };
}
