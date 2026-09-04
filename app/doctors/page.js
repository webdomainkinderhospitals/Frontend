import { getContent } from '@/lib/api';
import { allServices } from '@/lib/services';
import SiteChrome from '@/components/SiteChrome';
import PageHero from '@/components/PageHero';
import DoctorDirectory from '@/components/DoctorDirectory';

export const revalidate = 60;

export const metadata = {
  title: 'Our Doctors · Kinder Hospitals',
  description: 'Senior consultants and specialists across every Kinder centre — medicine, surgery, fertility and women’s & children’s health.',
};

const WHATSAPP_BOOK =
  'https://api.whatsapp.com/send?phone=919446654500&text=' +
  encodeURIComponent('Hello Kinder Hospitals, I would like to book an appointment with a doctor.');

export default async function DoctorsPage() {
  const content = await getContent();
  const { doctors, locations } = content;
  const servicePages = allServices(content.specialities).map((s) => s.slug);

  return (
    <SiteChrome content={content}>
      <main>
        <PageHero
          crumb="Doctors"
          eyebrow="Our Specialists"
          titleHtml="Meet the <em>Kinder family of doctors</em>"
          intro="Senior consultants practising under shared protocols, audit and clinical governance across every Kinder centre. Filter by hospital or speciality to find yours."
        />

        <section className="dd-section">
          <div className="container">
            <DoctorDirectory doctors={doctors} locations={locations} servicePages={servicePages} />
          </div>
        </section>

        <section className="hosp-cta-wrap">
          <div className="container">
            <div className="cta-strip">
              <div>
                <h3>Not sure which specialist you need?</h3>
                <p>Our care coordinators will guide you to the right Kinder doctor.</p>
              </div>
              <a href={WHATSAPP_BOOK} target="_blank" rel="noopener" className="btn btn-primary">
                Talk to Us →
              </a>
            </div>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
