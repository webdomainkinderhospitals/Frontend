import { test } from 'node:test';
import assert from 'node:assert/strict';
import { youtubeId, thumbOf, galleryItems, homeGallery, embedOf, placeOf } from '../lib/gallery.mjs';

const film = { id: 1, kind: 'video', title: 'Water Birthing', mediaUrl: '/f.mp4', posterUrl: '/f.webp', featured: true, showOnHome: true, published: true, location: 'Kochi' };
const photo = { id: 2, kind: 'image', title: 'Spandanam', mediaUrl: '/s.webp', showOnHome: true, published: true };
const yt = { id: 3, kind: 'youtube', title: 'Tour', mediaUrl: 'https://youtu.be/dQw4w9WgXcQ', showOnHome: true, published: true };

test('YouTube links in their usual forms', () => {
  for (const url of ['https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://youtu.be/dQw4w9WgXcQ', 'https://www.youtube.com/shorts/dQw4w9WgXcQ', 'https://www.youtube.com/watch?feature=share&v=dQw4w9WgXcQ']) {
    assert.equal(youtubeId(url), 'dQw4w9WgXcQ', url);
  }
  assert.equal(youtubeId('https://example.com/video'), '');
  assert.match(embedOf(yt), /^https:\/\/www\.youtube-nocookie\.com\/embed\/dQw4w9WgXcQ\?/);
});

test('each item has a picture to stand for it', () => {
  assert.equal(thumbOf(photo), '/s.webp');
  assert.equal(thumbOf(film), '/f.webp');
  assert.equal(thumbOf(yt), 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg');
  assert.equal(thumbOf({ kind: 'video', mediaUrl: '/x.mp4' }), '');
});

test('hidden, empty and broken items are left out; the admin order is kept', () => {
  const list = galleryItems([
    { ...photo, sortOrder: 2 }, { ...film, sortOrder: 1 }, { id: 9, kind: 'image', mediaUrl: '', published: true },
    { id: 8, kind: 'youtube', mediaUrl: 'https://example.com', published: true }, { ...yt, published: false },
  ]);
  assert.deepEqual(list.map((g) => g.id), [1, 2]);
});

test('the home page plays the featured video large, with the others beside it', () => {
  const { featured, others } = homeGallery([photo, yt, film]);
  assert.equal(featured.id, 1);
  assert.deepEqual(others.map((g) => g.id).sort(), [2, 3]);
  assert.equal(homeGallery([photo, yt]).featured.id, 3, 'without a featured video, the first video');
  assert.equal(homeGallery([photo]).featured, null);
  assert.equal(homeGallery([{ ...photo, showOnHome: false }]).others.length, 0);
  assert.equal(placeOf(film), 'Kinder Kochi');
  assert.equal(placeOf(photo), 'Kinder Hospitals');
});
