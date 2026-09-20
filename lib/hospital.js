// Everything a hospital sub-site shows about its own centre, in one place, so
// the centre's home page and its care pages agree on what exists.

import { getContent } from './api';
import { atLocation, findLocationBySlug, slugOfLocation } from './locations';
import { allServices } from './services';
import { carePagesFor, isCarePage } from './care-content.mjs';

export function hospitalData(content, loc) {
  // Doctors (and anything else) may be tagged with several hospitals.
  const at = (item) => atLocation(item, loc.name);
  // Every sub-site shows a Specialities menu: centres without their own
  // location-tagged list fall back to the group-wide catalogue.
  const ownSpecialities = content.specialities.filter(at);
  const specialities = ownSpecialities.length
    ? ownSpecialities
    : allServices(content.specialities).map((s) => ({ name: s.name, description: s.description, group: s.group.title }));

  const pages = content.pages || [];
  const carePages = carePagesFor(pages, at);
  const infoPages = pages.filter((p) => !isCarePage(p) && at(p));
  // A centre that publishes its own privacy policy links to that; everything
  // else falls back to the group policy.
  const ownPrivacy = infoPages.find((p) => /privacy-policy$/.test(p.slug || ''));
  const doctors = content.doctors.filter(at);
  const procedures = content.procedures.filter(at);
  const testimonials = content.testimonials.filter(at);
  const news = content.news.filter(at);

  return {
    at,
    slug: slugOfLocation(loc),
    privacyHref: ownPrivacy
      ? `/hospitals/${slugOfLocation(loc)}/information/${ownPrivacy.slug}`
      : '/policies/privacy-policy',
    specialities,
    centreSpecific: ownSpecialities.length > 0,
    servicePages: allServices(content.specialities).map((s) => s.slug),
    carePages,
    infoPages,
    doctors,
    procedures,
    testimonials,
    news,
    sections: {
      care: carePages.length > 0,
      facilities: String(loc.highlights || '').trim().length > 0,
      patientServices: true,
      contact: true,
      specialities: specialities.length > 0,
      doctors: doctors.length > 0,
      procedures: procedures.length > 0,
      testimonials: testimonials.length > 0,
      news: news.length > 0,
    },
  };
}

// Everything a page inside a centre's sub-site needs, resolved from its slug:
// the centre, the site content, and `base` — the link prefix that keeps every
// link on that sub-site. Returns null when the slug names no live centre, so
// the route can call notFound().
export async function hospitalContext(slug) {
  const content = await getContent();
  const loc = findLocationBySlug(content.locations, slug);
  if (!loc) return null;
  return { content, loc, slug, base: `/hospitals/${slug}`, data: hospitalData(content, loc) };
}
