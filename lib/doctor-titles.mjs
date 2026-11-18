// Doctors are shown without "Consultant" / "Senior Consultant" titles (the
// hospital's request, Nov 2026). A designation that is only such a title is
// dropped; one that adds a speciality keeps just the speciality, unless that
// repeats the speciality already shown on the card. Qualifications
// ("MBBS, DNB · Fellowship in Neonatology") are kept as they are.
const TITLE = /^\s*(?:senior|sr\.?|chief|associate|assistant|junior|jr\.?|visiting|principal)?\s*consultant\b[^—–-]*?(?:\s*[—–-]\s*|$)/i;
const same = (a, b) => String(a || '').trim().toLowerCase().replace(/\s+/g, ' ') === String(b || '').trim().toLowerCase().replace(/\s+/g, ' ');

export function withoutTitle(designation = '', speciality = '') {
  const text = String(designation || '').trim();
  if (!TITLE.test(text)) return text;
  const rest = text.replace(TITLE, '').trim();
  return !rest || same(rest, speciality) ? '' : rest;
}

export const withoutConsultantTitles = (doctors = []) =>
  doctors.map((d) => {
    const designation = withoutTitle(d.designation, d.speciality);
    return designation === String(d.designation || '').trim() ? d : { ...d, designation };
  });
