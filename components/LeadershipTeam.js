import styles from './LeadershipTeam.module.css';

// Leadership profiles as cards: a portrait (or the person's initials until a
// photo is added to their page in the admin), name, designation, a short
// summary and a link to the full profile.
export default function LeadershipTeam({ leaders = [], base = '' }) {
  if (!leaders.length) return null;
  return <ul className={styles.grid}>
    {leaders.map((l) => {
      const href = `${base}/information/${l.slug}`;
      return <li key={l.slug} className={styles.card}>
        <a href={href} className={styles.link} aria-label={`${l.name}${l.role ? `, ${l.role}` : ''} — read profile`} />
        <span className={styles.portrait} aria-hidden="true">
          {l.photo ? <img src={l.photo} alt="" loading="lazy" /> : <span>{l.initials}</span>}
        </span>
        <div className={styles.text}>
          <h3>{l.name}</h3>
          {l.role && <p className={styles.role}>{l.role}</p>}
          {l.summary && <p className={styles.summary}>{l.summary}</p>}
          <span className={styles.more} aria-hidden="true">Read profile <i>→</i></span>
        </div>
      </li>;
    })}
  </ul>;
}
