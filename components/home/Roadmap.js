import styles from './Roadmap.module.css';

// Future roadmap: the hospital's map of the Kinder Hospitals coming next.
// The artwork carries its own title and legend; on phones, where its text is
// small, the same stages follow it as a readable list.
const PHASES = [
  { key: 'signed', label: 'Already signed', tone: 'green', places: ['Edappal', 'Kollam'] },
  { key: '2026', label: '2026 – 2027', tone: 'orange', places: ['Palakkad', 'Thrissur'] },
  { key: '2027', label: '2027 – 2028', tone: 'red', places: ['Kozhikode', 'Kottayam', 'Trivandrum'] },
];

const Pin = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Z" /><circle cx="12" cy="10" r="2.6" /></svg>
);

export default function Roadmap() {
  return (
    <section id="roadmap" className={styles.section} aria-labelledby="roadmap-title">
      <div className="container">
        <div className={styles.srOnly}>
          <h2 id="roadmap-title">Future roadmap: expanding our health ecosystem, nurturing new communities</h2>
        </div>
        <figure className={styles.map}>
          <img
            src="/home/future-roadmap.webp"
            width={1272}
            height={704}
            loading="lazy"
            decoding="async"
            alt="Future roadmap map of Kerala. Already signed: Kinder Hospital Edappal and Kollam. 2026–2027: Palakkad and Thrissur. 2027–2028: Kozhikode, Kottayam and Trivandrum."
          />
        </figure>
        <ol className={styles.phases} aria-hidden="true">
          {PHASES.map((phase) => (
            <li key={phase.key} className={`${styles.phase} ${styles[phase.tone]}`}>
              <span className={styles.marker} aria-hidden="true"><Pin /></span>
              <h3>{phase.label}</h3>
              <ul>
                {phase.places.map((place) => (
                  <li key={place}>
                    <span className={styles.pin} aria-hidden="true"><Pin /></span>
                    <span><small>Kinder Hospital</small><strong>{place}</strong></span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
