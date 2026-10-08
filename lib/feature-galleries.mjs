// Photo highlights shown on a pregnancy experience's page, from the
// hospital's own event photography.
const T = '/celebrate-pregnancy/tharattazhaku';

export const FEATURE_GALLERIES = {
  'kochi-tharattazhaku': {
    eyebrow: 'Season 5 highlights',
    title: 'Kinder Tharattazhaku, Season 5',
    intro: 'The pregnant women’s fashion show contest brought expectant mothers to the runway to celebrate pregnancy with confidence, style and joy.',
    photos: [
      { src: `${T}/season-5-winners-walk.webp`, title: 'The winner’s walk', caption: 'Our Season 5 winner celebrates on the runway, crowned and cheered on by the audience.' },
      { src: `${T}/season-5-winner-crowned.webp`, title: 'Crowned Season 5 winner', caption: 'The winner receives her prize, worth Rs. 2.5 lakhs, on stage with the Kinder team.' },
      { src: `${T}/season-5-runners-up.webp`, title: 'First & second runners-up', caption: 'The runners-up celebrate their moment with our guest of honour.' },
      { src: `${T}/season-5-celebration.webp`, title: 'Joy on stage', caption: 'Laughter and dance as the Season 5 finale comes to a close.' },
    ],
  },
};

export const featureGallery = (slug) => FEATURE_GALLERIES[slug] || null;
