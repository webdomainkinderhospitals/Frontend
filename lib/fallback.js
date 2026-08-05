// Static fallback content extracted from the original design (design/original.html).
// The site renders fully from this data when NEXT_PUBLIC_API_URL is unset or the
// backend is unreachable.

export const fallbackContent = {
  settings: {
    siteName: 'Kinder Hospitals',
    tagline: 'Kindness at the heart of every tiny heartbeat.',
    helplinePhone: '+91 80 2888 8880',
    emergencyPhone: '+91 8618 999 833',
    email: 'contactus@kinderhospital.in',
    heroTitle: 'Kindness at the heart of <em>every tiny heartbeat</em>',
    heroSubtitle:
      "A women's & children's healthcare network spanning 5 hospitals across Cherthala, Kochi, Bengaluru, Alappuzha and Singapore. From IVF to neonatology — one promise of kindness, in every city we serve.",
    heroImageUrl:
      'https://images.unsplash.com/photo-1519824145371-296894a0daa9?auto=format&fit=crop&w=1920&q=80',
    logoUrl: '/logo.png',
    announcement: '',
    stats: [
      { label: 'Women Treated', value: '6L+' },
      { label: 'Births Delivered', value: '13,000+' },
      { label: 'IVF Successes', value: '1,500+' },
      { label: 'Senior Consultants', value: '60+' },
    ],
  },

  specialities: [
    { id: 1, name: 'Obstetrics', description: '', icon: 'heart-pin', imageUrl: '', sortOrder: 1 },
    { id: 2, name: 'Maternity', description: '', icon: 'pin-dot', imageUrl: '', sortOrder: 2 },
    { id: 3, name: 'Infertility & IVF', description: '', icon: 'heart', imageUrl: '', sortOrder: 3 },
    { id: 4, name: 'Paediatrics', description: '', icon: 'child', imageUrl: '', sortOrder: 4 },
    { id: 5, name: 'Neonatology', description: '', icon: 'target', imageUrl: '', sortOrder: 5 },
    { id: 6, name: 'Gynaec & Laparoscopic', description: '', icon: 'star', imageUrl: '', sortOrder: 6 },
    { id: 7, name: 'Fetal Medicine', description: '', icon: 'thermometer', imageUrl: '', sortOrder: 7 },
    { id: 8, name: 'General Medicine', description: '', icon: 'check-circle', imageUrl: '', sortOrder: 8 },
    { id: 9, name: 'General Surgery', description: '', icon: 'scalpel', imageUrl: '', sortOrder: 9 },
    { id: 10, name: 'Dermatology', description: '', icon: 'hearts', imageUrl: '', sortOrder: 10 },
    { id: 11, name: 'Plastic & Cosmetic', description: '', icon: 'mirror', imageUrl: '', sortOrder: 11 },
    { id: 12, name: 'Endocrinology', description: '', icon: 'gland', imageUrl: '', sortOrder: 12 },
    { id: 13, name: 'General ENT', description: '', icon: 'clock', imageUrl: '', sortOrder: 13 },
    { id: 14, name: 'Anesthesiology & Pain', description: '', icon: 'anesthesia', imageUrl: '', sortOrder: 14 },
    { id: 15, name: 'Dietetics & Nutrition', description: '', icon: 'home', imageUrl: '', sortOrder: 15 },
    { id: 16, name: 'Physiotherapy', description: '', icon: 'orbit', imageUrl: '', sortOrder: 16 },
  ],

  locations: [
    {
      id: 1,
      name: 'Cherthala',
      slug: 'cherthala',
      tagline: "The flagship — where the Kinder promise began.",
      description: "Kinder Hospital Cherthala opened in 2011 as the first NABH-accredited women & children hospital in the Alappuzha district. Over a decade later, it remains our flagship — a complete women's and children's hospital with round-the-clock emergency care, a Level III NICU, painless delivery, and a full fertility unit.",
      highlights: "NABH accredited since 2011\n24/7 emergency, lab & pharmacy\nLevel III NICU for newborn intensive care\nPainless delivery & modern birthing suites\nFertility & IVF unit\n13,000+ safe deliveries and counting",
      city: 'Cherthala',
      country: 'India',
      address:
        'The flagship — first NABH-accredited women & children hospital in Alappuzha. Maruthorvattom Temple Road, near NH 66.',
      phone: '+91 478 2830000',
      email: 'contactus@kinderhospital.in',
      mapUrl: 'https://kinderhospital.in',
      imageUrl:
        'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
      sortOrder: 1,
      since: 'Since 2011',
      website: 'https://kinderhospital.in',
      websiteLabel: 'Visit kinderhospital.in →',
      international: false,
    },
    {
      id: 2,
      name: 'Kochi',
      slug: 'kochi',
      tagline: "A 125-bed multispeciality hospital in the heart of Edappally.",
      description: "Kinder Multispeciality Hospital Kochi brings 25 specialities under one roof — from obstetrics, fertility and neonatology to general medicine, surgery, ENT and dermatology. With 125 beds, senior consultants and a Level III NICU, it is our largest centre in Kerala, serving families since 2018.",
      highlights: "125 beds · 25+ specialities\nSenior consultants across every department\nLevel III NICU & paediatric ICU\nAdvanced laparoscopic & keyhole surgery\n24/7 emergency & ambulance\nFull-service lab, imaging & pharmacy",
      city: 'Kochi',
      country: 'India',
      address:
        'A 125-bed multispeciality with 25 specialities. Kadavil Castle, Pukkattupady Road, Toll Junction, Edappally — Kochi 682024.',
      phone: '+91 484 405 4000',
      email: 'contactus@kinderhospital.in',
      mapUrl: 'https://www.kinderkochi.com',
      imageUrl:
        'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=800&q=80',
      sortOrder: 2,
      since: 'Since 2018',
      website: 'https://www.kinderkochi.com',
      websiteLabel: 'Visit kinderkochi.com →',
      international: false,
    },
    {
      id: 3,
      name: 'Bengaluru',
      slug: 'bengaluru',
      tagline: "Whitefield's premier women's hospital & fertility centre.",
      description: "Opened in 2022, Kinder Women & Children Hospital Bengaluru serves Whitefield, Hoodi and Krishnarajapura with 17 specialities focused on women's health and fertility — IVF, high-risk pregnancy care, painless delivery and well-woman clinics with the trusted Kinder protocols.",
      highlights: "Dedicated fertility & IVF centre\n17 specialities for women & children\nHigh-risk pregnancy & fetal medicine\nPainless delivery & birthing suites\nWell-woman health check programmes",
      city: 'Bengaluru',
      country: 'India',
      address:
        "Whitefield's premier women's hospital & fertility centre. 17 specialities. Doddanekundi, Hoodi Village, Krishnarajapura.",
      phone: '+91 80 2888 8880',
      email: 'contactus@kinderhospital.in',
      mapUrl: 'https://kinderhospitals.com',
      imageUrl:
        'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      sortOrder: 3,
      since: 'Since 2022',
      website: 'https://kinderhospitals.com',
      websiteLabel: 'Visit kinderhospitals.com →',
      international: false,
    },
    {
      id: 4,
      name: 'Alappuzha',
      slug: 'alappuzha',
      tagline: "Continuing the Cherthala legacy in Alappuzha town.",
      description: "Kinder Women's & Children's Clinic Alappuzha is our newest Indian centre, opened in 2023. It brings Kinder's antenatal care, gynaecology consultations, paediatric clinics and diagnostics closer to families in Alappuzha town — backed by our flagship hospital in nearby Cherthala.",
      highlights: "Women's & children's OPD clinics\nAntenatal & postnatal care\nPaediatric & vaccination clinic\nLab, scans & pharmacy\nSeamless referral to Kinder Cherthala",
      city: 'Alappuzha',
      country: 'India',
      address:
        "Our newest Indian centre — Kinder Women's & Children's Clinic, Alappuzha. Continuing the Cherthala legacy.",
      phone: '+91 478 2830000',
      email: 'contactus@kinderhospital.in',
      mapUrl: 'https://kinderhospital.in/kinder_alleppey',
      imageUrl:
        'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80',
      sortOrder: 4,
      since: 'Since 2023',
      website: 'https://kinderhospital.in/kinder_alleppey',
      websiteLabel: 'Visit Alappuzha →',
      international: false,
    },
    {
      id: 5,
      name: 'Singapore',
      slug: 'singapore',
      tagline: "Where the Kinder story began — at The Paragon, Orchard Road.",
      description: "Kinder Clinic Singapore is the international home of the Kinder Medical Group and one of Singapore's most established paediatric practices, located at The Paragon on Orchard Road — the same standards that guide every Kinder hospital in India.",
      highlights: "Established paediatric specialist group\nThe Paragon, 290 Orchard Road #07-02\nInternational clinical standards\nGroup headquarters & clinical governance",
      city: 'Singapore',
      country: 'Singapore',
      address:
        'Kinder Clinic at The Paragon, 290 Orchard Road, Unit #07-02 — where the Kinder story began.',
      phone: '',
      email: '',
      mapUrl: 'https://www.kinderclinic.com.sg',
      imageUrl:
        'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=800&q=80',
      sortOrder: 5,
      since: 'International HQ',
      website: 'https://www.kinderclinic.com.sg',
      websiteLabel: 'Visit kinderclinic.com.sg →',
      international: true,
    },
  ],

  doctors: [
    {
      id: 1,
      name: 'Brigadier (Dr.) A P Radhakrishnan',
      designation: 'Senior Consultant — General Medicine & Diabetology',
      speciality: 'General Medicine',
      location: 'Kochi',
      bio: 'BSc, MBBS, MD (General Medicine) · Former Director, Military Hospital Jaipur & Shillong',
      imageUrl:
        'https://www.kinderkochi.com/uploads/doctors/main/Dr.A_P_Radhakrishnan_1_.jpeg',
      sortOrder: 1,
    },
    {
      id: 2,
      name: 'Dr. Roshna Ramachandran',
      designation: 'Consultant — Internal Medicine',
      speciality: 'Internal Medicine',
      location: 'Kochi',
      bio: '15+ years of clinical experience · Diagnosis & comprehensive disease management',
      imageUrl: '/doctors/dr-roshna-ramachandran.jpg',
      sortOrder: 2,
    },
    {
      id: 3,
      name: 'Dr. Rita K M',
      designation: 'Senior Consultant — General & Paediatric Surgery',
      speciality: 'Paed. Surgery',
      location: 'Kochi',
      bio: 'MBBS (Kerala), MS General Surgery (Calicut, 1989), MCh Paediatric Surgery (Calicut, 1996) · 30+ yrs',
      imageUrl: '/doctors/dr-rita-k-m.jpg',
      sortOrder: 3,
    },
    {
      id: 4,
      name: 'Dr. Shirley Joan Fernandez',
      designation: 'Senior Consultant — Obstetrics & Gynaecology',
      speciality: 'Obstetrics',
      location: 'Kochi',
      bio: '14+ years of experience · Clinical attachments at University Hospital UK & Toronto, Canada',
      imageUrl: '/doctors/dr-shirley-joan-fernandez.jpg',
      sortOrder: 4,
    },
    {
      id: 5,
      name: 'Dr. Madhuja Gopishyam',
      designation: 'Consultant — Obstetrician & Gynec Laparoscopic Surgeon',
      speciality: 'Gynec Laparoscopy',
      location: 'Kochi',
      bio: 'MBBS, DGO, DNB, FMAS, MRCOG · 10+ yrs · Hysterectomy, myomectomy, cystectomy & high-risk pregnancy',
      imageUrl:
        'https://www.kinderkochi.com/uploads/doctors/main/Dr.Madhuja_Gopishyam_1_.jpeg',
      sortOrder: 5,
    },
  ],

  testimonials: [
    {
      id: 1,
      patientName: 'Swami Chakra Reddy',
      relation: 'Bengaluru · IVF',
      quote:
        'We visited Kinder for IVF and pregnancy treatment, and we received excellent care throughout our journey. Special thanks to Dr. Nidhi Jhawar for her guidance — we conceived with healthy twin heartbeats.',
      rating: 5,
      imageUrl:
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      patientName: 'Srikkanth Iyer',
      relation: 'Bengaluru · Obstetrics',
      quote:
        'Honestly, the best maternity hospital in Bangalore — cost, care, labour room, everything. Dr. Sreeja Rani is just too good. Out of words to describe her expertise. 10/10.',
      rating: 5,
      imageUrl:
        'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      patientName: 'Reeja Stephen',
      relation: 'Cherthala · Maternity',
      quote:
        'Best hospital in Cherthala for women & child care. Thanks to Dr. Neena, Dr. Vennila, and all the nurses for providing the best service. Heartfelt thanks to staff Mrs. Annamma Chechi for helping us throughout this journey.',
      rating: 5,
      imageUrl:
        'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&w=800&q=80',
    },
  ],

  news: [
    {
      id: 1,
      title: 'What to Be Careful About in the First Trimester of Pregnancy',
      slug: 'first-trimester-care',
      category: 'Pregnancy Care',
      excerpt: '',
      body: '',
      imageUrl:
        'https://images.unsplash.com/photo-1519824145371-296894a0daa9?auto=format&fit=crop&w=800&q=80',
      publishedAt: '2026-04-20',
      author: 'Dr. Sreeja Rani V R',
    },
    {
      id: 2,
      title: 'IVF Diet Guide: Foods to Avoid for Better Fertility Success',
      slug: 'ivf-diet-guide',
      category: 'Fertility',
      excerpt: '',
      body: '',
      imageUrl:
        'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=800&q=80',
      publishedAt: '2026-04-12',
      author: 'Dr. Nidhi Jhawar',
    },
    {
      id: 3,
      title: 'Hand, Foot and Mouth Disease in Kids: Symptoms, Treatment & Prevention',
      slug: 'hand-foot-mouth-disease-kids',
      category: 'Paediatrics',
      excerpt: '',
      body: '',
      imageUrl:
        'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80',
      publishedAt: '2026-04-03',
      author: 'Dr. Sampat Kumar Shettigar',
    },
  ],

  procedures: [
    {
      id: 1,
      name: 'IVF (In Vitro Fertilisation)',
      description:
        'End-to-end IVF support — from counselling and stimulation to embryo transfer — within a fully ART-certified IVF laboratory. 1,500+ successful cycles to date.',
      imageUrl: '',
      icon: 'ivf',
      sortOrder: 1,
    },
    {
      id: 2,
      name: 'IUI & ICSI',
      description:
        "Intrauterine insemination and intracytoplasmic sperm injection — personalised fertility pathways tailored to each couple's unique journey.",
      imageUrl: '',
      icon: 'plus-circle',
      sortOrder: 2,
    },
    {
      id: 3,
      name: 'Painless Delivery',
      description:
        'Labour & delivery pain management with epidural analgesia and birthing techniques designed for a calmer, more comfortable experience.',
      imageUrl: '',
      icon: 'waves',
      sortOrder: 3,
    },
    {
      id: 4,
      name: 'High-Risk Pregnancy Care',
      description:
        'Specialist obstetric care for complex pregnancies, with fetal medicine support, advanced imaging, and a multi-disciplinary team on standby.',
      imageUrl: '',
      icon: 'pulse',
      sortOrder: 4,
    },
    {
      id: 5,
      name: 'Laparoscopic Gynaec Surgery',
      description:
        'Minimally invasive keyhole gynaecological surgery — for fibroids, endometriosis, hysterectomy & more. Smaller scars, faster recovery.',
      imageUrl: '',
      icon: 'clipboard',
      sortOrder: 5,
    },
    {
      id: 6,
      name: 'Level III NICU Care',
      description:
        'For premature and critically ill newborns — round-the-clock neonatology with neonatal transport, ventilation, and gentle developmental care.',
      imageUrl: '',
      icon: 'shield-check',
      sortOrder: 6,
    },
  ],
};

export default fallbackContent;
