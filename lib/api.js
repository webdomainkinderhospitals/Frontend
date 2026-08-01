import { fallbackContent } from './fallback';

const API = process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetch the full site content from the backend CMS.
 * Falls back to the static content bundled with the app on ANY error
 * (missing env var, network failure, non-2xx response, invalid JSON).
 */
export async function getContent() {
  if (!API) return fallbackContent;

  try {
    const res = await fetch(`${API}/api/content`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`API responded with ${res.status}`);
    const data = await res.json();
    if (!data || typeof data !== 'object') throw new Error('Invalid API payload');

    // Merge with fallback so partially-filled APIs never break the layout.
    return {
      settings: { ...fallbackContent.settings, ...(data.settings || {}) },
      specialities: pick(data.specialities, fallbackContent.specialities),
      locations: pick(data.locations, fallbackContent.locations),
      doctors: pick(data.doctors, fallbackContent.doctors),
      testimonials: pick(data.testimonials, fallbackContent.testimonials),
      news: pick(data.news, fallbackContent.news),
      procedures: pick(data.procedures, fallbackContent.procedures),
    };
  } catch (err) {
    console.warn('[api] Falling back to static content:', err.message);
    return fallbackContent;
  }
}

function pick(list, fallback) {
  if (!Array.isArray(list) || list.length === 0) return fallback;
  return [...list].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}
