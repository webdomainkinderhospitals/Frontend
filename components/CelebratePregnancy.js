import { maternityHome } from '@/lib/maternity-home.mjs';
import { featureImages } from '@/lib/kochi-features.mjs';
import PregnancySlider from '@/components/PregnancySlider';
import styles from './CelebratePregnancy.module.css';

// Celebrate Pregnancy, on the group homepage (and Kochi's page): the
// introduction beside a slider of the signature experiences — Water Birth,
// Spandanam and Mom Mix — then the other experiences as cards, and the
// welcome every new family receives. Everything comes from published Content
// Library pages, so the admin controls what appears.
const SHOWCASE = [['water-birth', 'water-birthing-suite'], ['spandanam'], ['mom-mix']];

// Tharattazhaku's first import used kinderkochi.com's page banner; the
// hospital has since supplied a photo of the event itself.
const IMPORTED_BANNER = /kinderkochi\.com\/images\/tharatt_left_banner/;
const imageOf = (link) => {
  const own = String(link.page.imageUrl || '').trim();
  if (link.slug === 'kochi-tharattazhaku' && (!own || IMPORTED_BANNER.test(own))) return '/celebrate-pregnancy/tharatazhakku.webp';
  return own || featureImages(link.page)[0] || '';
};
const placeOf = (link) => String(link.page.location || 'Kochi').split(',')[0].trim();

export default function CelebratePregnancy({ pages = [], settings = {}, scope = 'group' }) {
  const section = maternityHome(pages, settings, 'pregnancy', scope);
  if (!section) return null;

  const showcase = SHOWCASE.map((shorts) => section.links.find((l) => shorts.includes(l.short))).filter(Boolean);
  const welcome = section.links.find((link) => link.short === 'first-moments');
  const cards = section.links.filter((link) => !showcase.includes(link) && link !== welcome);

  const slides = showcase.map((link) => ({
    key: link.slug, href: link.href, title: link.page.title || link.label, short: (link.page.title || link.label).split(' · ')[0],
    location: placeOf(link), excerpt: link.page.excerpt, image: imageOf(link),
  }));
  // A photo chosen for this section in the admin opens the slider.
  if (String(settings.maternityPregnancyImageUrl || '').trim()) {
    slides.unshift({ key: 'section-photo', href: section.href, title: section.imageAlt || section.title, location: '', excerpt: '', image: section.imageUrl });
  }

  return <section id="celebrate-pregnancy" className={styles.section} aria-labelledby="celebrate-title">
    <span className={styles.bloomA} aria-hidden="true" />
    <span className={styles.bloomB} aria-hidden="true" />
    <div className="container">
      <div className={`${styles.top} ${slides.length || section.imageUrl ? '' : styles.withoutImage}`}>
        <div className={styles.intro}>
          <span className={styles.kicker}><i aria-hidden="true">✦</i> {section.eyebrow}</span>
          <h2 id="celebrate-title" className={styles.title}>{section.title}</h2>
          <p className={styles.lead}>{section.description}</p>
          {showcase.length > 0 && <ul className={styles.points}>
            {showcase.map((link) => <li key={link.slug}><span aria-hidden="true" />{(link.page.title || link.label).split(' · ')[0]}<small>Kinder {placeOf(link)}</small></li>)}
          </ul>}
          <div className={styles.actions}>
            {section.buttonLabel && <a className={styles.primary} href={section.href}>{section.buttonLabel} <span aria-hidden="true">→</span></a>}
            {section.contactLabel && <a className={styles.ghost} href={section.contactHref}>{section.contactLabel}</a>}
          </div>
        </div>
        {slides.length > 0
          ? <PregnancySlider slides={slides} />
          : section.imageUrl && <figure className={styles.heroPhoto}><img src={section.imageUrl} alt={section.imageAlt} loading="lazy" /></figure>}
      </div>

      {cards.length > 0 && <>
        <div className={styles.subhead}>
          <span>More to celebrate</span>
          <h3>Celebrations, community &amp; learning</h3>
        </div>
        <div className={styles.grid} style={{ '--cols': Math.min(cards.length, 4) }}>
          {cards.map((link) => {
            const image = imageOf(link);
            return <a key={link.slug} className={styles.card} href={link.href}>
              <span className={styles.media}>
                {image && <img className={styles.cardPhoto} src={image} alt="" loading="lazy" />}
                <small className={styles.tag}>Kinder {placeOf(link)}</small>
              </span>
              <span className={styles.cardBody}>
                <strong>{(link.page.title || link.label).split(' · ')[0]}</strong>
                <span>{link.page.excerpt}</span>
                <em>Explore <span aria-hidden="true">→</span></em>
              </span>
            </a>;
          })}
        </div>
      </>}

      {welcome && <aside className={styles.welcome}>
        <span className={styles.welcomeMark} aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M12 21s-7-4.35-9.33-9A5.33 5.33 0 0 1 12 6.6 5.33 5.33 0 0 1 21.33 12C19 16.65 12 21 12 21Z" /></svg>
        </span>
        <div className={styles.welcomeText}>
          <span className={styles.welcomeKicker}>Your first moments together · Kinder {placeOf(welcome)}</span>
          <h3>{welcome.page.title}</h3>
          <p>{welcome.page.excerpt}</p>
        </div>
        <a className={styles.welcomeLink} href={welcome.href}>Discover the welcome <span aria-hidden="true">→</span></a>
      </aside>}
    </div>
  </section>;
}
