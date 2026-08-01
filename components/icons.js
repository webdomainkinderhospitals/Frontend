// Small inline SVG icon set ported from the original design.
// Icons are looked up by key (matching the `icon` field in the API data),
// with a sensible default when the key is unknown.

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 2 };

export const SPEC_ICONS = {
  'heart-pin': (
    <svg viewBox="0 0 24 24" {...stroke}><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" /></svg>
  ),
  'pin-dot': (
    <svg viewBox="0 0 24 24" {...stroke}><circle cx="12" cy="12" r="3" /><path d="M19 12c0 4-7 9-7 9s-7-5-7-9a7 7 0 1 1 14 0z" /></svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" {...stroke}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
  ),
  child: (
    <svg viewBox="0 0 24 24" {...stroke}><circle cx="12" cy="5" r="2" /><path d="M12 22V8M9 13l-2 4M15 13l2 4" /></svg>
  ),
  target: (
    <svg viewBox="0 0 24 24" {...stroke}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /></svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" {...stroke}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
  ),
  thermometer: (
    <svg viewBox="0 0 24 24" {...stroke}><path d="M12 2a3 3 0 0 0-3 3v8a5 5 0 1 0 6 0V5a3 3 0 0 0-3-3z" /></svg>
  ),
  'check-circle': (
    <svg viewBox="0 0 24 24" {...stroke}><path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>
  ),
  scalpel: (
    <svg viewBox="0 0 24 24" {...stroke}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
  ),
  hearts: (
    <svg viewBox="0 0 24 24" {...stroke}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" /></svg>
  ),
  mirror: (
    <svg viewBox="0 0 24 24" {...stroke}><circle cx="12" cy="8" r="6" /><path d="M15.5 12.5L21 18l-3 3-5.5-5.5" /></svg>
  ),
  gland: (
    <svg viewBox="0 0 24 24" {...stroke}><path d="M9 11a3 3 0 1 1 6 0v4a3 3 0 0 1-6 0zM12 2v4M12 18v4M2 12h4M18 12h4" /></svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" {...stroke}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
  ),
  anesthesia: (
    <svg viewBox="0 0 24 24" {...stroke}><path d="M14 12c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm0 0V7" /><path d="M5 14l-2 2 2 2M19 14l2 2-2 2" /></svg>
  ),
  home: (
    <svg viewBox="0 0 24 24" {...stroke}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></svg>
  ),
  orbit: (
    <svg viewBox="0 0 24 24" {...stroke}><path d="M3 12c0-4.97 4.03-9 9-9s9 4.03 9 9-4.03 9-9 9" /><circle cx="12" cy="12" r="3" /></svg>
  ),
};

const pstroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6 };

export const PROCEDURE_ICONS = {
  ivf: (
    <svg viewBox="0 0 24 24" {...pstroke}><path d="M12 2a4 4 0 0 0-4 4v3a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4zM8 14h8M9 18h6M10 22h4" /></svg>
  ),
  'plus-circle': (
    <svg viewBox="0 0 24 24" {...pstroke}><circle cx="12" cy="12" r="9" /><path d="M12 7v10M7 12h10" /></svg>
  ),
  waves: (
    <svg viewBox="0 0 24 24" {...pstroke}><path d="M12 2v20M9 6c0 2 1 3 3 3s3-1 3-3M8 11c0 2 1.5 3 4 3s4-1 4-3M7 17c0 2 2 3 5 3s5-1 5-3" /></svg>
  ),
  pulse: (
    <svg viewBox="0 0 24 24" {...pstroke}><path d="M3 12h4l3-9 4 18 3-9h4" /></svg>
  ),
  clipboard: (
    <svg viewBox="0 0 24 24" {...pstroke}><path d="M8 3v4M16 3v4M5 9h14M7 9v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9M10 13l2 2 4-4" /></svg>
  ),
  'shield-check': (
    <svg viewBox="0 0 24 24" {...pstroke}><path d="M12 2L4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4z" /><path d="M9 12l2 2 4-4" /></svg>
  ),
};

export function specIcon(key, index = 0) {
  if (key && SPEC_ICONS[key]) return SPEC_ICONS[key];
  const values = Object.values(SPEC_ICONS);
  return values[index % values.length];
}

export function procedureIcon(key, index = 0) {
  if (key && PROCEDURE_ICONS[key]) return PROCEDURE_ICONS[key];
  const values = Object.values(PROCEDURE_ICONS);
  return values[index % values.length];
}
