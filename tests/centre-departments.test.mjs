import test from 'node:test';
import assert from 'node:assert/strict';
import { centreGroups, OTHER, KOCHI_OTHER, WOMEN } from '../lib/centre-departments.mjs';

const titles = (groups) => groups.map((g) => g.title);

test('Kochi keeps its own grouping: the Women Hospital first, then Multispeciality Services', () => {
  const kochi = [
    { name: 'General Medicine & Diabetology', group: 'Multispeciality Services' },
    { name: 'Andrology', group: 'Multispeciality Services' },
    { name: 'Endocrinology', group: 'Women & Fertility Centre' },
    { name: 'Obstetrics & Gynaecology', group: 'Women & Fertility Centre' },
  ];
  const groups = centreGroups(kochi, { kochi: true });
  assert.deepEqual(titles(groups), [WOMEN, KOCHI_OTHER]);
  assert.equal(KOCHI_OTHER, 'Multispeciality Services');
  assert.equal(WOMEN, 'Women Hospital & Fertility Centre');
  assert.deepEqual(groups[0].items.map((s) => s.name), ['Endocrinology', 'Obstetrics & Gynaecology']);
  assert.deepEqual(groups[1].items.map((s) => s.name), ['General Medicine & Diabetology', 'Andrology']);
  assert.deepEqual(groups.map((g) => g.women), [true, false]);
});

test('every other centre: the Women Hospital first, Other Specialities second', () => {
  const groups = centreGroups([
    { name: 'Obstetrics & Gynaecology' }, { name: 'IVF & Fertility' }, { name: 'Neonatology' }, { name: 'Paediatrics' },
    { name: 'Paediatric Surgery' }, { name: 'Fetal Medicine' }, { name: 'General Surgery' }, { name: 'Orthopaedics' },
    { name: 'Cardiology' }, { name: 'Endocrinology' }, { name: 'ENT' },
  ]);
  assert.deepEqual(titles(groups), [WOMEN, OTHER]);
  assert.equal(OTHER, 'Other Specialities');
  assert.deepEqual(groups[0].items.map((s) => s.name), ['Obstetrics & Gynaecology', 'IVF & Fertility', 'Neonatology', 'Paediatrics', 'Paediatric Surgery', 'Fetal Medicine']);
  assert.deepEqual(groups[1].items.map((s) => s.name), ['General Surgery', 'Orthopaedics', 'Cardiology', 'Endocrinology', 'ENT']);
  assert.deepEqual(groups.map((g) => g.women), [true, false]);
});

test('a centre with departments on one side only gets one group', () => {
  assert.deepEqual(titles(centreGroups([{ name: 'Obstetrics' }, { name: 'Paediatrics' }])), [WOMEN]);
  assert.deepEqual(centreGroups([]), []);
});

test('a department listed twice appears once', () => {
  const groups = centreGroups([{ name: 'Obstetrics' }, { name: 'obstetrics ' }, { name: 'ENT' }]);
  assert.deepEqual(groups.map((g) => g.items.length), [1, 1]);
});
