import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leaderOf, groupLeaders, centreLeaders } from '../lib/leadership.mjs';

const pages = [
  { slug: 'leadership-mr-anto-twinkle', category: 'Leadership', title: 'Mr. Anto Twinkle', excerpt: 'Mr.', location: 'Kochi', sortOrder: 1,
    body: 'Mr. Anto Twinkle\n\nMr. Anto Twinkle is a distinguished professional in the field of hospital management, with over 12 years of comprehensive experience.' },
  { slug: 'leadership-mr-basanta-kumar-dash', category: 'Leadership', title: 'Mr. Basanta Kumar Dash', excerpt: 'Mr.', location: '', sortOrder: 3,
    body: 'MR. BASANTA KUMAR DASH\n\nGroup Financial Controller – Kinder Hospitals\n\nMr. Basanta Kumar Dash has more than 12 years of handsome experience in the Healthcare Industry.' },
  { slug: 'leadership-dr-v-k-pradeep-kumar', category: 'Leadership', title: 'Dr. V K Pradeep Kumar', location: '', sortOrder: 1,
    excerpt: 'Dr Vethody Kumaran Pradeep Kumar has over 37 glorious years of Paediatric and Neonatology practice in countries like India, Ireland and Singapore.',
    body: 'Dr V K Pradeep Kumar\n\nChairman – Kindorama Healthcare Pvt Ltd, India\n\nDr Vethody Kumaran…' },
  { slug: 'leadership-mr-renjith-krishnan', category: 'Leadership', title: 'Mr. Renjith Krishnan', excerpt: 'Mr.', location: '', sortOrder: 2,
    body: 'Mr. Renjith Krishnan\n\nCEO – KINDER HOSPITALS GROUP\n\nMr. Renjith Krishnan has over 15 years of experience in Hospital Management and healthcare business operations.' },
  { slug: 'about-us-mission-vision-values', category: 'About Us', title: 'Mission', location: '' },
];

test('a profile gives its name, designation, summary and initials', () => {
  const r = leaderOf(pages[3]);
  assert.equal(r.role, 'CEO – Kinder Hospitals Group');
  assert.match(r.summary, /^Mr\. Renjith Krishnan has over 15 years/);
  assert.equal(r.initials, 'RK');
  assert.equal(leaderOf(pages[1]).role, 'Group Financial Controller – Kinder Hospitals');
  assert.equal(leaderOf(pages[1]).initials, 'BD');
  assert.equal(leaderOf(pages[2]).initials, 'PK');
  assert.equal(leaderOf(pages[0]).role, 'Chief Operating Officer, Kinder Hospitals Kochi'); // confirmed by the hospital
  assert.match(leaderOf(pages[0]).summary, /distinguished professional/);
});

test('group leaders by display order; a centre keeps its own', () => {
  assert.deepEqual(groupLeaders(pages).map((l) => l.slug),
    ['leadership-dr-v-k-pradeep-kumar', 'leadership-mr-renjith-krishnan', 'leadership-mr-basanta-kumar-dash']);
  assert.deepEqual(centreLeaders(pages, 'Kochi').map((l) => l.slug), ['leadership-mr-anto-twinkle']);
  assert.deepEqual(centreLeaders(pages, 'Cochin').map((l) => l.slug), ['leadership-mr-anto-twinkle']);
  assert.deepEqual(centreLeaders(pages, 'Kollam'), []);
});

test('a summary never stops at "Mr."', () => {
  const r = leaderOf({ title: 'Mr. A B', body: 'Mr. A B\n\nCEO – X\n\nMr. A B has over 15 years of experience in hospital management and healthcare business operations. As the CEO of Kinder Hospitals Group, Mr. A B aims at maintaining a growing and profitable business according to standards.' });
  assert.match(r.summary, /operations\.$/);
});

test('the order and Anto Twinkle\'s centre hold even before the stored data is updated', () => {
  const stale = pages.map((p) => ({ ...p, location: '', sortOrder: { 'leadership-mr-anto-twinkle': 1, 'leadership-mr-basanta-kumar-dash': 2, 'leadership-dr-v-k-pradeep-kumar': 3, 'leadership-mr-renjith-krishnan': 4 }[p.slug] ?? 9 }));
  assert.deepEqual(groupLeaders(stale).map((l) => l.slug),
    ['leadership-dr-v-k-pradeep-kumar', 'leadership-mr-renjith-krishnan', 'leadership-mr-basanta-kumar-dash']);
  assert.deepEqual(centreLeaders(stale, 'Kochi').map((l) => l.slug), ['leadership-mr-anto-twinkle']);
});

test('Mr Anto Twinkle has his portrait on his card and his profile page', async () => {
  const { centreLeaders, leaderPortrait } = await import('../lib/leadership.mjs');
  const page = { slug: 'leadership-mr-anto-twinkle', category: 'Leadership', title: 'Mr. Anto Twinkle', body: 'Mr. Anto Twinkle\n\nHospital management.', published: true };
  assert.equal(centreLeaders([page], 'Kochi')[0].photo, '/leadership/anto-twinkle-head.webp');
  assert.equal(leaderPortrait(page), '/leadership/anto-twinkle.webp');
  assert.equal(leaderPortrait({ slug: 'privacy', category: 'Policies' }), '');
});

