import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { SPECIALITY_ICONS, specialityIconKey, uniqueSpecialityIcons } from '../lib/speciality-icons.mjs';

test('every icon in the set has its file', () => {
  assert.equal(SPECIALITY_ICONS.length, 52);
  assert.equal(new Set(SPECIALITY_ICONS).size, 52);
  for (const key of SPECIALITY_ICONS) assert.ok(existsSync(`public/icons/specialities/${key}.svg`), key);
});

test('each department on the site gets the fitting icon', () => {
  const expected = {
    // Kinder Kochi, as named in the client's directory
    'General Medicine & Diabetology': 'general-medicine',
    'Orthopaedics & Sports Medicine': 'orthopaedics',
    'General & Laparoscopic Surgery': 'general-surgery',
    ENT: 'ent', Urology: 'urology', Pulmonology: 'pulmonology', Radiology: 'radiology',
    'Emergency & Trauma Care': 'emergency-medicine', Dentistry: 'dental',
    'Dermatology & Cosmetology': 'dermatology', 'Plastic & Cosmetic Surgery': 'plastic-surgery',
    Gastroenterology: 'gastroenterology', 'Hepatology & Liver Transplant Medicine': 'hepatology',
    Neurosurgery: 'neurosurgery', Neurology: 'neurology', Ophthalmology: 'ophthalmology',
    Cardiology: 'cardiology', Nephrology: 'nephrology', 'Joint Replacement & Spine Surgery': 'joint-replacement',
    Geriatrics: 'geriatrics', Andrology: 'andrology', 'Anaesthesiology & Critical Care': 'anaesthesiology',
    'Psychiatry & Clinical Psychology': 'psychiatry', 'Paediatric Surgery': 'paediatric-surgery',
    'Paediatric Urology': 'paediatric-urology', 'Paediatric Orthopaedics': 'paediatric-orthopaedics',
    'Obstetrics & Gynaecology': 'gynaecology', 'Reproductive Medicine': 'reproductive-medicine',
    Paediatrics: 'paediatrics', 'Gynaecological Oncology': 'gynaecological-oncology',
    'Fetomaternal Medicine': 'fetomaternal-medicine', 'Neonatology with Level 3 NICU Care': 'neonatology',
    Endocrinology: 'endocrinology', 'Cosmetic Gynaecology': 'cosmetic-gynaecology',
    // the group site and the other hospitals
    Obstetrics: 'gynaecology', Maternity: 'mother-child', 'Infertility & IVF': 'ivf',
    'Gynaec & Laparoscopic': 'gynaecology', 'Fetal Medicine': 'fetomaternal-medicine',
    'Plastic & Cosmetic': 'plastic-surgery', 'General ENT': 'ent', 'Anesthesiology & Pain': 'anaesthesiology',
    'Dietetics & Nutrition': 'dietetics', Physiotherapy: 'physiotherapy',
    'Radiology & Diagnostics': 'radiology', 'Something new': 'general-medicine',
    // the Specialities menu
    'Labor & Delivery Pain Management': 'labour-care', 'ANC Classes': 'antenatal-classes',
    'Gynecology & Laparoscopic Surgery': 'gynaecology', 'Pediatric Intensivist (PICU)': 'critical-care',
    'Pediatric Anesthesia': 'anaesthesiology', 'Audiology & Speech Therapy': 'speech-therapy', 'Gynaec Oncology': 'gynaecological-oncology',
  };
  for (const [name, key] of Object.entries(expected)) assert.equal(specialityIconKey(name), key, name);
});

const KOCHI = [
  'General Medicine & Diabetology', 'Orthopaedics & Sports Medicine', 'General & Laparoscopic Surgery', 'ENT', 'Urology',
  'Pulmonology', 'Radiology', 'Emergency & Trauma Care', 'Dentistry', 'Dermatology & Cosmetology', 'Plastic & Cosmetic Surgery',
  'Gastroenterology', 'Hepatology & Liver Transplant Medicine', 'Neurosurgery', 'Neurology', 'Ophthalmology', 'Cardiology',
  'Nephrology', 'Joint Replacement & Spine Surgery', 'Geriatrics', 'Andrology', 'Anaesthesiology & Critical Care',
  'Psychiatry & Clinical Psychology',
  'Paediatric Surgery', 'Paediatric Urology', 'Paediatric Orthopaedics', 'Obstetrics & Gynaecology', 'Reproductive Medicine',
  'Paediatrics', 'Gynaecological Oncology', 'Fetomaternal Medicine', 'Neonatology with Level 3 NICU Care', 'Endocrinology',
  'Cosmetic Gynaecology',
];
const GROUP_MENU = [
  'Obstetrics', 'Maternity', 'High Risk Pregnancy', 'Mother & Child Care Programme', 'Fetal Medicine',
  'Labor & Delivery Pain Management', 'Lactation Support', 'ANC Classes',
  'Infertility Treatment', 'IVF', 'IUI', 'ICSI', 'Gynecology & Laparoscopic Surgery', 'Reproductive Medicine', 'Gynaec Oncology',
  "Women's Wellness",
  'Paediatrics', 'General Paediatrics', 'Paediatric Surgery', 'Neonatology', 'Pediatric Intensivist (PICU)',
  'Pediatric Anesthesia', 'Pediatric Nephrology', 'Audiology & Speech Therapy',
  'General Medicine', 'General Surgery', 'Dermatology & Cosmetology', 'Orthopaedics & Sports Med', 'Plastic & Cosmetic Surgery',
  'General ENT', 'Anesthesiology & Pain', 'Dietetics & Nutrition', 'Physiotherapy',
];

test('no icon is shown twice in Kochi\'s departments or the Specialities menu', () => {
  for (const list of [KOCHI, GROUP_MENU]) {
    const keys = uniqueSpecialityIcons(list);
    const seen = new Map();
    keys.forEach((k, i) => {
      assert.ok(!seen.has(k), `${list[i]} repeats ${k} (already on ${seen.get(k)})`);
      seen.set(k, list[i]);
    });
  }
  // The first choice is kept wherever it is free.
  assert.deepEqual(uniqueSpecialityIcons(['Urology', 'Nephrology', 'Andrology']), ['urology', 'nephrology', 'andrology']);
});
