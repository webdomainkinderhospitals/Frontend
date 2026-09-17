'use client';

import { useState } from 'react';
import styles from './EnquiryForm.module.css';

const WHATSAPP = 'https://api.whatsapp.com/send?phone=919446654500&text=';

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

// The form composes the message and hands it to email or WhatsApp — nothing
// is stored in the browser and nothing is sent without the visitor acting.
export default function EnquiryForm({ mode = 'enquiry', email = '', locations = [] }) {
  const config = MODES[mode] || MODES.enquiry;
  const [form, setForm] = useState({ name: '', phone: '', email: '', centre: '', subject: config.subjects[0], message: '' });
  const set = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }));

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
  const whatsapp = WHATSAPP + encodeURIComponent(`${config.heading}\n\n${body}`);
  const ready = form.name.trim() && form.phone.trim() && form.message.trim();

  return (
    <form className={styles.form} onSubmit={(e) => { e.preventDefault(); window.location.href = mailto; }}>
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
        <button type="submit" className="btn btn-primary" disabled={!ready}>{config.submit} →</button>
        <a className={styles.whatsapp} href={ready ? whatsapp : WHATSAPP} target="_blank" rel="noopener">Send on WhatsApp instead</a>
      </div>
      <p className={styles.note}>
        Please do not share detailed medical history or reports here. For anything urgent, call the
        emergency number — this form is not monitored around the clock.
      </p>
    </form>
  );
}
