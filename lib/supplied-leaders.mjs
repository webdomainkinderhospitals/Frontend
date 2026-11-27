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
  // Sent 25 Nov 2026; his studio portrait is the one the hospital sent earlier.
  {
    slug: 'leadership-mr-sojo-p-devaraj',
    title: 'Sojo P. Devaraj',
    category: 'Leadership',
    location: 'Aranmula',
    excerpt: '',
    imageUrl: '/leadership/team/sojo.webp',
    published: true,
    sortOrder: 41,
    body: [
      'Sojo P. Devaraj',
      'Manager – Operations, Kinder Hospitals Aranmula',
      'Sojo P. Devaraj serves as Manager – Operations at Kinder Women’s and Children’s Hospital, bringing nearly two decades of leadership experience across healthcare administration and corporate human resources.',
      'With an MBA in Human Resources Management, he combines strategic people management with strong operational acumen, driving organisational efficiency, service excellence and patient-centred hospital operations.',
      'Before joining Kinder, he led hospital operations at Aravinda Hospitals and held senior HR leadership positions at global technology firms, including Envestnet and IBS Software. His cross-industry leadership experience, expertise in organisational development and ability to align people, processes and performance underpin his approach to building efficient, responsive and high-performing healthcare operations.',
    ].join('\n\n'),
  },
];

// Titles that have changed since a leader's page was written: Mr Basanta
// Kumar Dash is the Chief Financial Officer (27 Nov 2026), no longer the
// Group Financial Controller his page still says.
const RETITLED = {
  'leadership-mr-basanta-kumar-dash': [[/\bGroup Financial Controller\b/gi, 'Chief Financial Officer']],
};
const retitled = (page) => {
  const rules = RETITLED[page.slug];
  if (!rules) return page;
  const fix = (text) => rules.reduce((t, [from, to]) => t.replace(from, to), String(text || ''));
  return { ...page, body: fix(page.body), excerpt: fix(page.excerpt) };
};

export function withSuppliedLeaders(pages = []) {
  const have = new Set(pages.map((p) => p.slug));
  return [...pages.map(retitled), ...SUPPLIED_LEADERS.filter((p) => !have.has(p.slug))];
}
