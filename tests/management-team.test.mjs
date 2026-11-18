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
