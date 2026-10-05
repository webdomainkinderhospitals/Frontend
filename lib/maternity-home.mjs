import { kochiFeaturePages, featureImages } from './kochi-features.mjs';
import { maternitySettings } from './maternity-settings.mjs';
export function maternityHome(pages = [], settings = {}, section = 'pregnancy', scope = 'group') {
  const config = maternitySettings(settings, section);
  const links = kochiFeaturePages(pages, 'Kochi').filter((link) =>
    section === 'birthing' ? link.group === 'Premium Birthing Centre' : link.group === 'Celebrate Pregnancy');
  if (config[scope === 'kochi' ? 'showOnKochi' : 'showOnGroup'] === false || !links.length) return null;
  const page = links[0].page;
  const phone = String(config.contactPhone || '').replace(/[^+\d]/g, '');
  return { ...config, links,
    description: config.description || (section === 'birthing' ? page.excerpt : ''),
    imageUrl: config.imageUrl || page.imageUrl || featureImages(page)[0] || '',
    href: section === 'birthing' ? links[0].href : '/hospitals/kochi/celebrate-pregnancy',
    contactHref: phone ? `tel:${phone}` : '/hospitals/kochi#contact',
  };
}
