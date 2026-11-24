import { test } from 'node:test';
import assert from 'node:assert/strict';
import { withCurrentLogos, THARATTAZHAKU_LOGO } from '../lib/event-logos.mjs';

test("Tharattazhaku's Season 3 logo is replaced by the current logo", () => {
  const [page, other] = withCurrentLogos([
    {
      slug: 'kochi-tharattazhaku',
      body: '![Kinder Tharattazhaku Season 3](https://www.kinderkochi.com/images/Tharattazhak_S3_final.png)\n\nIndia is the second most populous country.',
      galleryUrls: 'https://www.kinderkochi.com/images/Tharattazhak_S3_final.png\nhttps://www.kinderkochi.com/images/tha_group.png',
      imageUrl: 'https://www.kinderkochi.com/images/tharatt_left_banner.jpg',
    },
    { slug: 'other', body: 'Nothing here.' },
  ]);
  assert.equal(page.body, `![Kinder Tharattazhaku Season 3](${THARATTAZHAKU_LOGO})\n\nIndia is the second most populous country.`);
  assert.equal(page.galleryUrls.split('\n')[0], THARATTAZHAKU_LOGO);
  assert.equal(page.galleryUrls.split('\n')[1], 'https://www.kinderkochi.com/images/tha_group.png');
  assert.equal(page.imageUrl, 'https://www.kinderkochi.com/images/tharatt_left_banner.jpg');
  assert.equal(other.body, 'Nothing here.');
});
