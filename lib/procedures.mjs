// Signature procedures: each has its own page (/procedures/<slug>) written as
// patient information — what the procedure is, who it helps, how it is done,
// what to expect and common questions. The name, short description and icon
// come from the admin (Procedures); the guide below is matched by name, so a
// procedure added in the admin without a guide still gets a page.

const slugify = (s) => String(s || '').toLowerCase().replace(/&/g, ' and ').replace(/\([^)]*\)/g, ' ')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
export const procedureSlug = (proc = {}) => String(proc.slug || '').trim() || slugify(proc.name) || String(proc.id ?? '');
export const procedureHref = (proc) => `/procedures/${procedureSlug(proc)}`;

const GUIDES = [
  {
    match: /\bivf\b|in vitro/i,
    eyebrow: 'Fertility',
    lead: 'In vitro fertilisation (IVF) brings eggs and sperm together in the laboratory and returns a healthy embryo to the womb. It is one of the most effective treatments for couples who have not conceived with simpler methods.',
    whoFor: [
      'Blocked or damaged fallopian tubes',
      'Low sperm count or reduced sperm movement',
      'Endometriosis or reduced ovarian reserve',
      'Unexplained infertility after other treatments',
      'Couples who wish to use donor eggs or sperm, or preserve fertility',
    ],
    steps: [
      ['Consultation and tests', 'A fertility specialist reviews your history; blood tests, ultrasound and a semen analysis guide the plan.'],
      ['Ovarian stimulation', 'Hormone injections over about 10–12 days help the ovaries develop several eggs, with regular scans to track progress.'],
      ['Egg collection', 'A short, ultrasound-guided procedure under sedation collects the eggs; you usually go home the same day.'],
      ['Fertilisation and embryo culture', 'In the laboratory, eggs and sperm are combined (or ICSI is used) and the embryos are cultured for 3–5 days.'],
      ['Embryo transfer', 'A healthy embryo is placed in the womb with a soft catheter — painless and without anaesthesia. Extra good-quality embryos can be frozen.'],
      ['Pregnancy test', 'A blood test about two weeks later confirms whether the treatment has worked.'],
    ],
    expect: 'Most couples continue their daily routine during stimulation. Mild bloating or discomfort is common after egg collection. Your team will explain the medicines, the schedule of visits and the chances of success for your situation, which depend mainly on age and the cause of infertility.',
    atKinder: ['ART-certified IVF laboratory', 'Counselling before and during treatment', 'Embryo freezing (vitrification)', 'Obstetric care continuing after a positive test'],
    faqs: [
      ['Is IVF painful?', 'The injections are small and most women manage them at home. Egg collection is done under sedation, and the embryo transfer feels like a routine pelvic examination.'],
      ['How many visits are needed?', 'Typically 5–7 visits across one cycle, mostly for scans and blood tests during stimulation.'],
      ['Can we choose to freeze embryos?', 'Yes. Good-quality embryos that are not transferred can be frozen and used in a later cycle.'],
    ],
  },
  {
    match: /\biui\b|\bicsi\b|insemination/i,
    eyebrow: 'Fertility',
    lead: 'Intrauterine insemination (IUI) and intracytoplasmic sperm injection (ICSI) are two fertility treatments chosen to match each couple’s needs — IUI as a gentle first step, ICSI when sperm need help to fertilise the egg.',
    whoFor: [
      'IUI: mild sperm problems, cervical factors, ovulation problems or unexplained infertility',
      'IUI: couples using donor sperm',
      'ICSI: low sperm count, poor sperm movement or shape',
      'ICSI: previous IVF with poor or no fertilisation',
    ],
    steps: [
      ['Assessment', 'Tests for both partners — ovulation, tubes and a semen analysis — show which treatment fits best.'],
      ['IUI: monitored ovulation', 'With or without mild fertility medicines, scans time ovulation precisely.'],
      ['IUI: insemination', 'Washed, concentrated sperm are placed directly in the womb with a fine catheter — a quick procedure in the clinic.'],
      ['ICSI: as part of IVF', 'After egg collection, an embryologist injects a single sperm into each mature egg under a microscope.'],
      ['Embryo transfer and test', 'For ICSI, a healthy embryo is transferred to the womb; for both, a pregnancy test follows about two weeks later.'],
    ],
    expect: 'IUI takes only a few minutes and needs no anaesthesia; you can return to normal activities the same day. ICSI follows the IVF process. Your specialist will discuss how many IUI cycles to try before moving to IVF or ICSI.',
    atKinder: ['Semen analysis and sperm preparation in our laboratory', 'Scan-monitored cycles', 'ICSI performed by experienced embryologists', 'A personalised plan for each couple'],
    faqs: [
      ['Which should we try first?', 'For many couples IUI is a sensible first step. If sperm parameters are low or IUI has not worked, ICSI may offer a better chance.'],
      ['Is IUI painful?', 'Most women feel little or nothing; some have mild cramping for a short while.'],
      ['Does ICSI affect the baby’s health?', 'ICSI is a well-established technique used worldwide. Your specialist will discuss any points specific to your situation.'],
    ],
  },
  {
    match: /painless|epidural|labou?r analgesia/i,
    eyebrow: 'Maternity',
    lead: 'Painless delivery uses an epidural — a continuous, low-dose pain relief given through a fine tube in the lower back — so you can stay comfortable and alert through labour while it progresses naturally.',
    whoFor: [
      'Any expectant mother who would like pain relief in labour',
      'Long or difficult labours',
      'Mothers with medical conditions where pain relief helps (for example high blood pressure)',
    ],
    steps: [
      ['Discussion before labour', 'Your obstetrician and anaesthesiologist explain the options at an antenatal visit and answer your questions.'],
      ['When labour is established', 'The anaesthesiologist places a fine catheter in the lower back after numbing the skin; it takes about 10–15 minutes.'],
      ['Comfort through labour', 'Low doses of medicine ease the pain within about 15–20 minutes while you can still move and feel pressure to push.'],
      ['Continuous monitoring', 'You and your baby are monitored throughout by the labour room team.'],
    ],
    expect: 'Most mothers feel much more comfortable and are able to rest during labour. Some feel heaviness in the legs or brief itching. The catheter is removed after delivery, and you can usually start breastfeeding and walk soon after.',
    atKinder: ['Anaesthesiologists available round the clock', 'Labour, delivery and recovery rooms', 'Continuous monitoring of mother and baby', 'Birth-companion support'],
    faqs: [
      ['Will the epidural affect my baby?', 'The medicine is given in low doses and very little reaches the baby. It is a widely used and well-studied method of labour pain relief.'],
      ['Can I still have a normal delivery?', 'Yes. An epidural relieves pain; it does not by itself mean you will need a caesarean.'],
      ['Is it suitable for everyone?', 'Most mothers can have one. A few conditions, such as some bleeding disorders, may rule it out — your doctor will check.'],
    ],
  },
  {
    match: /high[- ]risk/i,
    eyebrow: 'Maternity',
    lead: 'High-risk pregnancy care gives extra attention to mothers and babies who need it — closer monitoring, specialist scans and a team ready for every stage, from the first trimester to delivery.',
    whoFor: [
      'High blood pressure, pre-eclampsia or diabetes in pregnancy',
      'Twins or more',
      'A previous caesarean, miscarriage or preterm birth',
      'Thyroid, heart, kidney or other medical conditions',
      'Concerns about the baby’s growth or development on scans',
    ],
    steps: [
      ['Early assessment', 'A detailed history, tests and scans identify the risks and set up a care plan.'],
      ['Closer monitoring', 'More frequent visits, blood pressure and sugar checks, and growth scans as needed.'],
      ['Specialist input', 'Fetal medicine, physicians and neonatologists join the plan when required.'],
      ['Planned delivery', 'The timing and type of delivery are planned with you, with the neonatal team ready.'],
    ],
    expect: 'Most high-risk pregnancies end in a healthy mother and baby with the right care. You will know whom to call, which warning signs to watch for, and what each visit is for.',
    atKinder: ['Experienced obstetricians and fetal medicine support', 'Advanced ultrasound and fetal monitoring', 'Level III NICU on site for the baby', 'Round-the-clock emergency and labour room care'],
    faqs: [
      ['Does high-risk mean something will go wrong?', 'No. It means you and your baby benefit from closer care, so problems can be prevented or managed early.'],
      ['Will I need a caesarean?', 'Not necessarily. Many mothers with high-risk pregnancies have a normal delivery; the plan depends on your situation.'],
      ['What warning signs should I watch for?', 'Bleeding, leaking fluid, severe headache, blurred vision, reduced baby movements or severe pain — contact the hospital straight away.'],
    ],
  },
  {
    match: /laparoscop|keyhole/i,
    eyebrow: 'Gynaecology',
    lead: 'Laparoscopic (keyhole) gynaecological surgery treats conditions of the womb, ovaries and tubes through a few small cuts, using a camera and fine instruments — with less pain, smaller scars and a quicker return to normal life.',
    whoFor: [
      'Fibroids and ovarian cysts',
      'Endometriosis and pelvic pain',
      'Hysterectomy when it is needed',
      'Investigation of infertility, and tubal problems',
      'Ectopic pregnancy',
    ],
    steps: [
      ['Consultation and tests', 'Examination, ultrasound and blood tests confirm the diagnosis and whether keyhole surgery is suitable.'],
      ['Preparation', 'A pre-anaesthesia check and fasting instructions before the day of surgery.'],
      ['Surgery', 'Under general anaesthesia, the surgeon works through 2–4 small incisions using a camera.'],
      ['Recovery', 'Most women walk the same day and go home within 1–2 days, depending on the procedure.'],
    ],
    expect: 'Expect some shoulder or abdominal discomfort for a few days, eased with simple pain relief. Many women return to light activities within a week; your surgeon will advise on driving, work and lifting.',
    atKinder: ['Modular operation theatres', 'Experienced gynaecological surgeons', 'Anaesthesia and critical-care support', 'Follow-up review after surgery'],
    faqs: [
      ['How is it different from open surgery?', 'Smaller cuts usually mean less pain, less blood loss, a shorter hospital stay and faster recovery.'],
      ['Can every operation be done this way?', 'Many can. Very large fibroids or some complex conditions may need open surgery — your surgeon will explain.'],
      ['When can I return to work?', 'Often within 1–2 weeks for desk work, depending on the procedure and how you feel.'],
    ],
  },
  {
    match: /nicu|neonat|newborn intensive/i,
    eyebrow: 'Newborn care',
    lead: 'A Level III neonatal intensive care unit (NICU) cares for premature and critically ill newborns round the clock, with specialist neonatologists, trained nurses and advanced support for breathing and feeding.',
    whoFor: [
      'Babies born early or with a low birth weight',
      'Breathing difficulties after birth',
      'Infections, jaundice needing treatment or feeding problems',
      'Babies who need close monitoring after a complicated delivery',
      'Newborns transferred from other hospitals',
    ],
    steps: [
      ['Admission and stabilisation', 'The team assesses your baby and starts the support needed — warmth, breathing help, fluids or medicines.'],
      ['Round-the-clock care', 'Continuous monitoring, ventilation when required, and specialist review every day.'],
      ['Family involvement', 'Parents are encouraged to visit, hold their baby skin-to-skin (kangaroo care) and help with feeding.'],
      ['Going home', 'When your baby is feeding and growing well, the team prepares you for discharge and follow-up.'],
    ],
    expect: 'The NICU can feel overwhelming at first. The team will explain the equipment, your baby’s progress and the plan each day, and support you in breastfeeding and caring for your baby.',
    atKinder: ['Neonatologists available round the clock', 'Ventilation and advanced respiratory support', 'Neonatal transport', 'Developmentally supportive care and follow-up'],
    faqs: [
      ['Can I stay with my baby?', 'Parents are welcome to visit and are encouraged to take part in their baby’s care; the team will explain visiting arrangements.'],
      ['How long will my baby stay?', 'It depends on how early your baby was born and their condition — from a few days to several weeks.'],
      ['Can I breastfeed?', 'Yes. Breast milk is the best food for babies in the NICU; the team will help with expressing and feeding.'],
    ],
  },
];

export function procedureGuide(proc = {}) {
  return GUIDES.find((g) => g.match.test(String(proc.name || ''))) || null;
}

export function findProcedure(list = [], slug = '') {
  const want = decodeURIComponent(String(slug || ''));
  return (Array.isArray(list) ? list : []).find((p) => p && p.published !== false && procedureSlug(p) === want) || null;
}
