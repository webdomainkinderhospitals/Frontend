import { test } from 'node:test';
import assert from 'node:assert/strict';

test('team profiles open with the written text, a leader page without its name line, or nothing', async () => {
  const { teamProfiles, teamAsDoctors } = await import('../lib/management-team.mjs');
  const pages = [{ slug: 'leadership-mr-anto-twinkle', body: 'Mr. Anto Twinkle\n\nMr. Anto Twinkle leads Kochi.\n\n- Team Leadership' }];
  const p = teamProfiles(pages);
  assert.match(p['dr-v-k-pradeep-kumar'].text, /^Dr V\. K\. Pradeep Kumar brings/);
  assert.ok(p['dr-v-k-pradeep-kumar'].quote && p['renjith-krishnan'].facts.length === 2);
  assert.equal(p['anto-twinkle'].text, 'Mr. Anto Twinkle leads Kochi.\n\n- Team Leadership');
  assert.equal(p['sreejith-s'], undefined);
  assert.equal(teamProfiles([])['anto-twinkle'], undefined);
  assert.equal(teamAsDoctors([])[0].team, 'dr-v-k-pradeep-kumar');
});

test('a photo chosen in the admin is kept over the studio and team portraits', async () => {
  const { withStudioPhotos } = await import('../lib/studio-photos.mjs');
  const { withTeamPhotos, teamAsDoctors } = await import('../lib/management-team.mjs');
  const chosen = { name: 'Dr. Manju V K', location: 'Kollam', imageUrl: 'https://cdn/new.jpg', photoSetAt: '2026-11-18T08:00:00Z' };
  const plain = { name: 'Dr. Manju V K', location: 'Kollam', imageUrl: 'https://cdn/old.jpg' };
  assert.equal(withStudioPhotos([chosen])[0].imageUrl, 'https://cdn/new.jpg');
  assert.match(withStudioPhotos([plain])[0].imageUrl, /studio\/kollam\/manju-v-k/);
  const sijo = { name: 'Dr. Sojo Thomas', location: 'Kochi', imageUrl: 'https://cdn/sijo.jpg', photoSetAt: '2026-11-18T08:00:00Z' };
  assert.equal(withTeamPhotos([sijo])[0].imageUrl, 'https://cdn/sijo.jpg');
  assert.equal(teamAsDoctors([sijo]).find((d) => d.teamOf).imageUrl, 'https://cdn/sijo.jpg');
  assert.match(withTeamPhotos([{ ...sijo, photoSetAt: null }])[0].imageUrl, /team\/sojo/);
});

test('the Kochi studio shoot covers doctors named by first name only', async () => {
  const { withStudioPhotos } = await import('../lib/studio-photos.mjs');
  const docs = [
    { name: 'Dr. Afshana Sidhik', location: 'Kochi' }, { name: 'Dr. Reema Poyil Kunhammed', location: 'Kochi' },
    { name: 'Dr. Akhil Ramesh', location: 'Cherthala' },
  ];
  const out = withStudioPhotos(docs).map((d) => d.imageUrl);
  assert.equal(out[0], '/doctors/studio/kochi/dr-afshana.webp');
  assert.equal(out[1], '/doctors/studio/kochi/dr-reema-poyil.webp');
  assert.equal(out[2], undefined); // a Kochi photo is not given to a Cherthala doctor
});

test('Mr Prasanth M. K. is the Chief Information Officer, with his profile, and never matched to a doctor', async () => {
  const { MANAGEMENT_TEAM, doctorOfMember, teamProfiles } = await import('../lib/management-team.mjs');
  const p = MANAGEMENT_TEAM.find((m) => m.slug === 'prasanth');
  assert.equal(p.name, 'Prasanth M. K.');
  assert.equal(p.role, 'Chief Information Officer');
  assert.equal(doctorOfMember(p, [{ name: 'Dr. Prasanth K' }, { name: 'Dr. Prasanth' }]), null);
  assert.match(teamProfiles([]).prasanth.text, /^Mr\. Prasanth M\. K\. is an accomplished/);
  assert.match(teamProfiles([]).prasanth.text, /CIO Association, Kerala Chapter\.$/);
});

test('Mr Prasanth M. K.\'s management card shows his studio portrait', async () => {
  const { MANAGEMENT_TEAM } = await import('../lib/management-team.mjs');
  assert.equal(MANAGEMENT_TEAM.find((m) => m.slug === 'prasanth').photo, '/leadership/team/prasanth-m-k.webp');
  assert.equal(MANAGEMENT_TEAM.find((m) => m.slug === 'sojo').photo, '/leadership/team/sojo.webp');
});

test('Jithin Raj VR, Head – Media & Branding, with his profile', async () => {
  const { MANAGEMENT_TEAM, teamProfiles } = await import('../lib/management-team.mjs');
  const j = MANAGEMENT_TEAM.find((m) => m.slug === 'jithin-raj');
  assert.equal(j.name, 'Jithin Raj VR');
  assert.equal(j.role, 'Head – Media & Branding');
  assert.equal(j.photo, '/leadership/team/jithin-raj.webp');
  assert.match(teamProfiles([])['jithin-raj'].text, /^Great brands are built on trust/);
  assert.match(teamProfiles([])['jithin-raj'].text, /Manappuram Healthcare Pvt\. Ltd\./);
});

