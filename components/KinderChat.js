'use client';

import { atLocation, locationLabel, locationsOf } from '@/lib/locations';
import { useEffect, useRef, useState } from 'react';
import { allServices, doctorsForService } from '@/lib/services';

// Kinder Assistant — a professional, on-brand hospital chatbot.
// It answers ONLY from the content this website already shows (services,
// doctors, hospitals, packages, contact details from the admin), and every
// answer carries buttons that take the visitor to the right page.

const WA = (text) =>
  'https://api.whatsapp.com/send?phone=919446654500&text=' + encodeURIComponent(text);

const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9\s&+]/g, ' ').replace(/\s+/g, ' ').trim();

const slugOfLoc = (loc) =>
  loc.slug || String(loc.name || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// Everyday words → the service they mean.
const SYNONYMS = [
  [/pregnan|delivery|labou?r|birth|anc\b/, 'Maternity'],
  [/gyn/, 'Gynecology & Laparoscopic Surgery'],
  [/fertilit|conceiv|test tube/, 'IVF'],
  [/newborn|premature|nicu/, 'Neonatology'],
  [/child|kid|baby|paed|pediatric|vaccin/, 'Paediatrics'],
  [/scan|anomaly|fetal|foetal/, 'Fetal Medicine'],
  [/skin|hair|cosmetolog/, 'Dermatology & Cosmetology'],
  [/bone|joint|knee|fracture|sports/, 'Orthopaedics & Sports Med'],
  [/ent\b|ear|nose|throat/, 'General ENT'],
  [/diet|nutrition/, 'Dietetics & Nutrition'],
  [/physio/, 'Physiotherapy'],
  [/lactation|breastfeed/, 'Lactation Support'],
  [/plastic|cosmetic surgery/, 'Plastic & Cosmetic Surgery'],
];

const CHIPS = [
  'Find a doctor',
  'Our services',
  'Our hospitals',
  'Health packages',
  'Book appointment',
];

function buildReply(text, content) {
  const q = norm(text);
  const { settings = {}, doctors = [], locations = [], specialities = [] } = content;
  const services = allServices(specialities);

  const reply = (t, actions = []) => ({ from: 'bot', text: t, actions });

  if (!q) return reply('Please type a question — for example "IVF", "doctors in Kochi" or "book an appointment".');

  // 1. Emergency — always first.
  if (/emergenc|ambulance|urgent|casualty/.test(q)) {
    return reply(
      `For medical emergencies please call our 24/7 emergency line ${settings.emergencyPhone || ''} immediately. Our team is available round the clock at every Kinder centre.`,
      [
        { label: `Call Emergency ${settings.emergencyPhone || ''}`, href: `tel:${String(settings.emergencyPhone || '').replace(/\s/g, '')}` },
        { label: 'Emergency contacts page', href: '/contact' },
      ]
    );
  }

  // 2. Greetings / thanks.
  if (/^(hi|hii+|hello|hey|good (morning|afternoon|evening)|namaste|vanakkam)\b/.test(q)) {
    return reply(
      `Hello! Welcome to ${settings.siteName || 'Kinder Hospitals'} — kindness at the heart of every tiny heartbeat. I can help you find a doctor, explore our services and hospitals, or book an appointment. What would you like to know?`
    );
  }
  if (/thank|thanks|thx/.test(q)) {
    return reply('You are most welcome! If there is anything else — a doctor, a service or a booking — I am right here.');
  }

  // 3. Booking.
  if (/book|appointment|consult|schedule|token/.test(q)) {
    return reply(
      `I can arrange that right away. The quickest way is WhatsApp — our care coordinators reply promptly. You can also call our 24/7 helpline ${settings.helplinePhone || ''}.`,
      [
        { label: 'Book on WhatsApp', href: WA('Hello Kinder Hospitals, I would like to book an appointment.'), external: true },
        { label: `Call ${settings.helplinePhone || ''}`, href: `tel:${String(settings.helplinePhone || '').replace(/\s/g, '')}` },
        { label: 'Contact page', href: '/contact' },
      ]
    );
  }

  // 4. A specific doctor by name.
  const namedDoc = doctors.find((d) => {
    const n = norm(d.name);
    return n && (q.includes(n) || n.split(' ').filter((w) => w.length > 3).some((w) => q.includes(w)));
  });
  if (namedDoc && /dr|doctor|who|meet|about/.test(q)) {
    const where = locationLabel(namedDoc) ? ` at ${locationLabel(namedDoc)}` : '';
    return reply(
      `${namedDoc.name} — ${[namedDoc.designation, namedDoc.speciality].filter(Boolean).join(', ')}${where}. ${namedDoc.bio || ''}`,
      [
        { label: 'See all doctors', href: '/doctors' },
        { label: 'Book with our team', href: WA(`Hello Kinder Hospitals, I would like to book an appointment with ${namedDoc.name}.`), external: true },
      ]
    );
  }

  // 5. A hospital / place.
  const loc = locations.find((l) => {
    const name = norm(l.name);
    const city = norm(l.city);
    return (name && q.includes(name)) || (city && q.includes(city)) || (name === 'bengaluru' && /bangalore/.test(q));
  });
  if (loc) {
    const team = doctors.filter((d) => atLocation(d, loc.name));
    return reply(
      `Kinder ${loc.name} — ${loc.tagline || `${loc.city}, ${loc.country}`}. ${loc.address || ''}${loc.phone ? ` Phone: ${loc.phone}.` : ''}${team.length ? ` ${team.length} of our specialists practise here.` : ''}`,
      [
        { label: `Visit Kinder ${loc.name} page`, href: `/hospitals/${slugOfLoc(loc)}` },
        loc.mapUrl && { label: 'Get directions', href: loc.mapUrl, external: true },
        { label: 'Book at this centre', href: WA(`Hello Kinder Hospitals, I would like to book an appointment at Kinder ${loc.name}.`), external: true },
      ].filter(Boolean)
    );
  }
  if (/hospital|centre|center|location|branch|where|near/.test(q)) {
    return reply(
      `We are a growing network of ${locations.length} centres: ${locations.map((l) => `Kinder ${l.name}`).join(', ')}. Which one would you like to know about?`,
      [
        ...locations.slice(0, 5).map((l) => ({ label: `Kinder ${l.name}`, href: `/hospitals/${slugOfLoc(l)}` })),
        { label: 'All contact details', href: '/contact' },
      ]
    );
  }

  // 6. A specific service/speciality (by name or everyday word).
  let svc = services.find((s) => q.includes(norm(s.name))) ||
    services.find((s) => norm(s.name).split(' ').filter((w) => w.length > 4).some((w) => q.includes(w)));
  if (!svc) {
    const syn = SYNONYMS.find(([re]) => re.test(q));
    if (syn) svc = services.find((s) => norm(s.name) === norm(syn[1])) || { name: syn[1], slug: null, group: null };
  }
  if (svc && svc.slug) {
    const team = doctorsForService(svc.name, doctors);
    const centres = [...new Set(team.flatMap((d) => locationsOf(d)))];
    return reply(
      `${svc.name} is part of our ${svc.group?.title || 'care'} services. ${svc.description || ''}${team.length ? ` We have ${team.length} specialist${team.length === 1 ? '' : 's'} for it${centres.length ? ` at Kinder ${centres.join(', Kinder ')}` : ''}.` : ''} Would you like to see the full page or book a consultation?`,
      [
        { label: `Open ${svc.name} page`, href: `/services/${svc.slug}` },
        { label: 'Book a consultation', href: WA(`Hello Kinder Hospitals, I would like to enquire about ${svc.name}.`), external: true },
      ]
    );
  }

  // 7. General doctors question.
  if (/doctor|specialist|consultant|physician/.test(q)) {
    return reply(
      `We have ${doctors.length}+ senior consultants across obstetrics, IVF, paediatrics, neonatology and more — each profile lists their centre and speciality. You can browse them all, or tell me a speciality (for example "IVF doctors").`,
      [
        { label: 'Browse all doctors', href: '/doctors' },
        { label: 'Our services', href: '/services' },
      ]
    );
  }

  // 8. Services in general.
  if (/service|specialit|department|treatment|care\b/.test(q)) {
    return reply(
      'Our care spans four groups — Maternity & Pregnancy, Fertility & Gynaecology, Children’s Care, and Allied & Wellness — each with its own specialists. Open the services page and click any speciality for details and doctors.',
      [{ label: 'Explore all services', href: '/services' }]
    );
  }

  // 9. Packages / pricing.
  if (/package|price|cost|charge|fee|jananimitra|check ?up|screening/.test(q)) {
    return reply(
      'We offer the Kinder Jananimitra pregnancy package plus Comprehensive, Well Women and Pre-Pregnancy health check-ups, in Silver, Golden and Platinum tiers starting at ₹1,550. The packages page has everything, and our coordinators can advise on WhatsApp.',
      [
        { label: 'View health packages', href: '/packages' },
        { label: 'Ask about pricing', href: WA('Hello Kinder Hospitals, I would like to know about your health package pricing.'), external: true },
      ]
    );
  }

  // 10. Other site sections.
  if (/news|event|camp|blog|press/.test(q)) {
    return reply('You can find our latest news, health blogs, events and awareness camps on the News & Events page.', [{ label: 'News & Events', href: '/news' }]);
  }
  if (/stor(y|ies)|testimonial|review|experience/.test(q)) {
    return reply('Our families tell it best — read real patient stories from across the Kinder network.', [{ label: 'Patient stories', href: '/stories' }]);
  }
  if (/career|job|vacan|hiring|recruit/.test(q)) {
    return reply(`We are always happy to meet caring professionals. Send your profile to ${settings.email || 'our team'} and we will get in touch.`, [{ label: 'Email your profile', href: `mailto:${settings.email}?subject=Careers%20at%20Kinder`, external: true }]);
  }
  if (/about|history|chairman|founder|group|since|story/.test(q)) {
    return reply('The Kinder Medical Group has been kindling life since 2011 — 5 hospitals, 13,000+ births and 6 lakh+ women cared for. The About page has our story, vision and milestones.', [{ label: 'About the Kinder Group', href: '/about' }]);
  }
  if (/contact|phone|call|email|reach|address|timing|hours|open/.test(q)) {
    return reply(
      `You can reach us 24/7. Helpline ${settings.helplinePhone || ''} · Emergency ${settings.emergencyPhone || ''} · ${settings.email || ''}. Every centre's address, phone and directions are on the contact page.`,
      [
        { label: 'Contact page', href: '/contact' },
        { label: `Call ${settings.helplinePhone || ''}`, href: `tel:${String(settings.helplinePhone || '').replace(/\s/g, '')}` },
      ]
    );
  }

  // 11. Fallback — stay helpful, hand over to a human.
  return reply(
    'I want to make sure you get the right answer. I can help with our doctors, services, hospitals, packages and appointments — try one of the shortcuts below, or chat directly with our care coordinators.',
    [
      { label: 'Chat with our team on WhatsApp', href: WA(`Hello Kinder Hospitals, I have a question: ${text}`), external: true },
      { label: 'Contact page', href: '/contact' },
    ]
  );
}

// Dr. Kinder — a robot in a doctor's white coat: glowing face-screen,
// antenna, stethoscope around the neck and a medical badge on the pocket.
// Brand tokens via CSS variables (with fallbacks) so it stays on-palette.
function DoctorBot(props) {
  return (
    <svg viewBox="0 0 72 88" fill="none" aria-hidden="true" {...props}>
      {/* antenna */}
      <rect x="34.6" y="8" width="2.8" height="7" rx="1.4" fill="#fff" opacity=".9" />
      <circle cx="36" cy="6" r="4" fill="var(--accent, #F26D8B)" />
      <circle cx="36" cy="6" r="6.5" stroke="var(--accent, #F26D8B)" strokeWidth="1.2" opacity=".35" />
      {/* head */}
      <rect x="16" y="14" width="40" height="31" rx="13" fill="#fff" />
      <rect x="16.9" y="14.9" width="38.2" height="29.2" rx="12.2" stroke="var(--primary, #6D49C9)" strokeOpacity=".22" strokeWidth="1.8" />
      {/* ear caps */}
      <rect x="11" y="24" width="5" height="11" rx="2.5" fill="var(--accent, #F26D8B)" />
      <rect x="56" y="24" width="5" height="11" rx="2.5" fill="var(--accent, #F26D8B)" />
      {/* glowing face screen */}
      <rect x="21.5" y="19.5" width="29" height="20" rx="9" fill="var(--primary-dark, #3F2A86)" />
      <circle cx="30" cy="28.5" r="3" fill="#A5F3FF" />
      <circle cx="42" cy="28.5" r="3" fill="#A5F3FF" />
      <circle cx="31" cy="27.5" r="1" fill="#fff" />
      <circle cx="43" cy="27.5" r="1" fill="#fff" />
      <path d="M31 34c1.7 1.9 8.3 1.9 10 0" stroke="#A5F3FF" strokeWidth="2.2" strokeLinecap="round" />
      {/* neck */}
      <rect x="30" y="45" width="12" height="5" rx="2.5" fill="#E4DCF5" />
      {/* white doctor's coat */}
      <path d="M14 88V64c0-9.5 9-15 22-15s22 5.5 22 15v24H14Z" fill="#fff" />
      <path d="M14.9 88V64c0-9 8.6-14.1 21.1-14.1S57.1 55 57.1 64v24" stroke="var(--primary, #6D49C9)" strokeOpacity=".18" strokeWidth="1.8" />
      {/* shirt opening + lapels */}
      <path d="M36 49.5 32 57l4 31 4-31-4-7.5Z" fill="var(--primary-light, #ECE6FA)" />
      <path d="m36 49.5-7.5 2.5 5 8.5 2.5-11Z" fill="#E4DCF5" />
      <path d="m36 49.5 7.5 2.5-5 8.5-2.5-11Z" fill="#E4DCF5" />
      {/* stethoscope */}
      <path d="M28.5 52.5c-1 8 1.5 13.5 7.5 13.5 5.5 0 8-5 7.5-12" stroke="var(--primary, #6D49C9)" strokeWidth="2.7" strokeLinecap="round" />
      <circle cx="36" cy="71" r="4.4" stroke="var(--primary, #6D49C9)" strokeWidth="2.7" />
      <path d="M36 66v.6" stroke="var(--primary, #6D49C9)" strokeWidth="2.7" strokeLinecap="round" />
      {/* pocket with medical cross */}
      <rect x="18.5" y="66" width="10.5" height="9.5" rx="2.5" fill="var(--primary-light, #ECE6FA)" />
      <path d="M23.75 68.2v5.1M21.2 70.75h5.1" stroke="var(--accent, #F26D8B)" strokeWidth="2.1" strokeLinecap="round" />
      {/* coat buttons */}
      <circle cx="47.5" cy="67" r="1.7" fill="#CBBFE9" />
      <circle cx="47.5" cy="74" r="1.7" fill="#CBBFE9" />
    </svg>
  );
}

export default function KinderChat({ content }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && msgs.length === 0) {
      setMsgs([{
        from: 'bot',
        text: `Hello! I'm Dr. Kinder, your robot guide. Ask me about our doctors, services, hospitals or packages — or use a shortcut below.`,
        actions: [],
      }]);
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 250);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, typing]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  function send(text) {
    const t = String(text || '').trim();
    if (!t || typing) return;
    setInput('');
    setMsgs((m) => [...m, { from: 'user', text: t }]);
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [...m, buildReply(t, content)]);
      setTyping(false);
    }, 550);
  }

  return (
    <>
      <button
        className={`kc-launcher${open ? ' kc-hidden' : ''}`}
        aria-label="Chat with Kinder Assistant"
        onClick={() => setOpen(true)}
      >
        <span className="kc-bot-wrap"><DoctorBot className="kc-bot-icon" /></span>
        <span className="kc-launcher-label">Chat with Dr.&nbsp;Kinder</span>
      </button>

      {open && (
        <section className="kc-panel" role="dialog" aria-label="Kinder Assistant chat">
          <header className="kc-head">
            <span className="kc-avatar" aria-hidden="true">
              <DoctorBot />
            </span>
            <div className="kc-head-text">
              <strong>Dr. Kinder · Assistant</strong>
              <span><i className="kc-dot" aria-hidden="true"></i> Online · replies instantly</span>
            </div>
            <button className="kc-close" aria-label="Close chat" onClick={() => setOpen(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </header>

          <div className="kc-body" ref={bodyRef} aria-live="polite">
            {msgs.map((m, i) => (
              <div className={`kc-msg ${m.from === 'user' ? 'kc-user' : 'kc-bot'}`} key={i}>
                <p>{m.text}</p>
                {m.actions?.length > 0 && (
                  <div className="kc-actions">
                    {m.actions.map((a, j) => (
                      <a key={j} className="kc-action" href={a.href} {...(a.external ? { target: '_blank', rel: 'noopener' } : {})}>
                        {a.label} →
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="kc-msg kc-bot kc-typing" aria-label="Kinder Assistant is typing">
                <span></span><span></span><span></span>
              </div>
            )}
          </div>

          <div className="kc-chips" role="group" aria-label="Quick questions">
            {CHIPS.map((c) => (
              <button key={c} className="kc-chip" onClick={() => send(c)}>{c}</button>
            ))}
          </div>

          <form
            className="kc-input"
            onSubmit={(e) => { e.preventDefault(); send(input); }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              placeholder="Type your question…"
              aria-label="Type your question for Kinder Assistant"
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" aria-label="Send message" disabled={!input.trim()}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></svg>
            </button>
          </form>
          <p className="kc-foot">Kinder Assistant guides you around this website · for medical advice please consult our doctors</p>
        </section>
      )}
    </>
  );
}
