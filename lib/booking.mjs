// Appointment requests: the dates a patient can pick, and the WhatsApp message
// that carries their request to the hospital's care coordinators. Pure
// functions only, so the booking page and the tests share one definition.
//
// A request is exactly that — a request. The site has no doctor schedules, so
// the patient picks a preferred day and part of the day, and a coordinator
// confirms the actual slot. The page says so; nothing here promises a slot.

// The group number every centre uses unless the admin gives it its own.
export const GROUP_WHATSAPP = '919446654500';

export const TIMES = ['Morning', 'Afternoon', 'Evening'];

// The preferred-time choices: "Any time", or a half-hour slot within the
// outpatient day (9:00 AM – 7:30 PM), grouped by part of the day. The
// coordinator confirms the actual time; these are preferences.
const clock = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
};
export const TIME_SLOTS = [
  ['Morning', 9 * 60, 12 * 60],
  ['Afternoon', 12 * 60, 16 * 60],
  ['Evening', 16 * 60, 20 * 60],
].map(([part, from, to]) => {
  const slots = [];
  for (let t = from; t < to; t += 30) slots.push(clock(t));
  return { part, slots };
});

// A half-hour slot that has already begun, when the chosen day is today, so
// it can't be asked for. "9:30 AM" -> minutes past midnight.
const minutesOf = (slot) => {
  const m = String(slot).match(/^(\d+):(\d+) (AM|PM)$/);
  if (!m) return null;
  return ((Number(m[1]) % 12) + (m[3] === 'PM' ? 12 : 0)) * 60 + Number(m[2]);
};
export function slotPassed(dayIso, slot, now = new Date()) {
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  if (dayIso !== today) return false;
  const mins = minutesOf(slot);
  return mins != null && mins <= now.getHours() * 60 + now.getMinutes();
}

const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAY_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'];
const pad = (n) => String(n).padStart(2, '0');

// The next `count` working days, starting today. Sundays are skipped: the
// outpatient desks are closed. Built from local date parts so a visitor in
// India sees Indian dates whatever the server's clock says.
export function bookingDates(from = new Date(), count = 12) {
  const out = [];
  for (let i = 0; out.length < count && i < count * 2; i++) {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
    if (d.getDay() === 0) continue;
    out.push(dayInfo(d));
  }
  return out;
}

// One day as the booking page shows it.
export function dayInfo(d) {
  return {
    iso: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    label: `${WEEKDAY[d.getDay()]} ${pad(d.getDate())} ${MONTH[d.getMonth()]}`,
    long: `${WEEKDAY_LONG[d.getDay()]}, ${d.getDate()} ${MONTH_LONG[d.getMonth()]} ${d.getFullYear()}`,
  };
}

// Every day a patient can ask for: today up to `span` days ahead, Sundays
// excepted. (On a day already past its last slot, today still shows; the
// time picker then offers "Any time" only.)
export function bookingMonth(from = new Date(), span = 30) {
  const out = [];
  for (let i = 0; i <= span; i++) {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
    if (d.getDay() !== 0) out.push(dayInfo(d));
  }
  return out;
}

// The calendar for one month: weeks of seven cells, Sunday first, with null
// before the 1st and after the last day.
export function monthGrid(year, month) {
  const first = new Date(year, month, 1);
  const days = new Date(year, month + 1, 0).getDate();
  const cells = Array(first.getDay()).fill(null);
  for (let d = 1; d <= days; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export const monthTitle = (year, month) => `${MONTH_LONG[month]} ${year}`;

// The whole booking window as one calendar: full weeks (Sunday first) from
// the week of the first day to the week of the last, so all 30 days show at
// once even when they cross into the next month.
export function rangeGrid(firstIso, lastIso) {
  const at = (iso) => new Date(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10));
  const first = at(firstIso);
  const last = at(lastIso);
  const start = new Date(first.getFullYear(), first.getMonth(), first.getDate() - first.getDay());
  const weeks = [];
  for (let d = start; d <= last || d.getDay() !== 0; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)) {
    if (d.getDay() === 0) weeks.push([]);
    weeks[weeks.length - 1].push(d);
  }
  return weeks;
}

// "October – November 2026", or "October 2026" when the window is one month.
export function rangeTitle(firstIso, lastIso) {
  const [fy, fm] = [+firstIso.slice(0, 4), +firstIso.slice(5, 7) - 1];
  const [ly, lm] = [+lastIso.slice(0, 4), +lastIso.slice(5, 7) - 1];
  if (fy === ly && fm === lm) return `${MONTH_LONG[fm]} ${fy}`;
  return fy === ly ? `${MONTH_LONG[fm]} – ${MONTH_LONG[lm]} ${fy}` : `${MONTH_LONG[fm]} ${fy} – ${MONTH_LONG[lm]} ${ly}`;
}
export const monthShort = (m) => MONTH[m];
export const WEEKDAY_INITIALS = WEEKDAY.map((w) => w.slice(0, 2));

// A patient's mobile number, tidied for the message; null when it can't be
// one. Without a + it is read as Indian (with or without a leading 0 or 91).
// With a + (or 00) the country code is taken as typed, so a Singapore number
// such as +65 9123 4567 stays Singaporean instead of being read as Indian.
const indian = (d) => (/^[6-9]\d{9}$/.test(d) ? `+91 ${d.slice(0, 5)} ${d.slice(5)}` : null);

export function normalisePhone(raw) {
  const text = String(raw || '').trim();
  let d = text.replace(/\D/g, '');
  if (text.startsWith('+') || text.startsWith('00')) {
    if (text.startsWith('00')) d = d.slice(2);
    if (d.startsWith('91')) return indian(d.slice(2));
    return d.length >= 8 && d.length <= 15 ? `+${d}` : null;
  }
  if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  if (d.length === 12 && d.startsWith('91')) d = d.slice(2);
  return indian(d);
}

// The WhatsApp number a centre's requests go to: its own if the admin set
// one, the group's otherwise. wa.me wants digits only, with country code.
export function whatsappNumber(centre) {
  let d = String(centre?.whatsapp || '').replace(/\D/g, '');
  if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  if (d.length === 10) d = `91${d}`;
  return d.length >= 11 && d.length <= 15 ? d : GROUP_WHATSAPP;
}

export function bookingMessage({ centreName, doctor, date, time, patient, phone, type, note }) {
  const lines = [
    `Hello ${centreName || 'Kinder Hospitals'}, I would like to book an appointment.`,
    '',
    `Doctor: ${doctor.name}${doctor.speciality ? ` — ${doctor.speciality}` : ''}`,
    `Preferred date: ${date.long}`,
    time ? `Preferred time: ${time}` : null,
    `Patient name: ${String(patient).trim()}`,
    `Mobile: ${phone}`,
    type ? `Patient type: ${type}` : null,
    String(note || '').trim() ? `Note: ${String(note).trim()}` : null,
    '',
    'Sent from the Kinder Hospitals website.',
  ];
  return lines.filter((l) => l !== null).join('\n');
}

export function whatsappLink(number, message) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
