import styles from '@/app/home.module.css';

const appointment = 'https://api.whatsapp.com/send?phone=919446654500&text=' +
  encodeURIComponent('Hello Kinder Hospitals, I would like to book an appointment.');

// Preserve the admin's supported emphasis without injecting arbitrary HTML.
function Headline({ text }) {
  return String(text).split(/(<em>.*?<\/em>)/gis).map((part, i) =>
    /^<em>/i.test(part) ? <em key={i}>{part.slice(4, -5)}</em> : part);
}

export default function HomeHero({ settings = {}, locations = [] }) {
  const names = locations.map((l) => l.name).filter(Boolean);
  const seeded = /spanning 5 hospitals across Cherthala/.test(settings.heroSubtitle || '');
  const intro = settings.heroSubtitle && !seeded ? settings.heroSubtitle :
    `Personalised care for women, children and families${names.length ? ` across ${names.join(', ')}` : ''}. From your first consultation to every milestone that follows.`;
  return <section id="home" className={styles.hero}>
    <div className="container">
      <div className={styles.heroGrid}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}><span aria-hidden="true" /> WELCOME TO KINDER HOSPITALS</span>
          <h1><Headline text={settings.heroTitle || 'Kindness at the heart of <em>every tiny heartbeat</em>'} /></h1>
          <p>{intro}</p>
          <div className={styles.heroActions}>
            <a className="btn btn-primary" href="#hospitals">Find your hospital <span aria-hidden="true">↗</span></a>
            <a className={styles.secondaryAction} href={appointment} target="_blank" rel="noopener noreferrer">Book an appointment <span aria-hidden="true">→</span></a>
          </div>
          <div className={styles.careLinks} aria-label="Explore our care"><span>Care for every chapter</span><a href="/services/maternity">Maternity</a><a href="/services/ivf">Fertility</a><a href="/services/paediatrics">Children&apos;s health</a></div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.heroImage}>
            <img src={settings.heroImageUrl || 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?auto=format&fit=crop&w=1200&q=85'} alt="" fetchPriority="high" decoding="async" />
          </div>
          <div className={styles.imageCaption}><span className={styles.heart} aria-hidden="true">♡</span><div><strong>Expertise you can trust.</strong><span>Kindness you can feel.</span></div></div>
          <span className={styles.sideNote} aria-hidden="true">THE KINDER WAY</span>
        </div>
      </div>
    </div>
  </section>;
}
