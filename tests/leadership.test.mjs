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
  assert.equal(leaderOf(pages[0]).role, '');
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
