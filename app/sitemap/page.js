import { getContent } from '@/lib/api';
import { siteTree, LEGAL_LINKS } from '@/lib/site-tree';
import SiteChrome from '@/components/SiteChrome';
import PageHero from '@/components/PageHero';

export const revalidate = 60;

export const metadata = {
  title: 'Sitemap · Kinder Hospitals',
  description: 'Every page on the Kinder Hospitals website, in one list.',
};

// Rendered straight from lib/site-tree.js, so this page is always the site's
// actual structure rather than a copy of it.
export default async function SitemapPage() {
  const content = await getContent();
  const tree = siteTree(content.locations || []).filter((node) => node.href !== '/');

  return (
    <SiteChrome content={content}>
      <main>
        <PageHero
          crumb="Sitemap"
          eyebrow="Sitemap"
          titleHtml="Every page, <em>in one list</em>"
          intro="The full structure of the Kinder Hospitals website."
        />
        <section>
          <div className="container">
            <div className="sitemap-grid">
              {tree.map((node) => {
                // A branch whose children have children of their own (the
                // centres) reads better as one block per child.
                const nested = node.children?.some((child) => child.children?.length);
                return (
                  <div key={node.label} className="sitemap-branch">
                    <nav className="sitemap-col" aria-label={node.label}>
                      <h2><a href={node.href}>{node.label}</a></h2>
                      {node.children?.length > 0 && !nested && (
                        <ul>
                          {node.children.map((child) => (
                            <li key={child.label + child.href}><a href={child.href}>{child.label}</a></li>
                          ))}
                        </ul>
                      )}
                    </nav>
                    {nested && node.children.map((child) => (
                      <nav className="sitemap-col" key={child.label} aria-label={child.label}>
                        <h3><a href={child.href}>{child.label}</a></h3>
                        <ul>
                          {child.children.map((leaf) => (
                            <li key={leaf.label + leaf.href}><a href={leaf.href}>{leaf.label}</a></li>
                          ))}
                        </ul>
                      </nav>
                    ))}
                  </div>
                );
              })}
              <nav className="sitemap-col" aria-label="Legal">
                <h2>Legal</h2>
                <ul>
                  {LEGAL_LINKS.map((link) => (
                    <li key={link.href}><a href={link.href}>{link.label}</a></li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
