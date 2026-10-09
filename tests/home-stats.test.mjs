import { test } from 'node:test';
import assert from 'node:assert/strict';
import { homeStats } from '../lib/home-stats.mjs';

test('the saved 13,000+ becomes 30K+ and 32K+ surgeries is added after births', () => {
  const saved = [
    { label: 'Women Treated', value: '6L+' }, { label: 'Births Delivered', value: '13,000+' },
    { label: 'IVF Successes', value: '1,500+' }, { label: 'Senior Consultants', value: '60+' },
  ];
  assert.deepEqual(homeStats(saved).map((s) => `${s.value} ${s.label}`),
    ['6L+ Women Treated', '30K+ Births Delivered', '32K+ Surgeries Performed', '1,500+ IVF Successes', '60+ Senior Consultants']);
});

test('a newer figure or an existing surgeries number set in the admin is kept', () => {
  const later = [{ label: 'Births Delivered', value: '35K+' }, { label: 'Surgeries', value: '40K+' }];
  assert.deepEqual(homeStats(later), later);
});
