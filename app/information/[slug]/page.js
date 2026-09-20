import KochiCarePage from '@/components/KochiCare';
import { notFound, redirect } from 'next/navigation';
import { getContent } from '@/lib/api';
import { hospitalSlugForPage } from '@/lib/locations';
import { carePageHref, isCarePage } from '@/lib/care-content.mjs';
import SiteChrome from '@/components/SiteChrome';
import InformationBody from '@/components/pages/InformationBody';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const content = await getContent();
  const page = (content.pages || []).find((p) => p.slug === slug);
  return page ? { title: `${page.title} · Kinder Hospitals`, description: page.excerpt } : { title: 'Page not found' };
}

export default async function InformationDetail({ params }) {
  const { slug } = await params;
  const content = await getContent();
  const page = (content.pages || []).find((p) => p.slug === slug);
  if (!page) notFound();
  // A page belonging to exactly one centre is read on that centre's sub-site:
  // older links land there rather than opening inside the corporate site.
  const hospitalSlug = hospitalSlugForPage(page, content.locations);
  if (hospitalSlug) {
    redirect(isCarePage(page) ? carePageHref(page, hospitalSlug) : `/hospitals/${hospitalSlug}/information/${page.slug}`);
  }
  if (isCarePage(page)) return <SiteChrome content={content}><KochiCarePage page={page} content={content} /></SiteChrome>;
  return (
    <SiteChrome content={content}>
      <InformationBody page={page} />
    </SiteChrome>
  );
}
