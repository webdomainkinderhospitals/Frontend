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

test('Mr Prasanth M. K.\'s management card shows the portrait from his profile', async () => {
  const { MANAGEMENT_TEAM } = await import('../lib/management-team.mjs');
  assert.equal(MANAGEMENT_TEAM.find((m) => m.slug === 'prasanth').photo, '/leadership/team/prasanth-coat.webp');
  assert.equal(MANAGEMENT_TEAM.find((m) => m.slug === 'sojo').photo, '/leadership/team/sojo.webp');
});