test('the portraits sent on 27 Nov 2026 find their doctors', async () => {
  const { withStudioPhotos } = await import('../lib/studio-photos.mjs');
  const docs = [
    { name: 'Dr. Sethulakshmi S', location: 'Aranmula' }, { name: 'Dr. Chris Placid', location: 'Kochi' },
    { name: 'Dr. Charlie Cherian', location: 'Kollam' }, { name: 'Dr. Simi Thomas K', location: 'Cherthala' },
  ];
  const out = withStudioPhotos(docs).map((d) => d.imageUrl);
  assert.deepEqual(out, [
    '/doctors/studio/aranmula/sethulakshmi-s.webp', '/doctors/studio/group/chris-placid.webp',
    '/doctors/studio/group/charlie-cherian.webp', '/doctors/studio/group/simi-thomas.webp',
  ]);
  // two doctors who fit one portrait equally get neither
  const twins = withStudioPhotos([{ name: 'Dr. Simi Thomas', location: 'Kochi' }, { name: 'Dr Simi Thomas', location: 'Kollam' }]);
  assert.deepEqual(twins.map((d) => d.imageUrl), [undefined, undefined]);
});

test('the profiles sent on 27 Nov 2026 fill in their doctors', async () => {
  const { withSuppliedProfiles } = await import('../lib/doctor-profiles.mjs');
  const [chris, simi, sethu, written, other] = withSuppliedProfiles([
    { name: 'Dr Chris Placid', bio: '' }, { name: 'Dr. Simi Thomas K', bio: 'MBBS, MS' },
    { name: 'Dr. Sethulakshmi S', designation: 'MBBS, DNB' },
    { name: 'Dr. Ananthen K S', fullBio: 'A profile written in the admin.' }, { name: 'Dr. Simi Joseph' },
  ]);
  assert.equal(chris.bio, 'MBBS, MD (Pediatrics), Fellowship in Neonatology');
  assert.match(chris.fullBio, /^Dr\. Chris Placid is a Consultant Pediatrician[\s\S]*### Areas of special interest\n\n- Newborn[\s\S]*clinical research\.$/);
  assert.equal(simi.bio, 'MBBS, MS'); // degrees on the record stay
  assert.match(simi.fullBio, /^Dr\. Simi Thomas is a passionate[\s\S]*journeys of their lives\.$/);
  assert.equal(sethu.bio, 'MBBS, DNB, MNAMS, FCGSM · Fellowship in Laparoscopy & Cosmetic Gynaecology');
  assert.match(sethu.fullBio, /^Dr\. Sethulakshmi S is a dedicated Obstetrician[\s\S]*### Her philosophy of care[\s\S]*every stage of life\.$/);
  assert.doesNotMatch(sethu.fullBio, /Muthoot|Pathanamthitta/);
  assert.equal(written.fullBio, 'A profile written in the admin.');
  assert.equal(other.fullBio, undefined);
});

test('Dr Chris Placid, Dr Simi Thomas and Dr Charlie Cherian are listed at Aranmula', async () => {
  const { withAranmulaDoctors } = await import('../lib/aranmula-doctors.mjs');
  const atAranmula = (list) => list.filter((d) => /\bAranmula\b/.test(d.location)).map((d) => d.name);
  // not on the site yet: added at Aranmula (Dr Charlie Cherian only once listed)
  const added = withAranmulaDoctors([{ name: 'Dr. Ganga M P', location: 'Aranmula' }]);
  assert.deepEqual(atAranmula(added), ['Dr. Ganga M P', 'Dr. Chris Placid', 'Dr. Simi Thomas']);
  assert.equal(added[1].speciality, 'Paediatrics');
  assert.equal(added[2].speciality, 'Obstetrics & Gynaecology');
  // on the site at another hospital: Aranmula is added to their hospitals
  const moved = withAranmulaDoctors([
    { name: 'Dr Chris Placid', location: 'Kochi' }, { name: 'Dr. Charlie Cherian', location: 'Cherthala, Alappuzha' },
    { name: 'Dr. Simi Thomas K', location: 'Aranmula' },
  ]);
  assert.deepEqual(moved.map((d) => d.location), ['Kochi, Aranmula', 'Cherthala, Alappuzha, Aranmula', 'Aranmula']);
  assert.equal(moved.length, 3);
});

test('Dr Sethulakshmi S\'s updated degrees replace the ones first sent', async () => {
  const { withSuppliedProfiles } = await import('../lib/doctor-profiles.mjs');
  const old = 'MBBS, DNB, MNAMS · Diploma in Cosmetic Gynaecology · Fellowship in Laparoscopy & NDVH';
  const [a, b, c] = withSuppliedProfiles([
    { name: 'Dr. Sethulakshmi S', designation: old },
    { name: 'Dr. Sethulakshmi S', bio: old.replace(/ ·/g, ',') },
    { name: 'Dr. Sethulakshmi S', bio: 'MBBS, DNB (typed in the admin)' },
  ]);
  for (const d of [a, b]) assert.equal(d.bio, 'MBBS, DNB, MNAMS, FCGSM · Fellowship in Laparoscopy & Cosmetic Gynaecology');
  assert.equal(a.designation, '');
  assert.equal(c.bio, 'MBBS, DNB (typed in the admin)'); // anything else stays
});
