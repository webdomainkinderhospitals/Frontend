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
