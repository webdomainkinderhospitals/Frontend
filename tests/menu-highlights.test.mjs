import test from 'node:test';
import assert from 'node:assert/strict';
import { menuHighlights, featureMenuPages, pregnancyPhoto } from '../lib/kochi-features.mjs';

test('Celebrate Pregnancy menu lists Spandanam and Mom-to-be; Cake Mixing is in News & Events', () => {
  const pages = [
    { slug: 'celebrate-spandanam', published: true, location: 'Cherthala', body: 'long' },
    { slug: 'celebrate-mom-mix', published: true, location: 'Kochi' },
    { slug: 'celebrate-mom-to-be', published: true, location: 'Cherthala' },
  ];
  const menu = featureMenuPages(pages);
  assert.deepEqual(menu.map((p) => p.slug), ['celebrate-spandanam', 'celebrate-mom-to-be']);
  assert.equal(menu[0].body, undefined);
  assert.deepEqual(menuHighlights(menu).map((h) => [h.label, h.href, h.photo]), [
    ['Spandanam', '/celebrate-pregnancy/spandanam', '/celebrate-pregnancy/spandanam.webp'],
    ['Mom-to-be', '/celebrate-pregnancy/mom-to-be', '/celebrate-pregnancy/mom-to-be.webp'],
  ]);
});

test('pregnancy photos: an admin photo wins, imported generic banners give way to the hospital photo', () => {
  assert.equal(pregnancyPhoto({ slug: 'celebrate-spandanam', imageUrl: 'https://cdn/x.webp' }), 'https://cdn/x.webp');
  assert.equal(pregnancyPhoto({ slug: 'kochi-tharattazhaku', imageUrl: 'https://www.kinderkochi.com/images/tharatt_left_banner.jpg' }), '/celebrate-pregnancy/tharattazhaku/season-5-winners-walk.webp');
  assert.equal(pregnancyPhoto({ slug: 'kochi-wow-mom', imageUrl: 'https://www.kinderkochi.com/images/appointment.jpg' }), '/kochi/tharattazhaku/mother-to-be.webp');
  assert.equal(pregnancyPhoto({ slug: 'kochi-water-birthing-suite', imageUrl: '' }), '/celebrate-pregnancy/water-birth.webp');
  assert.equal(pregnancyPhoto({ slug: 'kochi-premium-birthing-centre', imageUrl: 'https://www.kinderkochi.com/images/birth1.jpg' }), 'https://www.kinderkochi.com/images/birth1.jpg');
});

test('Cake Mixing is no longer a Celebrate Pregnancy experience anywhere', async () => {
  const { pregnancyHighlights } = await import('../lib/pregnancy-highlights.mjs');
  const { MOVED_TO_NEWS, isCakeMixing, CAKE_MIXING_HREF } = await import('../lib/news.mjs');
  const pages = [{ slug: 'celebrate-mom-mix', published: true, location: 'Kochi' }, { slug: 'celebrate-spandanam', published: true, location: 'Cherthala' }];
  assert.deepEqual(pregnancyHighlights(pages).map((h) => h.slug), ['celebrate-spandanam']);
  assert.ok(MOVED_TO_NEWS.has('celebrate-mom-mix'));
  assert.equal(CAKE_MIXING_HREF, '/news?topic=cake-mixing');
  assert.ok(isCakeMixing({ slug: 'mom-mix-season-3' }) && isCakeMixing({ title: 'The world\'s largest pregnant women\'s cake-mixing ceremony' }));
  assert.ok(!isCakeMixing({ slug: 'tharattazhaku-season-2', title: 'Tharattazhaku Season 2' }));
});
