// Sends an appointment request or enquiry to the Kinder admin portal, where
// staff see it under Bookings & Enquiries. Returns { ok } or { ok: false,
// error } with a message that can be shown to the visitor as is.
const API = process.env.NEXT_PUBLIC_API_URL;

export async function sendEnquiry(payload, { fetchImpl = globalThis.fetch, api = API } = {}) {
  if (!api) return { ok: false, error: 'Online requests are not available right now — please call the hospital.' };
  try {
    const source = typeof window !== 'undefined' ? window.location.pathname : '';
    const res = await fetchImpl(`${api}/api/enquiries`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ source, ...payload }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: body.error || 'We could not send your request — please try again.' };
    return { ok: true, id: body.id };
  } catch {
    return { ok: false, error: 'We could not reach Kinder Hospitals — check your connection and try again.' };
  }
}

// Site Settings → Hospital contact numbers: one hospital per line,
// "Name | Phone | Email". Lines without a name or a phone are skipped.
export function parseContacts(text = '') {
  return String(text)
    .split(/\\n|\n/)
    .map((line) => line.split('|').map((part) => part.trim()))
    .filter(([name, phone]) => name && phone)
    .map(([name, phone, email = '']) => ({
      name,
      phone,
      email,
      short: name.replace(/^Kinder\s+Hospitals?,?\s*/i, '') || name,
      tel: `tel:${dialable(phone)}`,
    }));
}

// An Indian number written the local way (0484 666 0000) dials from abroad
// too when given its country code: +914846660000.
function dialable(phone) {
  const digits = phone.replace(/[^+\d]/g, '');
  return /^0[1-9]\d{9}$/.test(digits) ? `+91${digits.slice(1)}` : digits;
}
