// Campaign banner slides from a settings object or a location record.
// Slot 1 uses the original field names; slots 2 and 3 add a number.
export function promoSlides(source, prefix) {
  if (!source) return [];
  return ['', '2', '3']
    .map((n) => ({
      image: String(source[`${prefix}${n}ImageUrl`] || '').trim(),
      link: String(source[`${prefix}${n}Link`] || '').trim(),
      alt: String(source[`${prefix}${n}Alt`] || '').trim(),
    }))
    .filter((s) => s.image);
}
