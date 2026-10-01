'use client';

import { useState } from 'react';
import styles from './EnquiryForm.module.css';
import { sendEnquiry } from '@/lib/enquiries.mjs';

const MODES = {
  enquiry: {
    subjects: ['Appointment', 'Health package', 'Insurance & TPA', 'Reports & records', 'Second opinion', 'Other'],
    subjectLabel: 'What is your enquiry about?',
    submit: 'Send enquiry',
    heading: 'Enquiry from the website',
  },
  feedback: {
    subjects: ['Compliment', 'Suggestion', 'Complaint / grievance', 'Billing', 'Other'],
    subjectLabel: 'What would you like to tell us?',
    submit: 'Send feedback',
    heading: 'Feedback from the website',
  },
};

// Sent to the admin portal (Bookings & Enquiries), where the team replies.
// If that fails, the message can still go by email or WhatsApp.
export default function EnquiryForm({ mode = 'enquiry', email = '', locations = [] }) {
  const config = MODES[mode] || MODES.enquiry;
  const [form, setForm] = useState({ name: '', phone: '', email: '', centre: '', subject: config.subjects[0], message: '' });
  const set = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }));
  const [state, setState] = useState({ sending: false, sent: false, error: '' });

  const body = [
    `Name: ${form.name}`,
    `Phone: ${form.phone}`,
    form.email && `Email: ${form.email}`,
    form.centre && `Centre: Kinder ${form.centre}`,
    `Subject: ${form.subject}`,
    '',
    form.message,
  ].filter(Boolean).join('\n');

  const mailto = `mailto:${email}?subject=${encodeURIComponent(`${config.heading} — ${form.subject}`)}&body=${encodeURIComponent(body)}`;
  const ready = form.name.trim() && form.phone.trim() && form.message.trim();

  return (
    state.sent ? (
      <div className={styles.form} role="status">
        <h3>Thank you, {form.name.trim().split(' ')[0]} — we have your message.</h3>
        <p>Our team will get back to you on {form.phone}{form.email ? ` or ${form.email}` : ''} shortly.</p>
      </div>
    ) : (
    <form className={styles.form} onSubmit={async (e) => {
      e.preventDefault();
      setState({ sending: true, sent: false, error: '' });
      const result = await sendEnquiry({
        type: mode === 'feedback' ? 'feedback' : 'enquiry',
        hospital: form.centre ? `Kinder ${form.centre}` : '',
        subject: form.subject, name: form.name, phone: form.phone, email: form.email,
        message: form.message, website: e.target.website.value,
      });
      setState({ sending: false, sent: result.ok, error: result.ok ? '' : result.error });
    }}>
      <div className={styles.row}>
        <label>
          <span>Your name *</span>
          <input type="text" required value={form.name} onChange={set('name')} autoComplete="name" />
        </label>
        <label>
          <span>Phone *</span>
          <input type="tel" required value={form.phone} onChange={set('phone')} autoComplete="tel" />
        </label>
      </div>
      <div className={styles.row}>
        <label>
          <span>Email</span>
          <input type="email" value={form.email} onChange={set('email')} autoComplete="email" />
        </label>
        <label>
          <span>Centre</span>
          <select value={form.centre} onChange={set('centre')}>
            <option value="">Not sure / any centre</option>
            {locations.map((loc) => <option key={loc.id ?? loc.name} value={loc.name}>Kinder {loc.name}</option>)}
          </select>
        </label>
      </div>
      <label>
        <span>{config.subjectLabel}</span>
        <select value={form.subject} onChange={set('subject')}>
          {config.subjects.map((subject) => <option key={subject}>{subject}</option>)}
        </select>
      </label>
      <label>
        <span>Your message *</span>
        <textarea rows={5} required value={form.message} onChange={set('message')} />
      </label>
      <div className={styles.actions}>
        <button type="submit" className="btn btn-primary" disabled={!ready || state.sending}>{state.sending ? 'Sending…' : `${config.submit} →`}</button>
        {state.error && <a className={styles.whatsapp} href={mailto}>Send by email instead</a>}
      </div>
      {state.error && <p className={styles.note} role="alert">{state.error}</p>}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hc-trap" aria-hidden="true" />
      <p className={styles.note}>
        Please do not share detailed medical history or reports here. For anything urgent, call the
        emergency number — this form is not monitored around the clock.
      </p>
    </form>
    )
  );
}
