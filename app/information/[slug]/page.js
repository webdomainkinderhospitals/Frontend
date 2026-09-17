import KochiCarePage from '@/components/KochiCare';
import { notFound, redirect } from 'next/navigation';
import { getContent } from '@/lib/api';
import { locationLabel, hospitalSlugForPage } from '@/lib/locations';
import { carePageHref, isCarePage } from '@/lib/care-content.mjs';
import SiteChrome from '@/components/SiteChrome';
import ContentBody from '@/components/ContentBody';
export const revalidate = 60;
export async function generateMetadata({ params }) {
  const content = await getContent();
  const page = (content.pages || []).find((p) => p.slug === params.slug);
  return page ? { title: `${page.title} · Kinder Hospitals`, description: page.excerpt } : { title: 'Page not found' };
}
export default async function InformationDetail({ params }) {
  const content = await getContent();
  const page = (content.pages || []).find((p) => p.slug === params.slug);
  if (!page) notFound();
  // A care page belongs to its hospital's sub-site: older links land there
  // rather than opening the page inside the corporate site.
  const hospitalSlug = isCarePage(page) ? hospitalSlugForPage(page, content.locations) : '';
  if (hospitalSlug) redirect(carePageHref(page, hospitalSlug));
  if (isCarePage(page)) return <SiteChrome content={content}><KochiCarePage page={page} content={content} /></SiteChrome>;
  return <SiteChrome content={content}><main><article className="editorial-article container">
    <nav aria-label="Breadcrumb"><a href="/information">Hospital & patient information</a> / {page.category}</nav>
    <header><span className="section-eyebrow">{page.category}</span><h1>{page.title}</h1>
      {page.location && <p>{locationLabel(page)}</p>}
      {page.excerpt && <p className="editorial-lead">{page.excerpt}</p>}
    </header>
    {page.imageUrl && /^https?:\/\//.test(page.imageUrl) && <img className="editorial-cover" src={page.imageUrl} alt={page.title} />}
    <ContentBody text={page.body} />
    <a href="/contact" className="btn btn-primary">Contact our team →</a>
  </article></main></SiteChrome>;
}