test('the management team in the hospital\'s order, each with a portrait', async () => {
  const fs = await import('node:fs');
  const { MANAGEMENT_TEAM } = await import('../lib/management-team.mjs');
  // shown in the leadership, in the hospital's order (20 Nov 2026)
  assert.deepEqual(MANAGEMENT_TEAM.filter((m) => !m.hidden).map((m) => m.name), ['Dr V. K. Pradeep Kumar', 'Renjith Krishnan', 'Basanta Kumar Dash', 'Sivadas T', 'Prasanth M. K.', 'Jithin Raj VR']);
  // kept for their portraits, not shown
  assert.deepEqual(MANAGEMENT_TEAM.filter((m) => m.hidden).map((m) => m.name), ['Sreejith S', 'Anto Twinkle', 'Sojo', 'Abeesh']);
  for (const m of MANAGEMENT_TEAM) assert.ok(fs.existsSync(`public${m.photo}`), m.photo);
  const { centreLeaders } = await import('../lib/leadership.mjs');
  const anto = { slug: 'leadership-mr-anto-twinkle', category: 'Leadership', title: 'Mr. Anto Twinkle', body: 'Mr. Anto Twinkle\n\nUnit Head\n\nHospital management.', published: true };
  assert.equal(centreLeaders([anto], 'Kochi')[0].role, 'Chief Operating Officer, Kinder Hospitals Kochi');
});

test('a team member who is also one of our doctors gets the new portrait and a profile link', async () => {
  const { withTeamPhotos, doctorOfMember, MANAGEMENT_TEAM } = await import('../lib/management-team.mjs');
  const doctors = [
    { name: 'Dr. V K Pradeep Kumar', location: 'Cherthala', imageUrl: 'https://cdn/old.jpg' },
    { name: 'Dr. Sojo Mathew', location: 'Kochi', imageUrl: '' },
    { name: 'Dr. Prasanth K', location: 'Kochi' }, { name: 'Dr. Prasanth R', location: 'Kollam' },
    { name: 'Dr. Anitha Joseph', location: 'Cherthala', imageUrl: 'https://cdn/a.jpg' },
  ];
  const out = withTeamPhotos(doctors);
  assert.equal(out[0].imageUrl, '/leadership/team/dr-v-k-pradeep-kumar.webp');
  assert.equal(out[1].imageUrl, '/leadership/team/sojo.webp');
  // two doctors called Prasanth: no guess
  assert.equal(out[2].imageUrl, undefined);
  assert.equal(out[4].imageUrl, 'https://cdn/a.jpg');
  assert.equal(doctorOfMember(MANAGEMENT_TEAM.find((m) => m.slug === 'abeesh'), doctors), null);
});

test('the doctor slider opens with the team in the hospital\'s order', async () => {
  const { teamAsDoctors } = await import('../lib/management-team.mjs');
  const doctors = [{ name: 'Dr. V K Pradeep Kumar', speciality: 'Neonatology', location: 'Kochi', imageUrl: 'https://cdn/old.jpg' }, { name: 'Dr. Mili Mohandas', location: 'Cherthala' }];
  const team = teamAsDoctors(doctors);
  assert.deepEqual(team.map((t) => t.name), ['Dr. V K Pradeep Kumar', 'Renjith Krishnan', 'Basanta Kumar Dash', 'Sivadas T', 'Prasanth M. K.', 'Jithin Raj VR', 'Sreejith S', 'Anto Twinkle', 'Sojo', 'Abeesh']);
  assert.equal(team[0].teamOf, doctors[0]);
  assert.equal(team[0].imageUrl, '/leadership/team/dr-v-k-pradeep-kumar.webp');
  assert.equal(team[1].bookable, false);
  assert.equal(team[1].profileHref, '/about#leadership-mr-renjith-krishnan');
  assert.equal(team[7].location, 'Kochi');
  assert.equal(team[6].profileHref, '/about#leadership');
});

test('Mr Basanta Kumar Dash shows the portrait the hospital sent, over the page photo', async () => {
  const { leaderOf, leaderPortrait, portraitReplacesPhoto } = await import('../lib/leadership.mjs');
  const page = { slug: 'leadership-mr-basanta-kumar-dash', title: 'Mr. Basanta Kumar Dash', category: 'Leadership', imageUrl: 'https://cdn/old.jpg', body: 'Mr. Basanta Kumar Dash\n\nA long enough biography paragraph for the summary to be taken from it.' };
  assert.equal(leaderOf(page).photo, '/leadership/basanta-kumar-dash-head.webp');
  assert.equal(leaderPortrait(page), '/leadership/basanta-kumar-dash.webp');
  assert.equal(portraitReplacesPhoto(page), true);
  assert.equal(portraitReplacesPhoto({ ...page, slug: 'leadership-mr-anto-twinkle' }), false);
});

