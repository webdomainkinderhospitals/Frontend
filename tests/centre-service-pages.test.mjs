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
  assert.equal(centreServicePage({ name: 'Kochi' }, 'neonatology'), null);
  assert.equal(faqSchema(page.faqs).mainEntity[0]['@type'], 'Question');
});

test('Kochi ENT carries the confirmed parts of the draft only', () => {
  const page = centreServicePage({ name: 'Kochi' }, 'ent');
  assert.equal(page.heading, 'ENT Care at Kinder Hospitals, Kochi');
  assert.match(page.fullDescription, /### Nose & sinus\n\n- Sinusitis/);
  assert.doesNotMatch(page.fullDescription + JSON.stringify(page.faqs), /confirm|VERIFY|FESS|cochlear|polysomnography|tonsillectomy/i);
  assert.equal(page.faqs.length, 4);
  assert.equal(centreServicePage({ name: 'Kochi' }, 'general-ent').heading, page.heading);
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
