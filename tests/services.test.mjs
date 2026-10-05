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