test('the Chairman\'s studio portrait replaces a photo already set on his page', async () => {
  const { groupLeaders: leaders, leaderPortrait, portraitReplacesPhoto } = await import('../lib/leadership.mjs');
  const page = { slug: 'leadership-dr-v-k-pradeep-kumar', category: 'Leadership', title: 'Dr. V K Pradeep Kumar', imageUrl: 'https://res.cloudinary.com/x/old.jpg', body: 'Dr. V K Pradeep Kumar\n\nChairman\n\nA long biography of the chairman that runs past sixty characters.' };
  assert.equal(leaders([page])[0].photo, '/leadership/dr-v-k-pradeep-kumar-head.webp');
  assert.equal(leaderPortrait(page), '/leadership/dr-v-k-pradeep-kumar.webp');
  assert.ok(portraitReplacesPhoto(page));
});

test('Sivadas T has his written profile on About Us', async () => {
  const { MANAGEMENT_TEAM, teamProfiles } = await import('../lib/management-team.mjs');
  const sivadas = MANAGEMENT_TEAM.find((m) => m.slug === 'sivadas');
  assert.equal(sivadas.role, 'Group General Manager – Human Resources');
  assert.equal(sivadas.notDoctor, true);
  assert.match(teamProfiles([]).sivadas.text, /19 years of end-to-end leadership[\s\S]*inspired to succeed\.$/);
});

test('every hospital is led by the Chairman and the CEO, then its own head', async () => {
  const { hospitalLeaders } = await import('../lib/leadership.mjs');
  const names = (centre, pages = []) => hospitalLeaders(pages, centre).map((l) => l.name);
  assert.deepEqual(names('Kollam'), ['Dr V. K. Pradeep Kumar', 'Renjith Krishnan', 'Abeesh']);
  assert.deepEqual(names('Aranmula'), ['Dr V. K. Pradeep Kumar', 'Renjith Krishnan', 'Rajesh Kumar B', 'Sojo P. Devaraj']);
  assert.deepEqual(names('Cherthala'), ['Dr V. K. Pradeep Kumar', 'Renjith Krishnan', 'Rajesh Kumar B']);
  assert.deepEqual(names('Cochin'), ['Dr V. K. Pradeep Kumar', 'Renjith Krishnan', 'Anto Twinkle']);
  assert.deepEqual(names('Alappuzha'), ['Dr V. K. Pradeep Kumar', 'Renjith Krishnan', 'Rajesh Kumar B']);
  const [chair, , kollam] = hospitalLeaders([], 'Kollam');
  assert.equal(chair.href, '/about#leadership-dr-v-k-pradeep-kumar');
  assert.equal(chair.photo, '/leadership/dr-v-k-pradeep-kumar-head.webp');
  assert.equal(kollam.role, 'Kinder Hospitals Kollam');
  assert.equal(kollam.href, null);
  // Rajesh Kumar B's profile page (supplied by the site) gives a linked card
  const { withSuppliedLeaders } = await import('../lib/supplied-leaders.mjs');
  const aranmula = hospitalLeaders(withSuppliedLeaders([]), 'Aranmula');
  assert.deepEqual(aranmula.map((l) => l.name), ['Dr V. K. Pradeep Kumar', 'Renjith Krishnan', 'Rajesh Kumar B', 'Sojo P. Devaraj']);
  const rajesh = aranmula[2];
  assert.equal(rajesh.href, undefined);
  assert.equal(rajesh.photo, '/leadership/rajesh-kumar-b-head.webp');
  assert.match(rajesh.role, /^Chief Operating Officer – Cluster Head/);
  assert.match(rajesh.summary, /^Rajesh Kumar B brings 23 years/);
  // Sojo P. Devaraj's profile page (supplied by the site) likewise
  const sojo = aranmula[3];
  assert.equal(sojo.href, undefined);
  assert.equal(sojo.role, 'Manager – Operations, Kinder Hospitals Aranmula');
  assert.equal(sojo.photo, '/leadership/team/sojo.webp');
  assert.match(sojo.summary, /^Sojo P\. Devaraj serves as Manager – Operations/);
  assert.equal(hospitalLeaders(withSuppliedLeaders([]), 'Kollam').length, 3);
  // with his Leadership page, Anto's card is the page's (one card, linked)
  const anto = { slug: 'leadership-mr-anto-twinkle', category: 'Leadership', title: 'Mr. Anto Twinkle', location: 'Kochi', body: 'Mr. Anto Twinkle\n\nA long biography that runs well past sixty characters in all.' };
  const kochi = hospitalLeaders([anto], 'Kochi');
  assert.equal(kochi.length, 3);
  assert.equal(kochi[2].href, undefined);
  assert.equal(kochi[2].role, 'Chief Operating Officer, Kinder Hospitals Kochi');
});
