// A doctor's written profile, shown on their page, in the booking page's
// profile view and as a short summary on booking cards.
//
// Profiles written in the admin can use the content format (a paragraph,
// "### Heading", "- list item"). A doctor with no profile yet gets one
// factual sentence built from their role, department, centre and
// qualifications — never invented detail.

const startsWithVowel = (s) => /^[aeiou]/i.test(String(s).trim());

export function composedProfile(doc, centre = '') {
  const role = String(doc.designation || '').trim();
  const dept = String(doc.speciality || '').trim();
  // "Consultant – Neonatology & Paediatrics" already names the department.
  const roleNamesDept = /[–—-]\s|\bin\b/.test(role) || (dept && role.toLowerCase().includes(dept.toLowerCase().split(/\s|&/)[0]));
  const what = role
    ? `${startsWithVowel(role) ? 'an' : 'a'} ${role}${dept && !roleNamesDept ? ` in ${dept}` : ''}`
    : dept ? `a specialist in ${dept}` : 'a specialist';
  const parts = [`${doc.name} is ${what}${centre ? ` at ${centre}` : ''}.`];
  if (String(doc.bio || '').trim()) parts.push(`Qualifications: ${String(doc.bio).trim().replace(/\.$/, '')}.`);
  return parts.join(' ');
}

// The full profile text, ready for ContentBody.
export function profileText(doc, centre = '') {
  const text = String(doc.fullBio || '').trim();
  if (!text) return composedProfile(doc, centre);
  // A heading needs a blank line before its list to render as a heading.
  return text.replace(/^(#{2,3} .+)\n(?!\n)/gm, '$1\n\n');
}

// The opening paragraph as plain text — for a card's short summary.
export function profileLead(doc, centre = '') {
  const first = profileText(doc, centre).split(/\n\s*\n/).map((b) => b.trim()).find((b) => b && !/^(#|-|\*|•|!\[)/.test(b));
  return (first || '').replace(/\s+/g, ' ');
}

// True when there is more to read than the lead paragraph.
export function hasMoreProfile(doc, centre = '') {
  return profileText(doc, centre).split(/\n\s*\n/).filter((b) => b.trim()).length > 1;
}

// One or two sentences for a booking card: the profile's lead, or for a
// doctor without one, the role sentence (qualifications are shown separately).
export function cardSummary(doc, centre = '') {
  if (String(doc.fullBio || '').trim()) return profileLead(doc, centre);
  return composedProfile({ ...doc, bio: '' }, centre);
}

// Qualifications as typed in the source can be uneven: "MS ( OBSTETRICS &
// GYNAECOLOGY ), DNB( OBG )". Tidied for display: spacing around brackets,
// and long all-caps words inside brackets in normal case. Degree
// abbreviations (MBBS, DNB, OBG…) stay as they are.
// Words typed in capitals ("FELLOWSHIP IN FETOMATERNAL MEDICINE") are put in
// normal case too, while degree and body abbreviations (MBBS, MRCOG, FIAGES,
// OBGYN, ART…) — short or nearly vowel-free capitals — stay as they are.
const ABBREVIATIONS = new Set(['FIAGES', 'MRCOG', 'MRCPCH', 'FRCOG', 'FICOG', 'FICOI', 'OBGYN', 'IBCLC', 'MNAMS', 'DDVL', 'DMRD', 'FMAS', 'DMAS', 'NDVH', 'MBBS']);
const isWord = (w) => !ABBREVIATIONS.has(w) && w.length >= 5 && (w.match(/[AEIOU]/g) || []).length >= 2;
const SMALL = new Set(['IN', 'OF', 'AND', 'THE', 'FOR', 'WITH']);

export function tidyQualifications(text = '') {
  const cased = String(text).replace(/\b[A-Z]{2,}\b/g, (w, at, all) => {
    if (isWord(w)) return w[0] + w.slice(1).toLowerCase();
    // "IN", "OF"… between words typed in capitals
    if (SMALL.has(w)) {
      const next = all.slice(at + w.length).match(/^\s+([A-Za-z]+)/)?.[1] || '';
      const prev = all.slice(0, at).match(/([A-Za-z]+)\s+$/)?.[1] || '';
      if ([next, prev].some((x) => isWord(x) || /^[A-Z][a-z]/.test(x))) return w.toLowerCase();
    }
    return w;
  });
  return cased
    .replace(/\s*\(\s*/g, ' (')
    .replace(/\s*\)/g, ')')
    .replace(/\s+,/g, ',')
    .replace(/,(?=\S)/g, ', ')
    .replace(/\s{2,}/g, ' ')
    .replace(/^ /, '')
    .trim();
}

// Degrees are typed into either field in the admin — some doctors' are in
// Designation ("MBBS, DNB"), others' in Qualifications ("BSc, MBBS, MD
// (General Medicine)") — and the two are shown differently, a role in the
// brand colour and qualifications in grey. So every doctor's degrees are
// moved to Qualifications, and Designation keeps only a role such as "Senior
// Consultant". A profile paragraph typed where the qualifications go moves to
// the profile text, unless a profile is already written.
const DEGREE = /\b(MBBS|MD|MS|DNB|DM|M\.?\s?Ch|BDS|MDS|DGO|DCH|DA|DLO|DVD|DDVL|DPM|DMRD|FNB|MRCP|MRCPCH|MRCOG|MRCS|FRCS|FRCOG|FRCP|FMAS|FIAGES|FICOG|FICOI|FIPM|MNAMS|PhD|B\.?\s?Sc|M\.?\s?Sc|BA|MA|MPhil|PGD\w*|BPT|MPT|BAMS|BHMS|OMFS|PDF|IBCLC|Diploma|Fellowship)\b/i;
const PROSE = /\b(is|are|was|has|have|had|with|who|years?|experience|our|he|she|his|her|they|their|known|acclaimed|dedicated)\b/i;

export function isQualifications(text = '') {
  const t = String(text).trim();
  return Boolean(t) && t.length <= 260 && DEGREE.test(t) && !PROSE.test(t);
}

export function withQualificationsSorted(doctors = []) {
  return doctors.map((d) => {
    const designation = String(d.designation || '').trim();
    // a bio that is only a title or a name ("Dr.") says nothing
    const typed = String(d.bio || '').trim();
    const bio = /^(dr|mr|mrs|ms)\.?(\s+[a-z .]{0,30})?$/i.test(typed) && !DEGREE.test(typed) ? '' : typed;
    if (bio !== typed) d = { ...d, bio };
    const roleIsDegrees = isQualifications(designation);
    const bioIsDegrees = isQualifications(bio);
    let next = d;
    if (roleIsDegrees) {
      // the fuller list wins when both fields hold degrees
      const degrees = bioIsDegrees && bio.length >= designation.length ? bio : designation;
      next = { ...d, designation: '', bio: degrees };
      if (bio && !bioIsDegrees && !String(d.fullBio || '').trim()) next.fullBio = bio;
    }
    return isQualifications(next.bio) ? { ...next, bio: tidyQualifications(next.bio) } : next;
  });
}
