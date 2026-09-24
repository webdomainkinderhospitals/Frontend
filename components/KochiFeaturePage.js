import ContentBody from './ContentBody';
import { careSections, careFaqs } from '@/lib/care-content.mjs';
import { featureImages } from '@/lib/kochi-features.mjs';
import styles from './KochiFeaturePage.module.css';

export default function KochiFeaturePage({ page, loc, links = [] }) {
  const sections = careSections(page.body);
  const images = featureImages(page);
  const cover = page.imageUrl || images[0];
  const phone = String(loc.phone || '').replace(/[^+\d]/g, '');
  const book = loc.bookingUrl || (phone ? `tel:${phone}` : '/contact');
  const isEvent = page.slug === 'kochi-tharattazhaku';
  return <main className={styles.page}>
    <header className={styles.hero}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={`container ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <a className={styles.back} href="/hospitals/kochi">← Kinder Kochi</a>
          <span className={styles.kicker}>{isEvent || page.category === 'Celebrate Pregnancy' ? 'Celebrate Pregnancy' : 'Kinder Kochi · Maternity Care'}</span>
          <h1>{page.title}</h1>
          <p>{page.excerpt}</p>
          <div className={styles.actions}>
            <a className={styles.primary} href={book} {...(book.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {})}>Enquire with Kinder Kochi →</a>
            <a className={styles.secondary} href="/hospitals/kochi/celebrate-pregnancy">Explore pregnancy care</a>
          </div>
        </div>
        {cover && <div className={styles.heroMedia}><img src={cover} alt={page.title} /></div>}
      </div>
    </header>

    <div className={`container ${styles.content}`}>
      <aside className={styles.index}><span>ON THIS PAGE</span>
        {sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
      </aside>
      <article className={styles.article}>
        {sections.map((section) => {
          const faqs = careFaqs(section);
          return <section id={section.id} key={section.id} className={styles.section}>
            <h2>{section.title}</h2>
            {faqs.length ? faqs.map((faq) => <details key={faq.question} className={styles.faq}><summary>{faq.question}</summary><ContentBody text={faq.answer} /></details>) : <ContentBody text={section.body} />}
          </section>;
        })}
      </article>
    </div>

    {images.length > 0 && <section className={styles.gallery}><div className="container">
      <span className={styles.kicker}>Kinder Kochi</span><h2>Moments &amp; spaces</h2>
      <div className={styles.galleryGrid}>{images.map((src, i) => <figure key={src}><img src={src} alt={`${page.title} — image ${i + 1}`} loading="lazy" /></figure>)}</div>
    </div></section>}

    {links.length > 0 && <section className={`container ${styles.explore}`}>
      <span className={styles.kicker}>Explore more</span><h2>More from Kinder Kochi</h2>
      <div className={styles.exploreGrid}>{links.filter((link) => link.slug !== page.slug).map((link) =>
        <a href={link.href} key={link.slug}><span>{link.group}</span><strong>{link.label}</strong><small>Explore →</small></a>)}</div>
    </section>}
  </main>;
}
