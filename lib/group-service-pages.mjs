import { sameService } from './service-aliases.mjs';

// Speciality pages for the whole group, where no hospital has sent its own
// department text yet. Written for the website (21 Nov 2026) to describe the
// speciality in general terms: what it covers and how a consultation works,
// without naming equipment, numbers or procedures the hospital hasn't
// confirmed. A centre's own text (lib/centre-service-pages.mjs) or text set
// in the admin replaces it.
//
// Body blocks: '## Heading' / a paragraph / an array (a bullet list).

const PAGES = {
  'plastic-and-cosmetic-surgery': {
    intro: 'Plastic and cosmetic surgery at Kinder Hospitals covers reconstructive surgery — restoring the form and function of the body after injury, illness, surgery or a condition present from birth — and aesthetic (cosmetic) procedures that refine appearance, each planned around the individual patient.',
    body: [
      '## Reconstructive and aesthetic care',
      'Plastic surgery is about more than appearance. Reconstructive surgery helps people recover from injuries, burns, wounds that will not heal, and the effects of other surgery, so that they can move, function and feel like themselves again. Aesthetic surgery helps people who are otherwise healthy change a feature that concerns them. Both begin with a careful assessment and an honest conversation about what can — and cannot — be achieved.',
      '## What the speciality covers',
      [
        'Scar revision, including scars from injury, burns or earlier surgery',
        'Keloid and hypertrophic scar management',
        'Removal of skin lumps, cysts and moles',
        'Wound care and reconstruction of difficult or non-healing wounds',
        'Hand injuries and soft-tissue repair',
        'Body contouring and reshaping procedures',
        'Facial aesthetic procedures',
        'Reconstruction after cancer surgery, planned with the treating team',
      ],
      '## Your consultation',
      'Your first visit is a consultation, not a commitment. The surgeon will ask about your health, medicines and expectations, examine the area of concern, and explain the options — including non-surgical ones where they suit you better. You will hear what recovery involves, the possible risks and what results to expect, and you are welcome to take time to decide.',
      '## Safety and recovery',
      'Procedures are carried out in the hospital’s operation theatres with anaesthesia care and nursing support, and every patient has a plan for recovery and follow-up visits. Many minor procedures are done as day care, so you can go home the same day.',
      'Which procedures are available can differ from one Kinder centre to another. Our care coordinators will tell you where and when the right surgeon is available.',
    ],
    faqs: [
      ['What is the difference between plastic surgery and cosmetic surgery?', 'Plastic surgery is the wider speciality. It includes reconstructive surgery, which restores form and function after injury, illness or surgery, and cosmetic (aesthetic) surgery, which changes appearance in people who are otherwise healthy.'],
      ['Can scars be removed completely?', 'A scar cannot be erased completely, but scar revision and other treatments can often make it flatter, narrower, less noticeable or less tight. The surgeon will explain what is realistic for your scar.'],
      ['Do I need a referral to see a plastic surgeon?', 'No. You can book a consultation directly, and if another doctor is treating you for the same problem, bring their notes and reports with you.'],
      ['How long does recovery take?', 'It depends on the procedure. Many minor procedures are done as day care with a short recovery, while larger operations need a longer recovery and follow-up visits. Your surgeon will give you a plan for your own procedure.'],
    ],
    cta: 'Book a consultation with a Kinder plastic and cosmetic surgeon.',
  },
};

// The group page for a speciality (under any of its names), with its body as
// text the content renderer reads, or null.
export function groupServicePage(slug) {
  const key = sameService(slug).find((s) => PAGES[s]);
  if (!key) return null;
  const page = PAGES[key];
  const text = page.body.map((block) => (Array.isArray(block) ? block.map((item) => `- ${item}`).join('\n') : block)).join('\n\n');
  return { ...page, key, fullDescription: text };
}
