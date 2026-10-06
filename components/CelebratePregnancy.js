import { maternityHome } from '@/lib/maternity-home.mjs';
import { featureImages } from '@/lib/kochi-features.mjs';
import styles from './CelebratePregnancy.module.css';

export default function CelebratePregnancy({ pages = [], settings = {}, scope = 'group' }) {
  const section = maternityHome(pages, settings, 'pregnancy', scope);
  if (!section) return null;
  const water = section.links.find((link) => ['water-birth', 'water-birthing-suite'].includes(link.short));
  const welcome = section.links.find((link) => link.short === 'first-moments');
  const cards = section.links.filter((link) => link !== water && link !== welcome);
  return <section id="celebrate-pregnancy" className={styles.section} aria-labelledby="celebrate-title">
    <span className={styles.bloomA} aria-hidden="true" />
    <span className={styles.bloomB} aria-hidden="true" />
    <div className="container">
      <div className={`${styles.top} ${!section.imageUrl ? styles.withoutImage : ''}`}>
        <div className={styles.intro}>
          <span className={styles.kicker}>{section.eyebrow}</span>
          <h2 id="celebrate-title" className={styles.title}>{section.title}</h2>
          <p className={styles.lead}>{section.description}</p>
          <div className={styles.actions}>
            {section.buttonLabel && <a className={styles.primary} href={section.href}>{section.buttonLabel} <span aria-hidden="true">→</span></a>}
            {section.contactLabel && <a className={styles.ghost} href={section.contactHref}>{section.contactLabel}</a>}
          </div>
        </div>
        {section.imageUrl && <figure className={styles.heroPhoto}><img src={section.imageUrl} alt={section.imageAlt} loading="lazy" /></figure>}
      </div>
      <div className={styles.grid}>
        {cards.map((link) => {
          const image = link.page.imageUrl || featureImages(link.page)[0];
          return <a key={link.slug} className={styles.card} href={link.href}>
            {image && <span className={styles.media}><img className={styles.cardPhoto} src={image} alt="" loading="lazy" /></span>}
            <span className={styles.cardBody}>
              <small className={styles.location}>Kinder {link.page.location || 'Kochi'}</small>
              <strong>{link.page.title || link.label}</strong>
              <span>{link.page.excerpt}</span>
              <em>Explore <span aria-hidden="true">→</span></em>
            </span>
          </a>;
        })}
      </div>
      {water && <article className={styles.waterFeature} aria-labelledby="water-feature-title">
        <div className={styles.waterIntro}>
          <span className={styles.waterLabel}>Kinder Kochi · Birthing choices</span>
          <h3 id="water-feature-title">{water.page.title || water.label}</h3>
          <p>{water.page.excerpt}</p>
          <a className={styles.primary} href={water.href}>Explore Water Birth <span aria-hidden="true">→</span></a>
        </div>
        <div className={styles.waterAside}>
          {water.page.imageUrl ? <img src={water.page.imageUrl} alt={water.page.title} loading="lazy" /> : <>
            <span className={styles.waterMark} aria-hidden="true">≈</span>
            <strong>Your birth preferences.<br />A conversation with your care team.</strong>
            <p>Learn about the centre, suitability and what to expect during labour.</p>
          </>}
        </div>
      </article>}
      {welcome && <aside className={styles.welcome}>
        <span className={styles.kicker}>Your first moments together</span>
        <h3>{welcome.page.title}</h3><p>{welcome.page.excerpt}</p>
        <a className={styles.ghost} href={welcome.href}>Discover the welcome experience →</a>
      </aside>}
    </div>
  </section>;
}
