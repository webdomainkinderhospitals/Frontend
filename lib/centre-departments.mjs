// Every centre's departments in the same two groups, shown as the two cards
// under the hospital banner and as the tabs of its Departments section:
// Other Specialities, and the Women Hospital & Fertility Centre (pregnancy,
// fertility, newborn and children's care). Kochi's departments come already
// grouped by the hospital; any other centre's are sorted by their names.
export const OTHER = 'Other Specialities';
export const WOMEN = 'Women Hospital & Fertility Centre';

const WOMEN_GROUP = /women|fertility|matern|mother|child/i;
const WOMEN_NAME = /obstet|gyn|fertil|\bivf\b|\biui\b|reproduct|neonat|nicu|paediat|pediat|fet(o|al)|matern|lactat|antenatal|newborn|child|women|birth|perinat|adolescent/i;

export function isWomenDepartment(spec = {}) {
  const group = String(spec.group || spec.category || '').trim();
  // The hospital's own grouping wins where it says which side a department is on.
  if (/multispeciality|other special/i.test(group)) return false;
  if (group && WOMEN_GROUP.test(group)) return true;
  return WOMEN_NAME.test(String(spec.name || ''));
}

// [{ title, items }] — Other Specialities first, then the Women Hospital &
// Fertility Centre; a group with no departments is left out.
export function centreGroups(specialities = []) {
  const seen = new Set();
  // one entry per department, even if it is listed twice
  const list = (Array.isArray(specialities) ? specialities : []).filter((s) => {
    const key = String(s?.name || '').trim().toLowerCase();
    return key && !seen.has(key) && seen.add(key);
  });
  const women = list.filter(isWomenDepartment);
  const other = list.filter((s) => !women.includes(s));
  return [{ title: OTHER, items: other }, { title: WOMEN, items: women }].filter((g) => g.items.length);
}
