import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maternityHome } from '../lib/maternity-home.mjs';
import { maternityKey } from '../lib/maternity-settings.mjs';
const pages = ['kochi-tharattazhaku', 'kochi-wow-mom', 'kochi-water-birthing-suite', 'kochi-premium-birthing-centre'].map((slug, id) => ({ id, slug, location: 'Kochi', published: true, title: `Editor title ${id}`, excerpt: `Editor summary ${id}`, imageUrl: `/photo-${id}.jpg` }));
test('pregnancy and premium sections contain separate published programmes', () => {
  // Water Birth sits with the Premium Birthing Centre, which leads.
  assert.deepEqual(maternityHome(pages).links.map((l) => l.slug), ['kochi-tharattazhaku', 'kochi-wow-mom']);
  const premium = maternityHome(pages, {}, 'birthing');
  assert.deepEqual(premium.links.map((l) => l.slug), ['kochi-premium-birthing-centre', 'kochi-water-birthing-suite']);
  assert.equal(premium.links[1].href, '/premium-birthing-centre/water-birth');
  assert.equal(premium.description, 'Editor summary 3');
  assert.equal(premium.href, '/premium-birthing-centre');
  assert.equal(maternityHome(pages, {}, 'birthing', 'kochi').href, '/hospitals/kochi/care/kochi-premium-birthing-centre');
  assert.equal(maternityHome(pages).href, '/celebrate-pregnancy');
  assert(maternityHome(pages).links.every((l) => !l.href.startsWith('/hospitals/kochi')));
  assert(maternityHome(pages, {}, 'pregnancy', 'kochi').links.every((l) => l.href.startsWith('/hospitals/kochi')));
  assert.equal(maternityHome(pages).links[0].page.title, 'Editor title 0');
});
test('unpublished and other-centre pages never appear or supply imagery', () => {
  const hidden = pages.map((page) => ({ ...page, published: false }));
  assert.equal(maternityHome(hidden), null);
  assert.equal(maternityHome(hidden, {}, 'birthing'), null);
  assert.equal(maternityHome(pages.map((p) => ({ ...p, location: 'Kollam' }))), null);
  const remaining = maternityHome(pages.map((p, i) => ({ ...p, published: i !== 0 })));
  assert.equal(remaining.imageUrl, '/photo-1.jpg');
});
test('each section can be hidden independently on either homepage', () => {
  const settings = { [maternityKey('pregnancy', 'showOnGroup')]: false, [maternityKey('birthing', 'showOnKochi')]: false };
  assert.equal(maternityHome(pages, settings), null);
  assert(maternityHome(pages, settings, 'pregnancy', 'kochi'));
  assert(maternityHome(pages, settings, 'birthing'));
  assert.equal(maternityHome(pages, settings, 'birthing', 'kochi'), null);
});
test('admin values override defaults, preserve explicit empty buttons and use safe phone links', () => {
  const settings = Object.fromEntries(Object.entries({ title: 'Our new heading', description: 'Our new introduction', imageUrl: '/updated.jpg', buttonLabel: '', contactPhone: '+91 (730) 670-1372' }).map(([key, value]) => [maternityKey('birthing', key), value]));
  const section = maternityHome(pages, settings, 'birthing');
  assert.equal(section.title, 'Our new heading');
  assert.equal(section.description, 'Our new introduction');
  assert.equal(section.imageUrl, '/updated.jpg');
  assert.equal(section.buttonLabel, '');
  assert.equal(section.contactHref, 'tel:+917306701372');
});

test('source highlights respect publication, centre scope and existing editorial controls', () => {
  const additions = [
    { slug: 'celebrate-spandanam', location: 'Cherthala', published: true, title: 'Music', imageUrl: '/music.webp' },
    { slug: 'celebrate-water-birth', location: 'Kochi', published: true, title: 'Water Birth' },
    { slug: 'celebrate-mom-mix', location: 'Kochi', published: false },
  ];
  const group = maternityHome([...pages, ...additions]);
  assert(group.links.some((l) => l.short === 'spandanam'));
  assert(!group.links.some((l) => l.short === 'mom-mix'));
  assert.equal(group.links.filter((l) => /water/.test(l.short)).length, 1);
  assert(group.links.every((l) => l.href.startsWith('/celebrate-pregnancy/')));
  const kochi = maternityHome([...pages, ...additions], {}, 'pregnancy', 'kochi');
  assert(!kochi.links.some((l) => l.page.location === 'Cherthala'));
  assert(kochi.links.every((l) => l.href.startsWith('/hospitals/kochi/')));
  assert.equal(maternityHome(additions, { maternityPregnancyShowOnGroup: false }), null);
  assert.equal(maternityHome(additions, { maternityPregnancyTitle: 'Edited heading' }).title, 'Edited heading');
});
