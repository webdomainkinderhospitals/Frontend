'use client';

import { useState } from 'react';
import { slugify } from '@/lib/services';

// Professional specialities grid for a hospital sub-website. Supports
// facility tabs (e.g. Kochi's multi-speciality hospital + women's &
// fertility centre). Every card opens that speciality's own detail page,
// which shows only the doctors related to it.
export default function CentreSpecialities({ facilities = [], base }) {
  const [tab, setTab] = useState(0);
  const items = facilities[tab]?.items || [];

  return (
    <>
      {facilities.length > 1 && (
        <div className="spec-tabs" role="tablist" aria-label="Facilities">
          {facilities.map((f, i) => (
            <button
              key={f.name}
              role="tab"
              aria-selected={i === tab}
              className={i === tab ? 'active' : ''}
              onClick={() => setTab(i)}
            >
              {f.name}
            </button>
          ))}
        </div>
      )}
      <div className="spec-grid">
        {items.map((s) => (
          <a className="spec-card" key={s.name} href={`${base}/${slugify(s.name)}`}>
            <span className="spec-card-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
            <span className="spec-card-body">
              <strong>{s.name}</strong>
              {s.overview && <small>{s.overview}</small>}
            </span>
            <span className="spec-card-more">
              View doctors &amp; details
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </a>
        ))}
      </div>
    </>
  );
}
