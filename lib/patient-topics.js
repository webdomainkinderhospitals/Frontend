// The Patients Portal branch of the site tree. Each topic renders the page
// published in the CMS when one exists (a ContentPage with the same slug);
// the copy here is the group-wide fallback so no branch of the tree is a
// dead end while the centre-specific text is being written.

export const PATIENT_TOPICS = {
  'insurance-and-tpa': {
    title: 'Insurance & TPA / Cashless',
    eyebrow: 'Insurance & TPA',
    intro: 'Kinder centres work with insurers and third-party administrators for cashless and reimbursement claims. Empanelment differs by centre and by policy, so please confirm your cover with the insurance desk before admission.',
    points: [
      'Carry your policy number, e-card and a photo ID for every admission',
      'Planned admissions: ask us to start pre-authorisation at least 48 hours ahead',
      'Emergency admissions: tell the front desk you intend to claim, on arrival',
      'Our insurance desk files the pre-authorisation and coordinates with your TPA',
      'Reimbursement claims: we provide the discharge summary, bills and investigation reports you need',
    ],
    ask: 'Hello Kinder Hospitals, I would like to check insurance and TPA cover.',
  },
  'patient-rights': {
    title: 'Patient Rights & Responsibilities',
    eyebrow: 'Patient Rights',
    intro: 'Every person treated at a Kinder centre has rights we commit to, and responsibilities that help us care for you safely. Each centre displays the full charter, and our staff will explain any part of it on request.',
    points: [
      'Care with dignity, privacy and respect, whatever your background',
      'A clear explanation of your condition, options, costs and risks before you consent',
      'Informed consent, including your right to refuse treatment or seek a second opinion',
      'Confidentiality of your medical records, and access to them on request',
      'Your responsibility: share your history accurately, follow the agreed plan, and respect staff and other patients',
      'Your responsibility: observe the centre’s visitor, safety and no-smoking rules',
    ],
    ask: 'Hello Kinder Hospitals, I have a question about patient rights.',
  },
  'second-opinion': {
    title: 'Second Opinion',
    eyebrow: 'Second Opinion',
    intro: 'Asking for another view is a normal part of good care, not a challenge to your doctor. Our specialists review outside reports and give you an independent opinion on the diagnosis or the plan you have been offered.',
    points: [
      'Share your reports, scans, discharge summaries and current prescriptions',
      'We match you to a specialist in the relevant department',
      'Available in person at any centre, or remotely where the case allows',
      'You keep your existing treating doctor either way — the choice stays yours',
    ],
    ask: 'Hello Kinder Hospitals, I would like a second opinion.',
  },
  'visitor-guidelines': {
    title: 'Visitor Guidelines',
    eyebrow: 'Visitor Guidelines',
    intro: 'Visiting hours, attendant passes and the rules for NICU, ICU and maternity wards are set by each centre for the safety of newborns and recovering patients. Please check with your centre before you travel.',
    points: [
      'Visiting hours and the number of visitors allowed differ by ward and by centre',
      'NICU, PICU and ICU have restricted, escorted visiting only',
      'One attendant is generally permitted to stay with an admitted patient',
      'Children and anyone with fever, cough or an infection should not visit inpatient areas',
      'Hand hygiene on entering and leaving every ward',
      'Photography and video are not permitted in clinical areas',
    ],
    ask: 'Hello Kinder Hospitals, what are the visiting hours at my centre?',
  },
};
