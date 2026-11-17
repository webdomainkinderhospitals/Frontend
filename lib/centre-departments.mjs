// Every centre's departments in the same two groups, shown as the two cards
// under the hospital banner and as the tabs of its Departments section: the
// Women’s Hospital & Fertility Centre (pregnancy, fertility, newborn and
// children's care) first, then Other Specialities — at Kinder Kochi named
// Multispeciality Services. Kochi's departments come already grouped by the
// hospital; any other centre's are sorted by their names.
export const OTHER = 'Other Specialities';
export const KOCHI_OTHER = 'Multispeciality Services';
export const WOMEN = 'Women’s Hospital & Fertility Centre';

const WOMEN_GROUP = /women|fertility|matern|mother|child/i;
const WOMEN_NAME = /obstet|gyn|fertil|\bivf\b|\biui\b|reproduct|neonat|nicu|paediat|pediat|fet(o|al)|matern|lactat|antenatal|newborn|child|women|birth|perinat|adolescent/i;

export function isWomenDepartment(spec = {}) {
  const group = String(spec.group || spec.category || '').trim();
  // The hospital's own grouping wins where it says which side a department is on.
  if (/multispeciality|other special/i.test(group)) return false;
  if (group && WOMEN_GROUP.test(group)) return true;
  return WOMEN_NAME.test(String(spec.name || ''));
}

// [{ title, items, women }] in the centre's order; a group with no
// departments is left out.
export function centreGroups(specialities = [], { kochi = false } = {}) {
  const seen = new Set();
  // one entry per department, even if it is listed twice
  const list = (Array.isArray(specialities) ? specialities : []).filter((s) => {
    const key = String(s?.name || '').trim().toLowerCase();
    return key && !seen.has(key) && seen.add(key);
  });
  const women = list.filter(isWomenDepartment);
  const other = list.filter((s) => !women.includes(s));
  return [
    { title: WOMEN, items: women, women: true },
    { title: kochi ? KOCHI_OTHER : OTHER, items: other, women: false },
  ].filter((g) => g.items.length);
}
