import styles from './CareOrbit.module.css';
import { specialityIconUrl } from '@/lib/speciality-icons.mjs';

// "Care at the heart" — the group's specialities orbiting a beating heart,
// with a live heartbeat trace underneath. Pure SVG and CSS: no photography to
// source, crisp at any size, and every colour comes from the brand tokens.
const I = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round' };
const SERVICES = [
  { label: 'Maternity', spec: 'gynaecology' },
  { label: 'IVF & Fertility', spec: 'reproductive-medicine' },
  { label: 'Newborn & NICU', spec: 'neonatology' },
  { label: 'Paediatrics', spec: 'paediatrics' },
  { label: '24/7 Emergency', spec: 'emergency-medicine' },
  { label: 'Expert Doctors', icon: <svg viewBox="0 0 24 24" {...I}><path d="M6 3v5a4 4 0 0 0 8 0V3" /><path d="M10 12v3a5 5 0 0 0 10 0v-2" /><circle cx="20" cy="11" r="2" /></svg> },
];

export default function CareOrbit({ hospitals = [], since }) {
  const years = since ? new Date().getFullYear() - since : null;
  return (
    <div className={styles.wrap}>
      <div className={styles.frame}>
      <div className={styles.card} role="img" aria-label="Kinder Hospitals care: maternity, IVF and fertility, newborn and NICU, paediatrics, 24/7 emergency and expert doctors">
        <span className={styles.glowA} aria-hidden="true" />
        <span className={styles.glowB} aria-hidden="true" />
        <span className={styles.plus} aria-hidden="true" />

        <div className={styles.system} aria-hidden="true">
          <span className={`${styles.ring} ${styles.ring1}`} />
          <span className={`${styles.ring} ${styles.ring2}`} />
          <span className={`${styles.ring} ${styles.ring3}`} />

          <div className={styles.orbit}>
            {SERVICES.map((s, i) => (
              <div key={s.label} className={styles.slot} style={{ '--a': `${(360 / SERVICES.length) * i - 90}deg` }}>
                <div className={styles.node}>
                  <span className={styles.nodeIcon}>
                    {s.spec ? <span className={styles.specIcon} style={{ '--ico': `url(${specialityIconUrl('', s.spec)})` }} /> : s.icon}
                  </span>
                  <span className={styles.nodeLabel}>{s.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.core}>
            <span className={styles.pulse} />
            <span className={`${styles.pulse} ${styles.pulse2}`} />
            <svg className={styles.heart} viewBox="0 0 64 58">
              <defs>
                <linearGradient id="co-heart" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#FF8A8E" />
                  <stop offset="1" stopColor="#E62129" />
                </linearGradient>
              </defs>
              <path d="M32 56S3 38.5 3 18.5A15.5 15.5 0 0 1 32 10.8 15.5 15.5 0 0 1 61 18.5C61 38.5 32 56 32 56Z" fill="url(#co-heart)" />
              <path className={styles.beat} d="M8 29h12l4-9 6 18 5-12 3 3h18" pathLength="100" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={styles.coreText}>Care at<br />the heart</span>
          </div>
        </div>

        <svg className={styles.ecg} viewBox="0 0 600 60" preserveAspectRatio="none" aria-hidden="true">
          <path pathLength="100" d="M0 34h150l10-14 12 30 14-44 12 42 8-14h120l10-14 12 30 14-44 12 42 8-14h168" />
        </svg>

      </div>

      {years && (
        <div className={`${styles.badge} ${styles.badgeTop}`}>
          <span className={styles.badgeIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M12 21s-7-4.4-9.3-9A5.4 5.4 0 0 1 12 6.3 5.4 5.4 0 0 1 21.3 12C19 16.6 12 21 12 21Z" /></svg>
          </span>
          <span><strong>Caring since {since}</strong><small>{years}+ years of kindness</small></span>
        </div>
      )}
      <div className={`${styles.badge} ${styles.badgeBottom}`}>
        <span className={`${styles.badgeIcon} ${styles.badgeIconLive}`} aria-hidden="true"><i /></span>
        <span><strong>Open 24/7</strong><small>Emergency · NICU · Pharmacy</small></span>
      </div>
      </div>

      {hospitals.length > 0 && (
        <nav className={styles.hospitals} aria-label="Our hospitals">
          <span className={styles.hospitalsLabel}>Our hospitals</span>
          {hospitals.map((h) => (
            <a key={h.slug} href={`/hospitals/${h.slug}`}>{h.name}</a>
          ))}
        </nav>
      )}
    </div>
  );
}
