import test from 'node:test';
import assert from 'node:assert/strict';
import { withStudioPhotos } from '../lib/studio-photos.mjs';

const doctors = [
  { name: 'Dr. Jeevan Raj C N', location: 'Cherthala', imageUrl: 'https://cdn/old.jpg' },
  { name: 'Dr. Rahul Kh', location: 'Cherthala', imageUrl: 'https://cdn/r.jpg' },
  { name: 'Dr. Remya R', location: 'Cherthala', imageUrl: '' },
  { name: 'Brigadier (Dr.) A P Radhakrishnan', location: 'Kochi', imageUrl: 'https://cdn/ap.jpg' },
  { name: 'Dr. Nikhil V Mathew', location: 'Cochin', imageUrl: 'https://cdn/n.jpg' },
  { name: 'Dr. Shoji Thomas', location: 'Kollam', imageUrl: '' },
  { name: 'Dr. Anitha', location: 'Aranmula', imageUrl: 'https://cdn/a.jpg' },
  { name: 'Dr. Reshmy R Pillai', location: 'Cherthala', imageUrl: 'https://cdn/x.jpg' },
];

test('each doctor gets the studio-blue portrait from their own hospital', () => {
  const [jeevan, rahul, remya, ap, nikhil, shoji, anitha, reshmyElsewhere] = withStudioPhotos(doctors);
  assert.equal(jeevan.imageUrl, '/doctors/studio/cherthala/jeevan-raj-c-n.webp');
  assert.equal(rahul.imageUrl, '/doctors/studio/cherthala/rahul-k-h.webp');
  assert.equal(remya.imageUrl, '/doctors/studio/cherthala/remya.webp');
  assert.equal(ap.imageUrl, '/doctors/studio/kochi/brigadier-dr-a-p-radhakrishnan.webp');
  assert.equal(nikhil.imageUrl, '/doctors/studio/kochi/dr-nikhil-v-mathew.webp');
  assert.equal(shoji.imageUrl, '/doctors/studio/kollam/shoji.webp');
  assert.equal(anitha.imageUrl, 'https://cdn/a.jpg');
  // The same full name at another hospital is the same doctor working at two
  assert.equal(reshmyElsewhere.imageUrl, '/doctors/studio/kollam/reshmy-r-pillai.webp');
  // …but a first-name-only photo never crosses to another hospital
  assert.equal(withStudioPhotos([{ name: 'Dr. Shoji', location: 'Cherthala', imageUrl: 'https://cdn/s.jpg' }])[0].imageUrl, 'https://cdn/s.jpg');
});

test('a first-name-only photo is not guessed when two doctors share the name', () => {
  const two = [{ name: 'Dr. Hira A', location: 'Kollam' }, { name: 'Dr. Hira B', location: 'Kollam' }];
  assert.deepEqual(withStudioPhotos(two), two);
});

test('names written differently still get their photo; a doctor at two hospitals too', () => {
  const docs = withStudioPhotos([
    { name: 'Dr. Kevin Antony George', location: 'Cherthala' },
    { name: 'Dr. Abhishek Radhakrishnan', location: 'Cherthala' },
    { name: 'Dr. Meera Mohan K', location: 'Cherthala' },
    { name: 'Dr. Mili Mohandas', location: 'Cherthala' },
    { name: 'Dr. Smitha Pratheesh', location: 'Kochi' },
    { name: 'Dr. Smitha Surendran', location: 'Kochi' },
  ]);
  assert.equal(docs[0].imageUrl, '/doctors/studio/cherthala/kevin-george.webp');
  assert.equal(docs[1].imageUrl, '/doctors/studio/kochi/dr-abhishek-radhakrishnan.webp');
  assert.equal(docs[2].imageUrl, '/doctors/studio/cherthala/meera-mohan.webp');
  assert.equal(docs[3].imageUrl, undefined);
  assert.equal(docs[4].imageUrl, '/doctors/studio/kochi/dr-smitha-pratheesh.webp');
  assert.equal(docs[5].imageUrl, '/doctors/studio/kochi/dr-smitha-surendran.webp');
});
