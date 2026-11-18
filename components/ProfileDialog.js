'use client';

import { useEffect, useRef } from 'react';
import ContentBody from './ContentBody';
import { initials } from './DoctorCard';
import { slugify } from '@/lib/services';
import { locationsOf } from '@/lib/locations';
import { profileText, tidyQualifications } from '@/lib/doctor-profile.mjs';

// A doctor's or team member's profile, opened over the page from the doctor
// slider so the visitor never leaves the page they were reading. Closes with
// the × button, Esc, or a click outside the panel.
export default function ProfileDialog({ doc, profile, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return undefined;
    if (doc && !dialog.open) dialog.showModal();
    if (!doc && dialog.open) dialog.close();
    // Keep the page behind still while the profile is open.
    document.documentElement.style.overflow = doc ? 'hidden' : '';
    return () => { document.documentElement.style.overflow = ''; };
  }, [doc]);

  const onClick = (e) => { if (e.target === ref.current) onClose(); };

  const isTeam = Boolean(doc?.team);
  const centres = doc ? locationsOf(doc) : [];
  const text = !doc ? '' : isTeam ? profile?.text || '' : profileText(doc, centres.length === 1 ? `Kinder ${centres[0]}` : '');

  return (
    <dialog ref={ref} className="pdlg" onClose={onClose} onClick={onClick} aria-labelledby="pdlg-name">
      {doc && (
        <div className="pdlg-panel">
          <button type="button" className="pdlg-close" onClick={onClose} aria-label="Close profile">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
          <div className="pdlg-media">
            {doc.imageUrl
              ? <img src={doc.imageUrl} alt={doc.name} />
              : <span className="pdlg-initials" aria-hidden="true">{initials(doc.name)}</span>}
          </div>
          <div className="pdlg-body">
            {doc.speciality && <span className="pdlg-eyebrow">{doc.speciality}</span>}
            <h3 id="pdlg-name" className="pdlg-name">{doc.name}</h3>
            {doc.designation && <p className="pdlg-role">{doc.designation}</p>}
            <p className="pdlg-where">
              {isTeam ? 'Kinder Hospitals management team' : centres.length ? centres.map((c) => `Kinder ${c}`).join(' · ') : 'All Kinder centres'}
            </p>
            {!isTeam && doc.bio && !doc.fullBio && (
              <p className="pdlg-quals"><strong>Qualifications</strong>{tidyQualifications(doc.bio)}</p>
            )}
            {profile?.facts?.length > 0 && (
              <dl className="pdlg-facts">
                {profile.facts.map(([value, label]) => (
                  <div key={value}><dt>{value}</dt><dd>{label}</dd></div>
                ))}
              </dl>
            )}
            {profile?.quote && <blockquote className="pdlg-quote">“{profile.quote}”</blockquote>}
            {text && (!isTeam || profile) && (
              <div className="pdlg-text">
                <ContentBody text={!isTeam && doc.bio && !doc.fullBio ? text.replace(/\s*Qualifications:.*$/, '') : text} />
              </div>
            )}
            {!isTeam && (
              <div className="pdlg-actions">
                <a className="dcard-btn dcard-btn-primary" href={`/book?doctor=${slugify(doc.name)}`}>Book appointment</a>
                <a className="dcard-btn" href={`/doctors/${slugify(doc.name)}`}>Full profile page</a>
              </div>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
