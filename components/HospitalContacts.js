'use client';

import { useEffect, useRef, useState } from 'react';
import { parseContacts, sendEnquiry } from '@/lib/enquiries.mjs';

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" />
  </svg>
);

// A call-back request to one hospital. It lands in the admin portal under
// Bookings & Enquiries, tagged with that hospital.
function CallbackForm({ contact, onDone }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [state, setState] = useState({ sending: false, error: '', sent: false });
  const nameRef = useRef(null);
  useEffect(() => { nameRef.current?.focus(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setState({ sending: true, error: '', sent: false });
    const result = await sendEnquiry({
      type: 'callback', hospital: contact.name, subject: 'Call back request',
      name, phone, message, website: e.target.website.value,
    });
    setState({ sending: false, error: result.ok ? '' : result.error, sent: result.ok });
  };

  if (state.sent) {
    return (
      <div className="hc-done" role="status">
        <strong>Thank you, {name.split(' ')[0]}.</strong>
        <span>{contact.name} will call you back shortly.</span>
        <button type="button" className="hc-link" onClick={onDone}>Close</button>
      </div>
    );
  }
  return (
    <form className="hc-form" onSubmit={submit}>
      <label><span>Your name</span>
        <input ref={nameRef} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required minLength={2} />
      </label>
      <label><span>Mobile number</span>
        <input type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="98765 43210" required />
      </label>
      <label><span>How can we help? <small>(optional)</small></span>
        <textarea rows={2} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={500} />
      </label>
      {/* Hidden from people; bots fill it in and are ignored. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hc-trap" aria-hidden="true" />
      {state.error && <p className="hc-error" role="alert">{state.error}</p>}
      <div className="hc-form-actions">
        <button type="submit" className="hc-submit" disabled={state.sending}>
          {state.sending ? 'Sending…' : 'Request a call back'}
        </button>
        <button type="button" className="hc-link" onClick={onDone}>Cancel</button>
      </div>
    </form>
  );
}

// The header's "Contact our hospitals" control: every hospital's number and
// email, from Site Settings → Hospital contact numbers, each with a
// call-back request that goes to the admin portal.
export default function HospitalContacts({ text = '' }) {
  const contacts = parseContacts(text);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    const onPointer = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onPointer); };
  }, [open]);
  useEffect(() => { if (!open) setForm(''); }, [open]);

  if (!contacts.length) return null;

  return (
    <div className={`hc${open ? ' is-open' : ''}`} ref={ref}>
      <button type="button" className="helpline hc-trigger" aria-expanded={open} aria-controls="hc-panel"
        onClick={() => setOpen((v) => !v)}>
        <span className="helpline-icon"><PhoneIcon /></span>
        <span className="helpline-text">
          <strong>Contact our hospitals <span className="hc-caret" aria-hidden="true">▾</span></strong>
          <span>{contacts.map((c) => c.short.replace(/\s*&.*$/, '')).join(' · ')}</span>
        </span>
      </button>
      <div className="hc-panel" id="hc-panel" role="region" aria-label="Hospital contact numbers">
        <p className="hc-head">Call, email or ask us to call you back</p>
        <ul className="hc-list">
          {contacts.map((c) => (
            <li key={c.name} className={form === c.name ? 'is-active' : undefined}>
              <div className="hc-row">
                <strong className="hc-name">{c.name}</strong>
                <a className="hc-phone" href={c.tel}><PhoneIcon />{c.phone}</a>
                {c.email && <a className="hc-mail" href={`mailto:${c.email}`}><MailIcon />{c.email}</a>}
                {form !== c.name && (
                  <button type="button" className="hc-callback" onClick={() => setForm(c.name)}>
                    Request a call back →
                  </button>
                )}
              </div>
              {form === c.name && <CallbackForm contact={c} onDone={() => setForm('')} />}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
