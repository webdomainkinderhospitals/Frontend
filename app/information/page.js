import { getContent } from '@/lib/api';
import SiteChrome from '@/components/SiteChrome';
import ContentPages from '@/components/ContentPages';
import PageHero from '@/components/PageHero';
export const revalidate = 60;
export const metadata = { title: 'Hospital & Patient Information · Kinder Hospitals' };
export default async function InformationPage() {
  const content = await getContent();
  const pages = content.pages || [];
  const categories = [...new Set(pages.map((p) => p.category))];
  return <SiteChrome content={content}><main>
    <PageHero crumb="Information" eyebrow="Kinder Hospitals" titleHtml="Information for <em>every step of your care</em>" intro="Explore our facilities, care programmes, hospital information and patient services." />
    {categories.map((category) => <ContentPages key={category} title={category} pages={pages.filter((p) => p.category === category)} locations={content.locations} />)}
    {!pages.length && <section><div className="container"><p>For hospital and patient service information, please <a href="/contact">contact our team</a>.</p></div></section>}
  </main></SiteChrome>;
}
