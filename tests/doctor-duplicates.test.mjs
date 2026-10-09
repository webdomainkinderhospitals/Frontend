import { test } from 'node:test';
import assert from 'node:assert/strict';
import { withoutDuplicateDoctors } from '../lib/doctor-duplicates.mjs';

const profile = 'Dr. Roshna Ramachandran is a physician with more than 15 years of clinical experience in patient care and disease management.';

test('the profile-less copy of a doctor is left out; the full profile stays', () => {
  const list = [
    { id: 1, name: 'Dr. Roshna Ramachandran', location: 'Kochi', fullBio: profile, imageUrl: '/a.jpg' },
    { id: 2, name: 'Dr.Roshan', location: 'Kochi', fullBio: '', imageUrl: '/a.jpg' },
    { id: 3, name: 'Dr. Roshna', location: '', fullBio: '' },
  ];
  assert.deepEqual(withoutDuplicateDoctors(list).map((d) => d.id), [1]);
});

test('different people, other hospitals and doctors without any profile are kept', () => {
  const list = [
    { id: 1, name: 'Dr. Roshna Ramachandran', location: 'Kochi', fullBio: profile },
    { id: 2, name: 'Dr. Roshan Kumar', location: 'Kollam', fullBio: '' }, // another hospital
    { id: 3, name: 'Dr. Anjali Menon', location: 'Kochi', fullBio: '' },
    { id: 4, name: 'Dr. Anjana Nair', location: 'Kochi', fullBio: profile.replace('Roshna Ramachandran', 'Anjana Nair') },
    { id: 5, name: 'Dr. Vidya Prasad', location: 'Cherthala', fullBio: '' },
  ];
  assert.deepEqual(withoutDuplicateDoctors(list).map((d) => d.id), [1, 2, 3, 4, 5]);
});
