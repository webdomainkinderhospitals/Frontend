import test from 'node:test';
import assert from 'node:assert/strict';
import { procedureSlug, procedureHref, procedureGuide, findProcedure } from '../lib/procedures.mjs';

const list = [
  { id: 1, name: 'IVF (In Vitro Fertilisation)' }, { id: 2, name: 'IUI & ICSI' }, { id: 3, name: 'Painless Delivery' },
  { id: 4, name: 'High-Risk Pregnancy Care' }, { id: 5, name: 'Laparoscopic Gynaec Surgery' }, { id: 6, name: 'Level III NICU Care' },
  { id: 7, name: 'Hidden', published: false },
];

test('each procedure has its own readable address', () => {
  assert.deepEqual(list.slice(0, 6).map(procedureSlug), ['ivf', 'iui-and-icsi', 'painless-delivery', 'high-risk-pregnancy-care', 'laparoscopic-gynaec-surgery', 'level-iii-nicu-care']);
  assert.equal(procedureHref(list[0]), '/procedures/ivf');
  assert.equal(findProcedure(list, 'iui-and-icsi').id, 2);
  assert.equal(findProcedure(list, 'hidden'), null);
});

test('every signature procedure has its own guide, and IVF and IUI/ICSI are not confused', () => {
  for (const p of list.slice(0, 6)) {
    const g = procedureGuide(p);
    assert.ok(g && g.lead && g.whoFor.length && g.steps.length && g.faqs.length, p.name);
  }
  assert.match(procedureGuide(list[0]).lead, /^In vitro fertilisation/);
  assert.match(procedureGuide(list[1]).lead, /^Intrauterine insemination/);
  assert.equal(procedureGuide({ name: 'Something new' }), null);
});
