// Everything a hospital sub-site shows about its own centre, in one place, so
// the centre's home page and its care pages agree on what exists.

import { atLocation, slugOfLocation } from './locations';
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
    privacyHref: ownPrivacy ? `/information/${ownPrivacy.slug}` : '/policies/privacy-policy',
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
