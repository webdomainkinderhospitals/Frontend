'use client';

import { useEffect, useRef, useState } from 'react';

// Long text shown in full on larger screens; on a phone it opens at a
// teaser height with a "Read full profile" button. `height` is the teaser
// height in px and `bg` the colour the text fades into (the section's
// background). Short text is never clamped. `always` clamps on every screen
// size, not just on phones.
export default function ReadMore({ children, height = 160, bg = '#fff', label = 'Read full profile', always = false }) {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const [needed, setNeeded] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (el) setNeeded(el.scrollHeight > height + 60);
  }, [height]);

  const toggle = () => {
    if (open && ref.current) {
      const top = ref.current.getBoundingClientRect().top + window.scrollY - 140;
      if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' });
    }
    setOpen((o) => !o);
  };

  const clamped = needed && !open;
  return (
    <div className={`readmore-wrap${always ? ' rm-always' : ''}`}>
      <div ref={ref} className={`readmore${clamped ? ' is-clamped' : ''}`} style={{ '--rm-h': `${height}px`, '--rm-bg': bg }}>
        {children}
      </div>
      {needed && (
        <button type="button" className="readmore-btn" onClick={toggle} aria-expanded={open}>
          {open ? 'Show less' : label}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={open ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6'} /></svg>
        </button>
      )}
    </div>
  );
}
