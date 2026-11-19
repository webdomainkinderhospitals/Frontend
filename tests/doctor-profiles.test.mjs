import { test } from 'node:test';
import assert from 'node:assert/strict';
import { withSuppliedProfiles } from '../lib/doctor-profiles.mjs';

test('Dr Ananthen K S gets the formatted profile unless one was written in the admin', () => {
  const [a] = withSuppliedProfiles([{ name: 'Dr. Ananthen K S', bio: 'Dr.', fullBio: '' }]);
  assert.match(a.fullBio, /^Dr\. Ananthen Killikulangara Sadanandan completed his MBBS in 1998/);
  assert.match(a.fullBio, /### Areas of interest\n\n- Neonatology/);
  assert.equal(a.bio, 'MBBS, DCH, MD (Paediatrics), Fellowship in Paediatric Cardiology, PGDMLE');
  const [raw] = withSuppliedProfiles([{ name: 'Dr Ananthen K S', fullBio: 'Dr. Ananthen Killikulangara Sadanandan completed his M.B.B.S in 1998 from government…' }]);
  assert.match(raw.fullBio, /### Areas of interest/);
  const [own] = withSuppliedProfiles([{ name: 'Dr. Ananthen K S', bio: 'MBBS, MD', fullBio: 'Written in the admin.' }]);
  assert.equal(own.fullBio, 'Written in the admin.');
  assert.equal(own.bio, 'MBBS, MD');
  const other = { name: 'Dr. Neena Ananthen', fullBio: '' };
  assert.equal(withSuppliedProfiles([other])[0], other);
});
