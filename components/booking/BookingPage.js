'use client';

import { forwardRef, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { initials } from '@/components/DoctorCard';
import { TIME_SLOTS, WEEKDAY_INITIALS, bookingMonth, dayInfo, monthGrid, monthShort, monthTitle, normalisePhone, slotPassed } from '@/lib/booking.mjs';
import { sendEnquiry } from '@/lib/enquiries.mjs';
import { cardSummary, profileText, tidyQualifications } from '@/lib/doctor-profile.mjs';
import ContentBody from '@/components/ContentBody';

const norm = (s) => String(s || '').toLowerCase().trim();

// A doctor's photo, or their initials when there is none or it fails to load:
// a broken-image icon never reaches a patient.
function DoctorPhoto({ doctor, small = false, large = false }) {
  const [failed, setFailed] = useState(false);
  const show = doctor.imageUrl && !failed;
  return (
    <span className={`bk-photo${small ? ' bk-photo-sm' : ''}${large ? ' bk-photo-lg' : ''}`} aria-hidden="true">
      {show
        ? <img src={doctor.imageUrl} alt="" loading="lazy" decoding="async" onError={() => setFailed(true)} />
        : <span className="bk-initials">{initials(doctor.name)}</span>}
    </span>
  );
}

const ICONS = {
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
};

const isoOf = (d) => dayInfo(d).iso;
const ymOf = (iso) => ({ y: +iso.slice(0, 4), m: +iso.slice(5, 7) - 1 });
const ymKey = ({ y, m }) => y * 12 + m;
const dateOf = (iso) => new Date(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10));

// A panel that opens from a field: on a doctor's card it floats over the
// page (the card clips anything that overflows it), placed below the field
// or scrolled into view, never under the site's sticky header; in the
// booking form it opens in place. Escape and a click outside close it.
function usePopover({ inline = false, width = 340 } = {}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);
  // Opened from the keyboard, focus moves into the panel at once.
  const [byKeyboard, setByKeyboard] = useState(false);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const scrolled = useRef(false); // scrolled once to make room, this opening

  const place = useCallback(() => {
    if (inline || !triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const w = Math.min(width, window.innerWidth - 16);
    const height = panelRef.current?.offsetHeight || 400;
    const left = Math.max(8, Math.min(r.left, window.innerWidth - w - 8));
    const headerBottom = Math.max(64, ...[...document.querySelectorAll('header, .hospitals-strip, .subsite-header')]
      .map((el) => el.getBoundingClientRect())
      .filter((b) => b.top < 10 && b.bottom > 0)
      .map((b) => b.bottom));
    const fitsBelow = window.innerHeight - r.bottom >= height + 16;
    const above = r.top - 8 - height;
    // Not enough room below: scroll once, just enough (with a margin), then
    // place it on the next frames — a scroll event may never come.
    if (!fitsBelow && !scrolled.current) {
      const delta = Math.ceil(r.bottom + 24 + height - window.innerHeight);
      if (delta > 0 && r.top - delta >= headerBottom + 8) {
        scrolled.current = true;
        window.scrollBy({ top: delta, behavior: 'instant' });
        requestAnimationFrame(() => requestAnimationFrame(() => place()));
        return;
      }
    }
    const roomBelow = window.innerHeight - r.bottom >= height + 8;
    const top = fitsBelow || roomBelow ? r.bottom + 8 : above >= headerBottom + 8 ? above : r.bottom + 8;
    // Page coordinates: the page wrapper may be transformed, which would
    // make a fixed position relative to it rather than to the window.
    setPos({ top: top + window.scrollY, left: left + window.scrollX, width: w });
  }, [inline, width]);

  useLayoutEffect(() => { if (open) place(); }, [open, place]);

  const close = useCallback((refocus) => {
    setOpen(false); setPos(null); scrolled.current = false;
    if (refocus) triggerRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (e) => {
      if (!panelRef.current?.contains(e.target) && !triggerRef.current?.contains(e.target)) close(false);
    };
    // Escape closes this panel only, not the booking form around it.
    const onKey = (e) => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(true); } };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey, true);
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey, true);
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [open, place, close]);

  const toggle = (e) => {
    if (open) { close(false); return; }
    setByKeyboard(e.detail === 0);
    setOpen(true);
  };
  const ready = open && (inline || pos);
  const style = inline || !pos ? undefined : { position: 'absolute', top: pos.top, left: pos.left, width: pos.width };
  const render = (panel) => (inline ? panel : panel && typeof document !== 'undefined' ? createPortal(panel, document.body) : null);
  return { open, ready, toggle, close, triggerRef, panelRef, byKeyboard, setByKeyboard, style, render, place };
}

