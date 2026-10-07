import { maternityHome } from '@/lib/maternity-home.mjs';
import { pregnancyPhoto, PREMIUM_SLUG } from '@/lib/kochi-features.mjs';
import styles from './CelebratePregnancy.module.css';

export default function PremiumBirthingCentre({ pages = [], settings = {}, scope = 'group' }) {
  const section = maternityHome(pages, settings, 'birthing', scope);
  if (!section) return null;
  const highlights = String(section.highlights || '').split(/\n|\\n/).map((s) => s.trim()).filter(Boolean);
  // Water Birth, inside the centre.
  const inside = section.links.filter((link) => link.slug !== PREMIUM_SLUG);
  return <section id="premium-birthing-centre" className={`${styles.section} ${styles.birthingSection}`} aria-labelledby="birthing-title">
    <div className="container">
      <div className={`${styles.top} ${!section.imageUrl ? styles.withoutImage : ''}`}>
        {section.imageUrl && <figure className={`${styles.heroPhoto} ${styles.birthingPhoto}`}><img src={section.imageUrl} alt={section.imageAlt} loading="lazy" /></figure>}
        <div className={styles.intro}>
          <span className={styles.kicker}>{section.eyebrow}</span>
          <h2 id="birthing-title" className={styles.title}>{section.title}</h2>
          <p className={styles.lead}>{section.description}</p>
          {highlights.length > 0 && <ul className={styles.highlights}>{highlights.map((text, i) => <li key={i}><span aria-hidden="true">✦</span>{text}</li>)}</ul>}
          <div className={styles.actions}>
            {section.buttonLabel && <a className={styles.primary} href={section.href}>{section.buttonLabel} <span aria-hidden="true">→</span></a>}
            {section.contactLabel && <a className={styles.ghost} href={section.contactHref}>{section.contactLabel}</a>}
          </div>
          {inside.map((link) => {
            const photo = pregnancyPhoto(link.page);
            return <a key={link.slug} className={styles.insideCard} href={link.href}>
              {photo && <img src={photo} alt="" loading="lazy" />}
              <span>
                <small>Inside the centre</small>
                <strong>{String(link.label).split(' · ')[0]}</strong>
                <em>{link.page.excerpt}</em>
              </span>
              <i aria-hidden="true">→</i>
            </a>;
          })}
        </div>
      </div>
    </div>
  </section>;
}
