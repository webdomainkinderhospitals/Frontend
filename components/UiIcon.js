// Small inline SVG glyphs for the chrome — the contact bar, location pills and
// link affordances. Emoji were standing in for these: they render as a
// different picture on every platform, can't take the brand colour, and never
// line up with the text baseline. One stroke weight, one corner treatment.
const PATHS = {
  mail: <><rect x="2.5" y="4.5" width="19" height="15" rx="2.5" /><path d="m3 7 8.2 5.6a1.5 1.5 0 0 0 1.6 0L21 7" /></>,
  phone: <path d="M6.6 3.5h3l1.5 3.8-2 1.3a12 12 0 0 0 5.3 5.3l1.3-2 3.8 1.5v3a1.7 1.7 0 0 1-1.9 1.7A15.5 15.5 0 0 1 4.9 5.4 1.7 1.7 0 0 1 6.6 3.5Z" />,
  ambulance: <><path d="M2.5 16V8.5A1.5 1.5 0 0 1 4 7h9.5v9" /><path d="M13.5 10H17l4 3.2V16" /><circle cx="7" cy="17.5" r="2" /><circle cx="17" cy="17.5" r="2" /><path d="M7 10.2v3M5.5 11.7h3" /></>,
  pin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z" /></>,
};

export default function UiIcon({ name, size = 15, className = '' }) {
  const path = PATHS[name];
  if (!path) return null;
  return (
    <svg
      className={`ui-icon ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {path}
    </svg>
  );
}
