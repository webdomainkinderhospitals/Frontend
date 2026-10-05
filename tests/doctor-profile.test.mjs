import { test } from 'node:test';
import assert from 'node:assert/strict';
import { composedProfile, profileText, profileLead, hasMoreProfile } from '../lib/doctor-profile.mjs';

test('a doctor without a profile gets one factual sentence', () => {
  assert.equal(
    composedProfile({ name: 'Dr. Rekha B Nair', designation: 'Consultant', speciality: 'Anaesthesiology & Critical Care', bio: 'MBBS, DA, DNB' }, 'Kinder Hospitals Kochi'),
    'Dr. Rekha B Nair is a Consultant in Anaesthesiology & Critical Care at Kinder Hospitals Kochi. Qualifications: MBBS, DA, DNB.'
  );
  assert.equal(
    composedProfile({ name: 'Dr. Bipin Johny', speciality: 'Nephrology', bio: 'MBBS, MD, DM (Nephrology)' }),
    'Dr. Bipin Johny is a specialist in Nephrology. Qualifications: MBBS, MD, DM (Nephrology).'
  );
  assert.match(composedProfile({ name: 'Dr. A', designation: 'Consultant – Neonatology & Paediatrics', speciality: 'Neonatology with Level 3 NICU Care' }), /is a Consultant – Neonatology & Paediatrics\./);
});

test('a written profile keeps its sections, and the lead is its first paragraph', () => {
  const doc = { name: 'Dr. S', fullBio: 'Dr. S is an experienced cardiologist.\n\n### Education & training\n- MBBS — College' };
  assert.match(profileText(doc), /### Education & training\n\n- MBBS/);
  assert.equal(profileLead(doc), 'Dr. S is an experienced cardiologist.');
  assert.equal(hasMoreProfile(doc), true);
  assert.equal(hasMoreProfile({ name: 'Dr. T', fullBio: 'One paragraph only.' }), false);
});

import { tidyQualifications } from '../lib/doctor-profile.mjs';
test('qualifications are tidied for display without changing degrees', () => {
  assert.equal(
    tidyQualifications('MBBS, MS ( OBSTETRICS & GYNAECOLOGY ), DNB( OBSTETRICS & GYNAECOLOGY ) & Fellowship in Reproductive Medicine'),
    'MBBS, MS (Obstetrics & Gynaecology), DNB (Obstetrics & Gynaecology) & Fellowship in Reproductive Medicine'
  );
  assert.equal(tidyQualifications('MBBS, MD, DM(NEPHROLOGY)'), 'MBBS, MD, DM (Nephrology)');
  assert.equal(tidyQualifications('MBBS, DNB (OBG), MNAMS'), 'MBBS, DNB (OBG), MNAMS');
});
