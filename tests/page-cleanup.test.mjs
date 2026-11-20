import { test } from 'node:test';
import assert from 'node:assert/strict';
import { withoutStubExcerpts } from '../lib/page-cleanup.mjs';

test('a summary that is only a title ("Mr.") is left out', () => {
  const out = withoutStubExcerpts([{ slug: 'a', excerpt: 'Mr.' }, { slug: 'b', excerpt: ' Dr ' }, { slug: 'c', excerpt: 'Mr. Anto Twinkle leads Kochi.' }, { slug: 'd' }]);
  assert.deepEqual(out.map((p) => p.excerpt), ['', '', 'Mr. Anto Twinkle leads Kochi.', undefined]);
});
