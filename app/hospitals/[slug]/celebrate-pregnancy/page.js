import { notFound } from 'next/navigation';
import { hospitalContext } from '@/lib/hospital';
import { kochiFeaturePages } from '@/lib/kochi-features.mjs';
import SubSiteChrome from '@/components/SubSiteChrome';
import styles from '@/components/KochiFeaturePage.module.css';

export const revalidate = 60;
export const metadata = { title: 'Celebrate Pregnancy · Kinder Kochi', description: 'Explore Tharattazhaku, WOW MOM, Water Birth and the Premium Birthing Centre at Kinder Kochi.' };

export default async function KochiPregnancyHub({ params }) {
  const { slug } = await params;
  const ctx = await hospitalContext(slug);
  if (!ctx || !/^(kochi|cochin)$/i.test(ctx.loc.name)) notFound();
  const links = kochiFeaturePages(ctx.content.pages, ctx.loc.name);
  if (!links.length) notFound();
  return <SubSiteChrome content={ctx.content} loc={ctx.loc} slug={slug} sections={ctx.data.sections} privacyHref={ctx.data.privacyHref}>
    <main className={styles.page}>
      <header className={styles.hero}><div className={`container ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <a className={styles.back} href="/hospitals/kochi">← Kinder Kochi</a>
          <span className={styles.kicker}>Kinder Kochi · Maternity</span>
          <h1>Celebrate every step of pregnancy</h1>
          <p>Discover Kinder Kochi's pregnancy community, past celebrations and birth choices. Explore each programme and speak with the care team about current availability.</p>
        </div>
      </div></header>
      <section className={`container ${styles.explore}`}>
        <span className={styles.kicker}>Choose your experience</span><h2>Pregnancy at Kinder Kochi</h2>
        <div className={styles.exploreGrid}>{links.map((link) => <a key={link.slug} href={link.href}>
          <span>{link.group}</span><strong>{link.label}</strong><small>{link.page.excerpt}</small><small>Explore →</small>
        </a>)}</div>
      </section>
    </main>
  </SubSiteChrome>;
}
