// The Health Library branch. Each shelf is filled from the CMS: pages filed
// under its category, plus the collections that already hold that kind of
// content (procedures for the explainers shelf).

export const LIBRARY_SHELVES = {
  'diseases-and-conditions': {
    title: 'Diseases & Conditions',
    intro: 'Plain-language explanations of the conditions we treat — what they are, how they are diagnosed and what treatment usually involves.',
    categories: ['Diseases & Conditions', 'Conditions'],
  },
  'procedure-explainers': {
    title: 'Procedure Explainers',
    intro: 'What a procedure involves, how to prepare for it and what recovery looks like.',
    categories: ['Procedure Explainers', 'Procedures'],
    includeProcedures: true,
  },
  'wellness-and-prevention': {
    title: 'Wellness & Prevention',
    intro: 'Screening, vaccination, nutrition and everyday habits that keep your family well.',
    categories: ['Wellness & Prevention', 'Wellness'],
  },
};
