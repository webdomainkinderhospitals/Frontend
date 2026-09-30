import ContentBody from './ContentBody';
import { careSections, careFaqs, carePageHref, isCarePage } from '@/lib/care-content.mjs';
import { slugOfLocation, atLocation, centreName } from '@/lib/locations';
import styles from './KochiCare.module.css';

// Cards for a centre's care pages. Every card opens that service's own page on
// the centre's sub-site, so the visitor never lands on the corporate site.
export function KochiCareCards({ pages = [], hospitalSlug = '', hospitalName = 'Kochi', centreLabel, title, intro, id = 'care', extra = [] }) {
  if (!pages.length) return null;
  const centre = centreLabel || `Kinder ${hospitalName}`;
  const heading = title || `Care at ${centre}`;
  // `extra` cards link to a section of the site rather than a care page
  // (e.g. Packages); they follow the care pages, numbered in sequence.
  const cards = [
    ...pages.map((page) => ({ key: page.id ?? page.slug, href: carePageHref(page, hospitalSlug), title: page.title, excerpt: page.excerpt, imageUrl: page.imageUrl })),
    ...extra.map((item) => ({ key: item.slug, ...item })),
  ];
  return <section className={styles.collection} id={id}><div className="container">
    <div className={styles.head}>
      <div>
        <span className="section-eyebrow">Explore our care</span>
        <h2 className="section-title">{heading}</h2>
        <p className={styles.intro}>{intro || `Each service below opens as its own page — what we treat, how we care for you and the answers patients ask for most.`}</p>
      </div>
      <span className={styles.count}>{cards.length} service{cards.length > 1 ? 's' : ''}</span>
    </div>
    <div className={styles.cards}>{cards.map((card, i) => <article key={card.key} className={styles.card}>
      <a className={styles.cardLink} href={card.href}>
        {card.imageUrl && <img className={styles.cardImg} src={card.imageUrl} alt="" loading="lazy" />}
        <div className={styles.cardBody}>
          <span className={styles.number}>{String(i + 1).padStart(2, '0')} / {centre}</span>
          <h3>{card.title}</h3>
          <p>{card.excerpt}</p>
          <span className={styles.more}>{card.cta || 'Explore this service'} <span aria-hidden="true">→</span></span>
        </div>
      </a>
    </article>)}</div>
  </div></section>;
}

export default function KochiCarePage({ page, content, loc, hospitalSlug }) {
  const location = loc || content.locations.find((l) => /^(kochi|cochin)$/i.test(l.name.trim()));
  const slug = hospitalSlug || (location ? slugOfLocation(location) : '');
  const home = slug ? `/hospitals/${slug}` : '/#hospitals';
  const name = location?.name || 'Kochi';
  const centre = location ? centreName(location) : `Kinder Hospital ${name}`;
  const phone = String(location?.phone || '').replace(/[^+\d]/g, '');
  const sections = careSections(page.body);
  const related = (content.pages || []).filter((p) => isCarePage(p) && p.id !== page.id && p.published !== false && (!location || atLocation(p, location.name)));
  const faqs = sections.flatMap(careFaqs);
  const schema = { '@context': 'https://schema.org', '@type': 'MedicalWebPage', name: page.title, description: page.excerpt,
    ...(faqs.length ? { hasPart: { '@type': 'FAQPage', mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) } } : {}) };
  return <main className={styles.page}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <header className={styles.hero}><div className="container">
      <a className={styles.back} href={home}><span aria-hidden="true">←</span> Back to {centre}</a>
      <nav aria-label="Breadcrumb" className={styles.crumbs}><a href={home}>{centre}</a><span aria-hidden="true"> / </span><a href={`${home}#care`}>Our care</a><span aria-hidden="true"> / </span><span aria-current="page">{page.title}</span></nav>
      <span className="section-eyebrow">KINDER HOSPITAL · {String(name).toUpperCase()}</span><h1>{page.title}</h1><p>{page.excerpt}</p>
      <div className={styles.actions}><a href={phone ? `tel:${phone}` : '/contact'} className="btn btn-primary">Contact the {name} care team →</a><a href={slug ? `${home}#doctors` : `/doctors?hospital=${encodeURIComponent(name)}`} className={styles.more}>Find a doctor →</a></div>
    </div></header>
    <div className={`container ${styles.layout}`}>
      <aside className={styles.sidebar}><nav aria-label="On this page"><strong>On this page</strong>{sections.map((s) => <a key={s.id} href={`#${s.id}`}>{s.title}</a>)}</nav>
        <div className={styles.help}><h2>Care starts with a conversation</h2><p>Contact our team to discuss services, appointments and your questions.</p><a href={phone ? `tel:${phone}` : '/contact'}>{phone ? `Call ${location.phone}` : 'Contact us'} →</a></div>
        <a className={styles.sidebarBack} href={home}><span aria-hidden="true">←</span> All care at {centre}</a>
      </aside>
      <article className={styles.article}>
        {page.imageUrl && <img className={styles.cover} src={page.imageUrl} alt={page.title} />}
        {sections.map((s) => { const questions = careFaqs(s); return <section id={s.id} key={s.id} className={styles.section}>
          <h2>{s.title}</h2>{questions.length ? <div className={styles.faqs}>{questions.map((faq, i) => <details key={i}><summary>{faq.question}</summary><ContentBody text={faq.answer} /></details>)}</div> : <ContentBody text={s.body} />}
        </section>; })}
        <div className={styles.next}><h2>Speak with {centre}</h2><p>Our care team can help with appointment availability and the next step.</p>
          <div className={styles.actions}><a className="btn btn-primary" href={phone ? `tel:${phone}` : '/contact'}>Enquire about this service →</a><a className={styles.more} href={home}><span aria-hidden="true">←</span> Back to {centre}</a></div>
        </div>
      </article>
    </div>
    <KochiCareCards pages={related} hospitalSlug={slug} hospitalName={name} centreLabel={centre} title={`More care at ${centre}`} intro={`Other services at this centre — each opens as its own page.`} id="more-care" />
  </main>;
}
