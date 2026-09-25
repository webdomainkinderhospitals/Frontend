// One professional line icon per speciality, picked from its name so every
// department — including ones added later in the admin — gets a fitting
// picture wherever specialities are listed. Rules run top to bottom and the
// first match wins, so "Paediatric Surgery" is a scalpel and "Gynaec
// Oncology" a ribbon. Anything unrecognised gets the medical cross.
const P = {
  pregnant: <><circle cx="11" cy="4.5" r="2" /><path d="M11 8c-2 0-3 1.7-3 3.6V21" /><path d="M11 8c1.5 0 2.6 1.1 2.9 2.4 2.4.6 3.8 2.6 3.8 5 0 2.3-1.7 3.9-3.7 4.1V21" /></>,
  motherChild: <><circle cx="9" cy="5.5" r="2.5" /><path d="M5 21v-5a4 4 0 0 1 4-4h1.5" /><circle cx="16" cy="12" r="2" /><path d="M11.5 21v-1.5a4.5 4.5 0 0 1 9 0V21" /></>,
  womb: <><circle cx="12" cy="12" r="9" /><circle cx="13.5" cy="9" r="2.2" /><path d="M11.4 10.4c-2.1.9-3.2 3-2.6 5 .6 2.1 3.1 2.9 5.1 1.8 1.4-.8 1.9-2.3 1.4-3.6" /></>,
  egg: <><circle cx="10" cy="14" r="6.5" /><circle cx="10" cy="14" r="2.2" /><circle cx="17.2" cy="6.8" r="1.6" /><path d="M18.4 5.6c.9-.9 1.3-2 2.6-2.4" /></>,
  female: <><circle cx="12" cy="9" r="5.5" /><path d="M12 14.5V21M9 18h6" /></>,
  ribbon: <><path d="M12 3c-2 0-3.3 1.6-3.3 3.5 0 2 1.4 3.9 3.3 6.3 1.9-2.4 3.3-4.3 3.3-6.3C15.3 4.6 14 3 12 3Z" /><path d="M9.6 10.4 6 20l2.9-1 1.6 2.5 3-7.6M14.4 10.4 18 20l-2.9-1-1.6 2.5-2.9-7.3" /></>,
  baby: <><circle cx="12" cy="13" r="7.5" /><path d="M12 5.5c0-1.6 1.1-2.6 2.4-2.4" /><circle cx="9.4" cy="12.3" r=".6" fill="currentColor" /><circle cx="14.6" cy="12.3" r=".6" fill="currentColor" /><path d="M9.8 15.6c1.3 1 3.1 1 4.4 0" /></>,
  child: <><circle cx="12" cy="5" r="2.5" /><path d="M12 8v7M7.5 10.5l4.5 1.8 4.5-1.8M9 21l3-6 3 6" /></>,
  scalpel: <><path d="M20.5 3.5c-3.2.2-7 2.6-10.4 6.1l3.8 3.8c3.5-3.4 5.9-7.2 6.6-9.9Z" /><path d="m10.1 9.6-6.4 6.4a1.8 1.8 0 0 0 0 2.5l1.8 1.8a1.8 1.8 0 0 0 2.5 0l6-6" /></>,
  monitor: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M6.5 11h2.5l1.5-3 2 6 1.5-3h3.5M9 21h6M12 17v4" /></>,
  syringe: <><path d="m18 2 4 4M19.5 4.5 10 14M14 6l4 4M8.5 11.5l4 4M11.5 8.5l2 2" /><path d="M12.5 11.5 7 17H4v-3l5.5-5.5" /><path d="M4 20l2-2" /></>,
  pill: <><path d="M10.5 3.5a5 5 0 0 1 7 7l-7 7a5 5 0 0 1-7-7Z" /><path d="m7 10 7 7" /></>,
  kidney: <><path d="M10 3.5C6 3.5 4 7 4 11.5S6 20 9.5 20c2.3 0 3-1.8 2.1-3.6-.8-1.5-.8-3.3 0-4.8C13 9 13 3.5 10 3.5Z" /><path d="M11.8 12h3.7a2.5 2.5 0 0 1 2.5 2.5V21" /></>,
  bottle: <><path d="M9.5 2.5h5M10.5 2.5v3L8 8.5V20a1.5 1.5 0 0 0 1.5 1.5h5A1.5 1.5 0 0 0 16 20V8.5l-2.5-3v-3" /><path d="M8 12.5h8M8 16.5h8" /></>,
  book: <><path d="M3 5.5c2.6-1 6-1 9 1 3-2 6.4-2 9-1V19c-2.6-1-6-1-9 1-3-2-6.4-2-9-1Z" /><path d="M12 6.5V20" /></>,
  heart: <><path d="M12 20.5s-8-4.6-8-10.6A4.4 4.4 0 0 1 12 7.4a4.4 4.4 0 0 1 8 2.5c0 6-8 10.6-8 10.6Z" /><path d="M4.5 12.5H9l1.5-2.5 2 4.5 1.5-2h5" /></>,
  brain: <><path d="M9.5 4A3 3 0 0 0 6.5 7a3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3h1.5V4Z" /><path d="M14.5 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3H13V4Z" /></>,
  bone: <><path d="M16.5 3a2.5 2.5 0 0 1 2.4 3.1A2.5 2.5 0 1 1 17.9 11l-6.9 6.9a2.5 2.5 0 1 1-4.9 1A2.5 2.5 0 1 1 5.1 14l6.9-6.9A2.5 2.5 0 0 1 16.5 3Z" /></>,
  ear: <><path d="M7 9a5 5 0 1 1 10 0c0 3.3-3.3 4.2-3.3 7a2.8 2.8 0 0 1-5.5.7" /><path d="M10 9a2 2 0 0 1 4 0c0 1.3-1.2 1.7-1.8 2.6" /></>,
  stomach: <><path d="M10 3v4c0 2-4 2.3-4 7 0 4 3 7 7 7 3.6 0 5-2.1 5-4.6 0-2-1.6-3.1-3.6-3.1-1.8 0-2.4 1.1-2.4-.8V3" /></>,
  apple: <><path d="M12 7.5c-2-1.5-7-1.2-7 4.8 0 4.5 3 8.7 5 8.7 1 0 1.4-.5 2-.5s1 .5 2 .5c2 0 5-4.2 5-8.7 0-6-5-6.3-7-4.8Z" /><path d="M12 7.5c0-2 1-3.6 3-4.2" /></>,
  runner: <><circle cx="14.5" cy="4.5" r="2" /><path d="M8.5 21l3-6 3 2.2V21M6 12.5 9 8.5h5l2 3.5 3 1M11 8.5l-1 6.5" /></>,
  scan: <><path d="M3 7.5V5a2 2 0 0 1 2-2h2.5M16.5 3H19a2 2 0 0 1 2 2v2.5M21 16.5V19a2 2 0 0 1-2 2h-2.5M7.5 21H5a2 2 0 0 1-2-2v-2.5" /><path d="M7 12h10" /><circle cx="12" cy="12" r="4" /></>,
  lungs: <><path d="M12 4v7.5M12 11.5c-1 1-3 1.6-3 1.6M12 11.5c1 1 3 1.6 3 1.6" /><path d="M8.5 7C6 7 4 11 4 15.5c0 2.5 1.5 4 3.5 3.6S10 17.4 10 15V9c0-1.1-.6-2-1.5-2ZM15.5 7C18 7 20 11 20 15.5c0 2.5-1.5 4-3.5 3.6S14 17.4 14 15V9c0-1.1.6-2 1.5-2Z" /></>,
  drop: <><path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11Z" /><path d="M9.8 14.5a2.2 2.2 0 0 0 2.2 2.2" /></>,
  chat: <><path d="M4 5h16v11H9.5L5 20V5" /><path d="M12 13.2s-2.7-1.6-2.7-3.4a1.4 1.4 0 0 1 2.7-.6 1.4 1.4 0 0 1 2.7.6c0 1.8-2.7 3.4-2.7 3.4Z" /></>,
  ambulance: <><path d="M2.5 16V8.5A1.5 1.5 0 0 1 4 7h9.5v9M13.5 10H17l4 3.2V16" /><circle cx="7" cy="17.5" r="2" /><circle cx="17" cy="17.5" r="2" /><path d="M7.5 9.5v4M5.5 11.5h4" /></>,
  stethoscope: <><path d="M6 3v5a4 4 0 0 0 8 0V3" /><path d="M10 12v3a5 5 0 0 0 10 0v-2" /><circle cx="20" cy="11" r="2" /></>,
  sparkle: <><path d="m12 3 1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8Z" /><path d="m18.5 15 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8Z" /></>,
  cross: <><path d="M9 3.5h6v5.5h5.5v6H15v5.5H9V15H3.5V9H9Z" /></>,
};

