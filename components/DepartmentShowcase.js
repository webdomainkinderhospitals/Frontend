'use client';

import { useId, useState } from 'react';
import { iconsForList, specialityIconUrl } from '@/lib/speciality-icons.mjs';

// A hospital's departments as a band of large line icons with their names
// beneath, in the hospital's own icon set — one tab per group of
// departments (Kochi: Multispeciality Services, Women & Fertility Centre).
// Every department links to its page; its icon turns when hovered or
// tapped. No icon repeats across the tabs.
//
//   groups  [{ title, items: [{ name, href, description }] }]
//   centre  e.g. "Kinder Hospitals Kochi"
//   image   optional photo laid faintly under the band
export default function DepartmentShowcase({ groups = [], centre = '', image = '', heading = null }) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  if (!groups.length) return null;
  const icons = iconsForList(groups.flatMap((g) => g.items.map((d) => d.name)));
  const tabbed = groups.length > 1;

  // Arrow keys move between tabs, as in any tab list.
  const onTabKey = (e) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = (active + step + groups.length) % groups.length;
    setActive(next);
    document.getElementById(`${baseId}-tab-${next}`)?.focus();
  };

  return (
    <div className="dept-band" style={image ? { '--dept-photo': `url("${image}")` } : undefined}>
      <div className="container dept-band-in">
        {heading}
        {tabbed && (
          <div className="dept-tabs" role="tablist" aria-label={`Departments at ${centre}`} onKeyDown={onTabKey}>
            {groups.map((g, i) => (
              <button
                key={g.title || i}
                id={`${baseId}-tab-${i}`}
                type="button"
                role="tab"
                aria-selected={active === i}
                aria-controls={`${baseId}-panel-${i}`}
                tabIndex={active === i ? 0 : -1}
                className={`dept-tab${active === i ? ' is-on' : ''}`}
                onClick={() => setActive(i)}
              >
                {g.title}
                <small>{g.items.length}</small>
              </button>
            ))}
          </div>
        )}
        {groups.map((g, i) => (
          <div
            key={g.title || i}
            id={`${baseId}-panel-${i}`}
            role={tabbed ? 'tabpanel' : undefined}
            aria-labelledby={tabbed ? `${baseId}-tab-${i}` : undefined}
            hidden={tabbed && active !== i}
          >
            {!tabbed && g.title && <h3 className="dept-group-title">{g.title}</h3>}
            <ul className="dept-grid">
              {g.items.map((d) => (
                <li key={d.name}>
                  <a className="dept-item" href={d.href} title={d.description || undefined}>
                    <span className="dept-ico" aria-hidden="true"
                      style={{ '--ico': `url(${specialityIconUrl(d.name, icons.get(d.name))})` }} />
                    <span className="dept-name">{d.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
