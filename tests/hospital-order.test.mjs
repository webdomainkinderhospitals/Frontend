import { test } from 'node:test';
import assert from 'node:assert/strict';
import { orderAt, byHospitalOrder } from '../lib/hospital-order.mjs';

test('doctors with a serial number at a hospital come first there, in number order', () => {
  const a = { name: 'A' }, b = { name: 'B', hospitalOrder: '{"Kochi":2,"Cherthala":1}' };
  const c = { name: 'C', hospitalOrder: '{"Kochi":1}' }, d = { name: 'D' };
  assert.deepEqual(byHospitalOrder([a, b, c, d], 'Kochi').map((x) => x.name), ['C', 'B', 'A', 'D']);
  assert.deepEqual(byHospitalOrder([a, b, c, d], 'cochin').map((x) => x.name), ['C', 'B', 'A', 'D']);
  assert.deepEqual(byHospitalOrder([a, c, b, d], 'Cherthala').map((x) => x.name), ['B', 'A', 'C', 'D']);
  assert.deepEqual(byHospitalOrder([a, d], 'Kochi'), [a, d]);
  assert.equal(orderAt({ hospitalOrder: 'oops' }, 'Kochi'), null);
});
