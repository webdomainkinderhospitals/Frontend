import test from 'node:test';
import assert from 'node:assert/strict';
import { withEventBanners } from '../lib/home-promos.mjs';

const admin = [{ image: 'https://cdn/ivf.webp', link: '', alt: 'IVF' }];

test('the Mom Mix banner leads the slider until the event day ends', () => {
  const slides = withEventBanners(admin, new Date('2026-10-17T10:00:00+05:30'));
  assert.equal(slides.length, 2);
  assert.equal(slides[0].image, '/banners/mom-mix-season-4-v2.webp');
  assert.equal(slides[0].link, '/celebrate-pregnancy/mom-mix');
  assert.equal(slides[1], admin[0]);
  assert.equal(withEventBanners(admin, new Date('2026-10-25T23:00:00+05:30')).length, 2);
});

test('the banner leaves on its own after the event', () => {
  assert.deepEqual(withEventBanners(admin, new Date('2026-10-26T00:00:01+05:30')), admin);
});

test('no duplicate when the admin has added the same banner', () => {
  const both = [{ image: '/banners/mom-mix-season-4-v2.webp', link: '', alt: '' }, ...admin];
  assert.deepEqual(withEventBanners(both, new Date('2026-10-17T10:00:00+05:30')), both);
});
