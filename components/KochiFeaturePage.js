import ContentBody from './ContentBody';
import { careSections, careFaqs } from '@/lib/care-content.mjs';
import { featureImages, pregnancyPhoto } from '@/lib/kochi-features.mjs';
import styles from './KochiFeaturePage.module.css';

// One of Kinder Kochi's pregnancy experiences or its birthing centre. On
// Kochi's own site it links back into that site; on the main site (`main`)
// it stays on the main site, under Celebrate Pregnancy.
export default function KochiFeaturePage({ page, loc, links = [], main = false }) {
  const centre = loc.name || 'Kochi';
  const back = main ? { href: '/celebrate-pregnancy', label: '← Celebrate Pregnancy' } : { href: '/hospitals/kochi', label: '← Kinder Kochi' };
  const hub = main ? '/celebrate-pregnancy' : '/hospitals/kochi/celebrate-pregnancy';
  const sections = careSections(page.body);
  const images = featureImages(page);
  const cover = pregnancyPhoto(page);
  const phone = String(loc.phone || '').replace(/[^+\d]/g, '');
  const book = loc.bookingUrl || (phone ? `tel:${phone}` : '/contact');
  const isEvent = page.slug === 'kochi-tharattazhaku';
  // The other experiences, once each: Water Birth has a page of its own and
  // the Kochi suite's page, so cards are matched by name.
  const nameOf = (title) => String(title || '').split(' · ')[0].trim().toLowerCase();
  const seen = new Set([nameOf(page.title), nameOf(links.find((link) => link.slug === page.slug)?.label)]);
  const more = links.filter((link) => {
    const name = nameOf(link.label);
    if (link.slug === page.slug || seen.has(name)) return false;
    seen.add(name);
    return true;
  });
  return <main className={styles.page}>
    <header className={styles.hero}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={`container ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <a className={styles.back} href={back.href}>{back.label}</a>
          <span className={styles.kicker}>{isEvent || page.category === 'Celebrate Pregnancy' ? 'Celebrate Pregnancy' : `Kinder ${centre} · Maternity Care`}{main ? ` · at Kinder Hospitals ${centre}` : ''}</span>
          <h1>{page.title}</h1>
          <p>{page.excerpt}</p>
          <div className={styles.actions}>
            <a className={styles.primary} href={book} {...(book.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {})}>Enquire with Kinder {centre} →</a>
            <a className={styles.secondary} href={hub}>Explore pregnancy care</a>
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
      <span className={styles.kicker}>Kinder {centre}</span><h2>Moments &amp; spaces</h2>
      <div className={styles.galleryGrid}>{images.map((src, i) => <figure key={src}><img src={src} alt={`${page.title} — image ${i + 1}`} loading="lazy" /></figure>)}</div>
    </div></section>}

    {more.length > 0 && <section className={`container ${styles.explore}`}>
      <span className={styles.kicker}>Explore more</span><h2>{main ? 'More to celebrate' : 'More from Kinder Kochi'}</h2>
      <div className={styles.exploreGrid}>{more.map((link) =>
        <a href={link.href} key={link.slug}>
          <span className={styles.exploreMedia}>{pregnancyPhoto(link.page)
            ? <img src={pregnancyPhoto(link.page)} alt="" loading="lazy" />
            : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-4.35-9.33-9A5.33 5.33 0 0 1 12 6.6 5.33 5.33 0 0 1 21.33 12C19 16.65 12 21 12 21Z" /></svg>}</span>
          <span className={styles.exploreBody}><span>{link.group}</span><strong>{String(link.label).split(' · ')[0]}</strong><small>Explore →</small></span>
        </a>)}</div>
    </section>}
  </main>;
}
