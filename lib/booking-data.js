// Server-side preparation for the booking page: plain, serialisable doctor
// records with the centres each one can be booked at.
import { atLocation, centreName, locationsOf, slugOfLocation } from './locations';
import { slugify } from './services';

const centreOf = (loc) => ({
  name: loc.name,
  title: centreName(loc),
  slug: slugOfLocation(loc),
  whatsapp: loc.whatsapp || '',
  bookingUrl: String(loc.bookingUrl || '').trim(),
});

// Every doctor bookable on the site. A doctor is offered at the centres they
// practise at that are live; one whose only centres are hidden is left out,
// since a visitor can't reach those centres anywhere else on the site either.
// Doctors listed for the whole group (no centre) stay, and book with the group.
export function bookingDoctors(content, fixedLoc = null) {
  const live = content.locations || [];
  return (content.doctors || [])
    .filter((d) => d.published !== false)
    .filter((d) => !fixedLoc || atLocation(d, fixedLoc.name))
    .map((d) => {
      const names = locationsOf(d);
      const centres = live.filter((l) => names.some((n) => n.toLowerCase() === l.name.toLowerCase())).map(centreOf);
      return {
        id: d.id ?? slugify(d.name),
        name: d.name,
        slug: slugify(d.name),
        speciality: d.speciality || '',
        designation: d.designation || '',
        bio: d.bio || '',
        fullBio: d.fullBio || '',
        imageUrl: d.imageUrl || '',
        centres,
        orphaned: names.length > 0 && centres.length === 0,
      };
    })
    .filter((d) => !d.orphaned)
    .map(({ orphaned, ...d }) => d);
}

// Centres for the corporate hospital filter: only those with a doctor to book.
export function bookingCentres(content, doctors) {
  const used = new Set(doctors.flatMap((d) => d.centres.map((c) => c.slug)));
  return (content.locations || []).map(centreOf).filter((c) => used.has(c.slug));
}

export { centreOf };
