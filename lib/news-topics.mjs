// Cake Mixing (Mom Mix) is a News & Events topic rather than a Celebrate
// Pregnancy experience: its Content Library page is kept off the site and
// its old addresses open the News page on this topic.
export const MOVED_TO_NEWS = new Set(['celebrate-mom-mix']);
export const CAKE_MIXING = 'cake-mixing';
export const CAKE_MIXING_HREF = `/news?topic=${CAKE_MIXING}`;
export const isCakeMixing = (item = {}) => /mom[\s-]?mix|cake[\s-]?mixing/i.test(`${item.slug || ''} ${item.title || ''}`);
