import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bookingDates, normalisePhone, whatsappNumber, bookingMessage, whatsappLink, GROUP_WHATSAPP } from '../lib/booking.mjs';

test('twelve working days from today, never a Sunday', () => {
  const monday = new Date(2026, 8, 28);                    // Mon 28 Sep 2026
  const days = bookingDates(monday);
  assert.equal(days.length, 12);
  assert.equal(days[0].label, 'Mon 28 Sep', 'starts today');
  assert.ok(days.every((d) => !d.label.startsWith('Sun')));
  assert.deepEqual(days.slice(5, 7).map((d) => d.label), ['Sat 03 Oct', 'Mon 05 Oct']);
  assert.equal(days[0].iso, '2026-09-28');
  assert.equal(days[0].long, 'Monday, 28 September 2026');
  assert.equal(bookingDates(new Date(2026, 9, 4), 1)[0].iso, '2026-10-05', 'a Sunday today starts on Monday');
});

test('dates roll over month and year ends', () => {
  const days = bookingDates(new Date(2026, 11, 30), 3);    // Wed 30 Dec 2026
  assert.deepEqual(days.map((d) => d.iso), ['2026-12-30', '2026-12-31', '2027-01-01']);
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
    centreName: 'Kinder Hospitals Kochi',
    doctor: { name: 'Dr. Reshmy R Pillai', speciality: 'Paediatrics' },
    date: { long: 'Tuesday, 29 September 2026' },
    time: 'Morning', patient: '  Anu Joseph ', phone: '+91 98765 43210', type: 'New patient', note: '',
  });
  assert.match(msg, /^Hello Kinder Hospitals Kochi, I would like to book an appointment\./);
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

import { bookingMonth, monthGrid, TIME_SLOTS, slotPassed } from '../lib/booking.mjs';

test('a whole month of days to choose from, Sundays excepted', () => {
  const days = bookingMonth(new Date(2026, 9, 5), 30);           // Mon 5 Oct 2026
  assert.equal(days[0].iso, '2026-10-05');                         // starts today
  assert.equal(days[days.length - 1].iso, '2026-11-04');            // 30 days ahead
  assert.ok(days.every((d) => !d.long.startsWith('Sunday')));
  assert.equal(days.length, 27);
});

test('the month calendar lays out weeks from Sunday', () => {
  const weeks = monthGrid(2026, 9);                                 // October 2026 starts on a Thursday
  assert.equal(weeks[0].filter(Boolean)[0].getDate(), 1);
  assert.equal(weeks[0].indexOf(weeks[0].find(Boolean)), 4);
  assert.ok(weeks.every((w) => w.length === 7));
  assert.equal(weeks.flat().filter(Boolean).length, 31);
});

test('time slots run every half hour through the outpatient day', () => {
  assert.deepEqual(TIME_SLOTS.map((g) => g.part), ['Morning', 'Afternoon', 'Evening']);
  assert.equal(TIME_SLOTS[0].slots[0], '9:00 AM');
  assert.equal(TIME_SLOTS[1].slots[0], '12:00 PM');
  assert.equal(TIME_SLOTS[2].slots.at(-1), '7:30 PM');
});

import { rangeGrid, rangeTitle } from '../lib/booking.mjs';

test('all 30 days show at once, in whole weeks across the month change', () => {
  const days = bookingMonth(new Date(2026, 9, 5), 30);
  const weeks = rangeGrid(days[0].iso, days.at(-1).iso);
  assert.ok(weeks.every((w) => w.length === 7));
  assert.equal(weeks[0][0].getDay(), 0);                           // starts on a Sunday
  const shown = new Set(weeks.flat().map((d) => d.toDateString()));
  for (const d of days) assert.ok(shown.has(new Date(d.iso + 'T00:00').toDateString()), d.iso);
  assert.equal(weeks.length, 5);
  assert.equal(rangeTitle(days[0].iso, days.at(-1).iso), 'October – November 2026');
  assert.equal(rangeTitle('2026-12-20', '2027-01-18'), 'December 2026 – January 2027');
});

test("today's slots that have already begun can't be picked; other days are open", () => {
  const now = new Date(2026, 9, 9, 13, 10);                       // Fri 9 Oct 2026, 1:10 PM
  assert.equal(slotPassed('2026-10-09', '9:00 AM', now), true);
  assert.equal(slotPassed('2026-10-09', '1:00 PM', now), true);
  assert.equal(slotPassed('2026-10-09', '1:30 PM', now), false);
  assert.equal(slotPassed('2026-10-09', '12:00 PM', now), true);
  assert.equal(slotPassed('2026-10-10', '9:00 AM', now), false);
  assert.equal(slotPassed('', '9:00 AM', now), false);
});
