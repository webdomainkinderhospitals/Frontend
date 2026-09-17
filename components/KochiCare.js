import ContentBody from './ContentBody';
import { careSections, careFaqs } from '@/lib/care-content.mjs';
import styles from './KochiCare.module.css';

export function KochiCareCards({ pages = [], title = 'Care at Kinder Kochi' }) {
  if (!pages.length) return null;
  return <section className={styles.collection} id="kochi-care"><div className="container">
    <span className="section-eyebrow">Explore our care</span><h2 className="section-title">{title}</h2>
    <p className={styles.intro}>Explore our services, learn what to expect and connect with the Kochi care team.</p>
    <div className={styles.cards}>{pages.map((page, i) => <article key={page.id} className={styles.card}>
      {page.imageUrl && <img src={page.imageUrl} alt="" loading="lazy" />}
      <div><span className={styles.number}>0{i + 1} / KINDER KOCHI</span><h3><a href={`/information/${page.slug}`}>{page.title}</a></h3>
        <p>{page.excerpt}</p><a className={styles.more} href={`/information/${page.slug}`}>Explore this service <span aria-hidden="true">↗</span></a></div>
    </article>)}</div>
  </div></section>;
}

export default function KochiCarePage({ page, content }) {
  const location = content.locations.find((l) => /^(kochi|cochin)$/i.test(l.name.trim()));
  const hospitalHref = location ? `/hospitals/${location.slug || location.name.toLowerCase()}` : '/#hospitals';
  const phone = String(location?.phone || '').replace(/[^+\d]/g, '');
  const sections = careSections(page.body);
  const related = (content.pages || []).filter((p) => p.category === 'Kochi Care' && p.id !== page.id && p.published !== false);
  const faqs = sections.flatMap(careFaqs);
  const schema = { '@context': 'https://schema.org', '@type': 'MedicalWebPage', name: page.title, description: page.excerpt,
    ...(faqs.length ? { hasPart: { '@type': 'FAQPage', mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) } } : {}) };
  return <main className={styles.page}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <header className={styles.hero}><div className="container">
      <nav aria-label="Breadcrumb"><a href={hospitalHref}>Kinder Kochi</a><span aria-hidden="true"> / </span><span>Our care</span></nav>
      <span className="section-eyebrow">KINDER HOSPITAL · KOCHI</span><h1>{page.title}</h1><p>{page.excerpt}</p>
      <div className={styles.actions}><a href={phone ? `tel:${phone}` : '/contact'} className="btn btn-primary">Contact the Kochi care team →</a><a href="/doctors?hospital=Kochi" className={styles.more}>Find a doctor ↗</a></div>
    </div></header>
    <div className={`container ${styles.layout}`}>
      <aside className={styles.sidebar}><nav aria-label="On this page"><strong>On this page</strong>{sections.map((s) => <a key={s.id} href={`#${s.id}`}>{s.title}</a>)}</nav>
        <div className={styles.help}><h2>Care starts with a conversation</h2><p>Contact our team to discuss services, appointments and your questions.</p><a href={phone ? `tel:${phone}` : '/contact'}>{phone ? `Call ${location.phone}` : 'Contact us'} →</a></div>
      </aside>
      <article className={styles.article}>
        {page.imageUrl && <img className={styles.cover} src={page.imageUrl} alt={page.title} />}
        {sections.map((s) => { const questions = careFaqs(s); return <section id={s.id} key={s.id} className={styles.section}>
          <h2>{s.title}</h2>{questions.length ? <div className={styles.faqs}>{questions.map((faq, i) => <details key={i}><summary>{faq.question}</summary><ContentBody text={faq.answer} /></details>)}</div> : <ContentBody text={s.body} />}
        </section>; })}
        <div className={styles.next}><h2>Speak with Kinder Kochi</h2><p>Our care team can help with appointment availability and the next step.</p><a className="btn btn-primary" href={phone ? `tel:${phone}` : '/contact'}>Enquire about this service →</a></div>
      </article>
    </div>
    <KochiCareCards pages={related} title="More care at Kinder Kochi" />
  </main>;
}
