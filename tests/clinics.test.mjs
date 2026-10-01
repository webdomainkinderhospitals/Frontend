import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clinicsOf, homeHospitalOf, hospitalsOnly, parentOfClinic } from '../lib/locations.js';

const cherthala = { id: 1, name: 'Cherthala', kind: 'hospital' };
const kochi = { id: 2, name: 'Kochi', kind: 'hospital' };
const alappuzha = { id: 3, name: 'Alappuzha', slug: 'alappuzha', kind: 'clinic' };

test('the group site lists hospitals only', () => {
  assert.deepEqual(hospitalsOnly([cherthala, alappuzha, kochi]).map((l) => l.name), ['Cherthala', 'Kochi']);
});

test('Alappuzha sits under Cherthala until the admin says otherwise', () => {
  const all = [cherthala, kochi, alappuzha];
  assert.equal(parentOfClinic(alappuzha), 'cherthala');
  assert.deepEqual(clinicsOf(cherthala, all), [alappuzha]);
  assert.deepEqual(clinicsOf(kochi, all), [], 'Kochi shows "coming soon"');
  assert.equal(homeHospitalOf(alappuzha, all), cherthala);
});

test('the admin "Clinic of" field decides once it is set', () => {
  const moved = { ...alappuzha, parentHospital: 'Kochi' };
  assert.deepEqual(clinicsOf(kochi, [cherthala, kochi, moved]), [moved]);
  assert.deepEqual(clinicsOf(cherthala, [cherthala, kochi, moved]), []);
  const unassigned = { ...alappuzha, parentHospital: '' };
  assert.deepEqual(clinicsOf(cherthala, [cherthala, unassigned]), []);
  assert.equal(homeHospitalOf(unassigned, [cherthala]), null);
});
