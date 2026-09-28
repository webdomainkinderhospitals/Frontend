// Small line icons for the site menus — one weight, one corner style, so the
// menu reads as a single designed set. Hidden on narrower desktops by CSS so
// the menu always fits on one line.
const G = {
  home: <><path d="M3.5 10.5 12 4l8.5 6.5" /><path d="M5.5 9v10.5h13V9" /><path d="M10 19.5v-5h4v5" /></>,
  about: <><circle cx="12" cy="9" r="5" /><path d="m9.5 13.5-1.5 7 4-2 4 2-1.5-7" /><path d="m12 6.8.7 1.4 1.5.2-1.1 1.1.3 1.5-1.4-.7-1.4.7.3-1.5-1.1-1.1 1.5-.2Z" /></>,
  pin: <><path d="M19 10c0 5.5-7 11-7 11s-7-5.5-7-11a7 7 0 0 1 14 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  stethoscope: <><path d="M6 3v5a4 4 0 0 0 8 0V3" /><path d="M10 12v3a5 5 0 0 0 10 0v-2" /><circle cx="20" cy="11" r="2" /></>,
  doctor: <><circle cx="12" cy="7" r="3.5" /><path d="M5 21v-1.5A5.5 5.5 0 0 1 10.5 14h3a5.5 5.5 0 0 1 5.5 5.5V21" /><path d="M12 15.5v3M10.5 17h3" /></>,
  patients: <><path d="M12 11.5s-3.5-2.1-3.5-4.4A1.9 1.9 0 0 1 12 6a1.9 1.9 0 0 1 3.5 1.1c0 2.3-3.5 4.4-3.5 4.4Z" /><path d="M3 15.5h3.5l3 2h4a1.5 1.5 0 0 0 0-3H11" /><path d="M13.5 14.5 18 12.8a1.5 1.5 0 0 1 1.9 2.1L15 20H6.5L3 18" /></>,
  book: <><path d="M3 5.5c2.6-1 6-1 9 1 3-2 6.4-2 9-1V19c-2.6-1-6-1-9 1-3-2-6.4-2-9-1Z" /><path d="M12 6.5V20" /></>,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></>,
  phone: <path d="M6.6 3.5h3l1.5 3.8-2 1.3a12 12 0 0 0 5.3 5.3l1.3-2 3.8 1.5v3a1.7 1.7 0 0 1-1.9 1.7A15.5 15.5 0 0 1 4.9 5.4 1.7 1.7 0 0 1 6.6 3.5Z" />,
  care: <><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" /><path d="M12 10v4M10 12h4" /></>,
  building: <><path d="M4 21V5.5A1.5 1.5 0 0 1 5.5 4h8A1.5 1.5 0 0 1 15 5.5V21" /><path d="M15 10h3.5A1.5 1.5 0 0 1 20 11.5V21M3 21h18" /><path d="M9.5 7v4M7.5 9h4M8 15h3M8 18h3" /></>,
  clinic: <><path d="M4 21V9.5L12 4l8 5.5V21" /><path d="M3 21h18" /><path d="M12 9.5v5M9.5 12h5" /><path d="M9.5 21v-3.5h5V21" /></>,
  people: <><circle cx="9" cy="8" r="3" /><path d="M3.5 20v-1A5 5 0 0 1 8.5 14h1a5 5 0 0 1 5 5v1" /><circle cx="17" cy="9" r="2.3" /><path d="M16.5 14H17a4 4 0 0 1 4 4v1" /></>,
};

export default function NavIcon({ name }) {
  const glyph = G[name];
  if (!glyph) return null;
  return (
    <svg className="nav-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {glyph}
    </svg>
  );
}
