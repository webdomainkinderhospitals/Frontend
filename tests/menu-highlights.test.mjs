import test from 'node:test';
import assert from 'node:assert/strict';
import { menuHighlights, featureMenuPages } from '../lib/kochi-features.mjs';

test('Celebrate Pregnancy menu lists Spandanam and Cake Mixing when their pages are published', () => {
  const pages = [
    { slug: 'celebrate-spandanam', published: true, location: 'Cherthala', body: 'long' },
    { slug: 'celebrate-mom-mix', published: true, location: 'Kochi' },
    { slug: 'celebrate-mom-to-be', published: true, location: 'Cherthala' },
  ];
  const menu = featureMenuPages(pages);
  assert.deepEqual(menu.map((p) => p.slug), ['celebrate-spandanam', 'celebrate-mom-mix']);
  assert.equal(menu[0].body, undefined);
  assert.deepEqual(menuHighlights(menu).map((h) => [h.label, h.href]), [
    ['Spandanam', '/celebrate-pregnancy/spandanam'],
    ['Cake Mixing', '/celebrate-pregnancy/mom-mix'],
  ]);
  assert.deepEqual(menuHighlights([{ slug: 'celebrate-mom-mix', published: false }]), []);
});
