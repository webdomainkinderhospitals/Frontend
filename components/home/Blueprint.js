import styles from './Blueprint.module.css';

// "Our Blueprint": the group's mission and vision, each with the values that
// carry it, around a photo of the care team.
const ICONS = {
  quality: <><circle cx="12" cy="12" r="8" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>,
  holistic: <><circle cx="12" cy="12" r="8" /><path d="M12 4v16M4 12h16" /><path d="M7 7c3 2 7 2 10 0M7 17c3-2 7-2 10 0" /></>,
  patient: <><circle cx="12" cy="7.5" r="3" /><path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><path d="M16.5 11.5c1 .8 2.3 1.2 3.5 1" /></>,
  access: <><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0" /><circle cx="12" cy="15" r="1.6" /></>,
  benchmark: <><path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4l-5.2 2.7 1-5.8L3.5 9.2l5.9-.9z" /></>,
  trusted: <><path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z" /><path d="m9 12 2 2 4-4" /></>,
  seamless: <><path d="M4 12a4 4 0 0 1 4-4h3M20 12a4 4 0 0 1-4 4h-3" /><path d="M8 16a4 4 0 0 1 0-8M16 8a4 4 0 0 1 0 8" /><path d="M9 12h6" /></>,
  universal: <><circle cx="12" cy="12" r="8" /><path d="M4 12h16M12 4c2.5 2.3 3.5 5 3.5 8s-1 5.7-3.5 8c-2.5-2.3-3.5-5-3.5-8s1-5.7 3.5-8z" /></>,
};
const Icon = ({ name }) => <svg viewBox="0 0 24 24" aria-hidden="true">{ICONS[name]}</svg>;

const COLUMNS = [
  {
    key: 'mission', kicker: 'Our Mission', title: 'What we do today',
    text: 'To make available high quality, personalised care with specialised and comprehensive range of services, in a cost effective health care facility in India at par with international standards.',
    values: [['quality', 'Quality'], ['holistic', 'Holistic'], ['patient', 'Patient-centricity'], ['access', 'Equitable access']],
  },
  {
    key: 'vision', kicker: 'Our Vision', title: 'Who we aspire to be',
    text: 'To be an institution recognised for exceptional patient care rendering efficient and reliable health services to all.',
    values: [['benchmark', 'Industry benchmark'], ['trusted', 'Trusted'], ['seamless', 'Seamless'], ['universal', 'Universal']],
  },
];

export default function Blueprint() {
  return (
    <section id="blueprint" className={styles.section} aria-labelledby="blueprint-title">
      <div className="container">
        <div className={styles.head}>
          <span className={styles.eyebrow}>Our blueprint</span>
          <h2 id="blueprint-title">Values driving <em>our progress</em></h2>
        </div>
        <div className={styles.layout}>
          {COLUMNS.map((col, i) => (
            <article key={col.key} className={`${styles.card} ${i === 0 ? styles.first : styles.second}`}>
              <span className={styles.kicker}>{col.kicker}</span>
              <h3>{col.title}</h3>
              <p>{col.text}</p>
              <span className={styles.valuesLabel}>Value takeaways</span>
              <ul className={styles.values}>
                {col.values.map(([icon, label]) => <li key={label}><span className={styles.valueIcon}><Icon name={icon} /></span>{label}</li>)}
              </ul>
            </article>
          ))}
          <figure className={styles.photo}>
            <img src="/home/care-team.webp" alt="Kinder Hospitals care team" loading="lazy" width={422} height={476} />
          </figure>
        </div>
      </div>
    </section>
  );
}