const RULES = [
  [/cosmet|plastic|derma|skin|aesthetic|hair/, 'sparkle'],
  [/oncolog|cancer|tumou?r/, 'ribbon'],
  [/fetal|foetal/, 'womb'],
  [/neonat|nicu|newborn/, 'baby'],
  [/intensiv|picu|\bicu\b|critical/, 'monitor'],
  [/anaesth|anesth/, 'syringe'],
  [/nephro|kidney|urolog|dialysis/, 'kidney'],
  [/lactation|breast ?feed|feeding/, 'bottle'],
  [/class|education|\banc\b|antenatal/, 'book'],
  [/ivf|\biui\b|icsi|fertil|reproduct|embryo|androl/, 'egg'],
  [/gyn|women|laparoscop|hysteroscop|menopaus/, 'female'],
  [/mother|maternity/, 'motherChild'],
  [/obstet|pregnan|labou?r|deliver|birth|midwi/, 'pregnant'],
  [/pain/, 'pill'],
  [/surg/, 'scalpel'],
  [/cardi|heart/, 'heart'],
  [/neuro|brain|epilep/, 'brain'],
  [/ortho|bone|joint|knee|sport|spine|fractur/, 'bone'],
  [/\bent\b|\bears?\b|audio|speech|hearing|otolaryn/, 'ear'],
  [/gastro|digest|liver|hepat|endoscop/, 'stomach'],
  [/diet|nutri/, 'apple'],
  [/physio|rehab|therap/, 'runner'],
  [/radiol|imaging|scan|ultraso|x-?ray/, 'scan'],
  [/pulmo|respir|lung|asthma|chest/, 'lungs'],
  [/endocrin|diabet|thyroid|hormon/, 'drop'],
  [/vaccin|immuni/, 'syringe'],
  [/psych|mental|counsel|behavio/, 'chat'],
  [/emergenc|casualty|trauma|ambulance/, 'ambulance'],
  [/pharma/, 'pill'],
  [/paediat|pediat|child|\bkids?\b|infant|adolescen/, 'child'],
  [/medicine|internal|physician|family|general/, 'stethoscope'],
];

export function specialityIconKey(name) {
  const n = String(name || '').toLowerCase();
  return (RULES.find(([re]) => re.test(n)) || [null, 'cross'])[1];
}

export default function SpecialityIcon({ name, className = 'spec-glyph' }) {
  return (
    <span className={className} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {P[specialityIconKey(name)]}
      </svg>
    </span>
  );
}
