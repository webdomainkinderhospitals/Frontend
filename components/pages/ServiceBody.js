import ContentBody from '@/components/ContentBody';
import PageHero from '@/components/PageHero';
import DoctorCard from '@/components/DoctorCard';
import { doctorsForService, slugify, specialityDescription } from '@/lib/services';
import { byHospitalOrder } from '@/lib/hospital-order.mjs';
import { atLocation, locationsOf } from '@/lib/locations';
import SpecialityIcon from '@/components/SpecialityIcon';
import { iconsForList } from '@/lib/speciality-icons.mjs';
import { centreServicePage, faqSchema } from '@/lib/centre-service-pages.mjs';
import { groupServicePage } from '@/lib/group-service-pages.mjs';

const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const enquire = (name, where) =>
  'https://api.whatsapp.com/send?phone=919746600600&text=' +
  encodeURIComponent(`Hello Kinder Hospitals, I would like to enquire about ${name}${where ? ` at Kinder ${where}` : ''}.`);

// One speciality page, rendered the same on the corporate site and inside a
// centre's sub-site. `base` is '' or '/hospitals/<slug>', and `loc` — set only
// on a sub-site — narrows the doctors to the ones practising at that centre.
export default function ServiceBody({ svc, content, base = '', loc = null }) {
  const here = loc ? loc.name : '';
  const all = doctorsForService(svc.name, content.doctors);
  const team = loc ? byHospitalOrder(all.filter((d) => atLocation(d, loc.name)), loc.name) : all;
  const related = svc.group.items.filter((i) => i.name !== svc.name);
  // The page's own icon comes first; its related specialities each get another.
  const icons = iconsForList([svc.name, ...related.map((i) => i.name)]);
  const centres = [...new Set(team.flatMap((d) => locationsOf(d)))];
  // A page the hospital has written in full for this speciality, if any. On
  // the group's own page and on any other centre's, Kinder Kochi's department
  // text is shown — the same on every site, credited to Kochi, with a link to
  // the department there — unless the speciality already has its own text in
  // the admin.
  const page = loc ? centreServicePage(loc, slugify(svc.name)) : null;
  const kochi = !page && !svc.fullDescription ? centreServicePage({ slug: 'kochi' }, slugify(svc.name)) : null;
  // Where no hospital has written one, the group's own page for the
  // speciality (lib/group-service-pages.mjs).
  const general = !page && !kochi && !svc.fullDescription ? groupServicePage(slugify(svc.name)) : null;
  const fullDescription = page ? page.fullDescription : svc.fullDescription || general?.fullDescription;
  const faqs = page?.faqs || kochi?.faqs || general?.faqs || [];
  // the short description the group's site gives this speciality, where the
  // centre's own entry has none
  const description = svc.description || specialityDescription(svc.name);

  return (
    <main>
      <PageHero
        crumb={svc.name}
        eyebrow={loc ? `${svc.group.title} · Kinder ${here}` : svc.group.title}
        titleHtml={esc(page?.heading || svc.name)}
        icon={<SpecialityIcon name={svc.name} icon={icons.get(svc.name)} className="page-hero-icon" />}
        homeHref={base || '/'}
        homeLabel={loc ? `Kinder ${here}` : 'Home'}
        trail={[{ label: 'Specialities', href: loc ? `${base}#specialities` : '/services' }]}
        intro={
          page?.intro ||
          description ||
          general?.intro ||
          (loc
            ? `${svc.name} at Kinder ${here} — part of our ${svc.group.title.toLowerCase()} care, delivered under the protocols shared across every Kinder centre.`
            : `${svc.name} at Kinder Hospitals — part of our ${svc.group.title.toLowerCase()} care, delivered under shared protocols across every Kinder centre.`)
        }
      />

      {fullDescription && (
        <section><div className={`container${page || general ? ' svc-article' : ''}`}><ContentBody text={fullDescription} /></div></section>
      )}

      {kochi && (
        <section>
          <div className="container svc-article">
            <span className="section-eyebrow">At Kinder Hospitals, Kochi</span>
            <h2 className="section-title">{kochi.heading}</h2>
            <p className="section-intro">{kochi.intro}</p>
            <ContentBody text={kochi.fullDescription} />
            <p className="svc-centre-link">
              <a className="btn btn-primary" href={`/hospitals/kochi/services/${slugify(svc.name)}`}>{svc.name} at Kinder Kochi →</a>
            </p>
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="svc-faq-wrap">
          <div className="container svc-article">
            <span className="section-eyebrow">{general ? `${svc.name} at Kinder Hospitals` : `${svc.name} at Kinder ${page ? here : 'Kochi'}`}</span>
            <h2 className="section-title">Frequently asked <em>questions</em></h2>
            <div className="svc-faqs">
              {faqs.map(([question, answer]) => (
                <details key={question} className="svc-faq">
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)).replace(/</g, '\\u003c') }} />
        </section>
      )}

      <section>
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-eyebrow">Our specialists</span>
              <h2 className="section-title">
                Doctors for <em>{svc.name}</em>
              </h2>
              {loc ? (
                <p className="section-intro">At Kinder {here}</p>
              ) : (
                centres.length > 0 && (
                  <p className="section-intro">
                    Available at {centres.map((c) => `Kinder ${c}`).join(' · ')}
                  </p>
                )
              )}
            </div>
            {loc && <a className="view-all" href={`${base}#doctors`}>All doctors at Kinder {here} →</a>}
          </div>
          {team.length > 0 ? (
            <div className="hosp-doctor-grid">
              {team.map((doc) => (
                <DoctorCard doc={doc} key={doc.id} base={base} hideHospitals={!!loc} />
              ))}
            </div>
          ) : (
            <div className="cta-strip">
              <div>
                <h3>Meet our {svc.name} team</h3>
                <p>
                  Our care coordinators will connect you with the right Kinder specialist
                  for {svc.name}{loc ? ` at Kinder ${here}` : ''}.
                </p>
              </div>
              <a href={enquire(svc.name, here)} target="_blank" rel="noopener" className="btn btn-primary">
                Enquire on WhatsApp →
              </a>
            </div>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section style={{ background: 'var(--bg-soft)' }}>
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-eyebrow">{svc.group.title}</span>
                <h2 className="section-title">
                  Related <em>services</em>
                </h2>
              </div>
              <a href={loc ? `${base}#specialities` : `/services#${svc.group.id}`} className="view-all">
                {loc ? `All specialities at Kinder ${here}` : `All ${svc.group.title}`} →
              </a>
            </div>
            <div className="svc-grid">
              {related.map((item) => (
                <a
                  key={item.name}
                  className="svc-card"
                  href={`${base}/services/${slugify(item.name)}`}
                  title={item.description || undefined}
                >
                  <SpecialityIcon name={item.name} icon={icons.get(item.name)} />
                  <span>{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="hosp-cta-wrap">
        <div className="container">
          <div className="cta-strip">
            <div>
              <h3>{page?.cta || general?.cta || `Ready to talk to us about ${svc.name}?`}</h3>
              <p>
                {loc && loc.phone
                  ? `Call ${loc.phone} or message us on WhatsApp — our coordinators at Kinder ${here} will arrange your consultation.`
                  : 'Message us on WhatsApp and our coordinators will arrange your consultation.'}
              </p>
            </div>
            <a href={`${base}/book`} className="btn btn-primary">
              Book an Appointment →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
