import { notFound } from 'next/navigation';
import { getContent } from '@/lib/api';
import SiteChrome from '@/components/SiteChrome';
import PageHero from '@/components/PageHero';
import ContentBody from '@/components/ContentBody';

export const revalidate = 60;

// The tree's legal branch. The wording of each policy is owned by the group
// and edited in the admin; this route publishes whatever is filed under the
// matching slug and says plainly when it has not been published yet.
const POLICIES = {
  'privacy-policy': {
    title: 'Privacy Policy',
    intro: 'How Kinder Hospitals collects, uses and protects your personal and medical information.',
  },
  'terms-of-use': {
    title: 'Terms of Use',
    intro: 'The terms on which this website and its content are made available to you.',
  },
  'accessibility-statement': {
    title: 'Accessibility Statement',
    intro: 'Our commitment to making this website usable by everyone, and how to tell us when it is not.',
  },
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const policy = POLICIES[slug];
  return policy ? { title: `${policy.title} · Kinder Hospitals`, description: policy.intro } : { title: 'Page not found' };
}

export default async function PolicyPage({ params }) {
  const { slug } = await params;
  const policy = POLICIES[slug];
  if (!policy) notFound();
  const content = await getContent();
  const page = (content.pages || []).find((p) => p.slug === slug && p.published !== false);
  const email = content.settings.email || '';

  return (
    <SiteChrome content={content}>
      <main>
        <PageHero crumb={policy.title} eyebrow="Legal" titleHtml={policy.title} intro={page?.excerpt || policy.intro} />
        <section><div className="container">
          <article className="editorial-body" style={{ maxWidth: '820px' }}>
            {page?.body ? <ContentBody text={page.body} /> : (
              <>
                <p>
                  The current text of this policy has not been published to the website yet. Until it is,
                  our team will send you the signed copy on request — write to <a href={`mailto:${email}`}>{email}</a>{' '}
                  or call the helpline listed in the footer.
                </p>
                <p>
                  {slug === 'accessibility-statement'
                    ? 'If any part of this site is hard for you to use — with a screen reader, a keyboard or on a small screen — tell us and we will fix it.'
                    : 'For questions about your own records or data, our records desk at any centre can help.'}
                </p>
              </>
            )}
          </article>
        </div></section>
      </main>
    </SiteChrome>
  );
}