const ChevronIcon = ({ dir }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
  </svg>
);

// The preferred day: a month calendar over the next year (today to 12
// months ahead), Sunday first. Arrows step a month; the month's name opens a
// grid of every month in the window. `dates` are the days that can be asked
// for (Sundays excepted, the outpatient desks are closed); other days show
// but cannot be picked.
function DatePicker({ id, dates, value, onChange, label, placeholder, invalid = false, describedBy, inline = false }) {
  const pop = usePopover({ inline, width: 340 });
  const allowed = useMemo(() => new Map(dates.map((d) => [d.iso, d])), [dates]);
  const first = dates[0]?.iso;
  const last = dates[dates.length - 1]?.iso;
  const todayIso = useMemo(() => isoOf(new Date()), [first]); // eslint-disable-line react-hooks/exhaustive-deps
  const [view, setView] = useState(null); // { y, m } of the month shown
  const [mode, setMode] = useState('days'); // 'days' | 'months'
  const [focusIso, setFocusIso] = useState(value || first);
  const gridRef = useRef(null);
  const chosen = value ? allowed.get(value) : null;

  const months = useMemo(() => {
    if (!first) return [];
    const out = [];
    for (let k = ymKey(ymOf(first)); k <= ymKey(ymOf(last)); k++) out.push({ y: Math.floor(k / 12), m: k % 12 });
    return out;
  }, [first, last]);

  const openPicker = (e) => {
    const at = value || first;
    if (at && !pop.open) { setView(ymOf(at)); setFocusIso(at); setMode('days'); }
    pop.toggle(e);
  };

  // Focus follows the arrow keys onto the focused day, once drawn.
  useEffect(() => {
    if (!pop.ready || mode !== 'days') return;
    const day = pop.panelRef.current?.querySelector(`[data-iso="${focusIso}"]`);
    if (pop.byKeyboard || pop.panelRef.current?.contains(document.activeElement)) day?.focus({ preventScroll: true });
    else gridRef.current?.focus({ preventScroll: true });
  }, [pop.ready, focusIso, view, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!first) return null;
  const v = view || ymOf(value || first);
  const canPrev = ymKey(v) > ymKey(ymOf(first));
  const canNext = ymKey(v) < ymKey(ymOf(last));
  const shift = (n) => setView((cur) => { const k = ymKey(cur || v) + n; return { y: Math.floor(k / 12), m: k % 12 }; });
  const pick = (iso) => { onChange(allowed.get(iso)); pop.close(true); };

  // Arrow keys move a day or a week (into the next month when needed),
  // skipping days that cannot be picked.
  const onGridKey = (e) => {
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
    if (!step) return;
    e.preventDefault();
    if (e.target === gridRef.current) {
      pop.setByKeyboard(true);
      const start = allowed.has(focusIso) && ymKey(ymOf(focusIso)) === ymKey(v) ? focusIso
        : dates.find((d) => ymKey(ymOf(d.iso)) === ymKey(v))?.iso || focusIso;
      setFocusIso(start);
      pop.panelRef.current?.querySelector(`[data-iso="${start}"]`)?.focus({ preventScroll: true });
      return;
    }
    const at = dateOf(focusIso);
    for (let i = 1; i <= 14; i++) {
      const next = isoOf(new Date(at.getFullYear(), at.getMonth(), at.getDate() + step * i));
      if (next < first || next > last) return;
      if (allowed.has(next)) { setFocusIso(next); setView(ymOf(next)); return; }
    }
  };

  const days = (
    <>
      <table ref={gridRef} tabIndex={-1} className="bk-cal-grid" role="grid" aria-label={monthTitle(v.y, v.m)} onKeyDown={onGridKey}>
        <thead>
          <tr>{WEEKDAY_INITIALS.map((w) => <th key={w} scope="col" abbr={w}>{w}</th>)}</tr>
        </thead>
        <tbody>
          {monthGrid(v.y, v.m).map((week, i) => (
            <tr key={i}>
              {week.map((d, j) => {
                if (!d) return <td key={j} />;
                const iso = isoOf(d);
                const ok = allowed.has(iso);
                const on = iso === value;
                const sunday = d.getDay() === 0 && iso > todayIso && iso <= last;
                const why = ok ? '' : iso === todayIso ? ', today' : sunday ? ', closed on Sundays' : ', not available';
                return (
                  <td key={iso}>
                    <button
                      type="button"
                      data-iso={iso}
                      className={`bk-cal-day${on ? ' is-on' : ''}${sunday ? ' is-sun' : ''}${iso === todayIso ? ' is-today' : ''}`}
                      disabled={!ok}
                      tabIndex={iso === focusIso ? 0 : -1}
                      aria-pressed={on}
                      aria-label={`${dayInfo(d).long}${why}`}
                      onClick={() => pick(iso)}
                      onFocus={() => setFocusIso(iso)}
                    >
                      {d.getDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="bk-cal-foot">
        <span className="bk-cal-legend">
          <span className="bk-cal-key bk-cal-key-today" aria-hidden="true" /> Today
          <span className="bk-cal-key bk-cal-key-sun" aria-hidden="true" /> Sunday closed
        </span>
        <button type="button" className="bk-cal-quick" onClick={() => pick(first)}>
          {first === todayIso ? 'Today' : dateOf(first).getTime() - dateOf(todayIso).getTime() === 86400000 ? 'Tomorrow' : 'Earliest'}
        </button>
      </div>
    </>
  );

  const monthsGrid = (
    <div className="bk-cal-months" role="listbox" aria-label="Choose a month">
      {months.map((mo) => {
        const on = mo.y === v.y && mo.m === v.m;
        const chosenHere = value && ymKey(ymOf(value)) === ymKey(mo);
        return (
          <button
            key={ymKey(mo)}
            type="button"
            role="option"
            aria-selected={on}
            className={`bk-cal-month${on ? ' is-on' : ''}${chosenHere ? ' has-pick' : ''}`}
            onClick={() => { setView(mo); setMode('days'); }}
          >
            <strong>{monthShort(mo.m)}</strong>
            <small>{mo.y}</small>
          </button>
        );
      })}
    </div>
  );

  const panel = pop.ready && (
    <div ref={pop.panelRef} className={`bk-cal${inline ? ' bk-cal-inline' : ''}`} role="dialog" aria-label={`${label}: choose a date`} style={pop.style}>
      <div className="bk-cal-head">
        <button type="button" className="bk-cal-nav" onClick={() => (mode === 'days' ? shift(-1) : null)}
          disabled={mode !== 'days' || !canPrev} aria-label="Previous month"><ChevronIcon dir="left" /></button>
        <button type="button" className="bk-cal-title" aria-expanded={mode === 'months'}
          onClick={() => setMode((m) => (m === 'days' ? 'months' : 'days'))}>
          {mode === 'days' ? monthTitle(v.y, v.m) : 'Choose a month'}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
        </button>
        <button type="button" className="bk-cal-nav" onClick={() => (mode === 'days' ? shift(1) : null)}
          disabled={mode !== 'days' || !canNext} aria-label="Next month"><ChevronIcon dir="right" /></button>
      </div>
      {mode === 'days' ? days : monthsGrid}
    </div>
  );

  return (
    <span className={`bk-day bk-datefield${invalid ? ' is-invalid' : ''}${pop.open ? ' is-open' : ''}`}>
      <button
        ref={pop.triggerRef}
        id={id}
        type="button"
        className={`bk-date-btn${chosen ? '' : ' is-empty'}`}
        aria-haspopup="dialog"
        aria-expanded={pop.open}
        aria-label={chosen ? `${label}: ${chosen.long}. Change date` : `${label}: ${placeholder}`}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={openPicker}
      >
        {chosen ? chosen.label : placeholder}
      </button>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {ICONS.calendar}
      </svg>
      {pop.render(panel)}
    </span>
  );
}

// The preferred time: "Any time", or a half-hour slot, laid out as a grid
// of times under Morning, Afternoon and Evening.
function TimePicker({ id, value, onChange, label, inline = false, day = '' }) {
  const pop = usePopover({ inline, width: 360 });

  useEffect(() => {
    if (!pop.ready) return;
    const el = pop.panelRef.current?.querySelector('[aria-pressed="true"]') || pop.panelRef.current?.querySelector('button');
    if (pop.byKeyboard) el?.focus({ preventScroll: true });
  }, [pop.ready]); // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (t) => { onChange(t); pop.close(true); };
  const panel = pop.ready && (
    <div ref={pop.panelRef} className={`bk-cal bk-time${inline ? ' bk-cal-inline' : ''}`} role="dialog" aria-label={`${label}: choose a time`} style={pop.style}>
      <button type="button" className={`bk-time-any${!value ? ' is-on' : ''}`} aria-pressed={!value} onClick={() => pick('')}>
        <span>Any time</span>
        <small>Our coordinator will offer the earliest slot</small>
      </button>
      {TIME_SLOTS.map((g) => (
        <div className="bk-time-group" key={g.part} role="group" aria-label={g.part}>
          <span className="bk-time-part">{g.part}</span>
          <div className="bk-time-grid">
            {g.slots.map((t) => (
              <button key={t} type="button" className={`bk-time-slot${value === t ? ' is-on' : ''}`} aria-pressed={value === t} onClick={() => pick(t)}
                disabled={slotPassed(day, t)} title={slotPassed(day, t) ? 'This time has passed today' : undefined}>
                {t}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <span className={`bk-day bk-datefield${pop.open ? ' is-open' : ''}`}>
      <button
        ref={pop.triggerRef}
        id={id}
        type="button"
        className={`bk-date-btn${value ? '' : ' is-empty'}`}
        aria-haspopup="dialog"
        aria-expanded={pop.open}
        aria-label={`${label}: ${value || 'Any time'}. Change time`}
        onClick={pop.toggle}
      >
        {value || 'Any time'}
      </button>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {ICONS.clock}
      </svg>
      {pop.render(panel)}
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
  const [profile, setProfile] = useState(null); // doctor whose profile is open
  const profileRef = useRef(null);
  const [chosen, setChosen] = useState({});     // doctor id -> { date, time } picked on its card
  // Changing the day to today drops a time that has already gone by.
  const choose = (id, patch) => setChosen((c) => {
    const next = { ...c[id], ...patch };
    if (next.time && slotPassed(next.date?.iso || '', next.time)) next.time = '';
    return { ...c, [id]: next };
  });
  const dialogRef = useRef(null);

  // Dates are the visitor's own local days, so they are worked out in the
  // browser after hydration rather than on the server's clock.
  useEffect(() => {
    setDates(bookingMonth(new Date(), 365));
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

  const centreTitle = (doc) => fixedCentre?.title || doc.centres[0]?.title || '';
  const openProfile = (doctor) => {
    setProfile(doctor);
    requestAnimationFrame(() => profileRef.current?.showModal());
  };
  const bookFromProfile = () => {
    const doc = profile;
    profileRef.current?.close();
    open(doc, chosen[doc.id]?.date || null, chosen[doc.id]?.time || '');
  };

  const open = (doctor, date, time = '') => {
    setPick({ doctor, date, time, opened: Date.now() });
    requestAnimationFrame(() => dialogRef.current?.showModal());
  };

  return (
    <section className="bk">
      <div className="container">
        <div className="bk-bar" role="search" aria-label="Find doctors">
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
              placeholder="Search doctors by name or speciality"
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
                <div className="bk-media">
                  <DoctorPhoto doctor={doc} large />
                  {!fixedCentre && doc.centres.length > 0 && (
                    <span className="bk-media-centre">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                      {doc.centres.map((c) => c.title.replace(/^Kinder (Hospitals? )?/, '')).join(' · ')}
                    </span>
                  )}
                </div>
                <div className="bk-body">
                  {doc.speciality && <span className="bk-dept">{doc.speciality}</span>}
                  <h3>{doc.name}</h3>
                  {doc.designation && <p className="bk-role">{doc.designation}</p>}
                  {doc.bio && <p className="bk-quals">{tidyQualifications(doc.bio)}</p>}
                  <p className="bk-excerpt">{cardSummary(doc, centreTitle(doc))}</p>
                  <button type="button" className="bk-profile-link" onClick={() => openProfile(doc)}>
                    View full profile <span aria-hidden="true">→</span>
                  </button>
                </div>
                <div className="bk-book">
                  <div className="bk-book-row">
                    <label className="bk-book-field">
                      <span className="bk-book-label">Preferred day</span>
                      <DatePicker
                        id={`bk-day-${doc.id}`}
                        dates={dates}
                        value={chosen[doc.id]?.date?.iso}
                        onChange={(date) => choose(doc.id, { date: date || null })}
                        label={`Preferred day with ${doc.name}`}
                        placeholder="Select day"
                      />
                    </label>
                    <label className="bk-book-field">
                      <span className="bk-book-label">Preferred time</span>
                      <TimePicker
                        id={`bk-time-${doc.id}`}
                        value={chosen[doc.id]?.time || ''}
                        day={chosen[doc.id]?.date?.iso || ''}
                        onChange={(time) => choose(doc.id, { time })}
                        label={`Preferred time with ${doc.name}`}
                      />
                    </label>
                  </div>
                  <button type="button" className="btn btn-primary bk-book-btn"
                    onClick={() => open(doc, chosen[doc.id]?.date || null, chosen[doc.id]?.time || '')}>
                    Book appointment
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <BookingDialog ref={dialogRef} pick={pick} dates={dates} fixedCentre={fixedCentre}
        onChangeDate={(date) => {
          setPick((p) => ({ ...p, date }));
          if (pick?.doctor) choose(pick.doctor.id, { date });
        }}
        onChangeTime={(time) => { if (pick?.doctor) choose(pick.doctor.id, { time }); }} />

      <dialog ref={profileRef} className="bk-dialog bk-profile" aria-labelledby="bk-profile-name"
        onClick={(e) => { if (e.target === profileRef.current) profileRef.current.close(); }}>
        {profile && (
          <div className="bk-profile-in">
            <button type="button" className="bk-close" onClick={() => profileRef.current?.close()} aria-label="Close">×</button>
            <div className="bk-profile-side">
              <DoctorPhoto doctor={profile} large />
            </div>
            <div className="bk-profile-main">
              {profile.speciality && <span className="bk-dept">{profile.speciality}</span>}
              <h2 id="bk-profile-name">{profile.name}</h2>
              {profile.designation && <p className="bk-role">{profile.designation}</p>}
              {profile.bio && (
                <p className="bk-profile-quals"><span>Qualifications</span>{tidyQualifications(profile.bio)}</p>
              )}
              {profile.centres.length > 0 && (
                <p className="bk-profile-centres">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                  {profile.centres.map((c) => c.title).join(' · ')}
                </p>
              )}
              <div className="bk-profile-text">
                <ContentBody text={profileText(profile, centreTitle(profile))} />
              </div>
              <div className="bk-actions">
                <button type="button" className="btn btn-primary" onClick={bookFromProfile}>
                  Book appointment with {profile.name.replace(/^Brigadier \(Dr\.\)/, 'Dr.')} →
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}

// ---------------------------------------------------------------------------


const BookingDialog = forwardRef(function BookingDialog({ pick, dates, fixedCentre, onChangeDate, onChangeTime }, ref) {
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

  // A fresh request each time the form opens (day and time come from the
  // card); patient details stay filled in so a family booking two doctors
  // doesn't type them twice.
  useEffect(() => {
    setSent(false); setFailure(''); setErrors({}); setTime(pick?.time || '');
    setCentreSlug(choices.length === 1 ? choices[0].slug : '');
    if (doctor) setTimeout(() => nameRef.current?.focus(), 30);
  }, [pick?.opened]); // eslint-disable-line react-hooks/exhaustive-deps

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
    if (!pick.date) next.day = 'Please choose a preferred day.';
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
              {time ? <> at <strong>{time}</strong></> : null}. A coordinator will call you on <strong>{normalisePhone(phone)}</strong> to
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

            <div className="bk-set">
              <label className="bk-legend" htmlFor="bk-day">Preferred day <b aria-hidden="true">*</b></label>
              <DatePicker
                id="bk-day"
                dates={dates}
                value={pick.date?.iso}
                onChange={(date) => {
                  onChangeDate(date || null);
                  if (time && slotPassed(date?.iso || '', time)) { setTime(''); onChangeTime?.(''); }
                  if (errors.day) setErrors((x) => ({ ...x, day: undefined }));
                }}
                label="Preferred day"
                placeholder="Select a preferred day"
                invalid={!!errors.day}
                describedBy={errors.day ? 'bk-day-err' : undefined}
                inline
              />
              {errors.day && <p id="bk-day-err" className="bk-error" role="alert">{errors.day}</p>}
            </div>

            <div className="bk-set">
              <label className="bk-legend" htmlFor="bk-time">Preferred time <small>(optional)</small></label>
              <TimePicker
                id="bk-time"
                value={time}
                day={pick.date?.iso || ''}
                onChange={(t) => { setTime(t); onChangeTime?.(t); }}
                label="Preferred time"
                inline
              />
            </div>

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
