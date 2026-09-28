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

const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAY_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'];
const pad = (n) => String(n).padStart(2, '0');

// The next `count` working days, starting tomorrow. Sundays are skipped: the
// outpatient desks are closed. Built from local date parts so a visitor in
// India sees Indian dates whatever the server's clock says.
export function bookingDates(from = new Date(), count = 12) {
  const out = [];
  for (let i = 1; out.length < count && i < count * 2; i++) {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
    if (d.getDay() === 0) continue;
    out.push({
      iso: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
      label: `${WEEKDAY[d.getDay()]} ${pad(d.getDate())} ${MONTH[d.getMonth()]}`,
      long: `${WEEKDAY_LONG[d.getDay()]}, ${d.getDate()} ${MONTH_LONG[d.getMonth()]} ${d.getFullYear()}`,
    });
  }
  return out;
}

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
