import { getContent } from '@/lib/api';
import SiteChrome from '@/components/SiteChrome';
import PageHero from '@/components/PageHero';

export const revalidate = 60;

export const metadata = {
  title: 'Patient Stories · Kinder Hospitals',
  description: 'Real stories of joy from Kinder families across Cherthala, Kochi, Bengaluru, Alappuzha and Singapore.',
};

export default async function StoriesPage() {
  const content = await getContent();
  const testimonials = content.testimonials || [];
  return (
    <SiteChrome content={content}>
      <main>
        <PageHero
          crumb="Patient Stories"
          eyebrow="Testimonials"
          titleHtml="Real stories <em>of joy</em>"
          intro="Every heartbeat we care for leaves a story. Here are a few, in our families' own words."
        />
        <section>
          <div className="container">
            {testimonials.length === 0 ? (
              <p className="muted">Stories are on the way — check back soon.</p>
            ) : (
              <div className="hosp-testi-grid">
                {testimonials.map((t, i) => (
                  <blockquote className="hosp-testi-card" key={t.id ?? i}>
                    <p>“{t.quote}”</p>
                    <footer>
                      <strong>{t.patientName}</strong>
                      <span>{[t.relation, t.location && `Kinder ${t.location}`].filter(Boolean).join(' · ')}</span>
                    </footer>
                  </blockquote>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
