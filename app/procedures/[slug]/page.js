import { notFound } from 'next/navigation';
import { getContent } from '@/lib/api';
import { findProcedure, procedureGuide, procedureSlug } from '@/lib/procedures.mjs';
import { whatsappLink, whatsappNumber } from '@/lib/booking.mjs';
import SiteChrome from '@/components/SiteChrome';
import PageHero from '@/components/PageHero';
import ProcedureCard from '@/components/procedures/ProcedureCard';
import styles from '@/components/procedures/Procedure.module.css';

export const revalidate = 60;

const escape = (s) => String(s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const proc = findProcedure((await getContent()).procedures, slug);
  if (!proc) return { title: 'Procedure not found · Kinder Hospitals' };
  return { title: `${proc.name} · Kinder Hospitals`, description: procedureGuide(proc)?.lead || proc.description || undefined };
}

export default async function ProcedurePage({ params }) {
  const { slug } = await params;
  const content = await getContent();
  const procedures = (content.procedures || []).filter((p) => p && p.published !== false);
  const proc = findProcedure(procedures, slug);
  if (!proc) notFound();
  const guide = procedureGuide(proc);
  const index = procedures.indexOf(proc);
  const others = procedures.filter((p) => p !== proc).slice(0, 3);
  const enquire = whatsappLink(whatsappNumber(null), `Hello Kinder Hospitals, I would like to know more about ${proc.name}.`);

  return (
    <SiteChrome content={content}>
      <main>
        <PageHero
          crumb={proc.name}
          trail={[{ label: 'Procedures', href: '/procedures' }]}
          eyebrow={guide?.eyebrow ? `${guide.eyebrow} · Key procedure` : 'Key procedure'}
          titleHtml={escape(proc.name)}
          intro={proc.description}
        />
        <section className={styles.page}>
          <div className={`container ${styles.layout}`}>
            <article className={styles.article}>
              {guide ? (
                <>
                  <p className={styles.lead}>{guide.lead}</p>
                  <section className={styles.block} aria-labelledby="who">
                    <h2 id="who">Who it can help</h2>
                    <ul className={styles.checks}>{guide.whoFor.map((w) => <li key={w}>{w}</li>)}</ul>
                  </section>
                  <section className={styles.block} aria-labelledby="how">
                    <h2 id="how">How it works</h2>
                    <ol className={styles.steps}>
                      {guide.steps.map(([title, text]) => <li key={title}><strong>{title}</strong><span>{text}</span></li>)}
                    </ol>
                  </section>
                  <section className={styles.block} aria-labelledby="expect">
                    <h2 id="expect">What to expect</h2>
                    <p>{guide.expect}</p>
                  </section>
                  <section className={styles.block} aria-labelledby="kinder">
                    <h2 id="kinder">At Kinder Hospitals</h2>
                    <ul className={styles.chips}>{guide.atKinder.map((a) => <li key={a}>{a}</li>)}</ul>
                  </section>
                  <section className={styles.block} aria-labelledby="faq">
                    <h2 id="faq">Common questions</h2>
                    <div className={styles.faqs}>
                      {guide.faqs.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
                    </div>
                  </section>
                </>
              ) : (
                <p className={styles.lead}>{proc.description}</p>
              )}
              <p className={styles.note}>This page is general information. Your doctor will advise on what is right for you.</p>
            </article>

            <aside className={styles.aside}>
              <div className={styles.card}>
                <h2>Talk to a specialist</h2>
                <p>Book a consultation and our care coordinators will confirm your visit — or ask us any question about {proc.name}.</p>
                <div className={styles.actions}>
                  <a href="/book" className="btn btn-primary">Book an Appointment →</a>
                  <a href={enquire} className={styles.ghost} target="_blank" rel="noopener">Ask on WhatsApp</a>
                </div>
              </div>
              <div className={styles.facts}>
                <h3>Useful links</h3>
                <ul>
                  <li><a href="/doctors">Find a doctor</a></li>
                  <li><a href="/hospitals">Our hospitals</a></li>
                  <li><a href="/procedures">All procedures</a></li>
                </ul>
              </div>
            </aside>
          </div>
        </section>
        {others.length > 0 && (
          <section className={styles.more} aria-labelledby="more-procedures">
            <div className="container">
              <div className={styles.moreHead}>
                <span className="section-eyebrow">Keep reading</span>
                <h2 id="more-procedures" className="section-title">More <em>procedures</em></h2>
              </div>
              <div className={styles.grid}>
                {others.map((p) => <ProcedureCard key={procedureSlug(p)} proc={p} index={procedures.indexOf(p)} />)}
              </div>
            </div>
          </section>
        )}
      </main>
    </SiteChrome>
  );
}
