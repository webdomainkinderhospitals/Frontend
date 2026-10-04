import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { SPECIALITY_ICONS, specialityIconKey } from '../lib/speciality-icons.mjs';

test('every icon in the set has its file', () => {
  assert.equal(SPECIALITY_ICONS.length, 32);
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
    Geriatrics: 'geriatrics', Andrology: 'urology', 'Anaesthesiology & Critical Care': 'anaesthesiology',
    'Psychiatry & Clinical Psychology': 'psychiatry', 'Paediatric Surgery': 'paediatric-surgery',
    'Paediatric Urology': 'urology', 'Paediatric Orthopaedics': 'paediatric-orthopaedics',
    'Obstetrics & Gynaecology': 'gynaecology', 'Reproductive Medicine': 'reproductive-medicine',
    Paediatrics: 'paediatrics', 'Gynaecological Oncology': 'gynaecological-oncology',
    'Fetomaternal Medicine': 'fetomaternal-medicine', 'Neonatology with Level 3 NICU Care': 'neonatology',
    Endocrinology: 'endocrinology', 'Cosmetic Gynaecology': 'cosmetic-gynaecology',
    // the group site and the other hospitals
    Obstetrics: 'gynaecology', Maternity: 'gynaecology', 'Infertility & IVF': 'reproductive-medicine',
    'Gynaec & Laparoscopic': 'gynaecology', 'Fetal Medicine': 'fetomaternal-medicine',
    'Plastic & Cosmetic': 'plastic-surgery', 'General ENT': 'ent', 'Anesthesiology & Pain': 'anaesthesiology',
    'Dietetics & Nutrition': 'gastroenterology', Physiotherapy: 'orthopaedics',
    'Radiology & Diagnostics': 'radiology', 'Something new': 'general-medicine',
    // the Specialities menu
    'Labor & Delivery Pain Management': 'gynaecology', 'ANC Classes': 'gynaecology',
    'Gynecology & Laparoscopic Surgery': 'gynaecology', 'Pediatric Intensivist (PICU)': 'paediatrics',
    'Pediatric Anesthesia': 'paediatrics', 'Audiology & Speech Therapy': 'ent', 'Gynaec Oncology': 'gynaecological-oncology',
  };
  for (const [name, key] of Object.entries(expected)) assert.equal(specialityIconKey(name), key, name);
});
