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
  const sijo = { name: 'Dr. Sijo Thomas', location: 'Kochi', imageUrl: 'https://cdn/sijo.jpg', photoSetAt: '2026-11-18T08:00:00Z' };
  assert.equal(withTeamPhotos([sijo])[0].imageUrl, 'https://cdn/sijo.jpg');
  assert.equal(teamAsDoctors([sijo]).find((d) => d.teamOf).imageUrl, 'https://cdn/sijo.jpg');
  assert.match(withTeamPhotos([{ ...sijo, photoSetAt: null }])[0].imageUrl, /team\/sijo/);
});
