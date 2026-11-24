import { test } from 'node:test';
import assert from 'node:assert/strict';
import { centreServicePage, faqSchema } from '../lib/centre-service-pages.mjs';

test('Kochi General Medicine carries the page the hospital wrote', () => {
  const page = centreServicePage({ name: 'Kochi', slug: 'kochi' }, 'general-medicine');
  assert.equal(page.metaTitle, 'General Medicine & Vaccination Clinic in Kochi | Kinder Hospitals');
  assert.match(page.fullDescription, /^## Why awareness matters\n\n/);
  assert.match(page.fullDescription, /## Vaccination Clinic\n\n.+\n\n- Adult vaccination/);
  assert.equal(page.faqs.length, 6);
  assert.ok(centreServicePage({ name: 'Cochin' }, 'general-medicine'));
  assert.equal(centreServicePage({ name: 'Cherthala' }, 'general-medicine'), null);
  assert.equal(centreServicePage({ name: 'Kochi' }, 'emergency-and-trauma-care'), null);
  assert.equal(faqSchema(page.faqs).mainEntity[0]['@type'], 'Question');
});

test('Kochi ENT carries the hospital\'s full department text', () => {
  const page = centreServicePage({ name: 'Kochi' }, 'ent');
  assert.equal(page.heading, 'ENT Care at Kinder Hospitals, Kochi');
  assert.match(page.fullDescription, /### Nose & sinus\n\n- Sinusitis/);
  assert.match(page.fullDescription, /## Nose & sinus surgery\n\n- Endoscopic sinus surgery/);
  assert.match(page.fullDescription, /Cochlear implants for children and adults/);
  assert.doesNotMatch(page.fullDescription + JSON.stringify(page.faqs), /confirm|VERIFY/i);
  assert.equal(page.faqs.length, 6);
  assert.equal(centreServicePage({ name: 'Kochi' }, 'general-ent').heading, page.heading);
});

test('every Kochi department the hospital wrote has its page, under either name', async () => {
  const { KOCHI_DEPARTMENT_LIST } = await import('../lib/kochi-departments.mjs');
  const { slugify } = await import('../lib/services.js');
  const kochi = { name: 'Kochi' };
  const written = KOCHI_DEPARTMENT_LIST.filter((d) => centreServicePage(kochi, slugify(d.name)));
  assert.deepEqual(written.map((d) => d.name), [
    'General Medicine & Diabetology', 'Orthopaedics & Sports Medicine', 'General & Laparoscopic Surgery', 'ENT',
    'Urology', 'Pulmonology', 'Radiology', 'Dentistry', 'Dermatology & Cosmetology', 'Gastroenterology',
    'Neurology', 'Ophthalmology', 'Cardiology', 'Geriatrics', 'Anaesthesiology & Critical Care',
    'Psychiatry & Clinical Psychology', 'Obstetrics & Gynaecology', 'Reproductive Medicine', 'Paediatrics',
    'Gynaecological Oncology', 'Fetomaternal Medicine', 'Neonatology with Level 3 NICU Care',
  ]);
  // the group's catalogue names lead to the same pages
  for (const [group, kochiName] of [
    ['Orthopaedics & Sports Med', 'Orthopaedics & Sports Medicine'], ['Neonatology', 'Neonatology with Level 3 NICU Care'],
    ['Fetal Medicine', 'Fetomaternal Medicine'], ['Gynaec Oncology', 'Gynaecological Oncology'],
    ['Dermatology', 'Dermatology & Cosmetology'], ['Anesthesiology & Pain', 'Anaesthesiology & Critical Care'],
  ]) {
    assert.equal(centreServicePage(kochi, slugify(group)).heading, centreServicePage(kochi, slugify(kochiName)).heading, group);
  }
  for (const d of written) {
    const page = centreServicePage(kochi, slugify(d.name));
    assert.ok(page.intro && page.metaTitle && page.metaDescription && page.fullDescription, d.name);
    assert.doesNotMatch(page.fullDescription + page.intro, /best (gyn|hospital|centre)|among (one of )?the best|only hospital|first of its kind|kinderkochi\.com|undefined/i, d.name);
  }
  assert.equal(centreServicePage({ name: 'Cherthala' }, 'urology'), null);
});

test('Kochi final pages are always published with the approved text', async () => {
  const { withKochiFinalPages } = await import('../lib/kochi-final-pages.mjs');
  const pages = withKochiFinalPages([
    { slug: 'kochi-premium-birthing-centre', title: 'Premium Birthing Services at Kinder Hospitals, Kochi', body: 'old', published: false, imageUrl: '/x.webp' },
    { slug: 'other', body: 'kept' },
  ]);
  const pbc = pages.find((p) => p.slug === 'kochi-premium-birthing-centre');
  assert.equal(pbc.published, true);
  assert.equal(pbc.title, 'Premium Birthing Services at Kinder Hospitals, Kochi');
  assert.equal(pbc.imageUrl, '/x.webp');
  assert.match(pbc.body, /## LDRP: One Room, Every Stage of Birth/);
  assert.equal(pbc.metaTitle, 'Premium Birthing Centre in Kochi | Kinder Hospitals');
  const lap = pages.find((p) => p.slug === 'kochi-general-laparoscopic-surgery');
  assert.equal(lap.published, true);
  assert.equal(lap.category, 'Kochi Care (linked page)');
  assert.ok(pages.find((p) => p.slug === 'kochi-water-birthing-suite'));
  assert.equal(pages.find((p) => p.slug === 'other').body, 'kept');
  assert.doesNotMatch(JSON.stringify(pages), /Keyword|AEO|FAQPage schema|\[phone\]/);
});

test('the Kochi surgery speciality page carries the final page', () => {
  const page = centreServicePage({ name: 'Kochi' }, 'general-laparoscopic-surgery');
  assert.match(page.intro, /^Kinder Hospitals' Department of General & Minimally Invasive Surgery in Kochi/);
  assert.match(page.fullDescription, /^## A Female Surgeon, Where That Matters to You/);
  assert.doesNotMatch(page.fullDescription, /Frequently Asked/i);
  assert.equal(page.faqs.length, 8);
  assert.doesNotMatch(page.faqs.at(-1)[1], /Book a consultation/);
  assert.match(page.cta, /^Book a consultation with Kinder Hospitals' General & Minimally Invasive Surgery team, Kochi/);
});

test('other hospitals and the group site get the department text without the centre name', async () => {
  const { withoutCentreName } = await import('../lib/centre-service-pages.mjs');
  const { KOCHI_DEPARTMENT_LIST } = await import('../lib/kochi-departments.mjs');
  const { slugify } = await import('../lib/services.js');
  for (const d of KOCHI_DEPARTMENT_LIST) {
    const page = withoutCentreName(centreServicePage({ name: 'Kochi' }, slugify(d.name)));
    if (!page) continue;
    const text = JSON.stringify(page);
    assert.doesNotMatch(text, /kochi|cochin/i, d.name);
    assert.doesNotMatch(text, /,\s*[—–,.]|\s,/, d.name);
  }
  const gm = withoutCentreName(centreServicePage({ name: 'Kochi' }, 'general-medicine'));
  assert.equal(gm.heading, 'General Medicine (Internal Medicine)');
  assert.match(gm.intro, /^The Department of General Medicine at Kinder Hospitals, also known as internal medicine/);
  // Kochi's own page keeps its name
  assert.match(centreServicePage({ name: 'Kochi' }, 'general-medicine').heading, /in Kochi$/);
});
