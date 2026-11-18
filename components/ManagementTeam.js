import { MANAGEMENT_TEAM, doctorOfMember } from '@/lib/management-team.mjs';
import { slugify } from '@/lib/services';
import styles from './ManagementTeam.module.css';

// The management team in the hospital's order: studio portrait, name and
// role; a member with a full profile links to it, and a member who is also
// one of our doctors links to their doctor profile.
export default function ManagementTeam({ team = MANAGEMENT_TEAM, doctors = [] }) {
  return (
    <ol className={styles.grid}>
      {team.map((member) => {
        const doc = member.href ? null : doctorOfMember(member, doctors);
        const m = doc ? { ...member, name: doc.name, href: `/doctors/${slugify(doc.name)}` } : member;
        const body = <>
          <span className={styles.photo}><img src={m.photo} alt={m.name} width={720} height={720} loading="lazy" decoding="async" /></span>
          <span className={styles.text}>
            <strong>{m.name}</strong>
            {m.role && <span className={styles.role}>{m.role}</span>}
            {m.href && <span className={styles.more}>View profile <i aria-hidden="true">→</i></span>}
          </span>
        </>;
        return (
          <li key={m.slug} className={styles.card}>
            {m.href ? <a className={styles.inner} href={m.href}>{body}</a> : <div className={styles.inner}>{body}</div>}
          </li>
        );
      })}
    </ol>
  );
}
