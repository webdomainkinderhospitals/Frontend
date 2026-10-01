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
export function tidyQualifications(text = '') {
  return String(text)
    .replace(/\s*\(\s*/g, ' (')
    .replace(/\s*\)/g, ')')
    .replace(/\(([^)]*)\)/g, (m, inner) => `(${inner.replace(/\b([A-Z]{5,})\b/g, (w) => w[0] + w.slice(1).toLowerCase())})`)
    .replace(/\s+,/g, ',')
    .replace(/\s{2,}/g, ' ')
    .replace(/^ /, '')
    .trim();
}
