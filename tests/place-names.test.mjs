import { test } from 'node:test';
import assert from 'node:assert/strict';
import { withoutDistrictName } from '../lib/place-names.mjs';

test('the Aranmula centre is never described by its district', () => {
  const out = withoutDistrictName({
    locations: [{
      name: 'Aranmula',
      since: "Women & Children's · Pathanamthitta",
      address: 'St. Thomas Hospital campus, Malakkara – Kurichimuttom Road (SH 10), Aranmula, Pathanamthitta, Kerala 689532',
      description: "Kinder Women & Children's Hospital, Aranmula brings the Kinder Group's kindness-first care to Pathanamthitta as a trusted unit.",
    }],
    pages: [{ title: 'Kinder Aranmula, Pathanamthitta', body: 'Families in Pathanamthitta district' }],
  });
  const [loc] = out.locations;
  assert.equal(loc.since, "Women & Children's");
  assert.equal(loc.address, 'St. Thomas Hospital campus, Malakkara – Kurichimuttom Road (SH 10), Aranmula, Kerala 689532');
  assert.match(loc.description, /care to Aranmula as a trusted unit/);
  assert.equal(out.pages[0].title, 'Kinder Aranmula');
  assert.doesNotMatch(JSON.stringify(out), /pathanamthitta/i);
  const same = { locations: [{ name: 'Kochi' }] };
  assert.equal(withoutDistrictName(same), same);
});
