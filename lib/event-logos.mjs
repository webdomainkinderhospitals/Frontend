// Tharattazhaku's logo: the hospital's new logo (24 Nov 2026), without a
// season number, replaces the "Season 3" logo wherever a page shows it — in
// its text (an image linked from kinderkochi.com) or its photo set.
export const THARATTAZHAKU_LOGO = '/celebrate-pregnancy/tharattazhaku/tharattazhaku-logo.webp';
const OLD_LOGO = /(?:https?:\/\/[^\s)"']*)?\/[^\s)"'/]*tharattazhak[^\s)"'/]*?(?:_s\d|season[-_ ]?\d|logo)[^\s)"'/]*\.(?:png|jpe?g|webp|svg)/gi;

const swap = (text) => (typeof text === 'string' ? text.replace(OLD_LOGO, THARATTAZHAKU_LOGO) : text);

export function withCurrentLogos(pages = []) {
  return pages.map((p) => {
    const next = { ...p, body: swap(p.body), imageUrl: swap(p.imageUrl), galleryUrls: swap(p.galleryUrls) };
    return next.body === p.body && next.imageUrl === p.imageUrl && next.galleryUrls === p.galleryUrls ? p : next;
  });
}
