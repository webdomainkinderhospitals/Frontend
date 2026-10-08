// Photo highlights shown on a pregnancy experience's page, from the
// hospital's own event photography.
const T = '/celebrate-pregnancy/tharattazhaku';

export const FEATURE_GALLERIES = {
  'kochi-tharattazhaku': {
    eyebrow: 'Season 5 highlights',
    title: 'Kinder Tharattazhaku, Season 5',
    intro: 'The pregnant women’s fashion show contest brought expectant mothers to the runway to celebrate pregnancy with confidence, style and joy.',
    photos: [
      { src: `${T}/season-5-winners-walk.webp`, title: 'The winner’s walk', caption: 'Our Season 5 winner celebrates on the runway with our brand ambassador, Amala Paul.' },
      { src: `${T}/season-5-winner-crowned.webp`, title: 'Crowned Season 5 winner', caption: 'The winner receives her prize, worth Rs. 2.5 lakhs, on stage with the Kinder team.' },
      { src: `${T}/season-5-runners-up.webp`, title: 'First & second runners-up', caption: 'The runners-up celebrate their moment with Amala Paul.' },
      { src: `${T}/season-5-celebration.webp`, title: 'Joy on stage', caption: 'Laughter and dance as the Season 5 finale comes to a close.' },
    ],
  },
};

const M = '/celebrate-pregnancy/mom-mix';
FEATURE_GALLERIES['celebrate-mom-mix'] = {
  eyebrow: 'Cake mixing highlights',
  title: 'Mom Mix, Season 2',
  intro: 'Our pregnant women’s cake-mixing ceremony brought expectant mothers together for a festive Christmas tradition, full of shared joy and sweet memories.',
  photos: [
    { src: `${M}/season-2-mixing-together.webp`, title: 'Mixing together', caption: 'Mothers-to-be mix the Christmas cake together at Mom Mix Season 2.' },
    { src: `${M}/season-2-group.webp`, title: 'One big family', caption: 'Expectant mothers and the Kinder team celebrate around the cake mix.' },
    { src: `${M}/season-2-ready-to-mix.webp`, title: 'Ready to mix', caption: 'Mothers-to-be gather at the fruit-and-nut mosaic before the mixing begins.' },
    { src: `${M}/season-2-festive-table.webp`, title: 'Hands in, all together', caption: 'A long festive table of mothers-to-be, mixing for the season.' },
    { src: `${M}/season-2-smiles.webp`, title: 'Smiles all round', caption: 'Laughter and cheers as families join the celebration.' },
  ],
};

export const featureGallery = (slug) => FEATURE_GALLERIES[slug] || null;
