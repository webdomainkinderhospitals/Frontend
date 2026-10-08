import styles from './BrandAmbassador.module.css';

// Kinder Hospitals' brand ambassador, Amala Paul.
export default function BrandAmbassador() {
  return (
    <section id="brand-ambassador" className={styles.section} aria-labelledby="ambassador-title">
      <div className={`container ${styles.layout}`}>
        <figure className={styles.portrait}>
          <img src="/home/amala-paul.webp" alt="Amala Paul, brand ambassador of Kinder Hospitals" loading="lazy" width={450} height={681} />
          <figcaption><strong>Amala Paul</strong><span>Brand Ambassador</span></figcaption>
        </figure>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>Our brand ambassador</span>
          <h2 id="ambassador-title">
            <span className={styles.red}>Trusted by the best.</span>
            <span className={styles.red}>Inspired by you.</span>
          </h2>
          <p className={styles.lead}>Amala Paul joins the Kinder family as our Brand Ambassador.</p>
          <p className={styles.text}>She stands with the mothers, children and families we care for — celebrating every pregnancy and every new beginning with us.</p>
          <figure className={styles.moment}>
            <img src="/celebrate-pregnancy/tharattazhaku/season-5-winners-walk.webp" alt="Amala Paul with the Tharattazhaku Season 5 winner" loading="lazy" />
            <figcaption>With the Season 5 winner at Kinder Tharattazhaku, our pregnant women’s fashion show.</figcaption>
          </figure>
          <a className={styles.link} href="/celebrate-pregnancy/tharattazhaku">Explore Tharattazhaku <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>
  );
}
