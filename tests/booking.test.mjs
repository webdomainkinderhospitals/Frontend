import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bookingDates, normalisePhone, whatsappNumber, bookingMessage, whatsappLink, GROUP_WHATSAPP } from '../lib/booking.mjs';

test('twelve working days from tomorrow, never a Sunday', () => {
  const monday = new Date(2026, 8, 28);                    // Mon 28 Sep 2026
  const days = bookingDates(monday);
  assert.equal(days.length, 12);
  assert.equal(days[0].label, 'Tue 29 Sep', 'starts tomorrow, not today');
  assert.ok(days.every((d) => !d.label.startsWith('Sun')));
  assert.deepEqual(days.slice(4, 6).map((d) => d.label), ['Sat 03 Oct', 'Mon 05 Oct']);
  assert.equal(days[0].iso, '2026-09-29');
  assert.equal(days[0].long, 'Tuesday, 29 September 2026');
});

test('dates roll over month and year ends', () => {
  const days = bookingDates(new Date(2026, 11, 30), 3);    // Wed 30 Dec 2026
  assert.deepEqual(days.map((d) => d.iso), ['2026-12-31', '2027-01-01', '2027-01-02']);
});

test('Indian mobile numbers in every usual form', () => {
  for (const raw of ['9876543210', '+91 98765 43210', '09876543210', '91-98765-43210'])
    assert.equal(normalisePhone(raw), '+91 98765 43210', raw);
  for (const bad of ['', '12345', '1234567890', 'abc', '+91 12345 67890'])
    assert.equal(normalisePhone(bad), null, bad);
});

test('a number with its own country code keeps it', () => {
  // Kinder has a Singapore centre: +65 must not be read as an Indian number.
  assert.equal(normalisePhone('+65 9123 4567'), '+6591234567');
  assert.equal(normalisePhone('0065 9123 4567'), '+6591234567');
  assert.equal(normalisePhone('+971 50 123 4567'), '+971501234567');
  assert.equal(normalisePhone('+1 23'), null, 'too short to be a number');
});

test("requests go to the centre's own WhatsApp, else the group's", () => {
  assert.equal(whatsappNumber({ whatsapp: '97466 00600' }), '919746600600');
  assert.equal(whatsappNumber({ whatsapp: '+91 97466 00600' }), '919746600600');
  assert.equal(whatsappNumber({ whatsapp: '' }), GROUP_WHATSAPP);
  assert.equal(whatsappNumber({ whatsapp: '123' }), GROUP_WHATSAPP, 'a typo falls back, never breaks');
  assert.equal(whatsappNumber(null), GROUP_WHATSAPP);
});

test('the message carries every detail the coordinator needs', () => {
  const msg = bookingMessage({
    centreName: 'Kinder Hospital Kochi',
    doctor: { name: 'Dr. Reshmy R Pillai', speciality: 'Paediatrics' },
    date: { long: 'Tuesday, 29 September 2026' },
    time: 'Morning', patient: '  Anu Joseph ', phone: '+91 98765 43210', type: 'New patient', note: '',
  });
  assert.match(msg, /^Hello Kinder Hospital Kochi, I would like to book an appointment\./);
  for (const part of ['Doctor: Dr. Reshmy R Pillai — Paediatrics', 'Preferred date: Tuesday, 29 September 2026',
    'Preferred time: Morning', 'Patient name: Anu Joseph', 'Mobile: +91 98765 43210', 'Patient type: New patient'])
    assert.ok(msg.includes(part), part);
  assert.doesNotMatch(msg, /Note:/, 'an empty note leaves no empty line');
});

test('the link opens WhatsApp with the message intact', () => {
  const url = whatsappLink('919446654500', 'Hello & welcome\nLine 2');
  assert.equal(url, 'https://wa.me/919446654500?text=Hello%20%26%20welcome%0ALine%202');
  assert.equal(decodeURIComponent(new URL(url).searchParams.get('text')), 'Hello & welcome\nLine 2');
});
