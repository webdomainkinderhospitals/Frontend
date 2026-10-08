import test from 'node:test';
import assert from 'node:assert/strict';
import { menuHighlights, featureMenuPages, pregnancyPhoto } from '../lib/kochi-features.mjs';

test('Celebrate Pregnancy menu lists Spandanam, Mom-to-be and Cake Mixing when their pages are published', () => {
  const pages = [
    { slug: 'celebrate-spandanam', published: true, location: 'Cherthala', body: 'long' },
    { slug: 'celebrate-mom-mix', published: true, location: 'Kochi' },
    { slug: 'celebrate-mom-to-be', published: true, location: 'Cherthala' },
  ];
  const menu = featureMenuPages(pages);
  assert.deepEqual(menu.map((p) => p.slug), ['celebrate-spandanam', 'celebrate-mom-mix', 'celebrate-mom-to-be']);
  assert.equal(menu[0].body, undefined);
  assert.deepEqual(menuHighlights(menu).map((h) => [h.label, h.href, h.photo]), [
    ['Spandanam', '/celebrate-pregnancy/spandanam', '/celebrate-pregnancy/spandanam.webp'],
    ['Mom-to-be', '/celebrate-pregnancy/mom-to-be', '/celebrate-pregnancy/mom-to-be.webp'],
    ['Cake Mixing', '/celebrate-pregnancy/mom-mix', '/celebrate-pregnancy/mom-mix/season-2-mixing-together.webp'],
  ]);
  assert.deepEqual(menuHighlights([{ slug: 'celebrate-mom-mix', published: false }]), []);
});

test('pregnancy photos: an admin photo wins, imported generic banners give way to the hospital photo', () => {
  assert.equal(pregnancyPhoto({ slug: 'celebrate-spandanam', imageUrl: 'https://cdn/x.webp' }), 'https://cdn/x.webp');
  assert.equal(pregnancyPhoto({ slug: 'kochi-tharattazhaku', imageUrl: 'https://www.kinderkochi.com/images/tharatt_left_banner.jpg' }), '/celebrate-pregnancy/tharattazhaku/season-5-winners-walk.webp');
  assert.equal(pregnancyPhoto({ slug: 'kochi-wow-mom', imageUrl: 'https://www.kinderkochi.com/images/appointment.jpg' }), '/kochi/tharattazhaku/mother-to-be.webp');
  assert.equal(pregnancyPhoto({ slug: 'kochi-water-birthing-suite', imageUrl: '' }), '/celebrate-pregnancy/water-birth.webp');
  assert.equal(pregnancyPhoto({ slug: 'kochi-premium-birthing-centre', imageUrl: 'https://www.kinderkochi.com/images/birth1.jpg' }), 'https://www.kinderkochi.com/images/birth1.jpg');
});

test('Cake Mixing uses the Season 2 photo over the one first seeded, but an admin photo still wins', () => {
  assert.equal(pregnancyPhoto({ slug: 'celebrate-mom-mix', imageUrl: 'https://site/celebrate-pregnancy/cake-mixing.webp' }), '/celebrate-pregnancy/mom-mix/season-2-mixing-together.webp');
  assert.equal(pregnancyPhoto({ slug: 'celebrate-mom-mix', imageUrl: 'https://cdn/new.webp' }), 'https://cdn/new.webp');
});
