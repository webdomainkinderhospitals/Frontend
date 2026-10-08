import styles from './Roadmap.module.css';

// Future roadmap: the Kinder Hospitals coming next, by stage.
const PHASES = [
  { key: 'signed', label: 'Already signed', tone: 'green', places: ['Edappal'] },
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
        <div className={styles.head}>
          <span className={styles.eyebrow}>Future roadmap</span>
          <h2 id="roadmap-title"><span className={styles.accent}>Expanding our health ecosystem,</span> nurturing new communities</h2>
          <span className={styles.badge}>Upcoming projects</span>
        </div>
        <ol className={styles.phases}>
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
