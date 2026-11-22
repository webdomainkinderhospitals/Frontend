// Leadership profiles the hospital sent, published as Leadership pages so
// they show on their hospitals' Leadership sections and open as a profile
// page there, even before (or without) a page in the admin. A page in the
// admin with the same address takes their place.

export const SUPPLIED_LEADERS = [
  // Sent 22 Nov 2026, with his studio portrait.
  {
    slug: 'leadership-mr-rajesh-kumar-b',
    title: 'Rajesh Kumar B',
    category: 'Leadership',
    location: 'Cherthala, Alappuzha, Aranmula',
    excerpt: '',
    published: true,
    sortOrder: 40,
    body: [
      'Rajesh Kumar B',
      'Chief Operating Officer – Cluster Head, Kinder Hospitals Cherthala, Alappuzha & Aranmula',
      'Rajesh Kumar B brings 23 years of dedicated healthcare leadership across India and the GCC, pairing strong operational expertise with a warm, patient-first approach to hospital management.',
      'As Chief Operating Officer and Cluster Head, he leads the Cherthala, Alappuzha and Aranmula units of Kinder Hospitals. Holding an MBA in Hospital Management and a Bachelor of Commerce, he focuses on creating supportive, high-performing healing environments where clinical excellence meets genuine care for patients and their families.',
      'Before joining Kinder Hospitals, he served in key leadership roles, including Director of Operations, Hospital Director and General Manager, with prominent organisations such as Burjeel Holdings, Apollo Hospitals and Badr Al Samaa Royal Hospital. Throughout his career, he has successfully guided multiple facilities through rigorous global quality accreditations, including JCI, NABH, Great Place to Work and ACHSI, ensuring that every hospital under his care meets the highest standards of safety and comfort.',
    ].join('\n\n'),
  },
];

export function withSuppliedLeaders(pages = []) {
  const have = new Set(pages.map((p) => p.slug));
  return [...pages, ...SUPPLIED_LEADERS.filter((p) => !have.has(p.slug))];
}
