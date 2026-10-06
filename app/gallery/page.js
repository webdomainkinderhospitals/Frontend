import { getContent } from '@/lib/api';
import SiteChrome from '@/components/SiteChrome';
import PageHero from '@/components/PageHero';
import { HubCta } from '@/components/Hub';
import GalleryGrid from '@/components/gallery/GalleryGrid';
import { galleryItems } from '@/lib/gallery.mjs';

export const revalidate = 60;

export const metadata = {
  title: 'Gallery · Kinder Hospitals',
  description: 'Photos and films from across Kinder Hospitals — our birthing suites, celebrations and the people who care for you.',
};

// Every photo and film published in the admin's Gallery.
export default async function GalleryPage() {
  const content = await getContent();
  const items = galleryItems(content.gallery);
  return (
    <SiteChrome content={content}>
      <main>
        <PageHero
          crumb="Gallery"
          eyebrow="Gallery"
          titleHtml="Moments <em>at Kinder</em>"
          intro="Films and photographs from our hospitals — the birthing suites, the celebrations and the people who care for you."
        />
        <section id="gallery">
          <div className="container">
            {items.length > 0
              ? <GalleryGrid items={items} />
              : <p className="muted">Photos and films are being added. Follow us on social media in the meantime — the links are in the footer.</p>}
          </div>
        </section>
        <HubCta
          title="Want to see the suites in person?"
          text="Book a visit or a consultation, and our team will show you around."
          href="/book"
          label="Book an appointment"
          external={false}
        />
      </main>
    </SiteChrome>
  );
}
