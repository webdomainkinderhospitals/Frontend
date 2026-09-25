import styles from './PromoBanner.module.css';

// A ready-made campaign artwork (text and branding baked into the image),
// managed from the admin portal. Shown at its natural 1920 × 720 proportion
// so nothing in the design is ever cropped; hidden entirely when no image is
// set. An optional link makes the whole banner clickable.
export default function PromoBanner({ image, link, alt, label = 'Announcement' }) {
  const src = String(image || '').trim();
  if (!src) return null;
  const href = String(link || '').trim();
  const external = /^https?:\/\//i.test(href);
  const picture = (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={styles.image} src={src} alt={String(alt || '').trim() || label} width={1920} height={720} loading="lazy" decoding="async" />
  );

  return (
    <aside className={styles.promo} aria-label={label}>
      <div className="container">
        {href ? (
          <a className={styles.frame} href={href} {...(external ? { target: '_blank', rel: 'noopener' } : {})}>
            {picture}
          </a>
        ) : (
          <div className={styles.frame}>{picture}</div>
        )}
      </div>
    </aside>
  );
}
