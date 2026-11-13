import test from 'node:test';
import assert from 'node:assert/strict';
import { centreGroups, OTHER, WOMEN } from '../lib/centre-departments.mjs';

test('Kochi keeps the hospital\'s own grouping, under the new names', () => {
  const kochi = [
    { name: 'General Medicine & Diabetology', group: 'Multispeciality Services' },
    { name: 'Andrology', group: 'Multispeciality Services' },
    { name: 'Endocrinology', group: 'Women & Fertility Centre' },
    { name: 'Obstetrics & Gynaecology', group: 'Women & Fertility Centre' },
  ];
  const groups = centreGroups(kochi);
  assert.deepEqual(groups.map((g) => g.title), [OTHER, WOMEN]);
  assert.equal(OTHER, 'Other Specialities');
  assert.equal(WOMEN, 'Women Hospital & Fertility Centre');
  assert.deepEqual(groups[0].items.map((s) => s.name), ['General Medicine & Diabetology', 'Andrology']);
  assert.deepEqual(groups[1].items.map((s) => s.name), ['Endocrinology', 'Obstetrics & Gynaecology']);
});

test('any other centre is sorted into the same two groups by department', () => {
  const groups = centreGroups([
    { name: 'Obstetrics & Gynaecology' }, { name: 'IVF & Fertility' }, { name: 'Neonatology' }, { name: 'Paediatrics' },
    { name: 'Paediatric Surgery' }, { name: 'Fetal Medicine' }, { name: 'General Surgery' }, { name: 'Orthopaedics' },
    { name: 'Cardiology' }, { name: 'Endocrinology' }, { name: 'ENT' },
  ]);
  assert.deepEqual(groups.map((g) => g.title), [OTHER, WOMEN]);
  assert.deepEqual(groups[1].items.map((s) => s.name), ['Obstetrics & Gynaecology', 'IVF & Fertility', 'Neonatology', 'Paediatrics', 'Paediatric Surgery', 'Fetal Medicine']);
  assert.deepEqual(groups[0].items.map((s) => s.name), ['General Surgery', 'Orthopaedics', 'Cardiology', 'Endocrinology', 'ENT']);
});

test('a centre with departments on one side only gets one group', () => {
  assert.deepEqual(centreGroups([{ name: 'Obstetrics' }, { name: 'Paediatrics' }]).map((g) => g.title), [WOMEN]);
  assert.deepEqual(centreGroups([]), []);
});

test('a department listed twice appears once', () => {
  const groups = centreGroups([{ name: 'Obstetrics' }, { name: 'obstetrics ' }, { name: 'ENT' }]);
  assert.deepEqual(groups.map((g) => g.items.length), [1, 1]);
});
