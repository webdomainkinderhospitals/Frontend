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
