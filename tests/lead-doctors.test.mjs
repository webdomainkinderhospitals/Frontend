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
