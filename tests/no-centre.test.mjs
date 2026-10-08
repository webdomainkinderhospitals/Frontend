import { test } from 'node:test';
import assert from 'node:assert/strict';
import { withoutCentre, pageWithoutCentre } from '../lib/no-centre.mjs';

test('pregnancy and birthing text never names a hospital', () => {
  const cases = {
    'Water Birth at Kinder Hospitals, Kochi': 'Water Birth at Kinder Hospitals',
    'Kinder Kochi’s Mom Mix brings couples together.': 'Kinder Hospitals’ Mom Mix brings couples together.',
    "Tharattazhaku is Kinder Kochi's celebration of pregnancy.": 'Tharattazhaku is Kinder Hospitals’ celebration of pregnancy.',
    'Contact the Cherthala team for upcoming editions.': 'Contact our team for upcoming editions.',
    'Ask the Kochi maternity team about eligibility.': 'Ask our maternity team about eligibility.',
    'Contact Kochi for the latest programme.': 'Contact us for the latest programme.',
    'Considering a water birth in Kochi? Book now.': 'Considering a water birth? Book now.',
    'Located in the prime location of Kochi, the centre…': 'Located in a prime location, the centre…',
    "book a consultation with Kinder Hospitals' maternity team, Kochi.": "book a consultation with Kinder Hospitals' maternity team.",
    'Discover experiences at Kinder Cherthala and Kochi.': 'Discover experiences at Kinder Hospitals.',
    'Kinder Kochi · Premium Birthing Centre': 'Kinder Hospitals · Premium Birthing Centre',
    "Kerala's first water birthing suite": "Kerala's first water birthing suite",
  };
  for (const [from, to] of Object.entries(cases)) assert.equal(withoutCentre(from), to);
  assert.equal(pageWithoutCentre({ slug: 'kochi-x', title: 'X at Kinder Kochi', body: 'In Kochi.', location: 'Kochi' }).location, 'Kochi');
});
