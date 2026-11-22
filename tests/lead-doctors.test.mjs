import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leadDoctorsFirst } from '../lib/lead-doctors.mjs';

test('Brigadier (Dr.) A P Radhakrishnan and Dr Ananthen K S lead the full doctor list', () => {
  const docs = ['Dr. Rahul Kh', 'Dr Ananthen K S', 'Dr. Manju V K', 'Brigadier (Dr.) A P Radhakrishnan'].map((name) => ({ name }));
  assert.deepEqual(leadDoctorsFirst(docs).map((d) => d.name),
    ['Brigadier (Dr.) A P Radhakrishnan', 'Dr Ananthen K S', 'Dr. Rahul Kh', 'Dr. Manju V K']);
  const none = [{ name: 'Dr. Rahul Kh' }];
  assert.equal(leadDoctorsFirst(none), none);
});

test('each department head is listed first in their department', async () => {
  const { departmentHeadsFirst } = await import('../lib/lead-doctors.mjs');
  const d = (name, speciality) => ({ name, speciality });
  const list = [
    d('Dr. Neena', 'Obstetrics & Gynaecology'), d('Dr. Arun', 'ENT'), d('Dr. Smitha Pratheesh', 'Obstetrics & Gynaecology'),
    d('Dr. Smitha Surendran', 'Obstetrics & Gynaecology'), d('Dr. Rahul', 'Paediatrics'), d('Dr. Vinay Raj', 'ENT'),
    d('Dr. Boban Abraham', 'Fetomaternal Medicine'),
  ];
  assert.deepEqual(departmentHeadsFirst(list).map((x) => x.name), [
    'Dr. Smitha Surendran', 'Dr. Neena', 'Dr. Vinay Raj', 'Dr. Arun', 'Dr. Smitha Pratheesh', 'Dr. Rahul', 'Dr. Boban Abraham',
  ]);
  // a same-named doctor elsewhere is not a head
  assert.deepEqual(departmentHeadsFirst([d('Dr. A', 'Reproductive Medicine'), d('Dr. Abhishek Radhakrishnan', 'Reproductive Medicine')]).map((x) => x.name),
    ['Dr. Abhishek Radhakrishnan', 'Dr. A']);
  assert.deepEqual(departmentHeadsFirst([]), []);
});

test('on a speciality page the department head comes first whatever their department is called', async () => {
  const { departmentHeadsFirst } = await import('../lib/lead-doctors.mjs');
  const list = [{ name: 'Dr. Arun G Nair', speciality: 'General Medicine' }, { name: 'Brigadier (Dr.) A P Radhakrishnan', speciality: 'General Medicine & Diabetology' }];
  assert.deepEqual(departmentHeadsFirst(list, { oneDepartment: true }).map((d) => d.name), ['Brigadier (Dr.) A P Radhakrishnan', 'Dr. Arun G Nair']);
});
