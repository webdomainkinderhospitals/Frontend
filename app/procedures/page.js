import { getContent } from '@/lib/api';
import SiteChrome from '@/components/SiteChrome';
import PageHero from '@/components/PageHero';
import ProcedureCard from '@/components/procedures/ProcedureCard';
import styles from '@/components/procedures/Procedure.module.css';

export const revalidate = 60;

export const metadata = {
  title: 'Signature procedures · Kinder Hospitals',
  description: 'IVF, IUI & ICSI, painless delivery, high-risk pregnancy care, laparoscopic gynaecological surgery and Level III NICU care at Kinder Hospitals.',
};

export default async function ProceduresPage() {
  const content = await getContent();
  const procedures = (content.procedures || []).filter((p) => p && p.published !== false);
  return (
    <SiteChrome content={content}>
      <main>
        <PageHero
          crumb="Procedures"
          eyebrow="Key procedures"
          titleHtml="Signature procedures, <em>kinder outcomes</em>"
          intro="Procedures where Kinder Hospitals has built deep clinical expertise — what each involves, who it helps and what to expect."
        />
        <section className={styles.list}>
          <div className="container">
            <div className={styles.grid}>
              {procedures.map((proc, i) => <ProcedureCard key={proc.id ?? proc.name} proc={proc} index={i} headingLevel={2} />)}
            </div>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
