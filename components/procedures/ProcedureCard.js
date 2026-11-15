import { procedureIcon } from '@/components/icons';
import { procedureGuide, procedureHref } from '@/lib/procedures.mjs';
import styles from './Procedure.module.css';

// One procedure as a card linking to its page.
export default function ProcedureCard({ proc, index = 0, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`;
  const guide = procedureGuide(proc);
  return (
    <a className={styles.procCard} href={procedureHref(proc)}>
      <span className={styles.procIcon} aria-hidden="true">{procedureIcon(proc.icon, index)}</span>
      {guide?.eyebrow && <span className={styles.procKicker}>{guide.eyebrow}</span>}
      <Heading>{proc.name}</Heading>
      {proc.description && <p>{proc.description}</p>}
      <span className={styles.procMore}>Read more <span aria-hidden="true">→</span></span>
    </a>
  );
}
