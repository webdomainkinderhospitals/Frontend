import { fallbackContent } from './fallback';
import { withoutDuplicateDoctors } from './doctor-duplicates.mjs';
import { withStudioPhotos } from './studio-photos.mjs';
import { SHOW_LEADERSHIP } from './leadership.mjs';

const API = process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetch the full site content from the backend CMS.
 * Falls back to the static content bundled with the app on ANY error
 * (missing env var, network failure, non-2xx response, invalid JSON).
 */
//
// While the site is being built a missing API falls back to the bundled copy.
// After that, a page that asks to `keepLastGood` throws instead, so Next keeps
// serving the last page built from the CMS and tries again on the next visit,
// rather than caching the backup copy as if it were the real content.
const BUILDING = process.env.NEXT_PHASE === 'phase-production-build';

export async function getContent({ keepLastGood = false } = {}) {
  if (!API) return fallbackContent;
  let error;
  // A second try covers a backend that is still waking from idle.
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      return await fetchContent();
    } catch (err) {
      error = err;
    }
  }
  if (keepLastGood && !BUILDING) throw new Error(`[api] Content unavailable, keeping the last good page: ${error.message}`);
  console.warn('[api] Falling back to static content:', error.message);
  return fallbackContent;
}

async function fetchContent() {
  const res = await fetch(`${API}/api/content`, { next: { revalidate: 60 }, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`API responded with ${res.status}`);
  const data = await res.json();
  if (!data || typeof data !== 'object') throw new Error('Invalid API payload');

  // Merge with fallback so partially-filled APIs never break the layout.
  return {
    pages: Array.isArray(data.pages) ? data.pages.filter((p) => p.published !== false && (SHOW_LEADERSHIP || p.category !== 'Leadership')) : [],
    settings: { ...fallbackContent.settings, ...(data.settings || {}) },
    specialities: pick(data.specialities, fallbackContent.specialities),
    locations: pick(data.locations, fallbackContent.locations),
    doctors: withStudioPhotos(withoutDuplicateDoctors(pick(data.doctors, fallbackContent.doctors))),
    testimonials: pick(data.testimonials, fallbackContent.testimonials),
    news: pick(data.news, fallbackContent.news),
    procedures: pick(data.procedures, fallbackContent.procedures),
    gallery: Array.isArray(data.gallery) ? data.gallery : [],
  };
}

function pick(list, fallback) {
  if (!Array.isArray(list) || list.length === 0) return fallback;
  return [...list].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}
