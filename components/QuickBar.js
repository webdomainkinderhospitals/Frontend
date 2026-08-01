const WHATSAPP_BOOK =
  'https://api.whatsapp.com/send?phone=919446654500&text=' +
  encodeURIComponent('Hello Kinder Hospitals, I would like to book an appointment.');

const ITEMS = [
  {
    href: '#specialities',
    title: 'Maternity Care',
    sub: '13,000+ births delivered',
    icon: <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />,
  },
  {
    href: '#specialities',
    title: 'Kinder IVF',
    sub: '1,500+ successful IVFs',
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19 12c0 4-7 9-7 9s-7-5-7-9a7 7 0 1 1 14 0z" />
      </>
    ),
  },
  {
    href: WHATSAPP_BOOK,
    external: true,
    title: 'Book Appointment',
    sub: 'OPD & online consult',
    icon: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    ),
  },
  {
    href: '#packages',
    title: 'Health Packages',
    sub: 'From ₹1,550 onwards',
    icon: (
      <>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </>
    ),
  },
];

export default function QuickBar() {
  return (
    <div className="container">
      <div className="quick-bar">
        {ITEMS.map((item, i) => (
          <a
            key={i}
            href={item.href}
            className="quick-item"
            {...(item.external ? { target: '_blank', rel: 'noopener' } : {})}
          >
            <div className="quick-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {item.icon}
              </svg>
            </div>
            <div className="quick-text">
              <strong>{item.title}</strong>
              <span>{item.sub}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
