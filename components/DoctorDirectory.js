'use client';

import { useEffect, useMemo, useState } from 'react';
import DoctorCard from './DoctorCard';
import { atLocation, locationsOf } from '@/lib/locations';

// Corporate "Our Doctors" directory: every published doctor from every
// centre, filterable by hospital, speciality and name. A doctor entered
// under a hospital in the admin appears here automatically.

const norm = (s) => String(s || '').trim().toLowerCase();

export default function DoctorDirectory({ doctors = [], locations = [], servicePages = [] }) {
  const [hospital, setHospital] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [query, setQuery] = useState('');

  // Deep links: /doctors?hospital=Kochi&speciality=IVF
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get('hospital')) setHospital(p.get('hospital'));
    if (p.get('speciality')) setSpeciality(p.get('speciality'));
    if (p.get('q')) setQuery(p.get('q'));
  }, []);
  useEffect(() => {
    const p = new URLSearchParams();
    if (hospital) p.set('hospital', hospital);
    if (speciality) p.set('speciality', speciality);
    if (query) p.set('q', query);
    const qs = p.toString();
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
  }, [hospital, speciality, query]);

  const specialities = useMemo(() => {
    const seen = new Map();
    for (const d of doctors) {
      const s = String(d.speciality || '').trim();
      if (s && !seen.has(norm(s))) seen.set(norm(s), s);
    }
    return [...seen.values()].sort((a, b) => a.localeCompare(b));
  }, [doctors]);

  // Group-wide doctors ("" location) practise at every centre.
  const atHospital = (d, name) => !name || locationsOf(d).length === 0 || atLocation(d, name);

  const countFor = (name) => doctors.filter((d) => atHospital(d, name)).length;

  const list = useMemo(() => {
    const q = norm(query);
    return doctors.filter((d) =>
      atHospital(d, hospital) &&
      (!speciality || norm(d.speciality) === norm(speciality)) &&
      (!q || [d.name, d.designation, d.speciality, ...locationsOf(d)].some((v) => norm(v).includes(q)))
    );
  }, [doctors, hospital, speciality, query]);

  const filtered = hospital || speciality || query;

  return (
    <div className="dd">
      <div className="dd-bar" role="search">
        <div className="dd-chips" aria-label="Filter by hospital">
          <button type="button" className={`doctor-filter${hospital === '' ? ' active' : ''}`} onClick={() => setHospital('')}>
            All hospitals <span className="dd-count">{doctors.length}</span>
          </button>
          {locations.map((l) => (
            <button
              key={l.id ?? l.name}
              type="button"
              className={`doctor-filter${norm(hospital) === norm(l.name) ? ' active' : ''}`}
              onClick={() => setHospital(norm(hospital) === norm(l.name) ? '' : l.name)}
            >
              Kinder {l.name} <span className="dd-count">{countFor(l.name)}</span>
            </button>
          ))}
        </div>
        <div className="dd-tools">
          <label className="dd-select">
            <span className="dd-label">Speciality</span>
            <select value={speciality} onChange={(e) => setSpeciality(e.target.value)} aria-label="Filter by speciality">
              <option value="">All specialities</option>
              {specialities.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="dd-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            <input
              type="search"
              placeholder="Search by doctor name…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search doctors by name"
            />
          </label>
        </div>
      </div>

      <div className="dd-summary">
        <p>
          {filtered ? (
            <>Showing <strong>{list.length}</strong> of {doctors.length} doctors
              {hospital ? <> at <strong>Kinder {hospital}</strong></> : null}
              {speciality ? <> in <strong>{speciality}</strong></> : null}
              {query ? <> matching “{query}”</> : null}
            </>
          ) : (
            <><strong>{doctors.length}</strong> specialists across <strong>{locations.length}</strong> Kinder centres and <strong>{specialities.length}</strong> specialities</>
          )}
        </p>
        {filtered && (
          <button type="button" className="dd-clear" onClick={() => { setHospital(''); setSpeciality(''); setQuery(''); }}>
            Clear filters ×
          </button>
        )}
      </div>

      {list.length === 0 ? (
        <div className="dd-empty">
          <strong>No doctors match these filters yet.</strong>
          <p>Try another hospital or speciality, or talk to our care coordinators and we will guide you to the right specialist.</p>
          <button type="button" className="btn btn-primary" onClick={() => { setHospital(''); setSpeciality(''); setQuery(''); }}>Show all doctors</button>
        </div>
      ) : (
        <div className="dd-grid">
          {list.map((doc, i) => <DoctorCard doc={doc} key={doc.id ?? i} servicePages={servicePages} />)}
        </div>
      )}
    </div>
  );
}
