// The Kinder Group information architecture, exactly as signed off in
// "KINDER HEALTHCARE GROUP WEBSITE — Tree (Final)".
//
// This file is the single source of truth: the header menu, the footer, the
// sitemap page and the per-hospital menus are all built from it, so the site
// and the agreed tree cannot drift apart.

import { slugOfLocation } from './locations';

// Per-location nodes the tree lists under every centre. `Aranmula & Kollam
// follow Cherthala entities`, so one list serves them all; anything a centre
// has no content for still resolves to the group-wide page.
export const LOCATION_SECTIONS = [
  { key: 'specialities', label: 'Departments & Specialities', hash: '#specialities' },
  { key: 'doctors', label: 'Doctors', hash: '#doctors' },
  { key: 'facilities', label: 'Facilities', hash: '#facilities' },
  { key: 'care', label: 'Our Care', hash: '#care' },
  { key: 'patientServices', label: 'Packages & Health Checkups', hash: '#patient-services' },
  { key: 'patientServices', label: 'Insurance & TPA', hash: '#patient-services' },
  { key: 'patientServices', label: 'Online Consultation', hash: '#patient-services' },
  { key: 'testimonials', label: 'Patient Testimonials', hash: '#testimonials' },
  { key: 'news', label: 'News & Events', hash: '#news' },
  { key: 'contact', label: 'Contact', hash: '#contact' },
];

// A centre only links to the sections it actually has on its page.
export function locationSectionsFor(sections = {}) {
  return LOCATION_SECTIONS.filter((section) => sections[section.key] !== false);
}

export function locationNodes(locations = []) {
  return locations.map((loc) => ({
    label: `Kinder ${loc.name}`,
    href: `/hospitals/${slugOfLocation(loc)}`,
    note: loc.tagline || loc.address,
    children: LOCATION_SECTIONS.map((s) => ({
      label: s.label,
      href: `/hospitals/${slugOfLocation(loc)}${s.hash}`,
    })),
  }));
}

/**
 * The full tree. `locations` comes from the CMS so new centres appear without
 * touching this file.
 */
export function siteTree(locations = []) {
  return [
    { label: 'Home', href: '/' },
    {
      label: 'About Us',
      href: '/about',
      children: [
        { label: 'Our Story', href: '/about#story' },
        { label: 'Mission & Vision', href: '/about#vision' },
        { label: 'Leadership', href: '/about#leadership' },
        { label: 'Accreditations & Certifications', href: '/about#accreditations' },
        { label: 'Quality & Patient Safety', href: '/about#quality' },
        { label: 'CSR', href: '/about#csr' },
        { label: 'Academics', href: '/about#academics' },
        { label: 'International Patients', href: '/international-patients' },
        { label: 'Careers', href: '/careers' },
        { label: 'News & Events', href: '/news' },
        { label: 'Gallery', href: '/media#gallery' },
        { label: 'Media', href: '/media#press' },
      ],
    },
    {
      label: 'Celebrate Pregnancy',
      href: '/celebrate-pregnancy',
      children: [
        { label: 'Your pregnancy journey', href: '/celebrate-pregnancy#journey' },
        { label: 'Birthing options', href: '/celebrate-pregnancy#birthing' },
        { label: 'Maternity packages', href: '/packages' },
        { label: 'Antenatal classes & support', href: '/celebrate-pregnancy#support' },
      ],
    },
    { label: 'Our Locations', href: '/hospitals', children: locationNodes(locations) },
    { label: 'Our Specialities', href: '/services' },
    {
      label: 'Doctors',
      href: '/doctors',
      children: [
        { label: 'Search Doctors', href: '/doctors#directory' },
        { label: 'Filter by Speciality', href: '/doctors#directory' },
        { label: 'Filter by Location', href: '/doctors#directory' },
        { label: 'Individual Doctor Profile', href: '/doctors#directory' },
      ],
    },
    {
      label: 'Patients Portal',
      href: '/patients',
      children: [
        { label: 'Patient Login', href: '/patients#login' },
        { label: 'Health Checkup Packages', href: '/packages' },
        { label: 'Insurance & TPA / Cashless', href: '/patients/insurance-and-tpa' },
        { label: 'Patient Rights & Responsibilities', href: '/patients/patient-rights' },
        { label: 'Second Opinion', href: '/patients/second-opinion' },
        { label: 'Visitor Guidelines', href: '/patients/visitor-guidelines' },
      ],
    },
    {
      label: 'Health Library',
      href: '/health-library',
      children: [
        { label: 'Diseases & Conditions', href: '/health-library/diseases-and-conditions' },
        { label: 'Procedure Explainers', href: '/health-library/procedure-explainers' },
        { label: 'Wellness & Prevention', href: '/health-library/wellness-and-prevention' },
        { label: 'News & Updates', href: '/news' },
      ],
    },
    { label: 'Find Care', href: '/find-care' },
    {
      label: 'Careers',
      href: '/careers',
      children: [
        { label: 'Current Openings', href: '/careers#openings' },
        { label: 'Life at Kinder', href: '/careers#life' },
      ],
    },
    {
      label: 'Media & Press',
      href: '/media',
      children: [
        { label: 'Press Releases', href: '/media#press' },
        { label: 'Awards & Recognition', href: '/media#awards' },
        { label: 'Photo & Video Gallery', href: '/media#gallery' },
      ],
    },
    {
      label: 'Contact & Enquiry',
      href: '/contact',
      children: [
        { label: 'General Enquiry Form', href: '/contact#enquiry' },
        { label: 'Location-wise Contact', href: '/contact#locations' },
        { label: 'Feedback & Grievance Redressal', href: '/contact#feedback' },
      ],
    },
  ];
}

// The tree's closing branch: legal and utility pages, shown in the footer.
export const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/policies/privacy-policy' },
  { label: 'Terms of Use', href: '/policies/terms-of-use' },
  { label: 'Sitemap', href: '/sitemap' },
  { label: 'Accessibility Statement', href: '/policies/accessibility-statement' },
];

// Menu items in the header: the tree's top level, with the branches the tree
// itself also files under About Us kept there to keep one readable row.
const HEADER_SKIP = new Set(['Careers', 'Media & Press']);
export function headerNodes(locations = []) {
  return siteTree(locations).filter((node) => !HEADER_SKIP.has(node.label));
}
