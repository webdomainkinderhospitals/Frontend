'use client';

import { useEffect, useRef, useState } from 'react';
import SpecialityIcon from '@/components/SpecialityIcon';
import { iconsForList } from '@/lib/speciality-icons.mjs';

// A centre's departments as its headline menu, right under the banner: one
// large card per group (Kochi: Multispeciality Services, and the Women &
// Fertility Centre). A card opens a panel with every department in that
// group, each linking to its own page on the centre's site.
//
//   groups  [{ title, items: [{ name, href, description }] }]

const STYLES = [
  { tone: 'blue', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3v6a4 4 0 0 0 8 0V3" /><path d="M10 13v3a5 5 0 0 0 10 0v-2" /><circle cx="20" cy="12" r="2" />
    </svg>
  ) },
  { tone: 'red', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="5.5" r="2.5" /><path d="M5 21v-5a4 4 0 0 1 4-4h1.5" /><circle cx="16" cy="12" r="2" /><path d="M11.5 21v-1.5a4.5 4.5 0 0 1 9 0V21" />
    </svg>
  ) },
];

const TAGLINES = {
  'multispeciality services': 'Surgery, critical care and specialist medicine for the whole family',
  'women & fertility centre': 'Pregnancy, fertility, newborn and children’s care under one roof',
};

export default function CentreServiceMenu({ groups = [], centre = '' }) {
  const [open, setOpen] = useState('');
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(''); };
    document.addEventListener('keydown', onKey);
    // Bring the panel into view on small screens, where it opens below the fold.
    requestAnimationFrame(() => {
      const r = panelRef.current?.getBoundingClientRect();
      if (r && r.top > window.innerHeight * 0.75) panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  if (!groups.length) return null;
  // Both panels belong to one hospital: no icon repeats across them.
  const icons = iconsForList(groups.flatMap((g) => g.items.map((d) => d.name)));

  return (
    <div className="csm" aria-label={`Departments at ${centre}`}>
      <div className="csm-cards">
        {groups.map((group, i) => {
          const style = STYLES[i % STYLES.length];
          const isOpen = open === group.title;
          const id = `csm-panel-${i}`;
          return (
            <button
              key={group.title}
              type="button"
              className={`csm-card csm-${style.tone}${isOpen ? ' is-open' : ''}`}
              aria-expanded={isOpen}
              aria-controls={id}
              onClick={() => setOpen(isOpen ? '' : group.title)}
            >
              <span className="csm-icon">{style.icon}</span>
              <span className="csm-body">
                <span className="csm-kicker">{group.items.length} departments</span>
                <strong className="csm-title">{group.title}</strong>
                <span className="csm-tag">{TAGLINES[group.title.toLowerCase()] || group.items.slice(0, 3).map((d) => d.name).join(' · ')}</span>
              </span>
              <span className="csm-go" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
              </span>
            </button>
          );
        })}
      </div>

      {groups.map((group, i) => (
        <div
          key={group.title}
          id={`csm-panel-${i}`}
          ref={open === group.title ? panelRef : null}
          className={`csm-panel csm-panel-${STYLES[i % STYLES.length].tone}${open === group.title ? ' is-open' : ''}`}
          role="region"
          aria-label={group.title}
          hidden={open !== group.title}
        >
          <div className="csm-panel-head">
            <div>
              <span className="csm-panel-kicker">{centre}</span>
              <h3>{group.title}</h3>
            </div>
            <button type="button" className="csm-close" onClick={() => setOpen('')} aria-label={`Close ${group.title}`}>×</button>
          </div>
          <ul className="csm-grid">
            {group.items.map((d) => (
              <li key={d.name}>
                <a href={d.href} className="csm-dept" title={d.description || undefined}>
                  <SpecialityIcon name={d.name} icon={icons.get(d.name)} />
                  <span>{d.name}</span>
                  <svg className="csm-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
