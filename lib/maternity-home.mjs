import { kochiFeaturePages, featureImages } from './kochi-features.mjs';
import { maternitySettings } from './maternity-settings.mjs';
// The Celebrate Pregnancy / Premium Birthing Centre section for the group
// homepage (scope 'group': links open the main-site pages) or the Kochi
// hospital page (scope 'kochi': links stay on the Kochi site).
export function maternityHome(pages = [], settings = {}, section = 'pregnancy', scope = 'group') {
  const config = maternitySettings(settings, section);
  const main = scope !== 'kochi';
  const links = kochiFeaturePages(pages, 'Kochi', { site: main ? 'main' : 'kochi' }).filter((link) =>
    section === 'birthing' ? link.group === 'Premium Birthing Centre' : link.group === 'Celebrate Pregnancy');
  if (config[main ? 'showOnGroup' : 'showOnKochi'] === false || !links.length) return null;
  const page = links[0].page;
  const phone = String(config.contactPhone || '').replace(/[^+\d]/g, '');
  return { ...config, links,
    description: config.description || (section === 'birthing' ? page.excerpt : ''),
    imageUrl: config.imageUrl || page.imageUrl || featureImages(page)[0] || '',
    href: section === 'birthing' ? links[0].href : (main ? '/celebrate-pregnancy' : '/hospitals/kochi/celebrate-pregnancy'),
    contactHref: phone ? `tel:${phone}` : (main ? '/contact' : '/hospitals/kochi#contact'),
  };
}
