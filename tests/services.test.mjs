import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matchesService } from '../lib/services.js';

test('a doctor is matched to whole department names only', () => {
  assert.equal(matchesService('Dentistry', 'ENT'), false);
  assert.equal(matchesService('Neurology', 'Urology'), false);
  assert.equal(matchesService('General ENT', 'ENT'), true);
  assert.equal(matchesService('Infertility & IVF', 'IVF'), true);
  assert.equal(matchesService('Urology', 'Urology'), true);
});

test('a paediatric sub-speciality is not the adult department', () => {
  const reju = 'Paediatric Surgery & Paediatric Urology';
  assert.equal(matchesService(reju, 'Paediatric Surgery'), true);
  assert.equal(matchesService(reju, 'Paediatric Urology'), true);
  assert.equal(matchesService(reju, 'Urology'), false);
  assert.equal(matchesService('Paediatric Orthopaedics', 'Orthopaedics'), false);
  assert.equal(matchesService('Urology & Paediatric Urology', 'Urology'), true);
});

test('every Kochi department with a written page is a group speciality too', async () => {
  const { groupServices, findService } = await import('../lib/services.js');
  const groups = groupServices([]);
  const allied = groups.find((g) => g.id === 'allied').items.map((i) => i.name);
  for (const name of ['Urology', 'Pulmonology', 'Radiology', 'Dentistry', 'Gastroenterology', 'Neurology', 'Ophthalmology', 'Cardiology', 'Geriatrics', 'Psychiatry & Clinical Psychology']) {
    assert.ok(allied.includes(name), name);
  }
  // covered under the group's own name — not listed twice
  const names = groups.flatMap((g) => g.items.map((i) => i.name));
  assert.ok(!names.includes('Neonatology with Level 3 NICU Care'));
  assert.ok(!names.includes('General Medicine & Diabetology'));
  assert.equal(new Set(names).size, names.length);
  assert.match(findService([], 'neonatology').description, /Level 3 NICU/);
  assert.match(findService([], 'urology').description, /Kidney stones/);
  // a speciality the admin already lists is not added again
  const db = [{ name: 'Urology', category: 'Allied & Wellness', description: 'Ours' }];
  const fromDb = groupServices(db).find((g) => g.id === 'allied').items.filter((i) => i.name === 'Urology');
  assert.deepEqual(fromDb.map((i) => i.description), ['Ours']);
});

test('a speciality has the same short description at every centre', async () => {
  const { specialityDescription } = await import('../lib/services.js');
  assert.match(specialityDescription('Urology'), /^Kidney stones/);
  assert.equal(specialityDescription('Neonatology'), specialityDescription('Neonatology with Level 3 NICU Care'));
  assert.equal(specialityDescription('Radiology & Diagnostics'), specialityDescription('Radiology'));
  assert.equal(specialityDescription('Gynaecology'), specialityDescription('Obstetrics & Gynaecology'));
  assert.equal(specialityDescription('Emergency & Trauma Care'), '');
});

test('a speciality link opens its page under any name the speciality has had', async () => {
  const { findService } = await import('../lib/services.js');
  const db = [
    { name: 'Plastic & Cosmetic', category: 'Allied & Wellness' },
    { name: 'Gynaec & Laparoscopic', category: 'Fertility & Gynaecology' },
  ];
  assert.equal(findService(db, 'plastic-and-cosmetic-surgery')?.name, 'Plastic & Cosmetic');
  assert.equal(findService(db, 'plastic-and-cosmetic')?.name, 'Plastic & Cosmetic');
  assert.equal(findService(db, 'gynecology-and-laparoscopic-surgery')?.name, 'Gynaec & Laparoscopic');
  // the shipped catalogue's own name still opens its page
  assert.equal(findService([], 'plastic-and-cosmetic-surgery')?.name, 'Plastic & Cosmetic Surgery');
  assert.equal(findService(db, 'no-such-service'), undefined);
});

test('Plastic & Cosmetic Surgery has a page of its own', async () => {
  const { groupServicePage } = await import('../lib/group-service-pages.mjs');
  const page = groupServicePage('plastic-and-cosmetic');
  assert.equal(page.key, 'plastic-and-cosmetic-surgery');
  assert.match(page.fullDescription, /^## Reconstructive and aesthetic care/);
  assert.equal(page.faqs.length, 4);
  assert.equal(groupServicePage('urology'), null);
});

test('a group speciality lists the doctors of the same department under its other names', async () => {
  const { doctorsForService } = await import('../lib/services.js');
  const docs = [
    { name: 'A', speciality: 'ENT' }, { name: 'B', speciality: 'Orthopaedics & Sports Medicine' },
    { name: 'C', speciality: 'Neonatology with Level 3 NICU Care' }, { name: 'D', speciality: 'Paediatric Orthopaedics' },
    { name: 'E', speciality: 'Paediatric Surgery & Paediatric Urology' },
  ];
  const names = (svc) => doctorsForService(svc, docs).map((d) => d.name);
  assert.deepEqual(names('General ENT'), ['A']);
  assert.deepEqual(names('Orthopaedics & Sports Med'), ['B']);
  assert.deepEqual(names('Neonatology'), ['C']);
  assert.deepEqual(names('Urology'), []);
});

test('maternity lists the gynaecology team, and IVF the reproductive medicine team', async () => {
  const { doctorsForService } = await import('../lib/services.js');
  const docs = [
    { name: 'Dr. Smitha Surendran', speciality: 'Obstetrics & Gynaecology' }, { name: 'Dr. Sajitha', speciality: 'Gynaecological Oncology' },
    { name: 'Dr. Abhishek Radhakrishnan', speciality: 'Reproductive Medicine' }, { name: 'Dr. Priyanka', speciality: 'Reproductive Medicine' },
    { name: 'Dr. K', speciality: 'Infertility & IVF' }, { name: 'Dr. P', speciality: 'Paediatrics' },
  ];
  const names = (svc) => doctorsForService(svc, docs).map((d) => d.name);
  assert.deepEqual(names('Maternity'), ['Dr. Smitha Surendran']);
  assert.deepEqual(names('IVF'), ['Dr. Abhishek Radhakrishnan', 'Dr. Priyanka', 'Dr. K']);
  assert.deepEqual(names('Infertility & IVF'), ['Dr. Abhishek Radhakrishnan', 'Dr. Priyanka', 'Dr. K']);
  assert.deepEqual(names('ICSI'), ['Dr. Abhishek Radhakrishnan', 'Dr. Priyanka', 'Dr. K']);
});
