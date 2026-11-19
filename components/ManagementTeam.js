'use client';

import { useState } from 'react';
import { MANAGEMENT_TEAM, doctorOfMember } from '@/lib/management-team.mjs';
import { slugify } from '@/lib/services';
import ProfileDialog from './ProfileDialog';
import styles from './ManagementTeam.module.css';

// The management team in the hospital's order: studio portrait, name and
// role. A member with a full profile links to it; a member who is also one
// of our doctors links to their doctor profile; a member whose profile is
// written here (Mr Prasanth M. K.) opens it over the page.
export default function ManagementTeam({ team = MANAGEMENT_TEAM, doctors = [] }) {
  const [shown, setShown] = useState(null);
  return (
    <>
      <ol className={styles.grid}>
        {team.map((member) => {
          const doc = member.href ? null : doctorOfMember(member, doctors);
          const m = doc ? { ...member, name: doc.name, href: `/doctors/${slugify(doc.name)}` } : member;
          const opens = !m.href && m.profile;
          const body = <>
            <span className={styles.photo}><img src={m.photo} alt={m.name} width={720} height={720} loading="lazy" decoding="async" /></span>
            <span className={styles.text}>
              <strong>{m.name}</strong>
              {m.role && <span className={styles.role}>{m.role}</span>}
              {(m.href || opens) && <span className={styles.more}>View profile <i aria-hidden="true">→</i></span>}
            </span>
          </>;
          return (
            <li key={m.slug} className={styles.card}>
              {m.href ? <a className={styles.inner} href={m.href}>{body}</a>
                : opens ? <button type="button" className={`${styles.inner} ${styles.button}`} onClick={() => setShown(m)} aria-haspopup="dialog">{body}</button>
                : <div className={styles.inner}>{body}</div>}
            </li>
          );
        })}
      </ol>
      <ProfileDialog
        doc={shown && { name: shown.name, speciality: shown.role, imageUrl: shown.photo, team: shown.slug }}
        profile={shown && { text: shown.profile.join('\n\n') }}
        onClose={() => setShown(null)}
      />
    </>
  );
}
