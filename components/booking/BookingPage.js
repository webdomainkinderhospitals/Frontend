'use client';

import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { initials } from '@/components/DoctorCard';
import { TIMES, bookingDates, normalisePhone } from '@/lib/booking.mjs';
import { sendEnquiry } from '@/lib/enquiries.mjs';

const norm = (s) => String(s || '').toLowerCase().trim();

// A doctor's photo, or their initials when there is none or it fails to load:
// a broken-image icon never reaches a patient.
function DoctorPhoto({ doctor, small = false }) {
  const [failed, setFailed] = useState(false);
  const show = doctor.imageUrl && !failed;
  return (
    <span className={`bk-photo${small ? ' bk-photo-sm' : ''}`} aria-hidden="true">
      {show
        ? <img src={doctor.imageUrl} alt="" loading="lazy" decoding="async" onError={() => setFailed(true)} />
        : <span className="bk-initials">{initials(doctor.name)}</span>}
    </span>
  );
}

// The appointment request flow shared by /book (every doctor) and a centre's
// own /hospitals/<slug>/book (that centre's doctors only, in its own chrome).
//
//   doctors      [{ id, name, slug, speciality, designation, bio, imageUrl, centres: [centre] }]
//   centres      the corporate hospital filter; empty inside a centre's site
//   fixedCentre  the centre whose site this is, or null on the corporate site
//   centre       { name, title, slug, whatsapp, bookingUrl }
export default function BookingPage({ doctors = [], centres = [], fixedCentre = null }) {
  const [dates, setDates] = useState([]);
  const [centreFilter, setCentreFilter] = useState('');
  const [dept, setDept] = useState('');
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState('');
  const [pick, setPick] = useState(null);       // { doctor, date }
  const dialogRef = useRef(null);

  // Dates are the visitor's own local days, so they are worked out in the
  // browser after hydration rather than on the server's clock.
  useEffect(() => {
    setDates(bookingDates(new Date()));
    const params = new URLSearchParams(window.location.search);
    const c = params.get('centre');
    if (c && centres.some((x) => x.slug === c)) setCentreFilter(c);
    const d = params.get('doctor');
    if (d) {
      setHighlight(d);
      requestAnimationFrame(() =>
        document.getElementById(`doctor-${d}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
    }
  }, [centres]);

  const inCentre = useMemo(
    () => (centreFilter ? doctors.filter((d) => d.centres.some((c) => c.slug === centreFilter)) : doctors),
    [doctors, centreFilter]
  );
  const departments = useMemo(
    () => [...new Set(inCentre.map((d) => d.speciality).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [inCentre]
  );
  useEffect(() => { if (dept && !departments.includes(dept)) setDept(''); }, [departments, dept]);

  const shown = useMemo(() => {
    const q = norm(query);
    return inCentre.filter((d) =>
      (!dept || d.speciality === dept) &&
      (!q || [d.name, d.speciality, d.designation, d.bio].some((f) => norm(f).includes(q))));
  }, [inCentre, dept, query]);

  const open = (doctor, date) => {
    setPick({ doctor, date });
    requestAnimationFrame(() => dialogRef.current?.showModal());
  };

  return (
    <section className="bk">
      <div className="container">
        <div className="bk-bar" role="search" aria-label="Find a doctor">
          {!fixedCentre && centres.length > 1 && (
            <label className="bk-field">
              <span>Hospital</span>
              <select value={centreFilter} onChange={(e) => setCentreFilter(e.target.value)}>
                <option value="">All hospitals</option>
                {centres.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
              </select>
            </label>
          )}
          <label className="bk-field">
            <span>Department</span>
            <select value={dept} onChange={(e) => setDept(e.target.value)}>
              <option value="">All departments</option>
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>
          <label className="bk-field bk-search">
            <span>Search</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Doctor’s name or speciality"
              autoComplete="off"
            />
          </label>
          <p className="bk-count" aria-live="polite">
            {shown.length} doctor{shown.length === 1 ? '' : 's'}
            {fixedCentre ? ` at ${fixedCentre.title}` : ''}
          </p>
        </div>

        <p className="bk-how">
          Choose a doctor and a preferred day. Your request goes straight to our care team,
          and a coordinator calls you to confirm the appointment time.
        </p>

        {shown.length === 0 ? (
          <div className="bk-empty">
            <strong>No doctors match that search.</strong>
            <p>Try another department or name, or clear the filters.</p>
            <button type="button" className="btn btn-soft" onClick={() => { setDept(''); setQuery(''); setCentreFilter(''); }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="bk-grid">
            {shown.map((doc) => (
              <article
                key={doc.id}
                id={`doctor-${doc.slug}`}
                className={`bk-card${highlight === doc.slug ? ' is-highlight' : ''}`}
              >
                <header className="bk-card-head">
                  <DoctorPhoto doctor={doc} />
                  <div className="bk-who">
                    <h3>{doc.name}</h3>
                    {doc.designation && <p className="bk-role">{doc.designation}</p>}
                    {doc.bio && <p className="bk-quals">{doc.bio}</p>}
                    <div className="bk-tags">
                      {doc.speciality && <span className="bk-tag">{doc.speciality}</span>}
                      {!fixedCentre && doc.centres.map((c) => (
                        <span key={c.slug} className="bk-tag bk-tag-centre">{c.title}</span>
                      ))}
                    </div>
                  </div>
                </header>
                <div className="bk-dates" role="group" aria-label={`Preferred day with ${doc.name}`}>
                  {dates.map((date) => (
                    <button key={date.iso} type="button" className="bk-date" onClick={() => open(doc, date)}
                      aria-label={`${date.long} with ${doc.name}`}>
                      {date.label}
                    </button>
                  ))}
                </div>
                <p className="bk-select">Select a preferred day to continue</p>
              </article>
            ))}
          </div>
        )}
      </div>

      <BookingDialog ref={dialogRef} pick={pick} dates={dates} fixedCentre={fixedCentre}
        onChangeDate={(date) => setPick((p) => ({ ...p, date }))} />
    </section>
  );
}

// ---------------------------------------------------------------------------


const BookingDialog = forwardRef(function BookingDialog({ pick, dates, fixedCentre, onChangeDate }, ref) {
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState('New patient');
  const [note, setNote] = useState('');
  const [centreSlug, setCentreSlug] = useState('');
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState('');
  const nameRef = useRef(null);

  const doctor = pick?.doctor;
  const choices = fixedCentre ? [fixedCentre] : doctor?.centres || [];
  const centre = choices.find((c) => c.slug === centreSlug) || (choices.length === 1 ? choices[0] : null);

  // A fresh request for each doctor; patient details stay filled in so a
  // family booking two doctors doesn't type them twice.
  useEffect(() => {
    setSent(false); setFailure(''); setErrors({}); setTime('');
    setCentreSlug(choices.length === 1 ? choices[0].slug : '');
    if (doctor) setTimeout(() => nameRef.current?.focus(), 30);
  }, [doctor?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!pick) return <dialog ref={ref} className="bk-dialog" />;

  const close = () => ref.current?.close();

  // The request goes straight to the admin portal (Bookings & Enquiries),
  // where a coordinator confirms the time with the patient by phone.
  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    const tidyPhone = normalisePhone(phone);
    const next = {};
    if (!name.trim()) next.name = 'Please enter the patient’s name.';
    if (!tidyPhone) next.phone = 'Please enter a valid mobile number, e.g. 98765 43210.';
    if (choices.length > 1 && !centre) next.centre = 'Please choose the hospital you would like to visit.';
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(`bk-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    setSending(true); setFailure('');
    const result = await sendEnquiry({
      type: 'appointment',
      hospital: centre?.title || '',
      doctor: doctor.name,
      speciality: doctor.speciality || '',
      preferredDate: pick.date.long,
      preferredTime: time,
      name: name.trim(),
      phone: tidyPhone,
      patientType: type,
      message: note.trim(),
      website: e.target.website?.value || '',
    });
    setSending(false);
    if (result.ok) setSent(true);
    else setFailure(result.error);
  };

  return (
    <dialog ref={ref} className="bk-dialog" aria-labelledby="bk-title"
      onClick={(e) => { if (e.target === ref.current) close(); }}>
      <div className="bk-dialog-in">
        <button type="button" className="bk-close" onClick={close} aria-label="Close">×</button>

        <div className="bk-summary">
          <DoctorPhoto doctor={doctor} small />
          <div>
            <span className="section-eyebrow">Appointment request</span>
            <h2 id="bk-title">{doctor.name}</h2>
            <p>{[doctor.speciality, centre?.title].filter(Boolean).join(' · ')}</p>
          </div>
        </div>

        {sent ? (
          <div className="bk-done" role="status">
            <h3>Request received — thank you, {name.trim().split(' ')[0]}</h3>
            <p>
              Our care team has your request for <strong>{doctor.name}</strong> on <strong>{pick.date.long}</strong>
              {time ? <> ({time.toLowerCase()})</> : null}. A coordinator will call you on <strong>{normalisePhone(phone)}</strong> to
              confirm the appointment time.
            </p>
            <div className="bk-actions">
              <button type="button" className="btn btn-primary" onClick={close}>Done</button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            {choices.length > 1 && (
              <fieldset className="bk-set">
                <legend>Hospital</legend>
                <div className="bk-chips">
                  {choices.map((c) => (
                    <button key={c.slug} type="button" id={c === choices[0] ? 'bk-centre' : undefined}
                      className={`bk-chip${centreSlug === c.slug ? ' is-on' : ''}`}
                      aria-pressed={centreSlug === c.slug} onClick={() => { setCentreSlug(c.slug); setErrors((x) => ({ ...x, centre: undefined })); }}>
                      {c.title}
                    </button>
                  ))}
                </div>
                {errors.centre && <p className="bk-error" role="alert">{errors.centre}</p>}
              </fieldset>
            )}

            <fieldset className="bk-set">
              <legend>Preferred day</legend>
              <div className="bk-chips">
                {dates.map((d) => (
                  <button key={d.iso} type="button" className={`bk-chip${pick.date.iso === d.iso ? ' is-on' : ''}`}
                    aria-pressed={pick.date.iso === d.iso} onClick={() => onChangeDate(d)}>
                    {d.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="bk-set">
              <legend>Preferred time <small>(optional)</small></legend>
              <div className="bk-chips">
                {TIMES.map((t) => (
                  <button key={t} type="button" className={`bk-chip${time === t ? ' is-on' : ''}`}
                    aria-pressed={time === t} onClick={() => setTime(time === t ? '' : t)}>
                    {t}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="bk-row">
              <label className="bk-input">
                <span>Patient’s name <b aria-hidden="true">*</b></span>
                <input id="bk-name" ref={nameRef} value={name} onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((x) => ({ ...x, name: undefined })); }}
                  autoComplete="name" required aria-invalid={!!errors.name} aria-describedby={errors.name ? 'bk-name-err' : undefined} />
                {errors.name && <em id="bk-name-err" className="bk-error" role="alert">{errors.name}</em>}
              </label>
              <label className="bk-input">
                <span>Mobile number <b aria-hidden="true">*</b></span>
                <input id="bk-phone" type="tel" inputMode="tel" value={phone} onChange={(e) => { setPhone(e.target.value); if (errors.phone) setErrors((x) => ({ ...x, phone: undefined })); }}
                  autoComplete="tel" placeholder="98765 43210" required aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? 'bk-phone-err' : undefined} />
                {errors.phone && <em id="bk-phone-err" className="bk-error" role="alert">{errors.phone}</em>}
              </label>
            </div>

            <fieldset className="bk-set">
              <legend>Patient type</legend>
              <div className="bk-chips">
                {['New patient', 'Existing patient'].map((t) => (
                  <button key={t} type="button" className={`bk-chip${type === t ? ' is-on' : ''}`}
                    aria-pressed={type === t} onClick={() => setType(t)}>{t}</button>
                ))}
              </div>
            </fieldset>

            <label className="bk-input">
              <span>Anything we should know? <small>(optional)</small></span>
              <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} />
            </label>

            {/* Hidden from people; bots fill it in and are ignored. */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hc-trap" aria-hidden="true" />
            <p className="bk-privacy">
              Your details go only to Kinder Hospitals' care team, to arrange this appointment.
            </p>
            {failure && <p className="bk-error bk-fail" role="alert">{failure}</p>}
            <div className="bk-actions">
              <button type="submit" className="btn btn-primary bk-send" disabled={sending}>
                {sending ? 'Sending…' : 'Request appointment →'}
              </button>
              {fixedCentre?.bookingUrl && (
                <a className="bk-app" href={fixedCentre.bookingUrl} target="_blank" rel="noopener">
                  Prefer the app? Book in the Kinder app
                </a>
              )}
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
});
