import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseContacts, sendEnquiry } from '../lib/enquiries.mjs';

test('the header contact list reads "Name | Phone | Email" lines', () => {
  const list = parseContacts('Kinder Hospital Cherthala & Alappuzha | +91 94466 54500 | marketing@kinderhospital.in\\nKinder Hospitals Kollam | +91 79944 45542 | contactus@kinderkollam.com\nBroken line\n | 123 |');
  assert.equal(list.length, 2);
  assert.equal(list[0].tel, 'tel:+919446654500');
  assert.equal(list[0].short, 'Cherthala & Alappuzha');
  assert.equal(list[1].short, 'Kollam');
  assert.equal(list[1].email, 'contactus@kinderkollam.com');
});

test('a request is posted to the admin API and errors come back readable', async () => {
  let sent;
  const ok = await sendEnquiry({ type: 'appointment', name: 'A' }, {
    api: 'https://api.example', fetchImpl: async (url, init) => { sent = { url, body: JSON.parse(init.body) }; return { ok: true, json: async () => ({ id: 7 }) }; },
  });
  assert.deepEqual(ok, { ok: true, id: 7 });
  assert.equal(sent.url, 'https://api.example/api/enquiries');
  assert.equal(sent.body.type, 'appointment');

  const bad = await sendEnquiry({}, { api: 'https://api.example', fetchImpl: async () => ({ ok: false, json: async () => ({ error: 'Please enter your name.' }) }) });
  assert.deepEqual(bad, { ok: false, error: 'Please enter your name.' });
  const down = await sendEnquiry({}, { api: 'https://api.example', fetchImpl: async () => { throw new Error('offline'); } });
  assert.equal(down.ok, false);
  assert.match(down.error, /could not reach/);
  assert.equal((await sendEnquiry({}, { api: '' })).ok, false);
});
