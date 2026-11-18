import { MANAGEMENT_TEAM } from '@/lib/management-team.mjs';
import styles from './ManagementTeam.module.css';

// The management team in the hospital's order: studio portrait, name and
// role; a member with a full profile links to it.
export default function ManagementTeam({ team = MANAGEMENT_TEAM }) {
  return (
    <ol className={styles.grid}>
      {team.map((m) => {
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
