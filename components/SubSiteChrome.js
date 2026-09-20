import SubSiteHeader from '@/components/SubSiteHeader';
import SubSiteFooter from '@/components/SubSiteFooter';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import ScrollEffects from '@/components/ScrollEffects';
import KinderChat from '@/components/KinderChat';

// A hospital sub-website's chrome — that centre's header and footer, never the
// group's menu. The corporate counterpart is SiteChrome, and every inner page
// renders inside one or the other.
export default function SubSiteChrome({ content, loc, slug, sections = {}, privacyHref, children }) {
  return (
    <>
      <SubSiteHeader loc={loc} settings={content.settings} slug={slug} sections={sections} />
      {children}
      <SubSiteFooter
        loc={loc}
        settings={content.settings}
        slug={slug}
        sections={sections}
        privacyHref={privacyHref}
      />
      <WhatsAppFloat />
      <KinderChat content={content} />
      <ScrollEffects />
    </>
  );
}
