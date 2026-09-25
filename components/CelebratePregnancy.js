import { kochiFeaturePages, featureImages } from '@/lib/kochi-features.mjs';
import styles from './CelebratePregnancy.module.css';

// Kinder Kochi's pregnancy and birthing experiences, brought onto the group
// homepage: the Premium Birthing Centre as the feature, with Tharattazhaku,
// WOW MOM and Water Birth beside it. Built from the same published pages as
// the Kochi menu bar, so a page the admin unpublishes drops out here too.
const COPY = {
  'kochi-tharattazhaku': { tag: 'Pregnancy fashion show', text: 'Kinder’s celebration of mothers-to-be on the ramp — with their families cheering them on.', art: '/kochi/tharattazhaku/ramp-walk.webp' },
  'kochi-wow-mom': { tag: 'Pregnancy club', text: 'Learning, wellness, friendship and celebrations for expectant mothers.' },
  'kochi-water-birthing-suite': { tag: 'Birth your way', text: 'Kerala’s first water birthing suite — gentle, low-intervention labour with expert monitoring.' },
  'kochi-premium-birthing-centre': { tag: 'Signature experience', text: 'LDRP suites, painless labour, VBAC and birth-companion support in a warm, home-like setting.' },
};

const imageOf = (link) => {
  const own = String(link.page.imageUrl || '').trim();
  return own || featureImages(link.page)[0] || COPY[link.slug]?.art || '';
};

// Background images: a photo that fails to load leaves the card's gradient
// showing instead of a broken-image icon.
const bg = (url) => ({ backgroundImage: `url("${String(url).replace(/"/g, '%22')}")` });

export default function CelebratePregnancy({ pages = [] }) {
  const links = kochiFeaturePages(pages, 'Kochi');
  if (!links.length) return null;
  const premium = links.find((l) => l.group === 'Premium Birthing Centre');
  const cards = links.filter((l) => l !== premium);

  return (
    <section className={styles.section} aria-labelledby="celebrate-title">
      <span className={styles.bloomA} aria-hidden="true" />
      <span className={styles.bloomB} aria-hidden="true" />
      <div className="container">
        <div className={styles.top}>
          <div className={styles.intro}>
            <span className={styles.kicker}><i aria-hidden="true">✦</i> Celebrate Pregnancy · Kinder Kochi</span>
            <h2 id="celebrate-title" className={styles.title}>
              Every step of pregnancy, <em>celebrated</em>.
            </h2>
            <p className={styles.lead}>
              From your first kick to your baby’s first cry — a pregnancy community, joyful celebrations and
              birth choices designed around you.
            </p>
            <div className={styles.actions}>
              <a className={styles.primary} href="/hospitals/kochi/celebrate-pregnancy">Explore Celebrate Pregnancy <span aria-hidden="true">→</span></a>
              <a className={styles.ghost} href="/hospitals/kochi#contact">Talk to our maternity team</a>
            </div>
          </div>

          {premium && (
            <a className={styles.premium} href={premium.href}>
              {imageOf(premium) && <span className={styles.premiumImg} style={bg(imageOf(premium))} aria-hidden="true" />}
              <span className={styles.premiumShade} aria-hidden="true" />
              <span className={styles.premiumBody}>
                <span className={styles.premiumBadge}>✦ {COPY[premium.slug]?.tag || 'Premium'}</span>
                <strong>Premium Birthing Centre</strong>
                <span className={styles.premiumText}>{COPY[premium.slug]?.text || premium.page.excerpt}</span>
                <span className={styles.premiumGo}>Discover the suites <span aria-hidden="true">→</span></span>
              </span>
            </a>
          )}
        </div>

        {cards.length > 0 && (
          <div className={styles.grid}>
            {cards.map((link, i) => {
              const img = imageOf(link);
              const copy = COPY[link.slug] || {};
              return (
                <a key={link.slug} className={styles.card} href={link.href} style={{ '--i': i }}>
                  <span className={styles.media}>
                    {img && <span className={styles.photo} style={bg(img)} aria-hidden="true" />}
                    <span className={styles.tag}>{copy.tag || link.group}</span>
                  </span>
                  <span className={styles.cardBody}>
                    <strong>{link.label}</strong>
                    <span>{copy.text || link.page.excerpt}</span>
                    <em>Explore <span aria-hidden="true">→</span></em>
                  </span>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
