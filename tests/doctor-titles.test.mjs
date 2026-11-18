import test from 'node:test';
import assert from 'node:assert/strict';
import { withoutTitle, withoutConsultantTitles } from '../lib/doctor-titles.mjs';

test('consultant titles are not shown; qualifications are', () => {
  assert.equal(withoutTitle('Senior Consultant'), '');
  assert.equal(withoutTitle('Consultant'), '');
  assert.equal(withoutTitle('Consultant — Paediatrics', 'Paediatrics'), '');
  assert.equal(withoutTitle('Senior Consultant — ENT', 'ENT'), '');
  assert.equal(withoutTitle('Consultant — General & Laparoscopic Surgery', 'General Surgery'), 'General & Laparoscopic Surgery');
  assert.equal(withoutTitle('Consultant Gynecological Oncologist — Gynaecological Oncology', 'Gynaecological Oncology'), '');
  assert.equal(withoutTitle('Consultant – Neonatology & Paediatrics — Neonatology with Level 3 NICU Care', 'Neonatology'), 'Neonatology & Paediatrics — Neonatology with Level 3 NICU Care');
  assert.equal(withoutTitle('MBBS, DNB · Fellowship in Neonatology', 'Neonatology'), 'MBBS, DNB · Fellowship in Neonatology');
  assert.equal(withoutTitle(''), '');
  const docs = [{ name: 'A', designation: 'Senior Consultant', speciality: 'General Medicine' }, { name: 'B', designation: 'MBBS, MD' }];
  const out = withoutConsultantTitles(docs);
  assert.equal(out[0].designation, '');
  assert.equal(out[1], docs[1]);
});
