// The Gallery, managed in the admin (Gallery): photos, uploaded videos and
// YouTube films. Shared by the home page's "Moments at Kinder", the Gallery
// page and the viewer that opens an item.

export function youtubeId(url = '') {
  const m = String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
  return m ? m[1] : '';
}

export const isVideo = (item) => item.kind === 'video' || item.kind === 'youtube';

// The picture that stands for an item: its photo, a video's cover, or
// YouTube's own cover. '' when a video has no cover yet (a frame of the video
// is shown instead).
export function thumbOf(item = {}) {
  if (item.kind === 'image') return item.mediaUrl || '';
  if (item.posterUrl) return item.posterUrl;
  const id = item.kind === 'youtube' ? youtubeId(item.mediaUrl) : '';
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '';
}

export const embedOf = (item, autoplay = true) => {
  const id = youtubeId(item.mediaUrl);
  return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1${autoplay ? '&autoplay=1' : ''}` : '';
};

// Published items in the admin's order; anything unusable is dropped.
export function galleryItems(list = []) {
  return (Array.isArray(list) ? list : [])
    .filter((g) => g && g.published !== false && String(g.mediaUrl || '').trim()
      && (g.kind !== 'youtube' || youtubeId(g.mediaUrl)))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || (b.id ?? 0) - (a.id ?? 0));
}

// The home page: the featured video large (or the first video), and up to
// `max` other items marked for the home page beside it.
export function homeGallery(list = [], max = 6) {
  const items = galleryItems(list).filter((g) => g.showOnHome !== false);
  const featured = items.find((g) => g.featured && isVideo(g)) || items.find(isVideo) || null;
  const others = items.filter((g) => g !== featured).slice(0, max);
  return { featured, others };
}

export const placeOf = (item) => (String(item.location || '').trim() ? `Kinder ${String(item.location).split(',')[0].trim()}` : 'Kinder Hospitals');
