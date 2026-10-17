// Event banners shown first in the home page banner slider, ahead of the ones
// set in the admin, until the end of the event day (India time). Each image
// is 1920 × 720, the slider's own shape, so nothing in the artwork is cropped.
export const EVENT_BANNERS = [
  {
    image: '/banners/mom-mix-season-4-v2.webp',
    link: '/celebrate-pregnancy/mom-mix',
    alt: 'Kinder Hospitals and CutiePie present Mom Mix Season 4, the pregnant women’s cake mixing ceremony, 25 October 2026 at 3:00 PM, Oberon Mall Kochi',
    until: '2026-10-25T23:59:59+05:30',
  },
];

export function withEventBanners(slides = [], now = new Date()) {
  const live = EVENT_BANNERS
    .filter((b) => now.getTime() <= Date.parse(b.until))
    .filter((b) => !slides.some((s) => s.image === b.image))
    .map(({ image, link, alt }) => ({ image, link, alt }));
  return [...live, ...slides];
}
