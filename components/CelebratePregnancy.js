import { maternityHome } from '@/lib/maternity-home.mjs';
import { featureImages } from '@/lib/kochi-features.mjs';
import styles from './CelebratePregnancy.module.css';

export default function CelebratePregnancy({ pages = [], settings = {}, scope = 'group' }) {
  const section = maternityHome(pages, settings, 'pregnancy', scope);
  if (!section) return null;
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
        {section.links.map((link) => {
          const image = link.page.imageUrl || featureImages(link.page)[0];
          return <a key={link.slug} className={styles.card} href={link.href}>
            {image && <span className={styles.media}><img className={styles.cardPhoto} src={image} alt="" loading="lazy" /></span>}
            <span className={styles.cardBody}>
              <strong>{link.page.title || link.label}</strong>
              <span>{link.page.excerpt}</span>
              <em>Explore <span aria-hidden="true">→</span></em>
            </span>
          </a>;
        })}
      </div>
    </div>
  </section>;
}
